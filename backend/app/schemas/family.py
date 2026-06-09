from pydantic import BaseModel
from typing import Optional

class FamilyCreate(BaseModel):
    name: str
    description: Optional[str] = None
    cover_url: Optional[str] = None

class FamilyResponse(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    cover_url: Optional[str] = None
    created_by: Optional[str] = None
    created_at: Optional[str] = None