# Frontend

Preact web application for creating and previewing BotC character sheets.

## Development

```bash
# From monorepo root
bun run dev:frontend

# Or directly
bun run dev
```

Runs by default at `http://localhost:5173`

## Build

```bash
bun run build
```

Output goes to `dist/`.

## Key Files

- `src/app.tsx` - Main application component
- `src/components/ScriptControls/` - Control panel components
- `src/hooks/usePdfGeneration.ts` - PDF API integration
