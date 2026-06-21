"""
Review engine for code analysis
"""

from typing import Dict, List
from app.utils.code_analyzer import (
    analyze_code_metrics,
    detect_security_issues,
    detect_performance_issues
)
from app.services.llm import llm_service


class ReviewEngine:
    """Main engine for code review"""
    
    @staticmethod
    def review_code(code: str, language: str) -> Dict:
        """
        Comprehensive code review
        
        Args:
            code: Source code
            language: Programming language
            
        Returns:
            Review result
        """
        # Get LLM review
        llm_review = llm_service.review_code(code, language)
        
        # Analyze code metrics
        metrics = analyze_code_metrics(code, language)
        
        # Detect security issues
        security_issues = detect_security_issues(code, language)
        
        # Detect performance issues
        performance_issues = detect_performance_issues(code)
        
        # Combine results
        result = {
            **llm_review,
            "metrics": metrics,
            "security_issues": llm_review.get("security_issues", []) + security_issues,
            "performance_issues": llm_review.get("performance_issues", []) + performance_issues,
        }
        
        return result
    
    @staticmethod
    def get_language_specific_tips(language: str) -> List[str]:
        """Get language-specific best practices"""
        tips = {
            "python": [
                "Follow PEP 8 style guide",
                "Use type hints for better code clarity",
                "Prefer list comprehensions over loops",
                "Use async/await for I/O operations",
                "Implement proper error handling with try-except"
            ],
            "java": [
                "Follow Java naming conventions",
                "Use streams instead of loops when possible",
                "Implement proper exception handling",
                "Write JavaDoc for all public methods",
                "Use dependency injection patterns"
            ],
            "javascript": [
                "Use const by default, let when needed",
                "Use async/await instead of callbacks",
                "Implement proper error boundaries in React",
                "Use TypeScript for type safety",
                "Follow eslint rules"
            ],
            "typescript": [
                "Use strict tsconfig settings",
                "Avoid using 'any' type",
                "Use interfaces for object shapes",
                "Implement proper error handling",
                "Use discriminated unions for pattern matching"
            ],
            "cpp": [
                "Use RAII for resource management",
                "Prefer smart pointers over raw pointers",
                "Use const correctness",
                "Implement move semantics",
                "Use templates wisely"
            ],
            "go": [
                "Follow go fmt conventions",
                "Use goroutines for concurrency",
                "Implement proper error handling",
                "Use interfaces for abstractions",
                "Write table-driven tests"
            ]
        }
        
        return tips.get(language, [])


# Global review engine instance
review_engine = ReviewEngine()
