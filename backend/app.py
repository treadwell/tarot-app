from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List
import os

try:
    from openai import OpenAI
except Exception as exc:  # pragma: no cover - import error surfaced at runtime
    raise RuntimeError("OpenAI SDK not installed. Install requirements.txt.") from exc


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"]
,
    allow_headers=["*"],
)


class CardPayload(BaseModel):
    id: str
    name: str
    orientation: str
    meaning: str
    position: str


class ReadingRequest(BaseModel):
    question: str = Field(..., min_length=3)
    layout: str
    cards: List[CardPayload]


@app.get("/api/health")
async def health():
    return {"status": "ok"}


@app.post("/api/reading")
async def reading(payload: ReadingRequest):
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="OPENAI_API_KEY is not set")

    model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

    layout_line = f"Layout: {payload.layout}"
    cards_block = "\n".join(
        [
            f"- {card.position}: {card.name} ({card.orientation}) — {card.meaning}"
            for card in payload.cards
        ]
    )

    prompt = (
        "You are a tarot reader. Provide a coherent, elegant reading that addresses the user's question. "
        "Use the layout to structure the narrative. Weave each card meaning into the story without listing them mechanically. "
        "Keep the tone refined and supportive, 2-3 short paragraphs. End with one grounded takeaway.\n\n"
        f"Question: {payload.question}\n"
        f"{layout_line}\n"
        f"Cards:\n{cards_block}"
    )

    client = OpenAI(api_key=api_key)

    # Prefer Responses API when available; fall back to Chat Completions for older SDKs.
    if hasattr(client, "responses"):
        response = client.responses.create(
            model=model,
            input=prompt,
        )
        return {"story": response.output_text}

    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": "You are a tarot reader. Provide refined, supportive readings."},
            {"role": "user", "content": prompt},
        ],
    )
    return {"story": response.choices[0].message.content}
