# botc-character-sheet

Preact components for rendering Blood on the Clocktower character sheets.

## Usage

```tsx
import { FancyDoc, TeensyDoc } from "botc-character-sheet";
import "botc-character-sheet/style.css";

<FancyDoc script={script} options={options} nightOrders={nightOrders} />;
```

## Components

- **FancyDoc** - Full character sheet with front and back pages
- **TeensyDoc** - Compact single-page layout
- **CharacterSheet** - Front page only
- **SheetBack** - Back page only
- **NightSheet** - Night order reference sheet

## Development

```bash
# Build
bun run build

# Watch mode
bun run dev
```

## Exports

```typescript
export { CharacterSheet, SheetBack, NightSheet, FancyDoc, TeensyDoc };
export type { ScriptOptions, ParsedScript, GroupedCharacters, ... };
```
