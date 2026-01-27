import { ParsedScript } from "botc-character-sheet";

const FIREBASE_URL = "https://logusage-dvbaqkhwga-uc.a.run.app";

export const logUsage = async (
  script: ParsedScript,
  other: { [key: string]: any } = {},
) => {
  if (import.meta.env.DEV) {
    return;
  }

  fetch(FIREBASE_URL, {
    method: "POST",
    body: JSON.stringify({
      app: "script-pdf-maker",
      meta: script.metadata,
      characters: script.characters,
      ...other,
    }),
    headers: {
      "x-password": "dungeon-mister",
      "Content-Type": "application/json",
    },
  }).catch(console.error);
};
