"""
Code review router
"""

from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.database.models import User, Review
from app.schemas import ReviewCreate, ReviewResponse, ReviewResult
from app.services.review_engine import review_engine
from app.services.report import report_generator
from app.utils.auth import verify_token
from app.utils.file_handler import save_uploaded_file, read_file_content, get_supported_files
from typing import Optional
import json

router = APIRouter(prefix="/api/review", tags=["review"])


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


@router.post("/code", response_model=ReviewResponse, status_code=status.HTTP_201_CREATED)
async def review_code(
    review_data: ReviewCreate,
    token: str = None,
    db: Session = Depends(get_db)
):
    """
    Review code snippet
    
    Args:
        review_data: Code to review
        token: Authentication token
        db: Database session
        
    Returns:
        Review result
    """
    # Get current user
    user = await get_current_user(token, db)
    
    # Review code using review engine
    review_result = review_engine.review_code(review_data.code_content, review_data.code_language)
    
    # Save review to database
    review = Review(
        user_id=user.id,
        code_language=review_data.code_language,
        code_content=review_data.code_content,
        file_name=review_data.file_name,
        review_result=review_result,
        overall_score=review_result.get("overall_score", 0),
        security_score=review_result.get("security_score", 0),
        performance_score=review_result.get("performance_score", 0),
        maintainability_score=review_result.get("maintainability_score", 0),
        documentation_score=review_result.get("documentation_score", 0),
    )
    
    db.add(review)
    db.commit()
    db.refresh(review)
    
    return ReviewResponse.model_validate(review)


@router.post("/upload", response_model=ReviewResponse, status_code=status.HTTP_201_CREATED)
async def review_uploaded_file(
    file: UploadFile = File(...),
    token: str = None,
    db: Session = Depends(get_db)
):
    """
    Review uploaded file
    
    Args:
        file: Uploaded file
        token: Authentication token
        db: Database session
        
    Returns:
        Review result
    """
    # Get current user
    user = await get_current_user(token, db)
    
    # Read file content
    content = await file.read()
    file_content = content.decode("utf-8")
    
    # Determine language from file extension
    ext_map = {
        ".py": "python",
        ".java": "java",
        ".cpp": "cpp",
        ".c": "cpp",
        ".js": "javascript",
        ".ts": "typescript",
        ".tsx": "typescript",
        ".jsx": "javascript",
        ".go": "go",
    }
    
    import os
    ext = os.path.splitext(file.filename)[1].lower()
    language = ext_map.get(ext, "python")
    
    # Review code
    review_result = review_engine.review_code(file_content, language)
    
    # Save review to database
    review = Review(
        user_id=user.id,
        code_language=language,
        code_content=file_content,
        file_name=file.filename,
        review_result=review_result,
        overall_score=review_result.get("overall_score", 0),
        security_score=review_result.get("security_score", 0),
        performance_score=review_result.get("performance_score", 0),
        maintainability_score=review_result.get("maintainability_score", 0),
        documentation_score=review_result.get("documentation_score", 0),
    )
    
    db.add(review)
    db.commit()
    db.refresh(review)
    
    return ReviewResponse.model_validate(review)


@router.get("/{review_id}", response_model=ReviewResponse)
async def get_review(
    review_id: int,
    token: str = None,
    db: Session = Depends(get_db)
):
    """
    Get review details
    
    Args:
        review_id: Review ID
        token: Authentication token
        db: Database session
        
    Returns:
        Review data
    """
    # Get current user
    user = await get_current_user(token, db)
    
    # Get review
    review = db.query(Review).filter(
        Review.id == review_id,
        Review.user_id == user.id
    ).first()
    
    if not review:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Review not found")
    
    return ReviewResponse.model_validate(review)
