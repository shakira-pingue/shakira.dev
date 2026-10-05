function randomChar(charset: string, random: () => number): string {
  return charset[Math.floor(random() * charset.length)];
}

export function scrambleText(text: string, charset: string, random: () => number): string {
  return text
    .split("")
    .map((char) => (char === " " ? " " : randomChar(charset, random)))
    .join("");
}

export function initialTextScramble(text: string, charset: string): string {
  return text
    .split("")
    .map((char, index) => {
      if (char === " ") return " ";
      const hash = Math.imul(index + 1, 2654435761) >>> 0;
      return charset[hash % charset.length];
    })
    .join("");
}

export function revealStep(
  target: string,
  lockedCount: number,
  charset: string,
  random: () => number
): string {
  return target
    .split("")
    .map((char, index) => (char === " " || index < lockedCount ? char : randomChar(charset, random)))
    .join("");
}
