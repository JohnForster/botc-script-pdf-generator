# Blood on the Clocktower Script PDF Backend

Serverless API for generating professional PDFs of Blood on the Clocktower character sheets.

## Tech Stack

- **Runtime**: Vercel Serverless Functions
- **Rendering**: Preact SSR + Puppeteer
- **Component**: `botc-character-sheet` npm package
- **Validation**: `botc-script-checker`

## API Endpoint

### POST /api/generate-pdf

Generate a PDF from a BotC script JSON.

**Request Body:**
```json
{
  "script": [...],  // BotC script JSON array
  "options": {
    "color": "#137415",
    "showAuthor": true,
    "showJinxes": true,
    "showSwirls": true,
    "solidTitle": false,
    "iconScale": 1.6,
    "compactAppearance": false,
    "showBackingSheet": true
  },
  "filename": "script.pdf"
}
```

**Response:** PDF binary

## Local Development

```bash
# Install dependencies
npm install

# Start local dev server
npm run dev

# Test endpoint
curl -X POST http://localhost:3000/api/generate-pdf \
  -H "Content-Type: application/json" \
  -d '{"script":[...],"options":{}}'
```

## Deployment

```bash
# Deploy to Vercel
vercel --prod
```

## Environment Variables

- `PDF_API_KEY` (optional): API key for additional security

## Security

- Maximum payload size: 500KB
- Maximum characters: 100
- CORS restricted to configured origins
- Optional API key authentication
