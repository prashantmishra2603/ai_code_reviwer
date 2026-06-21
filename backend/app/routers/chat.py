"""
Chat router for context-aware conversations
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.database.models import User, Chat, Review
from app.schemas import ChatMessage, ChatResponse
from app.services.llm import llm_service
from typing import List

router = APIRouter(prefix="/api/chat", tags=["chat"])


async def get_current_user(token: str, db: Session = Depends(get_db)) -> User:
    """Get current user from token"""
    from app.utils.auth import verify_token
    
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    
    user = db.query(User).filter(User.id == int(payload.get("sub"))).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    return user


@router.post("/message", response_model=ChatResponse, status_code=status.HTTP_201_CREATED)
async def send_message(
    message_data: ChatMessage,
    token: str = None,
    db: Session = Depends(get_db)
):
    """
    Send chat message
    
    Args:
        message_data: Chat message
        token: Authentication token
        db: Database session
        
    Returns:
        Chat response
    """
    # Get current user
    user = await get_current_user(token, db)
    
    # Get code context if review_id is provided
    code_context = None
    if message_data.review_id:
        review = db.query(Review).filter(
            Review.id == message_data.review_id,
            Review.user_id == user.id
        ).first()
        
        if not review:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Review not found")
        
        code_context = review.code_content
    
    # Get AI response
    ai_response = llm_service.chat(message_data.message, code_context)
    
    # Save chat to database
    chat = Chat(
        user_id=user.id,
        review_id=message_data.review_id,
        user_message=message_data.message,
        ai_response=ai_response,
        context_used=[code_context[:100]] if code_context else None
    )
    
    db.add(chat)
    db.commit()
    db.refresh(chat)
    
    return ChatResponse.model_validate(chat)


@router.get("/history", response_model=List[ChatResponse])
async def get_chat_history(
    review_id: int = None,
    token: str = None,
    db: Session = Depends(get_db)
):
    """
    Get chat history
    
    Args:
        review_id: Optional review ID to filter chats
        token: Authentication token
        db: Database session
        
    Returns:
        List of chat messages
    """
    # Get current user
    user = await get_current_user(token, db)
    
    # Query chats
    query = db.query(Chat).filter(Chat.user_id == user.id)
    
    if review_id:
        query = query.filter(Chat.review_id == review_id)
    
    chats = query.order_by(Chat.created_at.desc()).all()
    
    return [ChatResponse.model_validate(chat) for chat in chats]


@router.delete("/message/{chat_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_message(
    chat_id: int,
    token: str = None,
    db: Session = Depends(get_db)
):
    """
    Delete chat message
    
    Args:
        chat_id: Chat message ID
        token: Authentication token
        db: Database session
    """
    # Get current user
    user = await get_current_user(token, db)
    
    # Get and delete chat
    chat = db.query(Chat).filter(
        Chat.id == chat_id,
        Chat.user_id == user.id
    ).first()
    
    if not chat:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Chat not found")
    
    db.delete(chat)
    db.commit()
