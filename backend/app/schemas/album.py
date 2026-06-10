from pydantic import BaseModel
from typing import Optional


class AlbumCreate(BaseModel):
    family_id: str
    title: str
    description: Optional[str] = None
    cover_path: Optional[str] = None


class AlbumUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    cover_path: Optional[str] = None


class AlbumResponse(BaseModel):
    id: str
    family_id: str
    created_by: Optional[str] = None
    title: str
    description: Optional[str] = None
    cover_path: Optional[str] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None