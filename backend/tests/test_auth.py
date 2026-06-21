"""
Unit tests for authentication
"""

import pytest
from app.utils.auth import hash_password, verify_password, create_access_token, verify_token


def test_hash_password():
    """Test password hashing"""
    password = "test_password_123"
    hashed = hash_password(password)
    
    assert hashed != password
    assert verify_password(password, hashed)
    assert not verify_password("wrong_password", hashed)


def test_create_and_verify_token():
    """Test JWT token creation and verification"""
    data = {"sub": "1", "email": "test@example.com"}
    token = create_access_token(data)
    
    assert token is not None
    
    payload = verify_token(token)
    assert payload is not None
    assert payload.get("sub") == "1"
    assert payload.get("email") == "test@example.com"


def test_invalid_token():
    """Test invalid token verification"""
    payload = verify_token("invalid_token")
    assert payload is None
