"""
Unit tests for code analysis utilities
"""

import pytest
from app.utils.code_analyzer import (
    analyze_code_metrics,
    count_functions,
    count_classes,
    detect_security_issues,
)


def test_analyze_python_code():
    """Test Python code metrics analysis"""
    code = '''
def hello_world():
    print("Hello")

class MyClass:
    def method(self):
        pass
'''
    
    metrics = analyze_code_metrics(code, "python")
    
    assert metrics["lines_of_code"] > 0
    assert metrics["total_lines"] > 0
    assert metrics["functions"] == 1
    assert metrics["classes"] == 1


def test_detect_hardcoded_credentials():
    """Test hardcoded credentials detection"""
    code = 'password = "secret123"'
    
    issues = detect_security_issues(code, "python")
    
    assert len(issues) > 0
    assert any(i["type"] == "Hardcoded Credentials" for i in issues)


def test_detect_sql_injection():
    """Test SQL injection detection"""
    code = 'query = "SELECT * FROM users WHERE id = " + user_id'
    
    issues = detect_security_issues(code, "python")
    
    assert len(issues) > 0
    assert any(i["type"] == "SQL Injection" for i in issues)
