import { JSX } from "preact/jsx-runtime";

const minorWords = new Set([
  "the",
  "of",
  "in",
  "a",
  "an",
  "and",
  "or",
  "but",
  "for",
  "to",
  "at",
  "by",
  "on",
  "with",
  "from",
  "into",
  "upon",
  "after",
  "before",
]);

const isWordMinor = (word: string, index: number) => {
  return (
    minorWords.has(word) || (index === 0 && minorWords.has(word.toLowerCase()))
  );
};

export const formatWithMinorWords = (text: string): JSX.Element[] => {
  return text
    .split(/\s+/)
    .reduce((acc: JSX.Element[], word, wordIndex, words) => {
      const isMinor = isWordMinor(word, wordIndex);
      const prevIsMinor =
        wordIndex > 0 && isWordMinor(words[wordIndex - 1], wordIndex - 1);

      // Check if this is the start of a new sequence (either type)
      const isStartOfSequence = wordIndex === 0 || isMinor !== prevIsMinor;

      if (isStartOfSequence) {
        // Collect all consecutive words of the same type
        const sequence = [];
        for (
          let i = wordIndex;
          i < words.length && isWordMinor(words[i], i) === isMinor;
          i++
        ) {
          sequence.push(words[i]);
        }

        const needsSpace = acc.length > 0;
        acc.push(
          <span key={wordIndex} className={isMinor ? "minor-word" : undefined}>
            {needsSpace && " "}
            {sequence.join(" ")}
          </span>,
        );
      }
      // Skip if we're in the middle of a sequence (already rendered)

      return acc;
    }, []);
};
