from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import health, me


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield


app = FastAPI(
    title="Basar AI API",
    description="API for Basar AI - Brand Management Platform",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, tags=["health"])
app.include_router(me.router, tags=["account"])


@app.get("/")
async def root():
    return {
        "message": "Basar AI API",
        "version": "0.1.0",
        "status": "running",
    }
