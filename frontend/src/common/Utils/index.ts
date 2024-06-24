import { convertToHTML } from "draft-convert";
import { ContentState } from "draft-js";

export const delay = new Promise<boolean>((resolve, reject) => {
  setTimeout(() => resolve(true), 1000);
});

export const converToHtmlWithStyles = (contentState: ContentState) => {
  const html = convertToHTML({
    styleToHTML: (style) => {
      if (String(style) === "color-red")
        return {
          start: '<span style="color:red">',
          end: "</span>",
        };
    },
    entityToHTML: (entity, originalText) => {
      if (entity.type === "LINK") {
        return {
          start: `<a style="color:#007bff;text-decoration:underline" href="${entity.data.url}">`,
          end: "</a>",
          empty: originalText,
        };
      }
      return originalText;
    },
  })(contentState);

  return html;

  return html.substring(3, html.length - 4);
};
