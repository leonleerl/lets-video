import os
import json
from fastapi import HTTPException
from app.services.claude_client import claude_client
from app.services.supabase_client import supabase


def _build_memory_prompt(video: dict, language: str) -> str:
    return f"""
You are the Family Memory Agent for LetsVideo.

LetsVideo is a private family memory platform for families living across different countries.
Your job is to turn video metadata into warm, searchable family memory metadata.

Video metadata:
- Title: {video.get("title")}
- Description: {video.get("description")}
- Taken at: {video.get("taken_at")}
- Duration seconds: {video.get("duration_seconds")}

Return ONLY valid JSON. Do not include markdown. Do not include explanation.

JSON structure:
{{
  "summary": "A warm family memory summary.",
  "people": "Comma-separated people names if mentioned. Empty string if unknown.",
  "place": "Place if known. Empty string if unknown.",
  "event_type": "Travel | Birthday | Family Gathering | School | Holiday | Daily Life | Other",
  "tags": ["tag1", "tag2", "tag3"]
}}

Language: {language}
"""


def _extract_text_from_claude_response(response) -> str:
    for block in response.content:
        if getattr(block, "type", None) == "text":
            return block.text

    raise ValueError("Claude response does not contain text content")

def _clean_json_text(text: str) -> str:
    text = text.strip()

    if text.startswith("```json"):
        text = text.removeprefix("```json").strip()

    if text.startswith("```"):
        text = text.removeprefix("```").strip()

    if text.endswith("```"):
        text = text.removesuffix("```").strip()

    return text

def analyse_video_memory(video_id: str, language: str = "en") -> dict:
    video_result = (
        supabase
        .table("videos")
        .select("*")
        .eq("id", video_id)
        .single()
        .execute()
    )

    video = video_result.data

    if not video:
        raise HTTPException(status_code=404, detail="Video not found")

    prompt = _build_memory_prompt(video, language)
    model = os.getenv("CLAUDE_MODEL", "claude-sonnet-4-5")

    response = claude_client.messages.create(
        model=model,
        max_tokens=1000,
        system=(
            "You generate structured JSON metadata for private family videos. "
            "Always return valid JSON only."
        ),
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    content = _extract_text_from_claude_response(response)

    try:
        # ai_data = json.loads(content)
        clean_content = _clean_json_text(content)
        ai_data = json.loads(clean_content)
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=500,
            detail=f"Claude returned invalid JSON: {content}"
        )

    memory_data = {
        "video_id": video["id"],
        "family_id": video["family_id"],
        "summary": ai_data.get("summary", ""),
        "people": ai_data.get("people", ""),
        "place": ai_data.get("place", ""),
        "event_type": ai_data.get("event_type", "Other"),
        "language": language,
    }

    memory_result = (
        supabase
        .table("memory_summaries")
        .insert(memory_data)
        .execute()
    )

    tags = ai_data.get("tags", [])
    created_tags = []

    for tag in tags:
        clean_tag = str(tag).strip()

        if not clean_tag:
            continue

        try:
            tag_result = (
                supabase
                .table("video_tags")
                .insert({
                    "video_id": video["id"],
                    "tag": clean_tag
                })
                .execute()
            )

            if tag_result.data:
                created_tags.append(tag_result.data[0])

        except Exception:
            # Ignore duplicate tags because your DB has unique(video_id, tag)
            pass

    return {
        "video_id": video["id"],
        "memory_summary": memory_result.data[0] if memory_result.data else None,
        "tags": created_tags,
        "raw_ai_output": ai_data,
    }