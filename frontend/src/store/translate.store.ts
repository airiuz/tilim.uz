import { create } from "zustand";
import { EditorState } from "draft-js";

export interface ITooltipPosition {
  top: number;
  left: number;
  opacity: number;
  transform: string;
  zIndex: string;
}

const intialTooltipPosition: ITooltipPosition = {
  top: 30,
  left: 30,
  opacity: 0,
  zIndex: "-1",
  transform: "translateY(10px)",
};

type TextEditorState = {
  editorState: EditorState;
  setEditorState: (newEditorState: EditorState) => void;
  tooltipPosition: ITooltipPosition;
  setTooltipPosition: (newTooltipPosition: ITooltipPosition) => void;
  selectedWord: string;
  setSelectedWord: (selectedWord: string) => void;
  incorrectWords: string[];
  setIncorrectWords: (incorrectWords: string[]) => void;
  language: string;
  setLanguage: (language: string) => void;

  connected: boolean;
  setConnected: (connected: boolean) => void;
};

export const useTextEditorStore = create<TextEditorState>((set) => ({
  editorState: EditorState.createEmpty(),
  setEditorState: (newEditorState) => set({ editorState: newEditorState }),
  tooltipPosition: intialTooltipPosition,
  setTooltipPosition: (newTooltipPosition) =>
    set({ tooltipPosition: newTooltipPosition }),
  selectedWord: "",
  setSelectedWord: (selectedWord) => set({ selectedWord }),
  incorrectWords: [],
  setIncorrectWords: (incorrectWords) => set({ incorrectWords }),
  language: "0",
  setLanguage: (language) => set({ language }),
  connected: false,
  setConnected: (connected: boolean) => set({ connected }),
}));
