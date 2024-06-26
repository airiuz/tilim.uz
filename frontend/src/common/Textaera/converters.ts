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
  //   rawContent.entityMap[key].data.href = links[key];
  // });

  return convertFromRaw(rawContent);
}

export function convertTo(currentContent: ContentState) {
  const rawContent = convertToRaw(currentContent);
  const links: any = {};
  let count = 0;
  // Object.keys(rawContent.entityMap)
  //   .filter((key) => rawContent.entityMap[key].type === "LINK")
  //   .map((key) => {
  //     console.log(rawContent.entityMap[key]);
  //     links[key] = rawContent.entityMap[key].data.href;
  //     // rawContent.entityMap[key].data.href = key;
  //     // delete rawContent.entityMap[key].data.title;
  //   });
  // rawContent.blocks.forEach((block) => {
  //   block.text = block.text.replaceAll("\n", "♥");
  // });

  // rawContent.blocks.forEach((block) => {
  //   count += block.text.length;
  // });

  const newCurrentContent = convertFromRaw(rawContent);
  let markdown = stateToMarkdown(newCurrentContent);

  const regex = /\[([^\]]+)\]\(([^)]+)\)/g;

  // markdown.replaceAll(/\[([^\]]+)\]\(([^)]+)\)/g, (link: string) => {
  //   console.log(link);
  //   return link;
  // });

  let matches = [];
  let match;

  while ((match = regex.exec(markdown)) !== null) {
    matches.push(match);
  }

  matches.forEach((match, index) => {
    links[index] = match[2];
    markdown = markdown.replace(match[0], `[${match[1]}](${index})`);
  });

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
