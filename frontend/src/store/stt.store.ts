import { create } from "zustand";

type ITheme = {
  text: string[];
  setText: (text: string[]) => void;

  addText: (txt: string) => void;
  capturing: boolean;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  setCapturing: (show: boolean) => void;
};

export const useSttStore = create<ITheme>((set) => ({
  text: [],
  setText: (text) => set({ text }),
  addText: (txt) => set(({ text }) => ({ text: [...text, txt] })),
  capturing: false,
  setCapturing: (capturing) => {
    return set({ capturing });
  },
  loading: false,
  setLoading: (loading) => {
    return set({ loading });
  },
}));
