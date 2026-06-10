from pydantic import BaseModel
from typing import Optional


class MemorySummaryCreate(BaseModel):
    video_id: str
    family_id: str

    summary: str
    people: Optional[str] = None
    place: Optional[str] = None
    event_type: Optional[str] = None
    language: Optional[str] = "en"


class MemorySummaryUpdate(BaseModel):
    summary: Optional[str] = None
    people: Optional[str] = None
    place: Optional[str] = None
    event_type: Optional[str] = None
    language: Optional[str] = None


class MemorySummaryResponse(BaseModel):
    id: str
    video_id: str
    family_id: str

    summary: str
    people: Optional[str] = None
    place: Optional[str] = None
    event_type: Optional[str] = None
    language: Optional[str] = None
    created_at: Optional[str] = None