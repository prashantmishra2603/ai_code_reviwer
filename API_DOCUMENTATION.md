## 📚 Backend API Documentation

### Overview
The backend API handles all code review operations, user authentication, and data persistence.

### Base URL
```
http://localhost:8000/api
```

### Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## 🔐 Authentication Endpoints

### Register
Create a new user account.

**Endpoint:** `POST /auth/register`

**Request:**
```json
{
  "email": "user@example.com",
  "username": "john_doe",
  "password": "securepass123",
  "full_name": "John Doe"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "john_doe",
    "full_name": "John Doe",
    "is_active": true,
    "is_premium": false,
    "created_at": "2024-01-15T10:30:00"
  }
}
```

### Login
Authenticate user and receive access token.

**Endpoint:** `POST /auth/login`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepass123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer",
  "user": { ... }
}
```

### Refresh Token
Get a new access token.

**Endpoint:** `POST /auth/refresh`

**Parameters:**
- `token` (string): Current token to refresh

---

## 📝 Review Endpoints

### Review Code Snippet
Analyze code from a text input.

**Endpoint:** `POST /review/code`

**Request:**
```json
{
  "code_content": "def hello():\n    print('Hello')",
  "code_language": "python",
  "file_name": "app.py"
}
```

**Parameters:**
- `code_content` (string): Source code to review
- `code_language` (string): Language - python, java, cpp, javascript, typescript, go
- `file_name` (string, optional): Original filename

**Response:**
```json
{
  "id": 1,
  "user_id": 1,
  "code_language": "python",
  "file_name": "app.py",
  "review_result": {
    "summary": "...",
    "overall_score": 75,
    "security_score": 85,
    "performance_score": 70,
    "maintainability_score": 80,
    "documentation_score": 60,
    "bugs": [...],
    "best_practices": [...]
  },
  "overall_score": 75,
  "security_score": 85,
  "performance_score": 70,
  "maintainability_score": 80,
  "documentation_score": 60,
  "created_at": "2024-01-15T10:30:00"
}
```

### Upload File
Upload a file for review.

**Endpoint:** `POST /review/upload`

**Request:** Multipart form data
- `file` (file): Code file to upload

**Response:** Same as /review/code

### Get Review
Retrieve specific review details.

**Endpoint:** `GET /review/{review_id}`

**Response:** Review object with full analysis

---

## 💬 Chat Endpoints

### Send Message
Send a message to AI assistant for context-aware chat.

**Endpoint:** `POST /chat/message`

**Request:**
```json
{
  "message": "Explain the security issues",
  "review_id": 1
}
```

**Parameters:**
- `message` (string): Question or request
- `review_id` (integer, optional): Associated review ID for context

**Response:**
```json
{
  "id": 1,
  "user_id": 1,
  "review_id": 1,
  "user_message": "...",
  "ai_response": "...",
  "context_used": [...],
  "created_at": "2024-01-15T10:30:00"
}
```

### Get Chat History
Retrieve chat messages.

**Endpoint:** `GET /chat/history`

**Query Parameters:**
- `review_id` (integer, optional): Filter by review

**Response:**
```json
[
  {
    "id": 1,
    "user_id": 1,
    "user_message": "...",
    "ai_response": "...",
    "created_at": "2024-01-15T10:30:00"
  },
  ...
]
```

### Delete Message
Delete a chat message.

**Endpoint:** `DELETE /chat/message/{message_id}`

**Response:** 204 No Content

---

## 📜 History Endpoints

### Get History
Retrieve user's review history.

**Endpoint:** `GET /history`

**Query Parameters:**
- `skip` (integer, default: 0): Pagination offset
- `limit` (integer, default: 20): Number of results
- `language` (string, optional): Filter by language

**Response:**
```json
[
  {
    "id": 1,
    "user_id": 1,
    "code_language": "python",
    ...
  },
  ...
]
```

### Get Statistics
Get user analytics.

**Endpoint:** `GET /history/stats`

**Response:**
```json
{
  "total_reviews": 10,
  "languages_used": {
    "python": 5,
    "javascript": 3,
    "java": 2
  },
  "average_score": 78.5,
  "security_issues": 12,
  "performance_issues": 8
}
```

### Delete Review
Remove a review from history.

**Endpoint:** `DELETE /history/{review_id}`

**Response:** 204 No Content

### Export Review
Generate and export review report.

**Endpoint:** `POST /history/export/{review_id}`

**Query Parameters:**
- `format` (string): json, markdown, pdf

**Response:**
```json
{
  "file_path": "/uploads/review_1.json",
  "format": "json",
  "status": "generated"
}
```

---

## 🛠️ Response Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 204 | No Content |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Server Error |

---

## 🔍 Error Responses

```json
{
  "error": "Invalid request",
  "detail": "Code content is required",
  "status_code": 400
}
```

---

## 📊 Review Result Schema

```json
{
  "summary": "Code analysis overview",
  "overall_score": 75,
  "security_score": 85,
  "performance_score": 70,
  "maintainability_score": 80,
  "documentation_score": 60,
  "bugs": [
    {
      "severity": "high|medium|low|critical",
      "line": 42,
      "description": "Bug description",
      "fix": "How to fix",
      "optimized_code": "Fixed code snippet"
    }
  ],
  "security_issues": [
    {
      "severity": "critical",
      "issue": "Issue description",
      "fix": "How to fix"
    }
  ],
  "performance_issues": [
    {
      "severity": "medium",
      "issue": "Performance problem",
      "optimization": "Optimization suggestion"
    }
  ],
  "maintainability": {
    "score": 80,
    "issues": ["Issue 1", "Issue 2"],
    "suggestions": ["Suggestion 1"]
  },
  "documentation": {
    "score": 60,
    "missing_parts": ["Parameter docs"],
    "examples": "Example code"
  },
  "unit_tests": "Example test code",
  "best_practices": ["Best practice 1"]
}
```

---

## 🧪 Testing Endpoints

Use curl or Postman to test:

```bash
# Register
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","username":"test","password":"test1234"}'

# Login  
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test1234"}'

# Review code
curl -X POST http://localhost:8000/api/review/code \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"code_content":"print(1)","code_language":"python"}'
```

---

For complete OpenAPI documentation, visit: `http://localhost:8000/docs`
