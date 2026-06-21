## 🎓 Development Guide

### Project Overview

The AI Code Reviewer is a full-stack application that uses Retrieval-Augmented Generation (RAG) to provide intelligent code analysis powered by Gemini 2.5 Flash API.

### Architecture

```
User Request → Frontend (React)
              ↓
            API Layer (FastAPI)
              ↓
         RAG Service (ChromaDB)
              ↓
    LLM Service (Gemini 2.5 Flash)
              ↓
      Database (SQLite/PostgreSQL)
              ↓
         Response → Frontend
```

### Key Technologies

#### Backend
- **FastAPI**: async Python web framework
- **SQLAlchemy**: ORM for database
- **ChromaDB**: Vector DB for embeddings
- **Sentence Transformers**: Generate embeddings
- **LangChain**: LLM orchestration
- **Gemini API**: AI engine
- **JWT**: Authentication

#### Frontend
- **React 18**: UI library
- **Vite**: Build tool
- **Tailwind**: CSS framework
- **React Router**: Routing
- **Monaco Editor**: Code editor
- **Framer Motion**: Animations

### Directory Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI application
│   ├── config.py            # Configuration
│   ├── routers/
│   │   ├── auth.py          # Authentication endpoints
│   │   ├── review.py        # Code review endpoints
│   │   ├── chat.py          # Chat endpoints
│   │   └── history.py       # History endpoints
│   ├── services/
│   │   ├── rag.py           # RAG service
│   │   ├── llm.py           # LLM service
│   │   ├── embedding.py     # Embedding service
│   │   ├── review_engine.py # Review logic
│   │   └── report.py        # Report generation
│   ├── database/
│   │   ├── models.py        # Database models
│   │   └── db.py            # DB initialization
│   ├── schemas/             # Pydantic schemas
│   └── utils/               # Utilities
├── tests/                   # Unit tests
├── uploads/                 # Uploaded files
├── vector_db/               # ChromaDB storage
├── requirements.txt
├── .env.example
└── Dockerfile

frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx       # Top navigation
│   │   ├── Sidebar.jsx      # Side menu
│   │   ├── CodeEditor.jsx   # Monaco editor
│   │   ├── FileUploader.jsx # Drag-drop upload
│   │   ├── ReviewCard.jsx   # Review display
│   │   ├── ChatPanel.jsx    # Chat interface
│   │   ├── Charts.jsx       # Data visualization
│   │   ├── Loader.jsx       # Loading state
│   │   └── Toast.jsx        # Notifications
│   ├── pages/
│   │   ├── Landing.jsx      # Home page
│   │   ├── Login.jsx        # Login page
│   │   ├── Register.jsx     # Sign up page
│   │   ├── Dashboard.jsx    # Dashboard
│   │   ├── UploadCode.jsx   # Review page
│   │   ├── ReviewResult.jsx # Results page
│   │   ├── History.jsx      # History page
│   │   ├── Settings.jsx     # Settings page
│   │   └── Profile.jsx      # Profile page
│   ├── services/
│   │   └── api.js           # API client
│   ├── hooks/
│   │   ├── useAuth.js       # Auth hooks
│   │   └── useCodeReview.js # Review hooks
│   └── context/
│       ├── AuthContext.jsx  # Auth state
│       └── ThemeContext.jsx # Theme state
├── App.jsx                  # Root component
├── main.jsx                 # Entry point
└── styles/
    └── globals.css          # Global styles
```

### Data Flow

#### 1. Code Review Flow
```
User submits code
    ↓
Frontend validates input
    ↓
Sends to /api/review/code
    ↓
Backend receives & validates
    ↓
ReviewEngine analyzes code
    ↓
RAG retrieves relevant docs
    ↓
LLM processes with context
    ↓
Results saved to database
    ↓
Response sent to frontend
    ↓
Display in ReviewResult page
```

#### 2. Authentication Flow
```
User registers/logs in
    ↓
Credentials validated
    ↓
JWT token generated
    ↓
Token stored in localStorage
    ↓
Added to API requests
    ↓
Backend verifies token
    ↓
Grants access to endpoints
```

#### 3. Chat Flow
```
User sends message
    ↓
Frontend adds to messages array
    ↓
Sends to /api/chat/message
    ↓
Backend retrieves code context
    ↓
LLM generates response
    ↓
Saves to database
    ↓
Returns to frontend
    ↓
Display in chat panel
```

### Development Workflow

#### Adding a New Feature

1. **Backend**
   - Create route in `routers/`
   - Define schema in `schemas/`
   - Implement logic in `services/`
   - Add database model if needed
   - Write tests in `tests/`

2. **Frontend**
   - Create component in `components/`
   - Add page in `pages/` if needed
   - Create API service in `services/api.js`
   - Add hook if needed
   - Update routing in `App.jsx`

3. **Testing**
   - Backend: `pytest tests/`
   - Frontend: `npm test`

4. **Documentation**
   - Update README.md
   - Add API docs comments

#### Example: Add New Language Support

**Backend:**
```python
# In app/services/review_engine.py
@staticmethod
def get_language_specific_tips(language: str) -> List[str]:
    tips = {
        "rust": [
            "Use Rust idioms",
            "Leverage ownership system",
            ...
        ]
    }
```

**Frontend:**
```javascript
// In frontend/src/pages/UploadCode.jsx
const languages = ['python', 'java', 'cpp', 'javascript', 'typescript', 'go', 'rust']
```

### Environment Variables

#### Development
```env
# Backend
GEMINI_API_KEY=test-key
SECRET_KEY=dev-secret
DATABASE_URL=sqlite:///./dev.db
RELOAD=true

# Frontend
VITE_API_URL=http://localhost:8000/api
```

#### Production
```env
# Backend
GEMINI_API_KEY=prod-key
SECRET_KEY=prod-secret-key-min-32-chars
DATABASE_URL=postgresql://user:pass@host/db
RELOAD=false

# Frontend
VITE_API_URL=https://api.yourdomain.com/api
```

### Testing

#### Backend Tests
```bash
# Run all tests
pytest

# Run specific test
pytest tests/test_auth.py

# With coverage
pytest --cov=app tests/

# Verbose output
pytest -v
```

#### Frontend Tests
```bash
# Run tests
npm test

# Watch mode
npm test -- --watch

# Coverage
npm test -- --coverage
```

### Database Migrations

For production database changes:

```python
# Create model in app/database/models.py
# Then run:
from app.database.db import init_db
init_db()
```

### Code Style

#### Backend
- PEP 8 compliant
- Type hints required
- Docstrings for all functions
- 88 character line limit

#### Frontend
- ESLint + Prettier
- Functional components
- Hooks for state management
- PropTypes for validation

### Performance Optimization

#### Backend
- Use async/await for I/O
- Cache embeddings
- Batch API requests
- Implement pagination
- Use database indexes

#### Frontend
- Code splitting with React.lazy()
- Memoization with React.memo()
- Virtual scrolling for lists
- Image optimization
- Lazy load non-critical resources

### Security Checklist

- [x] Hash passwords with bcrypt
- [x] Use JWT for auth
- [x] Validate all inputs
- [x] Implement CORS
- [x] Sanitize file uploads
- [x] Environment variable management
- [x] SQL injection prevention
- [x] XSS protection
- [x] Rate limiting ready

### Deployment Checklist

- [ ] Update SECRET_KEY
- [ ] Set GEMINI_API_KEY
- [ ] Configure CORS_ORIGINS
- [ ] Use PostgreSQL for production
- [ ] Enable HTTPS
- [ ] Set up logging
- [ ] Configure backups
- [ ] Set resource limits
- [ ] Monitor performance
- [ ] Set up alerts

### Common Development Tasks

#### Add a new API endpoint

1. Create router function
```python
@router.post("/new-endpoint")
async def new_endpoint(data: Schema):
    # Implementation
    return {"result": result}
```

2. Add to main.py
```python
app.include_router(router)
```

3. Create frontend service
```javascript
export const newAPI = {
  endpoint: (data) => apiClient.post('/path', data)
}
```

#### Debug an issue

1. Check browser console (Frontend)
2. Check terminal output (Backend)
3. Use FastAPI docs: http://localhost:8000/docs
4. Check database: SQLite Browser
5. Review logs

#### Performance profiling

**Backend:**
```python
# Add timing decorator
import time
start = time.time()
# operation
print(f"Time: {time.time() - start}s")
```

**Frontend:**
```javascript
// React DevTools Profiler
const start = performance.now()
// operation
console.log(`Time: ${performance.now() - start}ms`)
```

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "Cannot find module" | Run `npm install` or `pip install -r requirements.txt` |
| "Port already in use" | Kill process: `lsof -i :8000` then `kill -9 <PID>` |
| "API key not working" | Verify key hasn't expired, check permissions |
| "Database locked" | Close other connections, restart application |
| "CORS error" | Update CORS_ORIGINS in .env |

### Resources

- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [React Docs](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [ChromaDB Docs](https://docs.trychroma.com/)
- [Gemini API](https://ai.google.dev/)

---

Happy coding! 🚀
