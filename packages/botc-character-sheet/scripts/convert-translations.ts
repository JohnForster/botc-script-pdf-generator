import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, '..');

// Read the German translations JSON
const translationsPath = join(__dirname, '../src/data/botc_german_translations.json');
const translations = JSON.parse(readFileSync(translationsPath, 'utf-8'));

// Create the TypeScript module content
const tsContent = `// Auto-generated German translations from botc_german_translations.json
// Do not edit manually - run 'bun run scripts/convert-translations.ts' to regenerate

import type { TranslationFile } from '../translations/types';

export const germanTranslations: TranslationFile = ${JSON.stringify(translations, null, 2)};

export default germanTranslations;
`;

// Write the TypeScript file
const outputPath = join(__dirname, '../src/translations/german.ts');
writeFileSync(outputPath, tsContent, 'utf-8');

console.log('German translations converted successfully!');
console.log('Output:', outputPath);
