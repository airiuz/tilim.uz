export enum Links {
  HOME = "/",
  DOCUMENT = "/document/",
  TYPING = "/typing/",
  ABOUT = "/about/",
  SECURITY = "/security/",
  TERMS = "/terms/",
  USERPOLICY = "/userpolicy/",
}

export enum THEME {
  DARK = "dark",
  LIGHT = "light",
}

export interface ITextEditorLink {
  link: string;
  text: string;
}

export const localStorageThemeKey = "theme";

export const localStorageShowKey = "show__markdown";

export type FlexDirection =
  | "column"
  | "inherit"
  | "-moz-initial"
  | "initial"
  | "revert"
  | "unset"
  | "column-reverse"
  | "row"
  | "row-reverse"
  | undefined;

export interface IUser {
  name: string;
  percent: number;
  place: number;
  t: string;
  wpm: number;
}

export type WebSocketMessage =
  | string
  | ArrayBuffer
  | SharedArrayBuffer
  | Blob
  | ArrayBufferView;

export const DURATION = 60;
export const MAX_SYMOBLS_TTS = 100;
export const SPLIT_REGEX = /[\s,\.!?;:\/]+/g;
export const TAG_REGEX = /<[^>]+>/g;
export const WRONG_WORD_TAG = /<span style="color:red">([\s\S]*?)<\/span>/g;
export const BOLD_WORD_TAG = /<strong>([\s\S]*?)<\/strong>/g;
export const WRONG_OPEN_TAG = '<span style="color:red">';
export const WRONG_CLOSE_TAG = "</span>";
export const EXCEPTION_SYMOBLS = "`‘'ʻ«‹»›„“‟”’’❝❞❮❯⹂〝〞〟＂‚‘‛❛❜❟" + '"';
