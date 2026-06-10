from pydantic import BaseModel


class VideoTagCreate(BaseModel):
    tag: str


class VideoTagResponse(BaseModel):
    id: str
    video_id: str
    tag: str