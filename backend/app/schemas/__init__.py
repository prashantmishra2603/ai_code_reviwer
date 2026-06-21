"""
Pydantic schemas for request/response validation
"""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime


# ==================== Auth Schemas ====================

class UserBase(BaseModel):
    """Base user schema"""
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=50)
    full_name: Optional[str] = None


class UserCreate(UserBase):
    """User creation schema"""
    password: str = Field(..., min_length=8)


class UserLogin(BaseModel):
    """User login schema"""
    email: EmailStr
    password: str


class UserResponse(UserBase):
    """User response schema"""
    id: int
    is_active: bool
    is_premium: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    """Token response schema"""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# ==================== Review Schemas ====================

class BugReport(BaseModel):
    """Bug report schema"""
    severity: str = Field(..., pattern="^(critical|high|medium|low)$")
    line: Optional[int] = None
    description: str
    fix: str
    optimized_code: Optional[str] = None


class ReviewScore(BaseModel):
    """Review score schema"""
    overall_score: float = Field(..., ge=0, le=100)
    security_score: float = Field(..., ge=0, le=100)
    performance_score: float = Field(..., ge=0, le=100)
    maintainability_score: float = Field(..., ge=0, le=100)
    documentation_score: float = Field(..., ge=0, le=100)


class ReviewResult(BaseModel):
    """Complete review result schema"""
    summary: str
    overall_score: float
    security_score: float
    performance_score: float
    maintainability_score: float
    documentation_score: float
    bugs: List[BugReport]
    unit_tests: Optional[str] = None
    documentation: Optional[str] = None
    best_practices: List[str]


class ReviewCreate(BaseModel):
    """Review creation schema"""
    code_content: str = Field(..., min_length=1)
    code_language: str = Field(..., pattern="^(python|java|cpp|javascript|typescript|go)$")
    file_name: Optional[str] = None


class ReviewResponse(BaseModel):
    """Review response schema"""
    id: int
    user_id: int
    code_language: str
    file_name: Optional[str]
    review_result: Dict[str, Any]
    overall_score: float
    security_score: float
    performance_score: float
    maintainability_score: float
    documentation_score: float
    created_at: datetime
    
    class Config:
        from_attributes = True


# ==================== Chat Schemas ====================

class ChatMessage(BaseModel):
    """Chat message schema"""
    message: str = Field(..., min_length=1)
    review_id: Optional[int] = None


class ChatResponse(BaseModel):
    """Chat response schema"""
    id: int
    user_id: int
    review_id: Optional[int]
    user_message: str
    ai_response: str
    context_used: Optional[List[str]]
    created_at: datetime
    
    class Config:
        from_attributes = True


# ==================== Upload Schemas ====================

class FileUploadResponse(BaseModel):
    """File upload response schema"""
    file_name: str
    file_size: int
    upload_time: datetime
    status: str = "uploaded"


class GithubReviewRequest(BaseModel):
    """GitHub repository review request schema"""
    repo_url: str = Field(..., pattern="^https://github\\.com/.*")
    branch: str = "main"


# ==================== Export Schemas ====================

class ExportRequest(BaseModel):
    """Export request schema"""
    review_id: int
    format: str = Field(..., pattern="^(pdf|markdown|json)$")


class ExportResponse(BaseModel):
    """Export response schema"""
    file_path: str
    file_size: int
    download_url: str


# ==================== Analytics Schemas ====================

class AnalyticsData(BaseModel):
    """Analytics data schema"""
    total_reviews: int
    languages_used: Dict[str, int]
    average_score: float
    security_issues_count: int
    performance_issues_count: int
    recent_reviews: List[ReviewResponse]


# ==================== Error Schemas ====================

class ErrorResponse(BaseModel):
    """Error response schema"""
    error: str
    detail: Optional[str] = None
    status_code: int
