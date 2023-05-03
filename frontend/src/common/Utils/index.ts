export function extractWord(word: string): string {
  return word
    .replace(".", "")
    .replace(",", "")
    .replace("?", "")
    .replace("!", "");
}
