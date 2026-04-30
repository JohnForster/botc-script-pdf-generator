import rolesJson from "./roles.json";
import type { ResolvedCharacter } from "../types";

export type OfficialRole = {
  id: string;
  name: string;
  team: string;
  edition: string;
  firstNightReminder?: string;
  otherNightReminder?: string;
  reminders: string[];
  setup: boolean;
  ability: string;
  flavor?: string;
};

export const ROLES_BY_ID: Record<string, ResolvedCharacter> = Object.fromEntries(
  (rolesJson as OfficialRole[]).map((role) => [
    role.id,
    role as unknown as ResolvedCharacter,
  ]),
);
