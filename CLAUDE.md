# DearDiary

Bilingual (English + Korean) emotional diary generator using OpenAI GPT via Streamlit.

## Tech Stack

- **Python 3.11+**, managed with `uv`
- **Streamlit** — web UI framework
- **OpenAI API** (gpt-4o-mini default) — diary generation
- **Docker** — containerized deployment

## Project Structure

- `app.py` — Streamlit app: UI, diary generation logic, error handling
- `config.py` — Configuration (env vars, logging setup)
- `main.py` — Entry point (placeholder)
- `pyproject.toml` / `uv.lock` — Dependencies
- `Dockerfile` / `docker-compose.yml` — Container setup (port 8501)

## Common Commands

```bash
# Install dependencies
uv sync

# Run locally
uv run streamlit run app.py

# Run with Docker
docker compose up --build

# Add a dependency
uv add <package>
```

## Environment Variables

Defined in `.env` (see `.env.example`):
- `OPENAI_API_KEY` — required
- `OPENAI_MODEL` — optional (default: gpt-4o-mini)
- `LOG_LEVEL` — optional (default: INFO)

## Style & Conventions

- UI text is in Korean; code/logs are in English
- Use `config.logger` for logging
- OpenAI errors handled per type: `AuthenticationError`, `RateLimitError`, `APIError`
