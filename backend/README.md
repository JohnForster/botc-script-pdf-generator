# Backend

Helper code and local development server for the PDF generation API.

## Structure

```
backend/
├── src/
│   └── renderer.ts    # Server-side HTML rendering
└── dev-server.ts      # Local Bun dev server
```

The actual serverless function lives in `/api/generate-pdf.ts` at the monorepo root.

## Development

```bash
# From monorepo root
bun run dev:backend

# Or directly
bun run serve
```

Runs at `http://localhost:3001`

## API

### POST /api/generate-pdf

Generates a PDF from a BotC script.

**Request:**

```json
{
  "script": [...],
  "options": { "color": "#137415", ... },
  "filename": "script.pdf"
}
```

**Response:** PDF binary

## Security

- Max payload: 500KB
- Max characters: 100
- CORS restricted to allowed origins
