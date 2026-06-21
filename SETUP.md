## 🚀 Quick Start Guide

### Prerequisites
- Python 3.11+
- Node.js 18+
- Git

### 1. Clone & Navigate
```bash
git clone <repository-url>
cd ai-code-reviewer
```

### 2. Backend Setup (5 minutes)
```bash
cd backend

# Virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install & run
pip install -r requirements.txt
cp .env.example .env

# Edit .env with your Gemini API key
# GEMINI_API_KEY=your-key-here

python -m uvicorn app.main:app --reload
```

✅ Backend running at `http://localhost:8000`

### 3. Frontend Setup (5 minutes)
```bash
cd ../frontend

npm install
npm run dev
```

✅ Frontend running at `http://localhost:5173`

### 4. First Review
1. Open http://localhost:5173
2. Click "Sign Up" → Create account
3. Go to "Upload Code"
4. Paste Python code → Submit
5. View analysis results!

## 🐳 Docker Quick Start
```bash
export GEMINI_API_KEY=your-key
docker-compose up
```

Access:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## 📁 Project Structure

```
ai-code-reviewer/
├── backend/                    # FastAPI backend
│   ├── app/
│   │   ├── main.py            # FastAPI app
│   │   ├── config.py          # Settings
│   │   ├── routers/           # API endpoints
│   │   ├── services/          # Business logic
│   │   ├── database/          # Database models
│   │   ├── schemas/           # Pydantic schemas
│   │   └── utils/             # Utilities
│   ├── requirements.txt       # Python dependencies
│   ├── .env.example
│   └── Dockerfile
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── components/        # UI components
│   │   ├── pages/             # Page components
│   │   ├── services/          # API services
│   │   ├── hooks/             # Custom hooks
│   │   ├── context/           # Context providers
│   │   └── styles/            # Tailwind CSS
│   ├── package.json
│   ├── index.html
│   └── Dockerfile
├── docker-compose.yml         # Docker orchestration
└── README.md
```

## 🎯 Key Features Used

### Backend
- **FastAPI** - Modern async Python web framework
- **SQLAlchemy** - Database ORM
- **ChromaDB** - Vector database for RAG
- **Sentence Transformers** - Text embeddings
- **Gemini 2.5 Flash API** - AI analysis engine
- **JWT** - Secure authentication
- **Pydantic** - Data validation

### Frontend
- **React 18** - UI library
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing
- **Monaco Editor** - Code editor
- **Framer Motion** - Smooth animations
- **Recharts** - Data visualization

## 🔑 Environment Variables

### Backend (.env)
```env
GEMINI_API_KEY=your-gemini-api-key
GITHUB_TOKEN=your-github-token (optional)
SECRET_KEY=your-jwt-secret-key
DATABASE_URL=sqlite:///./code_reviewer.db
```

### Frontend (.env.local)
```env
VITE_API_URL=http://localhost:8000/api
```

## 📊 Supported Languages
- Python 🐍
- Java ☕
- C++ 🔨
- JavaScript 📜
- TypeScript 💙
- Go 🐹

## 🔍 Review Includes
- ✅ Bug detection
- ✅ Security analysis (OWASP)
- ✅ Performance optimization
- ✅ Code quality metrics
- ✅ Best practices
- ✅ Unit test generation
- ✅ Documentation suggestions

## 🎨 UI Components
- Responsive design
- Dark/Light themes
- Monaco code editor
- Charts and analytics
- Toast notifications
- Loading states
- Smooth animations

## 🧪 Running Tests

**Backend:**
```bash
cd backend
pytest tests/
```

**Frontend:**
```bash
cd frontend
npm test
```

## 🚀 Deployment

### Local Development
```bash
# Backend
cd backend && python -m uvicorn app.main:app --reload

# Frontend (in another terminal)
cd frontend && npm run dev
```

### Production Build
```bash
# Backend
cd backend && pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000

# Frontend
cd frontend && npm run build
npm run preview
```

### Docker Production
```bash
docker-compose -f docker-compose.yml up -d
```

## 📚 API Documentation

Auto-generated OpenAPI docs available at:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

## 🐛 Common Issues

**"Cannot connect to backend"**
- Check backend is running: `http://localhost:8000/health`
- Verify CORS settings
- Check firewall rules

**"Gemini API key not working"**
- Verify key is correct
- Check key has permissions
- Ensure .env is in correct location

**"Port already in use"**
```bash
# Find process on port 8000
lsof -i :8000

# Kill it
kill -9 <PID>
```

## 📞 Support & Contact

- 📧 Email: support@example.com
- 🐛 Issues: GitHub Issues
- 💬 Discussions: GitHub Discussions

## 📄 License

MIT License - Free to use and modify

## 🎉 Next Steps

1. ✅ Set up environment
2. ✅ Run backend & frontend
3. ✅ Create account
4. ✅ Submit code for review
5. ✅ View analysis results
6. ✅ Chat with AI assistant
7. ✅ Export reports
8. ✅ Track history

---

**Enjoy intelligent code reviews powered by AI! 🚀**
