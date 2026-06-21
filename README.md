# AI Code Reviewer 🤖

A production-ready AI-powered code review platform with Retrieval-Augmented Generation (RAG). Analyze code quality, detect security vulnerabilities, optimize performance, and get actionable insights powered by Groq Llama 3.3 API.

## ✨ Features

### 🔍 Code Analysis
- **Bug Detection**: Identify potential bugs and runtime errors
- **Security Analysis**: Detect OWASP Top 10 vulnerabilities
- **Performance Review**: Find optimization opportunities
- **Code Quality**: Assess maintainability and best practices

### 📊 Multiple Input Methods
- Paste code directly
- Upload individual files (.py, .java, .cpp, .js, .ts, .go)
- Upload ZIP projects
- Clone from GitHub repositories

### 🤖 AI-Powered Features
- Deep code analysis with Groq Llama 3.3
- RAG (Retrieval-Augmented Generation) with ChromaDB
- Context-aware AI chatbot
- Generate unit tests and documentation
- Refactor suggestions and code conversion

### 📈 Analytics & History
- Dashboard with statistics
- Review history with filtering
- Export reports (JSON, Markdown, PDF)
- Performance metrics and trends

### 🎨 Modern UI
- GitHub & VS Code inspired design
- Dark/Light theme support
- Responsive design
- Smooth animations with Framer Motion
- Monaco Editor for syntax highlighting

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Monaco Editor** for code editing
- **Recharts** for analytics
- **React Router** for navigation

### Backend
- **Python 3.11**
- **FastAPI** for REST API
- **SQLAlchemy** for ORM
- **ChromaDB** for vector embeddings
- **Sentence Transformers** for embeddings
- **LangChain** for LLM orchestration
- **Groq Llama 3.3** for AI analysis
- **JWT** for authentication
- **SQLite/PostgreSQL** for database

### Infrastructure
- **Docker & Docker Compose**
- **Redis** for caching
- **PostgreSQL** for production database

## 📋 Prerequisites

- Python 3.11+
- Node.js 18+
- Docker & Docker Compose (optional)
- Git

## ⚙️ Installation

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/ai-code-reviewer.git
cd ai-code-reviewer
```

### 2. Set Up Environment Variables

**Backend (.env)**
```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:
```env
GROQ_API_KEY=your-key
GITHUB_TOKEN=your-github-token-here
SECRET_KEY=your-secure-secret-key-here
DATABASE_URL=sqlite:///./code_reviewer.db
```

### 3. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Initialize database
python -c "from app.database.db import init_db; init_db()"

# Run development server
python -m uvicorn app.main:app --reload
```

Backend will be available at: `http://localhost:8000`

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
echo "VITE_API_URL=http://localhost:8000/api" > .env.local

# Run development server
npm run dev
```

Frontend will be available at: `http://localhost:5173`

## 🐳 Docker Deployment

### Using Docker Compose

```bash
# Set environment variables
export GROQ_API_KEY=your-key
export GITHUB_TOKEN=your-token

# Build and run
docker-compose up --build

# Access the application
# Frontend: http://localhost:3000
# Backend: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### Individual Containers

**Backend:**
```bash
cd backend
docker build -t ai-code-reviewer-backend .
docker run -p 8000:8000 -e GROQ_API_KEY=your-key ai-code-reviewer-backend
```

**Frontend:**
```bash
cd frontend
docker build -t ai-code-reviewer-frontend .
docker run -p 3000:3000 ai-code-reviewer-frontend
```

## 🔑 API Key Setup

### Get Groq API Key
1. Visit [Groq Console](https://console.groq.com)
2. Create a new API key
3. Add to `.env` file

### Get GitHub Token (Optional)
1. GitHub Settings → Developer settings → Personal access tokens
2. Generate new token with `repo` scope
3. Add to `.env` file

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh token

### Code Review
- `POST /api/review/code` - Review code snippet
- `POST /api/review/upload` - Upload and review file
- `GET /api/review/{id}` - Get review details

### Chat
- `POST /api/chat/message` - Send chat message
- `GET /api/chat/history` - Get chat history
- `DELETE /api/chat/message/{id}` - Delete message

### History
- `GET /api/history` - Get review history
- `GET /api/history/stats` - Get statistics
- `DELETE /api/history/{id}` - Delete review
- `POST /api/history/export/{id}` - Export review

## 📖 Usage

### 1. Register Account
Navigate to `/register` and create a new account.

### 2. Upload Code
- Go to "Upload Code" page
- Choose method: Paste, Upload File, or GitHub URL
- Select programming language
- Click "Start Review"

### 3. View Results
- See comprehensive analysis
- Review bugs, security issues, and performance suggestions
- Chat with AI assistant for explanations
- Export report as PDF, JSON, or Markdown

### 4. Track History
- View all past reviews
- Filter by language
- Export or delete reviews
- View statistics dashboard

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest tests/
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📊 Supported Languages

- Python
- Java
- C++
- JavaScript
- TypeScript
- Go

## 🔐 Security Features

- ✅ JWT authentication
- ✅ Password hashing with bcrypt
- ✅ SQL injection prevention
- ✅ XSS protection
- ✅ CORS configuration
- ✅ Rate limiting ready
- ✅ Secure API endpoints

## 🚀 Production Deployment

### Using Heroku
```bash
heroku create your-app-name
git push heroku main
```

### Using AWS
- Deploy frontend to S3 + CloudFront
- Deploy backend to EC2 or ECS
- Use RDS for PostgreSQL
- Use ElastiCache for Redis

### Using DigitalOcean
```bash
doctl apps create --spec app.yaml
```

## 📝 Configuration

### Database
- **Development**: SQLite (default)
- **Production**: PostgreSQL (recommended)

Edit `backend/app/config.py`:
```python
DATABASE_URL = "postgresql://user:password@localhost/db"
```

### CORS
Update allowed origins in `.env`:
```env
CORS_ORIGINS=["http://localhost:3000", "https://yourdomain.com"]
```

## 🔄 Workflow

1. **Code Upload** → User submits code
2. **Processing** → Code analysis begins
3. **RAG Retrieval** → Fetch relevant documentation
4. **LLM Analysis** → Groq analyzes with context
5. **Report Generation** → Create comprehensive review
6. **Display Results** → Show findings in UI
7. **Feedback Loop** → Chat with AI for clarifications

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if port 8000 is in use
lsof -i :8000

# Kill process
kill -9 <PID>
```

### Frontend API connection fails
- Check backend is running: `http://localhost:8000/health`
- Verify CORS settings in `.env`
- Check browser console for errors

### Docker issues
```bash
# Clean up containers
docker-compose down -v

# Rebuild
docker-compose up --build
```

## 📄 Environment Variables

### Backend
```env
# API
API_TITLE=AI Code Reviewer
API_VERSION=1.0.0

# Security
SECRET_KEY=your-secure-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Database
DATABASE_URL=sqlite:///./code_reviewer.db

# LLM
GROQ_API_KEY=your-key

# GitHub
GITHUB_TOKEN=your-token

# Storage
CHROMA_DB_PATH=./vector_db
UPLOAD_DIR=./uploads
MAX_UPLOAD_SIZE=52428800

# Server
HOST=0.0.0.0
PORT=8000
RELOAD=true
```

### Frontend
```env
VITE_API_URL=http://localhost:8000/api
```

## 📞 Support

- Create GitHub issues for bugs
- Start discussions for features
- Check documentation wiki

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Contributing

Contributions are welcome! Please:
1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create pull request

## 🎯 Roadmap

- [ ] Multi-language support UI
- [ ] Team collaboration features
- [ ] Advanced analytics
- [ ] IDE integrations (VSCode, PyCharm)
- [ ] CI/CD pipeline integration
- [ ] Mobile app
- [ ] Real-time code review
- [ ] Custom rule creation

---

**Built with ❤️ using React, FastAPI, and AI**
