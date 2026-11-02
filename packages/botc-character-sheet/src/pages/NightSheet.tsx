import { CharacterTeam, NightMarker, NightOrderEntry, ScriptOptions } from "../types";
import { getImageSrc } from "../utils/nightOrder";
import "./NightSheet.css";
import { teamColours } from "../utils/colours";
import { BottomTrimSheet } from "../components/BottomTrimSheet";
import { useTranslation } from "../translations/context";

export type NightSheetProps = {
  title: string;
  firstNightOrder?: NightOrderEntry[];
  otherNightOrder?: NightOrderEntry[];
  options: ScriptOptions;
};

export const NightSheet = ({
  title,
  firstNightOrder,
  otherNightOrder,
  options,
}: NightSheetProps) => {
  const { t } = useTranslation();
  
  // Get translated section titles
  const firstNightText = t('ui', 'first_night') || 'First Night';
  const otherNightsText = t('ui', 'other_nights') || 'Other Nights';
  
  // Get translated non-character reminders
  const getNonCharacterReminder = (entry: NightMarker, night: "first" | "other") => {
    const reminderKey = night === "first" ? "first" : "other";
    const reminderText = t('roles', entry, reminderKey);
    const name = t('roles', entry, 'name');
    return {
      reminderText: reminderText || (night === "first" ? NON_CHARACTER_REMINDERS_DEFAULT[entry].first : (NON_CHARACTER_REMINDERS_DEFAULT[entry].other ?? "")),
      name: name || NON_CHARACTER_REMINDERS_DEFAULT[entry].name,
    };
  };

  const getReminderText = (entry: NightOrderEntry, night: "first" | "other") => {
    if (typeof entry === "object") {
      const reminderKey = night === "first" ? "first" : "other";
      const reminderText = t('roles', entry.id, reminderKey) || (night === "first" ? entry.firstNightReminder : entry.otherNightReminder);
      const name = t('roles', entry.id, 'name') || entry.name;
      return { reminderText, name };
    } else {
      const reminder = getNonCharacterReminder(entry, night);
      return reminder;
    }
  };

  const NightSheetEntry = (props: NightSheetEntryProps) => {
    const src = getImageSrc(props.entry, props.iconUrlTemplate);
    const { reminderText, name } = getReminderText(props.entry, props.night);
    const colour =
      typeof props.entry === "string" ? "#222" : teamColours[props.entry.team];
    if (!reminderText) {
      console.warn("No reminder text found for:", props.entry);
      return <></>;
    }

    const replaceReminders = (str: string) =>
      str.split(":reminder:").map((u, i) => (i % 2 === 0 ? u : <ReminderIcon />));

    const renderText = (text: string) => {
      const withBold = text
        .split("*")
        .map((t, i) => (i % 2 === 0 ? t : <strong>{t}</strong>))
        .map((t) => (typeof t === "string" ? replaceReminders(t) : t));
      return <>{withBold}</>;
    };

    const isMarker = typeof props.entry === "string";

    return (
      <div className="night-sheet-entry">
        <img src={src} className={isMarker ? "marker-icon" : undefined}></img>
        <div className="night-sheet-entry-text">
          <p className="reminder-name" style={{ color: colour }}>
            {name}
          </p>
          <p className="reminder-text">{renderText(reminderText)}</p>
        </div>
      </div>
    );
  };
  
  return (
    <>
      {firstNightOrder && (
        <BottomTrimSheet options={options}>
          <div className="night-sheet-heading">
            <h3 className="night-title">{firstNightText}</h3>
            <h3 className="script-title">{title}</h3>
          </div>
          <div className="night-sheet-order">
            {firstNightOrder.map((reminder) => (
              <NightSheetEntry
                entry={reminder}
                night="first"
                iconUrlTemplate={options.iconUrlTemplate}
                getReminderText={getReminderText}
              />
            ))}
          </div>
        </BottomTrimSheet>
      )}
      {otherNightOrder && (
        <BottomTrimSheet options={options}>
          <div className="night-sheet-heading">
            <h3 className="night-title">{otherNightsText}</h3>
            <h3 className="script-title">{title}</h3>
          </div>
          <div className="night-sheet-order">
            {otherNightOrder.map((reminder) => (
              <NightSheetEntry
                entry={reminder}
                night="other"
                iconUrlTemplate={options.iconUrlTemplate}
                getReminderText={getReminderText}
              />
            ))}
          </div>
        </BottomTrimSheet>
      )}
    </>
  );
};

const ReminderIcon = () => (
  <img className="reminder-icon" src="/images/reminder.png"></img>
);

const NON_CHARACTER_REMINDERS_DEFAULT: Record<
  NightMarker,
  { first: string; name: string; other?: string }
> = {
  dusk: {
    first: "Start the Night Phase.",
    name: "Dusk",
    other: "Start the Night Phase.",
  },
  dawn: {
    first: "Wait for a few seconds. End the Night Phase.",
    name: "Dawn",
    other: "Wait for a few seconds. End the Night Phase.",
  },
  demoninfo: {
    first:
      "If there are 7 or more players, wake the Demon: Show the *THESE ARE YOUR MINIONS* token. Point to all Minions. Show the *THESE CHARACTERS ARE NOT IN PLAY* token. Show 3 not-in-play good character tokens.",
    name: "Demon Info",
  },
  minioninfo: {
    first:
      "If there are 7 or more players, wake all Minions: Show the *THIS IS THE DEMON* token. Point to the Demon. Show the *THESE ARE YOUR MINIONS* token. Point to the other Minions.",
    name: "Minion Info",
  },
};

type NightSheetEntryProps = {
  entry: NightOrderEntry;
  night: "first" | "other";
  iconUrlTemplate?: string;
  getReminderText: (entry: NightOrderEntry, night: "first" | "other") => { reminderText: string | undefined; name: string };
};

export const NightSheetEntry = (props: NightSheetEntryProps) => {
  const src = getImageSrc(props.entry, props.iconUrlTemplate);
  const { reminderText, name } = props.getReminderText(props.entry, props.night);
  const colour =
    typeof props.entry === "string" ? "#222" : teamColours[props.entry.team as CharacterTeam];
  if (!reminderText) {
    console.warn("No reminder text found for:", props.entry);
    return <></>;
  }

  const replaceReminders = (str: string) =>
    str.split(":reminder:").map((u, i) => (i % 2 === 0 ? u : <ReminderIcon />));

  const renderText = (text: string) => {
    const withBold = text
      .split("*")
      .map((t, i) => (i % 2 === 0 ? t : <strong>{t}</strong>))
      .map((t) => (typeof t === "string" ? replaceReminders(t) : t));
    return <>{withBold}</>;
  };

  const isMarker = typeof props.entry === "string";

  return (
    <div className="night-sheet-entry">
      <img src={src} className={isMarker ? "marker-icon" : undefined}></img>
      <div className="night-sheet-entry-text">
        <p className="reminder-name" style={{ color: colour }}>
          {name}
        </p>
        <p className="reminder-text">{renderText(reminderText)}</p>
      </div>
    </div>
  );
};
