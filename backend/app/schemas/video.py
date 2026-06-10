from pydantic import BaseModel
from typing import Optional


class VideoCreate(BaseModel):
    family_id: str
    album_id: Optional[str] = None
    uploaded_by: Optional[str] = None

    title: str
    description: Optional[str] = None
    storage_path: str
    thumbnail_path: Optional[str] = None

    duration_seconds: Optional[int] = None
    taken_at: Optional[str] = None


class VideoResponse(BaseModel):
    id: str
    family_id: str
    album_id: Optional[str] = None
    uploaded_by: Optional[str] = None

    title: str
    description: Optional[str] = None
    storage_path: str
    thumbnail_path: Optional[str] = None

    duration_seconds: Optional[int] = None
    taken_at: Optional[str] = None

    created_at: Optional[str] = None
    updated_at: Optional[str] = None