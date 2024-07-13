import DOMPurify from "dompurify";
import { convertToHTML } from "draft-convert";
import { ContentState } from "draft-js";
export const delay = (time: number) =>
  new Promise((resolve, reject) => {
    setTimeout(resolve, time);
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

  return DOMPurify.sanitize(html);
};

export function wrapEachNodeSpan(htmlString: string) {
  let counter = 0;
  function wrap(node: Node) {
    let index = 0;
    let result = "";
    for (const char of node.nodeValue!) {
      result += `<span class="index__shower" id="span_${counter}">${char}</span>`;
      index++;
      counter++;
    }
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

  textNodes.forEach((node) => {
    const spanWrappedText = wrap(node);
    const spanWrapper = document.createElement("span");
    spanWrapper.innerHTML = spanWrappedText;
    node.parentNode?.replaceChild(spanWrapper, node);
  });

  return doc.body.innerHTML;
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
