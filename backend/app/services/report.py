"""
Report generation service
"""

import json
from typing import Dict, Optional
from datetime import datetime
from pathlib import Path
from app.config import settings


class ReportGenerator:
    """Service for generating reports in different formats"""
    
    @staticmethod
    def generate_json_report(review_data: Dict, filename: Optional[str] = None) -> str:
        """
        Generate JSON report
        
        Args:
            review_data: Review data dictionary
            filename: Optional filename
            
        Returns:
            Path to generated report
        """
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = filename or f"review_{timestamp}.json"
        
        report_path = Path(settings.upload_dir) / filename
        
        with open(report_path, "w") as f:
            json.dump(review_data, f, indent=2, default=str)
        
        return str(report_path)
    
    @staticmethod
    def generate_markdown_report(review_data: Dict, filename: Optional[str] = None) -> str:
        """
        Generate Markdown report
        
        Args:
            review_data: Review data dictionary
            filename: Optional filename
            
        Returns:
            Path to generated report
        """
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = filename or f"review_{timestamp}.md"
        
        report_path = Path(settings.upload_dir) / filename
        
        with open(report_path, "w") as f:
            f.write(ReportGenerator._generate_markdown_content(review_data))
        
        return str(report_path)
    
    @staticmethod
    def _generate_markdown_content(review_data: Dict) -> str:
        """Generate markdown content"""
        md = f"""# Code Review Report

**Generated:** {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}

## Summary

{review_data.get('summary', 'No summary')}

## Scores

| Metric | Score |
|--------|-------|
| Overall | {review_data.get('overall_score', 0)}/100 |
| Security | {review_data.get('security_score', 0)}/100 |
| Performance | {review_data.get('performance_score', 0)}/100 |
| Maintainability | {review_data.get('maintainability_score', 0)}/100 |
| Documentation | {review_data.get('documentation_score', 0)}/100 |

## Code Metrics

"""
        
        if 'metrics' in review_data:
            metrics = review_data['metrics']
            md += f"""
- **Lines of Code:** {metrics.get('lines_of_code', 0)}
- **Total Lines:** {metrics.get('total_lines', 0)}
- **Functions:** {metrics.get('functions', 0)}
- **Classes:** {metrics.get('classes', 0)}
- **Cyclomatic Complexity:** {metrics.get('cyclomatic_complexity', 0)}
"""
        
        md += "\n## Bugs Found\n\n"
        
        bugs = review_data.get('bugs', [])
        if bugs:
            for bug in bugs:
                md += f"""### {bug.get('severity', 'unknown').upper()}: {bug.get('description', 'Bug')}

**Line:** {bug.get('line', 'N/A')}

**Fix:** {bug.get('fix', 'No fix provided')}

**Optimized Code:**
```
{bug.get('optimized_code', 'No code provided')}
```

"""
        else:
            md += "No bugs found!\n\n"
        
        # Security Issues
        md += "\n## Security Issues\n\n"
        security_issues = review_data.get('security_issues', [])
        if security_issues:
            for issue in security_issues:
                md += f"- **{issue.get('severity', 'unknown').upper()}**: {issue.get('issue', issue.get('description', 'Security issue'))}\n"
                md += f"  - Fix: {issue.get('fix', 'No fix provided')}\n\n"
        else:
            md += "No security issues found!\n\n"
        
        # Performance Issues
        md += "\n## Performance Issues\n\n"
        perf_issues = review_data.get('performance_issues', [])
        if perf_issues:
            for issue in perf_issues:
                md += f"- **{issue.get('severity', 'medium').upper()}**: {issue.get('issue', issue.get('description', 'Performance issue'))}\n"
                md += f"  - Optimization: {issue.get('optimization', 'No optimization provided')}\n\n"
        else:
            md += "No performance issues found!\n\n"
        
        # Best Practices
        md += "\n## Best Practices\n\n"
        best_practices = review_data.get('best_practices', [])
        if best_practices:
            for practice in best_practices:
                md += f"- {practice}\n"
        else:
            md += "No best practices to highlight.\n"
        
        # Unit Tests
        if review_data.get('unit_tests'):
            md += f"""\n## Suggested Unit Tests

```python
{review_data.get('unit_tests', '')}
```
"""
        
        # Documentation
        if review_data.get('documentation'):
            md += f"""\n## Documentation

{review_data.get('documentation', '')}
"""
        
        return md
    
    @staticmethod
    def generate_pdf_report(review_data: Dict, filename: Optional[str] = None) -> str:
        """
        Generate PDF report
        
        Args:
            review_data: Review data dictionary
            filename: Optional filename
            
        Returns:
            Path to generated report
        """
        # For PDF generation, we'll use the markdown and require an external tool
        # This is a placeholder that creates a text file that can be converted to PDF
        from pathlib import Path
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = filename or f"review_{timestamp}.pdf"
        
        report_path = Path(settings.upload_dir) / filename
        
        # For production, use libraries like:
        # - reportlab
        # - weasyprint
        # - python-pptx
        
        # Placeholder: save markdown as text for PDF conversion
        with open(report_path, "w") as f:
            f.write(ReportGenerator._generate_markdown_content(review_data))
        
        return str(report_path)


# Global report generator instance
report_generator = ReportGenerator()
