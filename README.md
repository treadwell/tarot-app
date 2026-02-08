# tarot-app

A simple static web app that performs a tarot draw, now with two layouts and an AI-generated reading.

## What It Does

- Loads tarot card data from `res/tarot.json` and images from `res/img/`.
- Asks the user for a question, then draws cards for the selected layout.
- Sends the question and card meanings to a FastAPI backend which calls OpenAI to generate a narrative reading.

## Run It (Docker)

1. Create a local `.env` file with your OpenAI key:

```bash
cp .env.example .env
```

Edit `.env` and set `OPENAI_API_KEY`.

2. Start the app:

```bash
docker compose up --build
```

3. Open:

```
http://localhost:8080/
```

## Local Dev (No Docker)

Backend (FastAPI):

```bash
cd backend
python3 -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
export OPENAI_API_KEY=your-key-here
uvicorn app:app --reload --port 8000
```

Frontend:

```bash
python3 -m http.server 8080
```

## Files

- `index.html` - page entry point.
- `src/3card.js` - app logic (draw cards, render images, generate story).
- `src/3card.css` - layout and reversed-card rotation.
- `res/tarot.json` - card metadata and upright/reversed captions.
- `res/img/` - card images referenced by the JSON.
- `backend/app.py` - FastAPI API calling OpenAI for readings.
- `backend/requirements.txt` - backend dependencies.
- `nginx/default.conf` - nginx proxy to the API service.

## Notes

Never put your OpenAI API key in client-side code. Keep it in `.env` and let the backend call OpenAI.
