"""
File handling utilities
"""

import os
import shutil
from pathlib import Path
from typing import Optional
import zipfile
from app.config import settings


def ensure_upload_dir():
    """Ensure upload directory exists"""
    Path(settings.upload_dir).mkdir(parents=True, exist_ok=True)


def save_uploaded_file(file_content: bytes, filename: str) -> str:
    """
    Save uploaded file to disk
    
    Args:
        file_content: File content bytes
        filename: Original filename
        
    Returns:
        Path to saved file
    """
    ensure_upload_dir()
    
    # Create unique filename
    file_path = Path(settings.upload_dir) / filename
    
    # If file exists, add timestamp
    if file_path.exists():
        name, ext = os.path.splitext(filename)
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        file_path = Path(settings.upload_dir) / f"{name}_{timestamp}{ext}"
    
    # Save file
    with open(file_path, "wb") as f:
        f.write(file_content)
    
    return str(file_path)


def read_file_content(file_path: str, encoding: str = "utf-8") -> str:
    """
    Read file content
    
    Args:
        file_path: Path to file
        encoding: File encoding
        
    Returns:
        File content
    """
    with open(file_path, "r", encoding=encoding) as f:
        return f.read()


def extract_zip(zip_path: str, extract_to: str = None) -> str:
    """
    Extract zip file
    
    Args:
        zip_path: Path to zip file
        extract_to: Directory to extract to
        
    Returns:
        Path to extracted directory
    """
    if extract_to is None:
        extract_to = Path(settings.upload_dir) / Path(zip_path).stem
    
    Path(extract_to).mkdir(parents=True, exist_ok=True)
    
    with zipfile.ZipFile(zip_path, "r") as zip_ref:
        zip_ref.extractall(extract_to)
    
    return str(extract_to)


def get_supported_files(directory: str) -> list:
    """
    Get all supported code files from directory
    
    Args:
        directory: Directory path
        
    Returns:
        List of supported file paths
    """
    supported_extensions = {
        ".py", ".java", ".cpp", ".c", ".js", ".ts", ".tsx", ".jsx", ".go"
    }
    
    files = []
    for root, dirs, filenames in os.walk(directory):
        for filename in filenames:
            if Path(filename).suffix.lower() in supported_extensions:
                files.append(os.path.join(root, filename))
    
    return files


def cleanup_old_files(directory: str, days: int = 7):
    """
    Clean up old files from directory
    
    Args:
        directory: Directory path
        days: Files older than this many days will be deleted
    """
    import time
    
    cutoff_time = time.time() - (days * 86400)
    
    for filename in os.listdir(directory):
        file_path = os.path.join(directory, filename)
        if os.path.isfile(file_path):
            if os.stat(file_path).st_mtime < cutoff_time:
                os.remove(file_path)


from datetime import datetime
