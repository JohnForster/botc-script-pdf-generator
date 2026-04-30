import jinxesJson from "./jinxes.json";
import type { Jinx } from "../types";

type OfficialJinxEntry = {
  id: string;
  jinx: Array<{ id: string; reason: string }>;
};

export const JINXES: Jinx[] = (jinxesJson as OfficialJinxEntry[]).flatMap(
  ({ id: char1, jinx }) =>
    jinx.map(({ id: char2, reason }) => ({
      characters: [char1, char2] as [string, string],
      jinx: reason,
    })),
);
