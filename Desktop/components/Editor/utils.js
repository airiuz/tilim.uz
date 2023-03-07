import { convertToRaw } from "draft-js";

export function getEditorText(currentContent) {
  const rawContent = convertToRaw(currentContent);
  const value = rawContent.blocks
    .map((block) => block.text)
    .join("`\n`")
    .replaceAll("`", "");
  return value;
}
