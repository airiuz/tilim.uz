import { create } from "zustand";
import { EditorState } from "draft-js";

type TextEditorState = {
  editorState: EditorState;
  setEditorState: (newEditorState: EditorState) => void;
};

export const useTextEditorStore = create<TextEditorState>((set) => ({
  editorState: EditorState.createEmpty(),
  setEditorState: (newEditorState) => set({ editorState: newEditorState }),
}));
