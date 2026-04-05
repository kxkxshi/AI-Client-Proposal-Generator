from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.database import engine
from app.models import proposal as proposal_model
from app.routers import proposals
from app.core.config import get_settings
from fastapi.responses import RedirectResponse

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Create database tables on startup."""
    proposal_model.Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="ProposeAI API",
    description="AI-powered client proposal generator for freelancers and agencies.",
    version="1.0.0",
    lifespan=lifespan,
)

# ─── CORS ────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url, "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Routers ─────────────────────────────────────────────────────────────────
app.include_router(proposals.router)


@app.get("/", tags=["Health"])
def health_check():
    """Redirect root to API documentation."""
    return RedirectResponse(url="/docs")
