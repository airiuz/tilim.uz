import { stateFromMarkdown } from "draft-js-import-markdown";
import { stateToMarkdown } from "draft-js-export-markdown";
import { ContentState, convertFromRaw, convertToRaw } from "draft-js";

export function convertFrom(markdown: any, links: any) {
  const currentContent = stateFromMarkdown(markdown);

  const rawContent = convertToRaw(currentContent);

  rawContent.blocks.forEach((block) => {
    block.text = block.text.replaceAll("♥", "\n");
  });

  // Object.keys(links).forEach((key) => {
  //   rawContent.entityMap[key].data.url = links[key];
  // });

  return convertFromRaw(rawContent);
}

export function convertTo(currentContent: ContentState) {
  const rawContent = convertToRaw(currentContent);
  const links: any = {};
  let count = 0;
  Object.keys(rawContent.entityMap)
    .filter((key) => rawContent.entityMap[key].type === "LINK")
    .map((key) => {
      links[key] = rawContent.entityMap[key].data.url;
      rawContent.entityMap[key].data.url = key;
      delete rawContent.entityMap[key].data.title;
    });
  rawContent.blocks.forEach((block) => {
    block.text = block.text.replaceAll("\n", "♥");
  });

  rawContent.blocks.forEach((block) => {
    count += block.text.length;
  });

  const newCurrentContent = convertFromRaw(rawContent);
  let markdown = stateToMarkdown(newCurrentContent);

  return [markdown, links, count];
}

export function getEditorText(currentContent: ContentState) {
  const rawContent = convertToRaw(currentContent);
  const value = rawContent.blocks
    .map((block) => block.text)
    .join("`\n`")
    .replaceAll("`", "");
  return value;
}
