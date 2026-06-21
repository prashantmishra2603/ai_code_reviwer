"""
LLM service for code review using Groq API
"""

from groq import Groq
from typing import Dict, Optional
import json
import re
from app.config import settings
from app.services.rag import rag_service
from app.utils.code_analyzer import (
    analyze_code_metrics,
    detect_security_issues,
    detect_performance_issues
)


class LLMService:
    """Service for LLM interactions"""
    
    def __init__(self):
        """Initialize LLM service"""
        self.client = None
        self.model = "llama-3.3-70b-versatile"
        
        # Don't fail immediately on initialization, allow starting with dummy key
        if settings.groq_api_key and settings.groq_api_key != "your-groq-api-key-here":
            try:
                self.client = Groq(api_key=settings.groq_api_key)
            except Exception as e:
                print(f"⚠️ Error initializing Groq client: {e}")
    
    def get_system_prompt(self) -> str:
        """Get system prompt for code review"""
        return """You are an expert software engineer with 20 years of experience in code review and quality assurance.

Your responsibilities:
1. Identify bugs and security vulnerabilities
2. Analyze code performance and optimization opportunities
3. Assess code maintainability and readability
4. Check documentation completeness
5. Suggest improvements and best practices

Always provide:
- Detailed explanations of each issue
- Severity levels (critical, high, medium, low)
- Suggested fixes and optimized code
- Best practices and patterns
- Unit test examples when relevant

Return your response as valid JSON with the following structure:
{
    "summary": "Brief overview of the code and main findings",
    "bugs": [
        {
            "severity": "high|medium|low|critical",
            "line": "line number or null",
            "description": "What the bug is",
            "fix": "How to fix it",
            "optimized_code": "Example of fixed code"
        }
    ],
    "security_issues": [
        {
            "severity": "high|medium|low|critical",
            "issue": "Security issue description",
            "fix": "How to fix it"
        }
    ],
    "performance_issues": [
        {
            "severity": "high|medium|low",
            "issue": "Performance issue",
            "optimization": "How to optimize"
        }
    ],
    "maintainability": {
        "score": 0-100,
        "issues": ["List of maintainability concerns"],
        "suggestions": ["List of suggestions"]
    },
    "documentation": {
        "score": 0-100,
        "missing_parts": ["What documentation is missing"],
        "examples": "Example documentation"
    },
    "unit_tests": "Example unit test code",
    "best_practices": ["List of best practices found or recommended"],
    "overall_score": 0-100,
    "security_score": 0-100,
    "performance_score": 0-100,
    "maintainability_score": 0-100,
    "documentation_score": 0-100
}"""
    
    def review_code(
        self,
        code: str,
        language: str,
        context: Optional[str] = None
    ) -> Dict:
        """
        Review code using LLM
        
        Args:
            code: Source code to review
            language: Programming language
            context: Additional context from RAG
            
        Returns:
            Review result as dictionary
        """
        # If Groq is not initialized, generate a dynamic mock review immediately
        if not self.client:
            return self._generate_mock_review(code, language)
            
        # Get relevant documentation context
        rag_context = rag_service.retrieve_context(language, code[:500], top_k=3)
        context_text = ""
        
        if rag_context:
            context_text = "\n\nRelevant Documentation:\n"
            for doc in rag_context:
                context_text += f"- {doc['content'][:200]}...\n"
        
        user_prompt = f"""Please review the following {language} code:

```{language}
{code}
```

{context_text}

Provide a comprehensive code review including bugs, security issues, performance optimization opportunities, and code quality assessment."""
        
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": self.get_system_prompt()},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.3,
                max_tokens=4000
            )
            
            # Extract JSON from response
            response_text = response.choices[0].message.content
            
            # Try to find JSON in the response
            json_match = re.search(r'\{[\s\S]*\}', response_text)
            if json_match:
                result = json.loads(json_match.group())
            else:
                # Fallback if no JSON found
                result = self._create_fallback_response(response_text, language)
            
            return result
        
        except Exception as e:
            print(f"Error reviewing code: {e}")
            return self._generate_mock_review(code, language)
    
    def chat(self, message: str, code_context: Optional[str] = None) -> str:
        """
        Chat about code
        
        Args:
            message: User message
            code_context: Optional code context
            
        Returns:
            AI response
        """
        if not self.client:
            return self._generate_mock_chat(message, code_context)
            
        context = ""
        if code_context:
            context = f"\nCode Context:\n```\n{code_context}\n```\n"
        
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are a helpful code review assistant. Answer questions about code quality, best practices, and programming."},
                    {"role": "user", "content": f"{context}User: {message}"}
                ],
                temperature=0.3,
                max_tokens=2000
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"Error in chat service: {e}")
            return self._generate_mock_chat(message, code_context)
            
    def _generate_mock_review(self, code: str, language: str) -> Dict:
        """Generate high-quality mock review when LLM is unavailable"""
        metrics = analyze_code_metrics(code, language)
        security_issues = detect_security_issues(code, language)
        performance_issues = detect_performance_issues(code)
        
        # Calculate scores
        security_score = 100 - (len(security_issues) * 15)
        performance_score = 100 - (len(performance_issues) * 10)
        
        complexity_deduction = max(0, (metrics.get("cyclomatic_complexity", 1) - 5) * 5)
        maintainability_score = max(50, 95 - complexity_deduction)
        
        # Count comments ratio
        total_lines = metrics.get("total_lines", 1) or 1
        comment_ratio = metrics.get("comment_lines", 0) / total_lines
        if comment_ratio < 0.1:
            documentation_score = 70
        elif comment_ratio < 0.2:
            documentation_score = 85
        else:
            documentation_score = 98
            
        overall = int((security_score + performance_score + maintainability_score + documentation_score) / 4)
        overall = max(10, min(100, overall))
        
        # Mock bugs
        bugs = []
        if "/" in code and "0" in code:
            bugs.append({
                "severity": "critical",
                "line": None,
                "description": "Potential Division by Zero vulnerability detected in code arithmetic.",
                "fix": "Validate that the denominator is not zero before executing division.",
                "optimized_code": "# Example fix:\nif denominator != 0:\n    result = numerator / denominator\nelse:\n    result = 0"
            })
            
        if overall < 80 and not bugs:
            bugs.append({
                "severity": "medium",
                "line": 1,
                "description": f"Function complexity is higher than recommended. Found {metrics.get('cyclomatic_complexity', 1)} decision points.",
                "fix": "Refactor complex conditional statements or loops into smaller helper functions.",
                "optimized_code": "// Consider breaking down the main function block into smaller single-responsibility methods."
            })
            
        # Language specific tips as best practices
        from app.services.review_engine import review_engine
        best_practices = review_engine.get_language_specific_tips(language)
        if not best_practices:
            best_practices = [
                "Keep functions short and focused on a single responsibility",
                "Write descriptive variable and function names",
                "Add docstrings/comments to explain complex business logic"
            ]
            
        # Language specific unit test mock
        if language == "python":
            unit_tests = """import unittest
from module import *

class TestCode(unittest.TestCase):
    def test_success_case(self):
        # TODO: Add assertions
        self.assertTrue(True)

if __name__ == '__main__':
    unittest.main()"""
        elif language in ["javascript", "typescript"]:
            unit_tests = """describe('Code Review Generated Tests', () => {
  it('should run successfully and return expected result', () => {
    // TODO: Implement actual test assertions
    expect(true).toBe(true);
  });
});"""
        elif language == "go":
            unit_tests = """package main

import "testing"

func TestMain(t *testing.T) {
    if false {
        t.Errorf("expected true, got false")
    }
}"""
        else:
            unit_tests = """// Standard Unit Test Blueprint
// TODO: Implement unit test assertions for your target build environment."""

        summary = f"Review generated (Offline Analyzer). Tested {metrics.get('lines_of_code', 0)} lines of {language.upper()} code. "
        if len(security_issues) > 0 or len(performance_issues) > 0:
            summary += f"Detected {len(security_issues)} security alerts and {len(performance_issues)} performance targets."
        else:
            summary += "Code complies with general design guidelines and has no syntax-analyzable issues."
            
        return {
            "summary": summary,
            "bugs": bugs,
            "security_issues": security_issues,
            "performance_issues": performance_issues,
            "maintainability": {
                "score": maintainability_score,
                "issues": [f"Cyclomatic complexity is {metrics.get('cyclomatic_complexity', 1)}"],
                "suggestions": ["Minimize deep nested indentation levels"]
            },
            "documentation": {
                "score": documentation_score,
                "missing_parts": ["Module headers" if comment_ratio < 0.1 else "None"],
                "examples": f"# Documentation Example for {language.upper()}\n# Document module functions, interfaces, arguments and exception types."
            },
            "unit_tests": unit_tests,
            "best_practices": best_practices,
            "overall_score": overall,
            "security_score": security_score,
            "performance_score": performance_score,
            "maintainability_score": maintainability_score,
            "documentation_score": documentation_score
        }
        
    def _generate_mock_chat(self, message: str, code_context: Optional[str] = None) -> str:
        """Generate high-quality chatbot replies offline"""
        msg = message.lower()
        reply = "🤖 **AI Assistant (Development Mode)**\n\n"
        
        if "fix" in msg or "bug" in msg or "error" in msg:
            reply += "To resolve issues in this code, consider these best practices:\n"
            reply += "1. Always validate external input to prevent security exploits (e.g. SQL Injection, XSS).\n"
            reply += "2. Implement detailed try-except or error recovery blocks around file and network operations.\n"
            reply += "3. Use standard static analysis tools (like ESLint for JS, Flake8 for Python) to clean up syntax warnings."
        elif "optimize" in msg or "performance" in msg or "slow" in msg:
            reply += "For better runtime efficiency, look at optimizing these segments:\n"
            reply += "1. **Caching**: Store repetitive calculation results or API responses.\n"
            reply += "2. **Loops**: Minimize nested loop statements and leverage map/filter operators where possible.\n"
            reply += "3. **Database Queries**: Fetch only required fields and use indexing for quick lookups."
        elif "test" in msg or "unittest" in msg:
            reply += "Writing robust unit tests is critical. Ensure you cover:\n"
            reply += "- **Happy Paths**: Typical inputs yielding successful results.\n"
            reply += "- **Edge Cases**: Empty fields, boundary numeric limits, and null values.\n"
            reply += "- **Exception Paths**: Validating that standard errors are raised and handled appropriately."
        else:
            reply += "I'm running in offline assistant mode. Feel free to ask me to analyze code complexity, suggest security mitigations, write test blueprints, or refactor blocks of code! For real-time Groq Llama 3.3 replies, please set a valid `GROQ_API_KEY` in your `.env` file."
            
        return reply

    @staticmethod
    def _create_empty_response() -> Dict:
        """Create empty response structure"""
        return {
            "summary": "Unable to process review",
            "bugs": [],
            "security_issues": [],
            "performance_issues": [],
            "maintainability": {"score": 0, "issues": [], "suggestions": []},
            "documentation": {"score": 0, "missing_parts": [], "examples": ""},
            "unit_tests": "",
            "best_practices": [],
            "overall_score": 0,
            "security_score": 0,
            "performance_score": 0,
            "maintainability_score": 0,
            "documentation_score": 0,
        }
    
    @staticmethod
    def _create_fallback_response(text: str, language: str) -> Dict:
        """Create fallback response from text"""
        return {
            "summary": text[:200],
            "bugs": [],
            "security_issues": [],
            "performance_issues": [],
            "maintainability": {"score": 50, "issues": [], "suggestions": []},
            "documentation": {"score": 50, "missing_parts": [], "examples": ""},
            "unit_tests": "",
            "best_practices": [],
            "overall_score": 50,
            "security_score": 50,
            "performance_score": 50,
            "maintainability_score": 50,
            "documentation_score": 50,
        }


# Global LLM service instance
llm_service = LLMService()
