from fastapi import FastAPI
from app.api.families import router as families_router
from app.api.albums import router as albums_router
from app.api.videos import router as videos_router
from app.api.video_tags import router as video_tags_router
from app.api.memory_summaries import router as memory_summaries_router

app = FastAPI(title="LetsVideo AI Agent")

app.include_router(families_router, prefix="/api/families")
app.include_router(albums_router, prefix="/api/albums")
app.include_router(videos_router, prefix="/api/videos")
app.include_router(video_tags_router, prefix="/api/video-tags")
app.include_router(memory_summaries_router, prefix="/api/memory-summaries")