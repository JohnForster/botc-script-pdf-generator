import nightsheetJson from "./nightsheet.json";

type Nightsheet = {
  firstNight: string[];
  otherNight: string[];
};

const nightsheet = nightsheetJson as Nightsheet;

export const FIRST_NIGHT_ORDER: string[] = nightsheet.firstNight;
export const OTHER_NIGHT_ORDER: string[] = nightsheet.otherNight;
