import { stateFromMarkdown } from "draft-js-import-markdown";
import { stateToMarkdown } from "draft-js-export-markdown";
import { ContentState, convertFromRaw, convertToRaw } from "draft-js";
import { marked } from "marked";
import TurndownService from "turndown";
import { converToHtmlWithStyles } from "../Utils";

export function convertFrom(markdown: any, links: any) {
  const currentContent = stateFromMarkdown(markdown);

  const rawContent = convertToRaw(currentContent);

  rawContent.blocks.forEach((block) => {
    block.text = block.text.replaceAll("♥", "\n");
  });

  Object.keys(links).forEach((key) => {
    rawContent.entityMap[key].data.href = links[key];
  });

  return convertFromRaw(rawContent);
}

export async function fromMarkdownToHtml(
  markdown: string,
  links: { [key: number]: string }
) {
  return await marked(markdown, {
    hooks: {
      postprocess: (html: string) => {
        return html.replace(/href="(\d+)"/g, (match, p1) => {
          return `style="color:#007bff;text-decoration:underline" href="${links[p1]}"`;
        });
      },
      preprocess: (markdown) => markdown,
      processAllTokens: (tokens) => tokens,
      options: {},
    },
  });
}

export function convertTo(currentContent: ContentState) {
  const links: { [key: number]: string } = {};
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

  const htmlString = converToHtmlWithStyles(currentContent);

  // let markdown = stateToMarkdown(currentContent);

  const turndownService = new TurndownService();
  let markdown: any = turndownService.turndown(htmlString);

  const regex = /\[([^[\]]*(?:\[[^[\]]*\][^[\]]*)*)\]\(([^)]+)\)/g;
  // const regex = /\[([^\]]+)\]\(([^)]+)\)/g;

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
    links[index] = match[2].replaceAll("++", "");
    markdown = markdown.replace(
      match[0],
      `[${match[1].replaceAll("++", "")}](${index})`
    );
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
