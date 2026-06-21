"""
Code analysis utilities
"""

import re
from typing import Dict, List


def analyze_code_metrics(code: str, language: str) -> Dict:
    """
    Analyze code metrics
    
    Args:
        code: Source code
        language: Programming language
        
    Returns:
        Code metrics dictionary
    """
    lines = code.split('\n')
    
    metrics = {
        "lines_of_code": len([l for l in lines if l.strip() and not l.strip().startswith('#')]),
        "total_lines": len(lines),
        "empty_lines": len([l for l in lines if not l.strip()]),
        "comment_lines": count_comments(code, language),
        "functions": count_functions(code, language),
        "classes": count_classes(code, language),
        "imports": count_imports(code, language),
        "cyclomatic_complexity": estimate_complexity(code),
    }
    
    return metrics


def count_comments(code: str, language: str) -> int:
    """Count comment lines in code"""
    lines = code.split('\n')
    count = 0
    
    if language in ["python"]:
        for line in lines:
            if line.strip().startswith('#'):
                count += 1
    elif language in ["java", "cpp", "c", "javascript", "typescript", "go"]:
        for line in lines:
            if '//' in line or '/*' in line or '*' in line and '/*' not in line:
                count += 1
    
    return count


def count_functions(code: str, language: str) -> int:
    """Count function definitions"""
    if language == "python":
        return len(re.findall(r'^def\s+\w+', code, re.MULTILINE))
    elif language == "java":
        return len(re.findall(r'(public|private|protected)?\s*\w+\s+\w+\s*\(', code))
    elif language in ["javascript", "typescript"]:
        return len(re.findall(r'(function|const|let|var)\s+\w+\s*(\(|=\s*(\(|function))', code))
    elif language == "cpp":
        return len(re.findall(r'\w+\s+\w+\s*\([^)]*\)\s*[{;]', code))
    elif language == "go":
        return len(re.findall(r'func\s+\w+', code))
    
    return 0


def count_classes(code: str, language: str) -> int:
    """Count class definitions"""
    if language == "python":
        return len(re.findall(r'^class\s+\w+', code, re.MULTILINE))
    elif language == "java":
        return len(re.findall(r'(public|private)?\s*class\s+\w+', code))
    elif language in ["typescript", "javascript"]:
        return len(re.findall(r'class\s+\w+', code))
    elif language == "cpp":
        return len(re.findall(r'(class|struct)\s+\w+', code))
    
    return 0


def count_imports(code: str, language: str) -> int:
    """Count import/require statements"""
    if language == "python":
        return len(re.findall(r'^(import|from)\s+', code, re.MULTILINE))
    elif language in ["javascript", "typescript"]:
        return len(re.findall(r"(import|require)\s*", code))
    elif language == "java":
        return len(re.findall(r'^import\s+', code, re.MULTILINE))
    elif language == "cpp":
        return len(re.findall(r'#include\s+[<"]', code))
    elif language == "go":
        return len(re.findall(r'import\s+', code))
    
    return 0


def estimate_complexity(code: str) -> int:
    """Estimate cyclomatic complexity"""
    # Count decision points: if, for, while, catch, case, etc.
    complexity = 1
    decision_keywords = r'\b(if|else if|for|while|switch|case|catch|and|or)\b'
    complexity += len(re.findall(decision_keywords, code))
    
    return min(complexity, 20)  # Cap at 20


def detect_security_issues(code: str, language: str) -> List[Dict]:
    """
    Detect potential security issues
    
    Args:
        code: Source code
        language: Programming language
        
    Returns:
        List of security issues
    """
    issues = []
    
    # SQL Injection patterns (e.g. SELECT/INSERT/UPDATE/DELETE with string concatenation or f-string interpolation)
    sql_patterns = [
        r'(select|insert|update|delete)\s+.*?\+\s*\w+',
        r'f["\'](select|insert|update|delete)\s+.*?{.*?}',
        r'(query|execute|sql)\s*[\(\[].*\+'
    ]
    if any(re.search(pat, code, re.IGNORECASE) for pat in sql_patterns):
        issues.append({
            "type": "SQL Injection",
            "severity": "high",
            "description": "Potential SQL injection vulnerability"
        })
    
    # Hardcoded credentials
    if re.search(r'(password|secret|api_key|token)\s*=\s*["\']', code, re.IGNORECASE):
        issues.append({
            "type": "Hardcoded Credentials",
            "severity": "critical",
            "description": "Hardcoded credentials detected"
        })
    
    # XSS vulnerabilities
    if language in ["javascript", "typescript"] and re.search(r'innerHTML\s*=|dangerouslySetInnerHTML', code):
        issues.append({
            "type": "XSS",
            "severity": "high",
            "description": "Potential XSS vulnerability with innerHTML"
        })
    
    # Unsafe deserialization
    if re.search(r'(pickle\.load|JSON\.parse|yaml\.load)', code):
        issues.append({
            "type": "Unsafe Deserialization",
            "severity": "high",
            "description": "Unsafe deserialization detected"
        })
    
    return issues


def detect_performance_issues(code: str) -> List[Dict]:
    """
    Detect potential performance issues
    
    Args:
        code: Source code
        
    Returns:
        List of performance issues
    """
    issues = []
    
    # Nested loops
    nested_loops = re.findall(r'for\s+\w+\s+in.*:\s*(?:[^f]|f(?!or))*for\s+\w+\s+in', code)
    if nested_loops:
        issues.append({
            "type": "Nested Loops",
            "severity": "medium",
            "description": f"Found {len(nested_loops)} nested loops, consider optimization"
        })
    
    # N+1 queries pattern
    if re.search(r'for.*database|db\.query.*for', code):
        issues.append({
            "type": "N+1 Queries",
            "severity": "high",
            "description": "Potential N+1 query problem"
        })
    
    # Inefficient string concatenation
    if re.search(r'str\s*\+\s*str|string\s*\+\s*string', code):
        issues.append({
            "type": "String Concatenation",
            "severity": "low",
            "description": "Consider using string joining instead of concatenation"
        })
    
    return issues
