"""
Unit tests for review engine
"""

import pytest
from app.services.review_engine import review_engine


def test_get_language_tips_python():
    """Test Python best practices"""
    tips = review_engine.get_language_specific_tips("python")
    
    assert len(tips) > 0
    assert isinstance(tips, list)
    assert any("PEP 8" in tip for tip in tips)


def test_get_language_tips_all_languages():
    """Test all languages have tips"""
    languages = ["python", "java", "javascript", "typescript", "cpp", "go"]
    
    for lang in languages:
        tips = review_engine.get_language_specific_tips(lang)
        assert len(tips) > 0
