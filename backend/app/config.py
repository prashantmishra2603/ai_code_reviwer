"""
Application configuration and settings
"""

from pydantic_settings import BaseSettings
from pydantic import field_validator
from typing import List, Union
import json


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

    # Qdrant
    qdrant_url: str = ""
    qdrant_api_key: str = ""

    # CORS — always includes the Vercel frontend by default
    cors_origins: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "https://ai-code-reviwer-lemon.vercel.app",
    ]

    @field_validator("cors_origins", mode="before")
    @classmethod
    def parse_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        """
        Accept CORS_ORIGINS as:
          - a Python/JSON list:  ["url1", "url2"]
          - a comma-separated string: url1,url2
          - a single URL string: url1
        Always ensure the Vercel frontend is included.
        """
        vercel_url = "https://ai-code-reviwer-lemon.vercel.app"

        if isinstance(v, list):
            origins = v
        elif isinstance(v, str):
            v = v.strip()
            if v.startswith("["):
                try:
                    origins = json.loads(v)
                except json.JSONDecodeError:
                    origins = [o.strip().strip('"').strip("'") for o in v.strip("[]").split(",")]
            else:
                origins = [o.strip() for o in v.split(",") if o.strip()]
        else:
            origins = []

        # Always include the deployed frontend
        if vercel_url not in origins:
            origins.append(vercel_url)

        return origins

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
