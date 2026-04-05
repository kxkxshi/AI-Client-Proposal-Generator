# ProposeAI 🚀

**AI-powered client proposal generator for freelancers and agencies.**  
Generate professional, tailored proposals in under 30 seconds using Google Gemini AI.

---

## 🧠 Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python 3.11+ · FastAPI · Uvicorn |
| ORM | SQLAlchemy 2.0 |
| Database | PostgreSQL |
| Auth | Supabase (JWT-based) |
| AI | Google Gemini 1.5 Flash |
| Frontend | React 18 · Vite · Tailwind CSS 3 |
| HTTP Client | Axios |
| PDF Export | jsPDF + html2canvas |

---

## 📁 Project Structure

```
AI Client Proposal Generator/
├── backend/
│   ├── app/
│   │   ├── main.py              ← FastAPI app entry point
│   │   ├── database.py          ← SQLAlchemy setup
│   │   ├── dependencies.py      ← Auth dependencies
│   │   ├── core/
│   │   │   ├── config.py        ← Settings from .env
│   │   │   └── security.py      ← Supabase JWT validation
│   │   ├── models/
│   │   │   └── proposal.py      ← ORM model
│   │   ├── schemas/
│   │   │   └── proposal.py      ← Pydantic schemas
│   │   ├── routers/
│   │   │   └── proposals.py     ← API endpoints
│   │   └── services/
│   │       ├── gemini_service.py  ← AI integration
│   │       └── proposal_service.py
│   ├── .env                     ← ⚠️ Fill in your credentials
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── pages/               ← Login, Register, Dashboard, Create, View, History
    │   ├── components/          ← Sidebar, ProposalCard, LoadingSpinner, ProtectedRoute
    │   ├── api/                 ← Axios + proposal API helpers
    │   ├── context/             ← AuthContext (Supabase)
    │   └── lib/
    │       └── supabaseClient.js
    ├── .env                     ← ⚠️ Fill in your credentials
    └── tailwind.config.js
```

---

## ⚙️ Prerequisites

- **Python 3.11+** — [Download](https://python.org)
- **Node.js 18+** — [Download](https://nodejs.org)
- **PostgreSQL** — [Download](https://postgresql.org)
- **Gemini API Key** — [Get free key](https://aistudio.google.com/app/apikey)
- **Supabase account** — [Sign up free](https://supabase.com) (for authentication)

---

## 🚀 Getting Started

### 1. Clone / Open the project

```bash
cd "d:\Project\AI Client Proposal Generator"
```

### 2. Set up PostgreSQL

Create the database:
```sql
CREATE DATABASE proposeai;
```

### 3. Configure the Backend

Edit `backend/.env`:
```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/proposeai
GEMINI_API_KEY=your-gemini-api-key
SUPABASE_JWT_SECRET=your-supabase-jwt-secret
```

> **Where to find Supabase JWT Secret:**  
> Supabase Dashboard → Your Project → Settings → API → **JWT Secret**

### 4. Run the Backend

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start server
uvicorn app.main:app --reload --port 8080
```

✅ Backend running at: http://localhost:8080  
📖 API Docs at: http://localhost:8080/docs

> The database tables are created automatically on first startup.

### 5. Configure the Frontend

Edit `frontend/.env`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_URL=http://localhost:8080
```

> **Where to find Supabase keys:**  
> Supabase Dashboard → Your Project → Settings → API → **Project URL** and **anon public key**

### 6. Run the Frontend

```bash
cd frontend
npm install     # if not already done
npm run dev
```

✅ Frontend running at: http://localhost:5173

---

## 🔑 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | ❌ | Health check |
| POST | `/api/proposals/generate` | ✅ | Generate + save AI proposal |
| GET | `/api/proposals/` | ✅ | List current user's proposals |
| GET | `/api/proposals/{id}` | ✅ | Get full proposal by ID |
| DELETE | `/api/proposals/{id}` | ✅ | Delete a proposal |

---

## 🔐 Authentication Flow

1. User registers/logs in via the frontend (Supabase handles auth)
2. Supabase issues a JWT access token
3. Frontend attaches the token to every API request (`Authorization: Bearer <token>`)
4. Backend validates the token using the Supabase JWT Secret
5. User ID is extracted from the token and used to scope proposals

> **Note:** Authentication is fully handled by Supabase. No credentials are stored in the ProposeAI database.

---

## 🎨 Design System

- **Background:** `#0a0a0f` deep navy
- **Surface:** `#13131a` card background
- **Accent:** `#7c3aed` → `#4f46e5` purple-indigo gradient
- **Font:** Inter (Google Fonts)

---

## 📄 PDF Export

Click **Download PDF** on any proposal view page. The proposal content is captured with `html2canvas` and exported as a multi-page A4 PDF using `jsPDF`.

---

## 🛠️ Troubleshooting

| Issue | Solution |
|---|---|
| `psycopg2` install fails | Install PostgreSQL dev headers or use `psycopg2-binary` (already in requirements) |
| 401 Unauthorized from backend | Check `SUPABASE_JWT_SECRET` matches your Supabase project |
| Gemini API 429 error | You've hit the free tier limit (1500/day). Wait or upgrade |
| CORS errors | Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL |
| Tables not created | Check `DATABASE_URL` is correct and PostgreSQL is running |

---

## 📝 License

MIT — use freely for personal or commercial projects.
