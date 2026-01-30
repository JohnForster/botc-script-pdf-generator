import { collection, doc, setDoc, getDoc } from "firebase/firestore";
import db from "./firestore";
import type { Script } from "botc-script-checker";
import type { ScriptOptions } from "botc-character-sheet";

const SCRIPTS_COLLECTION = "scripts";

export interface StoredScript {
  script: string; // JSON stringified rawScript
  options: string; // JSON stringified options
}

/**
 * Generate a short random ID for the script URL
 */
function generateId(): string {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "";
  for (let i = 0; i < 8; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

/**
 * Save a script and options to Firestore
 * Returns the document ID that can be used in the share URL
 */
export async function saveScript(
  rawScript: Script,
  options: ScriptOptions,
): Promise<string> {
  const id = generateId();
  const docRef = doc(collection(db, SCRIPTS_COLLECTION), id);

  const data: StoredScript = {
    script: JSON.stringify(rawScript),
    options: JSON.stringify(options),
  };

  await setDoc(docRef, data);
  return id;
}

/**
 * Load a script and options from Firestore by ID
 * Returns null if the document doesn't exist
 */
export async function loadScript(
  id: string,
): Promise<{ rawScript: Script; options: ScriptOptions } | null> {
  const docRef = doc(db, SCRIPTS_COLLECTION, id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  const data = docSnap.data() as StoredScript;
  return {
    rawScript: JSON.parse(data.script),
    options: JSON.parse(data.options),
  };
}

/**
 * Generate a share URL for a given script ID
 */
export function getShareUrl(id: string): string {
  const baseUrl = window.location.origin;
  return `${baseUrl}/view/${id}`;
}
