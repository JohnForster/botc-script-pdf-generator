import { Jinx, ResolvedCharacter } from "../types";
import { FabledOrLoric } from "../utils/fabledOrLoric";

interface JinxesSectionProps {
  jinxes: Jinx[];
  allCharacters: ResolvedCharacter[];
  fabledAndLoric: FabledOrLoric[];
  bootleggerRules: string[];
}

export function JinxesAndSpecial({
  jinxes,
  allCharacters,
  fabledAndLoric,
  bootleggerRules,
}: JinxesSectionProps) {
  // Create a map for quick character lookup
  const characterMap = new Map(
    allCharacters.map((char) => [char.id.toLowerCase(), char])
  );

  const hasBothJinxesAndFabledLoric =
    jinxes.length > 0 && fabledAndLoric.length > 0;

  const hasJinxesOnly = jinxes.length > 0 && fabledAndLoric.length === 0;
  const hasSpecialOnly = jinxes.length === 0 && fabledAndLoric.length > 0;
  const all = [...jinxes, ...fabledAndLoric];

  const useTwoColumns =
    hasBothJinxesAndFabledLoric ||
    jinxes.length > 4 ||
    fabledAndLoric.length > 4;

  const midpoint = useTwoColumns ? Math.ceil(all.length / 2) : all.length;

  // If there are both jinxes and fabled/loric in play, we display jinxes on the left, fabled/loric on the right.
  // If not, we split the jinxes or special characters into columns if there are more than four
  // If not, we use a single column
  let leftColumn;
  let rightColumn;
  if (hasBothJinxesAndFabledLoric) {
    leftColumn = jinxes.map((jinx, i) => (
      <JinxItem key={`lc-${i}`} jinx={jinx} charMap={characterMap} />
    ));
    rightColumn = fabledAndLoric.map((fl, i) => (
      <FabledLoricItem
        key={`rc-${i}`}
        item={fl}
        bootleggerRules={bootleggerRules}
      />
    ));
  } else if (hasJinxesOnly && useTwoColumns) {
    leftColumn = jinxes
      .slice(0, midpoint)
      .map((jinx, i) => (
        <JinxItem key={`lc-${i}`} jinx={jinx} charMap={characterMap} />
      ));
    rightColumn = jinxes
      .slice(midpoint)
      .map((jinx, i) => (
        <JinxItem key={`rc-${i}`} jinx={jinx} charMap={characterMap} />
      ));
  } else if (hasSpecialOnly && useTwoColumns) {
    leftColumn = fabledAndLoric
      .slice(0, midpoint)
      .map((item, i) => (
        <FabledLoricItem
          key={`lc-${i}`}
          item={item}
          bootleggerRules={bootleggerRules}
        />
      ));
    rightColumn = fabledAndLoric
      .slice(midpoint)
      .map((item, i) => (
        <FabledLoricItem
          key={`rc-${i}`}
          item={item}
          bootleggerRules={bootleggerRules}
        />
      ));
  } else if (hasJinxesOnly) {
    leftColumn = jinxes.map((jinx, i) => (
      <JinxItem key={`lc-${i}`} jinx={jinx} charMap={characterMap} />
    ));
  } else if (hasSpecialOnly) {
    leftColumn = fabledAndLoric.map((item, i) => (
      <FabledLoricItem
        key={`lc-${i}`}
        item={item}
        bootleggerRules={bootleggerRules}
      />
    ));
  } else {
    return null;
  }

  return (
    <div className="jinxes-section">
      <h2 className="section-title"></h2>

      {rightColumn ? (
        <div className="jinxes-list jinxes-two-columns">
          <div className="jinx-column">{...leftColumn}</div>
          <div className="jinx-column">{...rightColumn}</div>
        </div>
      ) : (
        <div className="jinxes-list">{...leftColumn}</div>
      )}
    </div>
  );
}

type JinxItemProps = {
  charMap: Map<string, ResolvedCharacter>;
  jinx: Jinx;
};

const JinxItem = ({ charMap, jinx }: JinxItemProps) => {
  const char1 = charMap.get(jinx.characters[0]);
  const char2 = charMap.get(jinx.characters[1]);
  return (
    <div className="jinx-item">
      <div className="jinx-icons">
        {char1 && (
          <div className="jinx-icon-wrapper">
            {getImageUrl(char1) ? (
              <img
                src={getImageUrl(char1)!}
                alt={char1.name}
                className="jinx-icon"
              />
            ) : (
              <div className="jinx-icon-placeholder">
                {char1.name.charAt(0)}
              </div>
            )}
          </div>
        )}
        <span className="jinx-divider"></span>
        {char2 && (
          <div className="jinx-icon-wrapper">
            {getImageUrl(char2) ? (
              <img
                src={getImageUrl(char2)!}
                alt={char2.name}
                className="jinx-icon"
              />
            ) : (
              <div className="jinx-icon-placeholder">
                {char2.name.charAt(0)}
              </div>
            )}
          </div>
        )}
      </div>
      <p className="jinx-text">{jinx.jinx}</p>
    </div>
  );
};

function FabledLoricItem({
  item,
  bootleggerRules,
}: {
  item: FabledOrLoric;
  bootleggerRules: string[];
}) {
  const isBootlegger = item.name.toLowerCase() === "bootlegger";
  return (
    <div className="jinx-item loric">
      <div className="loric-spacer"></div>
      {item.image ? (
        <img src={item.image} alt={item.name} className="jinx-icon loric" />
      ) : (
        <div className="jinx-icon-placeholder">{item.name.charAt(0)}</div>
      )}
      <div className="loric-text-container">
        <p className="jinx-text loric-name">{item.name}</p>
        <p className="jinx-text loric-text">{item.note}</p>
        {isBootlegger &&
          bootleggerRules.map((rule, i) => (
            <p key={`bootlegger-rule-${i}`} className="jinx-text loric-text">
              {rule}
            </p>
          ))}
      </div>
    </div>
  );
}

function getImageUrl(
  character: Pick<ResolvedCharacter, "image" | "wiki_image">
) {
  if (character.wiki_image) {
    return character.wiki_image;
  }
  if (!character.image) {
    return null;
  }
  if (typeof character.image === "string") {
    return character.image;
  }
  return character.image[0];
}
