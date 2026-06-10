from fastapi import FastAPI
from app.api.families import router as families_router
from app.api.albums import router as albums_router

app = FastAPI(title="LetsVideo AI Agent")

app.include_router(families_router, prefix="/api/families")
app.include_router(albums_router, prefix="/api/albums")