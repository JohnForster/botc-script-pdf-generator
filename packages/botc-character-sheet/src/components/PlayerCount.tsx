import "./PlayerCount.css";
import { useTranslation } from "../translations/context";

const PLAYER_COUNTS = {
  "5": [3, 0, 1, 1],
  "6": [3, 1, 1, 1],
  "7": [5, 0, 1, 1],
  "8": [5, 1, 1, 1],
  "9": [5, 2, 1, 1],
  "10": [7, 0, 2, 1],
  "11": [7, 1, 2, 1],
  "12": [7, 2, 2, 1],
  "13": [9, 0, 3, 1],
  "14": [9, 1, 3, 1],
  "15+": [9, 2, 3, 1],
};

export type PlayerCountProps = {
  background?: boolean;
};

export const PlayerCount = ({ background = true }: PlayerCountProps) => {
  const { t } = useTranslation();
  return (
    <>
      <div
        className={`player-count-container ${
          background ? "with-background" : ""
        }`}
      >
        <div className="count-column titles">
          <div className="row-title">{t('ui', 'players') || 'Players'}</div>
          <div className="row-title good-count">{t('ui', 'townsfolk') || 'Townsfolk'}</div>
          <div className="row-title good-count">{t('ui', 'outsiders') || 'Outsiders'}</div>
          <div className="row-title evil-count">{t('ui', 'minions') || 'Minions'}</div>
          <div className="row-title evil-count">{t('ui', 'demons') || 'Demons'}</div>
        </div>
        {Object.entries(PLAYER_COUNTS).map(([playerCount, teamCounts]) => (
          <div className="count-column">
            <div className="player-count">{playerCount}</div>
            <div className="good-count">{teamCounts[0]}</div>
            <div className="good-count">{teamCounts[1]}</div>
            <div className="evil-count">{teamCounts[2]}</div>
            <div className="evil-count">{teamCounts[3]}</div>
          </div>
        ))}
      </div>
    </>
  );
};
