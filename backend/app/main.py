"""
Main FastAPI application
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.config import settings
from app.database.db import init_db
from app.routers import auth, review, chat, history
import os

# Create uploads directory if it doesn't exist
os.makedirs(settings.upload_dir, exist_ok=True)

# ---------------------------------------------------------------------------
# CORS origins — hardcoded so Render env var parsing issues don't break this
# ---------------------------------------------------------------------------
CORS_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://ai-code-reviwer-lemon.vercel.app",  # Production Vercel frontend
]

# Also pick up any extra origins from CORS_ORIGINS env var (comma-separated)
_extra = os.environ.get("CORS_ORIGINS", "")
if _extra:
    import json
    try:
        _parsed = json.loads(_extra)
    except Exception:
        _parsed = [o.strip().strip('"').strip("'") for o in _extra.strip("[]").split(",")]
    for _origin in _parsed:
        _origin = _origin.strip()
        if _origin and _origin not in CORS_ORIGINS:
            CORS_ORIGINS.append(_origin)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan context manager
    """
    # Startup
    print("🚀 Starting AI Code Reviewer...")
    print(f"✅ CORS allowed origins: {CORS_ORIGINS}")
    init_db()
    print("✅ Database initialized")

    yield

    # Shutdown
    print("🛑 Shutting down AI Code Reviewer...")


# Create FastAPI app
app = FastAPI(
    title=settings.api_title,
    description=settings.api_description,
    version=settings.api_version,
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Include routers
app.include_router(auth.router)
app.include_router(review.router)
app.include_router(chat.router)
app.include_router(history.router)


@app.api_route("/", methods=["GET", "HEAD"])
async def root():
    """Root endpoint — supports HEAD for Render port scanner"""
    return {
        "message": "🤖 AI Code Reviewer API",
        "version": settings.api_version,
        "docs": "/docs",
        "openapi": "/openapi.json"
    }


@app.api_route("/health", methods=["GET", "HEAD"])
async def health_check():
    """Health check endpoint — supports HEAD for Render port scanner"""
    return {
        "status": "healthy",
        "service": "AI Code Reviewer"
    }


if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "app.main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.reload
    )
