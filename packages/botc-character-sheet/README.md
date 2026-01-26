# botc-character-sheet

Reusable Preact component for rendering Blood on the Clocktower character sheets with a beautiful parchment theme.

## Installation

```bash
npm install botc-character-sheet
# or
bun add botc-character-sheet
```

## Usage

```tsx
import { CharacterSheet, SheetBack } from 'botc-character-sheet';
import 'botc-character-sheet/style.css';

function App() {
  const characters = {
    townsfolk: [...],
    outsider: [...],
    minion: [...],
    demon: [...],
  };

  return (
    <>
      <CharacterSheet
        title="My Custom Script"
        author="John Doe"
        characters={characters}
        color="#137415"
        jinxes={[]}
        showSwirls={true}
        solidTitle={false}
        iconScale={1.6}
        appearance="normal"
      />
      <SheetBack
        title="My Custom Script"
        color="#137415"
        includeMargins={false}
      />
    </>
  );
}
```

## Components

### CharacterSheet

Main character sheet component with parchment background and styled sections.

**Props:**
- `title` (string): Script title
- `author` (string, optional): Script author name
- `characters` (GroupedCharacters): Characters grouped by team
- `color` (string): Theme color (default: "#137415")
- `jinxes` (Jinx[]): Array of jinx relationships
- `showSwirls` (boolean): Show decorative swirls (default: true)
- `solidTitle` (boolean): Use solid title background (default: false)
- `iconScale` (number): Scale character icons (default: 1.6)
- `appearance` ("normal" | "compact" | "super-compact"): Layout density (default: "normal")
- `includeMargins` (boolean): Add margins for printing (default: false)

### SheetBack

Backing sheet component for double-sided printing.

**Props:**
- `title` (string): Script title
- `color` (string): Theme color
- `includeMargins` (boolean): Add margins for printing

## Types

```typescript
interface ResolvedCharacter {
  id: string;
  name: string;
  ability: string;
  team: 'townsfolk' | 'outsider' | 'minion' | 'demon' | 'traveller' | 'fabled';
  image?: string;
}

interface GroupedCharacters {
  townsfolk: ResolvedCharacter[];
  outsider: ResolvedCharacter[];
  minion: ResolvedCharacter[];
  demon: ResolvedCharacter[];
  traveller?: ResolvedCharacter[];
  fabled?: ResolvedCharacter[];
}

interface Jinx {
  id: string;
  jinx: Array<{ id: string; reason: string }>;
}
```

## Development

```bash
# Install dependencies
bun install

# Build
bun run build

# Watch mode
bun run dev
```

## License

MIT
