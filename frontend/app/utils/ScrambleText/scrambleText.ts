function randomChar(charset: string, random: () => number): string {
  return charset[Math.floor(random() * charset.length)];
}

function mapChars(text: string, pick: (char: string, index: number) => string): string {
  return text
    .split("")
    .map((char, index) => (char === " " ? " " : pick(char, index)))
    .join("");
}

export function scrambleText(text: string, charset: string, random: () => number): string {
  return mapChars(text, () => randomChar(charset, random));
}

export function initialTextScramble(text: string, charset: string): string {
  return mapChars(text, (_char, index) => {
    const hash = Math.imul(index + 1, 2654435761) >>> 0;
    return charset[hash % charset.length];
  });
}

export function unrevealStep(
  revealedText: string,
  restingText: string,
  lockedCount: number,
  charset: string,
  random: () => number
): string {
  return mapChars(revealedText, (char, index) => {
    if (index < lockedCount) return char;
    if (index < restingText.length) return restingText[index];
    return randomChar(charset, random);
  });
}

export function settleStep(
  revealedText: string,
  restingText: string,
  lockedCount: number,
  scrambling: boolean,
  charset: string,
  random: () => number
): string {
  return mapChars(revealedText, (char, index) => {
    if (index < lockedCount - 1) return char;
    if (index === lockedCount - 1) return scrambling ? randomChar(charset, random) : char;
    if (index < restingText.length) return restingText[index];
    return randomChar(charset, random);
  });
}

export function revealStep(
  target: string,
  lockedCount: number,
  charset: string,
  random: () => number
): string {
  return mapChars(target, (char, index) => (index < lockedCount ? char : randomChar(charset, random)));
}
