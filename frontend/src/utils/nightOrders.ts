import { nightOrders } from "botc-script-checker";
import type {
  Script,
  ScriptCharacter,
  ScriptElement,
} from "botc-script-checker";
import {
  NightOrderEntry,
  NightOrders,
  ParsedScript,
} from "botc-character-sheet";

type RawCharMap = Map<string, { firstNight?: number; otherNight?: number }>;

const elementIsCharacter = (el: ScriptElement): el is ScriptCharacter => {
  return (
    typeof el === "object" && el !== null && "id" in el && el.id !== "_meta"
  );
};

const createRawCharMap = (rawScriptData: Script): RawCharMap => {
  const rawCharMap = new Map<
    string,
    { firstNight?: number; otherNight?: number }
  >();

  for (const element of rawScriptData) {
    if (elementIsCharacter(element)) {
      const char = element;

      if (char.firstNight !== undefined || char.otherNight !== undefined) {
        rawCharMap.set(char.id.toLowerCase(), {
          firstNight: char.firstNight,
          otherNight: char.otherNight,
        });
      }
    }
  }

  return rawCharMap;
};

const getPosition = (
  entry: NightOrderEntry,
  nightType: "firstNight" | "otherNight",
  orderList: string[],
  rawCharMap: RawCharMap
): number => {
  const id = typeof entry === "string" ? entry : entry.id;

  // ! Remove travellers from Night Order
  if (typeof entry !== "string" && entry.team === "traveller") return Infinity;

  const officialIndex = orderList.indexOf(id);

  if (officialIndex !== -1) {
    return officialIndex;
  }

  // Check if it's a custom character with a numeric position
  const customData = rawCharMap.get(id);
  const customValue =
    nightType === "firstNight"
      ? customData?.firstNight
      : customData?.otherNight;

  if (customValue !== undefined && customValue > 0) {
    return customValue;
  }

  return Infinity; // Characters without night actions go to the end
};

const buildNightOrder = (
  characters: NightOrderEntry[],
  nightType: "firstNight" | "otherNight",
  rawCharMap: RawCharMap
): NightOrderEntry[] => {
  const orderList =
    nightType === "firstNight"
      ? nightOrders.firstNight
      : nightOrders.otherNight;

  // Filter characters that have actions for this night
  const activeChars = characters.filter((char) => {
    const position = getPosition(char, nightType, orderList, rawCharMap);
    return position !== Infinity;
  });

  const charsAndMarkers: NightOrderEntry[] =
    nightType === "firstNight"
      ? [...activeChars, "dawn", "dusk", "minioninfo", "demoninfo"]
      : [...activeChars, "dawn", "dusk"];

  // Sort characters by position
  charsAndMarkers.sort((a, b) => {
    return (
      getPosition(a, nightType, orderList, rawCharMap) -
      getPosition(b, nightType, orderList, rawCharMap)
    );
  });

  return charsAndMarkers;
};

export const calculateNightOrders = (
  parsedScript: ParsedScript,
  rawScriptData: Script
): NightOrders => {
  const rawCharMap = createRawCharMap(rawScriptData);

  const first = parsedScript.metadata?.firstNight?.length
    ? parseNightOrder(parsedScript.metadata.firstNight, parsedScript.characters)
    : buildNightOrder(parsedScript.characters, "firstNight", rawCharMap);

  const other = parsedScript.metadata?.otherNight?.length
    ? parseNightOrder(parsedScript.metadata.otherNight, parsedScript.characters)
    : buildNightOrder(parsedScript.characters, "otherNight", rawCharMap);

  return { first, other };
};

const parseNightOrder = (
  nightOrder: string[],
  characters: ScriptCharacter[]
): NightOrderEntry[] => {
  let nightOrderEntries: NightOrderEntry[] = [];
  for (const entry of nightOrder) {
    const foundChar = characters.find(
      (c) => c.id.toLowerCase() === entry.toLowerCase()
    );
    const isNightMarker = ["dawn", "dusk", "minioninfo", "demoninfo"].includes(
      entry.toLowerCase()
    );
    if (foundChar) {
      nightOrderEntries.push(foundChar);
    } else if (isNightMarker) {
      nightOrderEntries.push(entry.toLowerCase() as NightOrderEntry);
    }
  }
  return nightOrderEntries;
};
