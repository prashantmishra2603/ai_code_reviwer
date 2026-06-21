"""
Application configuration and settings
"""

from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # API Configuration
    api_title: str = "AI Code Reviewer"
    api_version: str = "1.0.0"
    api_description: str = "Production-ready AI Code Reviewer with RAG"
    
    # Security
    secret_key: str = "your-super-secret-key-change-this-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # Database
    database_url: str = "sqlite:///./code_reviewer.db"
    
    # Groq API
    groq_api_key: str = ""
    
    # GitHub
    github_token: str = ""
    
    # ChromaDB
    chroma_db_path: str = "./vector_db"
    
    # CORS
    cors_origins: List[str] = ["http://localhost:5173", "http://localhost:3000"]
    
    # Upload
    max_upload_size: int = 52428800  # 50MB
    upload_dir: str = "./uploads"
    
    # Uvicorn
    host: str = "0.0.0.0"
    port: int = 8000
    reload: bool = True
    
    class Config:
        env_file = ".env"
        case_sensitive = False


# Initialize settings
settings = Settings()
