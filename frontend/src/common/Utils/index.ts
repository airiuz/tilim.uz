"use client";
import DOMPurify from "dompurify";
import { convertToHTML } from "draft-convert";
import { ContentState } from "draft-js";
export const delay = new Promise<boolean>((resolve, reject) => {
  setTimeout(() => resolve(true), 1000);
});

export const converToHtmlWithStyles = (
  contentState: ContentState,
  animation: boolean = false
) => {
  if (typeof window === "undefined") {
    // Prevent the function from running on the server
    return "";
  }
  const html = convertToHTML({
    styleToHTML: (style) => {
      if (animation)
        return {
          start: "",
          end: "",
        };
      if (String(style) === "color-red")
        return {
          start: '<span style="color:red">',
          end: "</span>",
        };
    },
    entityToHTML: (entity, originalText) => {
      if (animation)
        return {
          start: "",
          end: "",
        };
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

  return DOMPurify.sanitize(html);
};

export function wrapEachNodeSpan(htmlString: string) {
  let counter = 0;
  let prevSegment = "";
  let prevPrevSegment = "";
  let prevParentTagName = "";
  let prevIndex = 0;
  let spaceIndex = 0;
  let charIndex = 0;
  const emptySpace = "&nbsp;";
  let digit = false;

  function wrap(node: Node, parentTagName: string, index: number) {
    const wordsAndSpaces = node.nodeValue!.split(/(\s+)/);
    let result = document.createDocumentFragment();

    wordsAndSpaces.forEach((segment, i) => {
      if (segment === "") return;
      const span = document.createElement("span");
      span.id = `span_${counter}`;
      if (segment.trim() === "") {
        if (prevSegment.trim() === "") {
          spaceIndex--;
        }
        span.className = `index__shower space_${spaceIndex}`;
        span.innerHTML = emptySpace.repeat(segment.length);
        spaceIndex++;
        result.appendChild(span);
      } else {
        if (prevSegment.trim() !== "" && index === prevIndex) {
          charIndex--;
        }
        if (
          prevSegment.trim() === "" &&
          prevPrevSegment.match(/^["'`<\+\-\{\[\(]?\d+$/g) &&
          segment.match(/^\d+[\.,]?\d+[\$\%\.\?!;\:>\)\]\}]?["'`]?$/g)
        ) {
          const prevSpace = result.querySelector(`.space_${spaceIndex - 1}`);
          const prevChar = result.querySelector(`.char_${spaceIndex - 1}`);
          prevSpace?.remove();
          if (prevChar)
            prevChar.innerHTML = prevChar?.textContent + emptySpace + segment;

          spaceIndex--;
          digit = true;
        } else {
          span.className = `index__shower char_${charIndex}`;
          span.textContent = segment;

          charIndex++;
          digit = false;
          result.appendChild(span);
        }
      }
      prevPrevSegment = prevSegment;
      prevSegment = segment;
      counter++;
    });

    if (charIndex > spaceIndex) {
      const span = document.createElement("span");
      span.className = `index__shower space_${spaceIndex}`;
      span.innerHTML = emptySpace;
      result.append(span);
      prevPrevSegment = prevSegment;
      prevSegment = " ";
      spaceIndex++;
    }

    prevParentTagName = parentTagName;
    prevIndex = index;

    return result;
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");

  const walker = document.createTreeWalker(
    doc.body,
    NodeFilter.SHOW_TEXT,
    null
  );

  const textNodes = [];
  let currentNode = walker.nextNode();

  while (currentNode) {
    textNodes.push(currentNode);
    currentNode = walker.nextNode();
  }

  textNodes.forEach((node, index) => {
    const spanWrappedText = wrap(
      node,
      node.parentElement?.localName || "",
      index
    );
    node.parentNode?.replaceChild(spanWrappedText, node);
  });

  let outputHtml = doc.body.innerHTML;

  // Replace <br> tags with </p><p>
  outputHtml = outputHtml.replace(/<br\s*\/?>/g, "</p><p class='margin_top' >");

  // Ensure that there are no empty <p> tags
  outputHtml = outputHtml.replaceAll("<p></p>", `<p>${emptySpace}</p>`);

  // Add styles to <p> tags
  outputHtml = outputHtml.replaceAll(
    /<p(.*?)>/g,
    "<p$1 style='display:flex;flex-wrap:wrap;'>"
  );

  return outputHtml;
}
export function hasAudioHeader(chunk: Uint8Array) {
  console.log(
    isWavHeader(chunk),
    chunk.length >= 4 &&
      chunk[0] === 0x52 && // 'R'
      chunk[1] === 0x49 && // 'I'
      chunk[2] === 0x46 && // 'F'
      chunk[3] === 0x46
  );
  // Check for WAV header
  if (
    chunk.length >= 4 &&
    chunk[0] === 0x52 && // 'R'
    chunk[1] === 0x49 && // 'I'
    chunk[2] === 0x46 && // 'F'
    chunk[3] === 0x46
  ) {
    // 'F'
    return "WAV";
  }

  // Check for MP3 header
  if (chunk.length >= 2 && chunk[0] === 0xff && (chunk[1] & 0xe0) === 0xe0) {
    // 111xxxxx in binary
    return "MP3";
  }

  // Check for AAC ADTS header
  if (chunk.length >= 2 && chunk[0] === 0xff && (chunk[1] & 0xf6) === 0xf0) {
    // 1111xxx0 in binary
    return "AAC";
  }

  return null;
}

function isWavHeader(array: Uint8Array): boolean {
  const riffMarker = "RIFF";

  for (let i = 0; i <= array.length - 4; i++) {
    if (
      String.fromCharCode(
        array[i],
        array[i + 1],
        array[i + 2],
        array[i + 3]
      ) === riffMarker
    ) {
      return true;
    }
  }

  return false;
}

export function decodeFromUint8ArrayToJson(data: Uint8Array) {
  const decoder = new TextDecoder();
  const jsonString = decoder.decode(data, { stream: true });
  return JSON.parse(jsonString);
}

export function concatenateUint8Arrays(arrays: Uint8Array[]): Uint8Array {
  let totalLength = 0;
  for (const arr of arrays) {
    totalLength += arr.length;
  }

  const concatenatedArray = new Uint8Array(totalLength);

  let offset = 0;
  for (const arr of arrays) {
    concatenatedArray.set(arr, offset);
    offset += arr.length;
  }

  return concatenatedArray;
}

export function sliceEachWavData(
  array: Uint8Array,
  index: number,
  iterated: boolean
) {
  const riffMarker = "RIFF";
  let idx = index;
  let wavData: null | Uint8Array = null;
  let indexes: null | number[] = null;

  for (let i = index; i <= array.length - 4; i++) {
    if (
      String.fromCharCode(
        array[i],
        array[i + 1],
        array[i + 2],
        array[i + 3]
      ) === riffMarker &&
      iterated
    ) {
      const data = new Uint8Array(array.buffer.slice(index, i));
      if (
        data.length >= 4 &&
        data[0] === 0x52 && // 'R'
        data[1] === 0x49 && // 'I'
        data[2] === 0x46 && // 'F'
        data[3] === 0x46
      ) {
        wavData = data;
      } else indexes = decodeFromUint8ArrayToJson(data);
      idx = i;
    }
    iterated = true;
  }
  return { wavData, idx, indexes };
}
