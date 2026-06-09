from fastapi import FastAPI
from app.api.families import router as families_router

app = FastAPI(title="LetsVideo AI Agent")

app.include_router(families_router, prefix="/api/families")