# dear-diary

Bilingual (English + Korean) emotional diary generator using OpenAI GPT-4o-mini via Next.js.

## Tech Stack

- **Next.js 16** (App Router) + React 19 + TypeScript
- **Tailwind CSS v4** — styling
- **OpenAI API** (gpt-4o-mini) — diary generation with SSE streaming
- **html2canvas-pro** — diary card image export
- **Vercel** — deployment

## Project Structure

```text
web/
├── src/
│   ├── app/
│   │   ├── api/generate/route.ts   # OpenAI diary generation API (SSE)
│   │   ├── page.tsx                # Main input form
│   │   ├── layout.tsx              # Root layout
│   │   └── globals.css             # Global styles (warm palette)
│   └── components/
│       └── diary-result.tsx        # Result card + SNS sharing
├── .env.example
└── package.json
```

## Common Commands

```bash
# Install dependencies
cd web && npm install

# Run locally
npm run dev

# Build
npm run build

# Lint
npm run lint
```

## Environment Variables

In `web/.env.local` (see `web/.env.example`):

- `OPENAI_API_KEY` — required

## Style & Conventions

- UI text is in Korean; code/logs are in English
- OpenAI errors handled per type in API route
- SSE streaming for real-time diary generation
