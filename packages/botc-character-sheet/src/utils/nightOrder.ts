import { NightOrderEntry } from "../types";
import { resolveIconUrl } from "./scriptUtils";

export function getImageSrc(
  entry: NightOrderEntry,
  iconUrlTemplate?: string,
): string | undefined {
  if (typeof entry === "string") {
    return entry === "dawn"
      ? "/images/dawn-icon.png"
      : entry === "dusk"
      ? "/images/dusk-icon.png"
      : entry === "minioninfo"
      ? "/images/minioninfo.png"
      : "/images/demoninfo.png";
  } else if (typeof entry.image === "string") {
    return entry.image;
  } else if (Array.isArray(entry.image) && entry.image.length) {
    return entry.image[0];
  } else if (iconUrlTemplate) {
    return resolveIconUrl(iconUrlTemplate, entry.id) ?? undefined;
  }
}
