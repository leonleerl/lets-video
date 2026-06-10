from typing import Optional
from pydantic import BaseModel

class AnalyzeVideoRequest(BaseModel):
    language: Optional[str] = "en"

class AnalyzeVideoResult(BaseModel):
    summary: str
    people: str
    place: str
    event_type: str
    tags: list[str]