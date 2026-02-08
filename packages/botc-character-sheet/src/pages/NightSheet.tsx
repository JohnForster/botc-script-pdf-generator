import { NightMarker, NightOrderEntry, ScriptOptions } from "../types";
import { getImageSrc } from "../utils/nightOrder";
import "./NightSheet.css";
import { teamColours } from "../utils/colours";
import { BottomTrimSheet } from "../components/BottomTrimSheet";

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
  return (
    <>
      {firstNightOrder && (
        <BottomTrimSheet options={options}>
          <div className="night-sheet-heading">
            <h3 className="night-title">First Night</h3>
            <h3 className="script-title">{title}</h3>
          </div>
          <div className="night-sheet-order">
            {firstNightOrder.map((reminder) => (
              <NightSheetEntry entry={reminder} night="first" iconUrlTemplate={options.iconUrlTemplate} />
            ))}
          </div>
        </BottomTrimSheet>
      )}
      {otherNightOrder && (
        <BottomTrimSheet options={options}>
          <div className="night-sheet-heading">
            <h3 className="night-title">Other Nights</h3>
            <h3 className="script-title">{title}</h3>
          </div>
          <div className="night-sheet-order">
            {otherNightOrder.map((reminder) => (
              <NightSheetEntry entry={reminder} night="other" iconUrlTemplate={options.iconUrlTemplate} />
            ))}
          </div>
        </BottomTrimSheet>
      )}
    </>
  );
};

type NightSheetEntryProps = {
  entry: NightOrderEntry;
  night: "first" | "other";
  iconUrlTemplate?: string;
};

const ReminderIcon = () => (
  <img className="reminder-icon" src="/images/reminder.png"></img>
);

export const NightSheetEntry = (props: NightSheetEntryProps) => {
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

  return (
    <div className="night-sheet-entry">
      <img src={src}></img>
      <div className="night-sheet-entry-text">
        <p className="reminder-name" style={{ color: colour }}>
          {name}
        </p>
        <p className="reminder-text">{renderText(reminderText)}</p>
      </div>
    </div>
  );
};

const getReminderText = (entry: NightOrderEntry, night: "first" | "other") => {
  if (typeof entry === "object") {
    const reminderText =
      night === "first" ? entry.firstNightReminder : entry.otherNightReminder;
    const name = entry.name;
    return { reminderText, name };
  } else {
    const reminder = NON_CHARACTER_REMINDERS[entry];
    const reminderText =
      night === "first" ? reminder.first : (reminder.other ?? "");
    const name = reminder.name;
    return { reminderText, name };
  }
};

const NON_CHARACTER_REMINDERS: Record<
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
