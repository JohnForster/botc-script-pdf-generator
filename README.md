# Blood on the Clocktower Script PDF Maker

A web application for creating printable character sheets for Blood on the
Clocktower custom scripts, styled to look like the official sheet aesthetic.

**Live site**: [fancy.ravenswoodstudio.xyz](https://fancy.ravenswoodstudio.xyz)

<p align="center">
  <img src="docs/blending-in.png" alt="Example character sheet for Blending In script" width="400">
</p>

## Features

- Upload or paste custom script JSON files
- Live preview
- Customizable colors (sidebar, title, gradients)
- Multiple layout options (standard, compact, teensy)
- Double-sided printing support with backing sheets
- Night order display
- Jinx information
- Server-side PDF generation via Puppeteer
- Sort scripts using official BotC sorting rules

## Monorepo Structure

```
├── frontend/           # Preact web application
├── backend/            # Helper code and dev server
│   └── src/
│       └── renderer.ts # Server-side HTML rendering
├── api/                # Vercel serverless functions (Bun runtime)
│   └── generate-pdf.ts # PDF generation endpoint
└── packages/
    └── botc-character-sheet/  # Reusable component library
```

## Tech Stack

- **Runtime**: [Bun](https://bun.sh) - Fast JavaScript runtime and package
  manager
- **Frontend**: [Preact](https://preactjs.com) + TypeScript +
  [Vite](https://vitejs.dev)
- **Backend**: Vercel Functions with Bun runtime
- **PDF Generation**: [Puppeteer](https://pptr.dev) +
  [@sparticuz/chromium](https://github.com/Sparticuz/chromium)
- **Validation**:
  [botc-script-checker](https://www.npmjs.com/package/botc-script-checker)
- **Deployment**: [Vercel](https://vercel.com)

## Development

### Prerequisites

- [Bun](https://bun.sh) (v1.x)

### Setup

```bash
# Install dependencies
bun install

# Start development server (frontend + backend + package watch)
bun run dev

# Run type checking
bun run typecheck

# Build for production
bun run build
```

The dev server runs:

- Frontend at `http://localhost:5173`
- Backend API at `http://localhost:3001`

## Deployment

The project deploys to Vercel automatically:

- **Production**: Push to `main` branch
- **Preview**: Push to any other branch or open a PR

Vercel configuration is in `vercel.json`. The serverless function uses Bun
runtime (`bunVersion: "1.x"`).

## Script Format

Scripts are JSON arrays following the
[official BotC schema](https://wiki.bloodontheclocktower.com/Script_Metadata):

```json
[
  {
    "id": "_meta",
    "name": "My Custom Script",
    "author": "Your Name"
  },
  "washerwoman",
  "imp",
  {
    "id": "custom_character",
    "name": "Custom Character",
    "team": "townsfolk",
    "ability": "Your ability text here..."
  }
]
```

Characters can be:

- Official character IDs (lowercase strings like `"washerwoman"`)
- Full character objects with `id`, `name`, `team`, and `ability`

## Fonts

- **Title**: "Unlovable" by Letterhead Fonts
- **Character names**: Goudy Old Style
- **Abilities**: Trade Gothic

## Note on Use of LLMs

This project was developed with assistance from Claude (Anthropic). While the
project was architected by and largely written by hand, LLMs were used with
close supervision for:

- **Code generation**: Filling out components, serverless functions, and build
  configurations
- **Documentation**: Writing inline code comments
- **Refactoring**

All LLM-generated code was reviewed and modified by the developer before being
committed.

## License

This project is for personal use only. Blood on the Clocktower is a trademark of
Steven Medway and The Pandemonium Institute.

## Attribution

- © Steven Medway [bloodontheclocktower.com](https://bloodontheclocktower.com)
- Script template by John Forster
  [ravenswoodstudio.xyz](https://ravenswoodstudio.xyz)
