"""
History router for managing review history
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.database.models import User, Review
from app.schemas import ReviewResponse
from typing import List

router = APIRouter(prefix="/api/history", tags=["history"])


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


@router.get("", response_model=List[ReviewResponse])
async def get_history(
    skip: int = 0,
    limit: int = 20,
    language: str = None,
    token: str = None,
    db: Session = Depends(get_db)
):
    """
    Get user's review history
    
    Args:
        skip: Number of reviews to skip
        limit: Maximum number of reviews to return
        language: Optional language filter
        token: Authentication token
        db: Database session
        
    Returns:
        List of reviews
    """
    # Get current user
    user = await get_current_user(token, db)
    
    # Build query
    query = db.query(Review).filter(Review.user_id == user.id)
    
    if language:
        query = query.filter(Review.code_language == language)
    
    # Get reviews
    reviews = query.order_by(Review.created_at.desc()).offset(skip).limit(limit).all()
    
    return [ReviewResponse.model_validate(review) for review in reviews]


@router.get("/stats", response_model=dict)
async def get_stats(
    token: str = None,
    db: Session = Depends(get_db)
):
    """
    Get user's statistics
    
    Args:
        token: Authentication token
        db: Database session
        
    Returns:
        User statistics
    """
    # Get current user
    user = await get_current_user(token, db)
    
    # Get reviews
    reviews = db.query(Review).filter(Review.user_id == user.id).all()
    
    # Calculate statistics
    total_reviews = len(reviews)
    languages_used = {}
    total_score = 0
    security_issues = 0
    performance_issues = 0
    
    for review in reviews:
        # Count languages
        languages_used[review.code_language] = languages_used.get(review.code_language, 0) + 1
        
        # Calculate average score
        total_score += review.overall_score
        
        # Count issues
        if review.review_result:
            security_issues += len(review.review_result.get("security_issues", []))
            performance_issues += len(review.review_result.get("performance_issues", []))
    
    average_score = total_score / total_reviews if total_reviews > 0 else 0
    
    return {
        "total_reviews": total_reviews,
        "languages_used": languages_used,
        "average_score": round(average_score, 2),
        "security_issues": security_issues,
        "performance_issues": performance_issues,
    }


@router.delete("/{review_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_review(
    review_id: int,
    token: str = None,
    db: Session = Depends(get_db)
):
    """
    Delete review from history
    
    Args:
        review_id: Review ID
        token: Authentication token
        db: Database session
    """
    # Get current user
    user = await get_current_user(token, db)
    
    # Get and delete review
    review = db.query(Review).filter(
        Review.id == review_id,
        Review.user_id == user.id
    ).first()
    
    if not review:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Review not found")
    
    db.delete(review)
    db.commit()


@router.post("/export/{review_id}")
async def export_review(
    review_id: int,
    format: str = "json",
    token: str = None,
    db: Session = Depends(get_db)
):
    """
    Export review report
    
    Args:
        review_id: Review ID
        format: Export format (json, markdown, pdf)
        token: Authentication token
        db: Database session
        
    Returns:
        Export response (file download)
    """
    from app.services.report import report_generator
    from fastapi.responses import FileResponse
    import os
    
    # Get current user
    user = await get_current_user(token, db)
    
    # Get review
    review = db.query(Review).filter(
        Review.id == review_id,
        Review.user_id == user.id
    ).first()
    
    if not review:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Review not found")
    
    # Generate report
    if format == "json":
        report_path = report_generator.generate_json_report(review.review_result, f"review_{review_id}.json")
        media_type = "application/json"
    elif format == "markdown":
        report_path = report_generator.generate_markdown_report(review.review_result, f"review_{review_id}.md")
        media_type = "text/markdown"
    elif format == "pdf":
        report_path = report_generator.generate_pdf_report(review.review_result, f"review_{review_id}.pdf")
        media_type = "application/pdf"
    else:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid format")
    
    return FileResponse(
        path=report_path,
        filename=os.path.basename(report_path),
        media_type=media_type
    )
