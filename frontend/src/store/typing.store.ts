import axios from "axios";
import { create } from "zustand";

interface IText {
  text_id: number;
  text: string;
}

type TypingState = {
  show: boolean;
  passed: boolean;
  pause: boolean;
  chars: number;
  words: number;
  accuracy: number;
  time: boolean;
  language: number;
  loading: boolean;
  text: IText | null;
  typedText: string;
  place: number;
  readonly: boolean;
  setReadonly: (readonly: boolean) => void;
  setPlace: (place: number) => void;
  setTypedText: (text: string) => void;
  setText: (text: IText) => void;
  setLoading: (loading: boolean) => void;
  setLanguage: (language: number) => void;
  setTime: (time: boolean) => void;
  setData: (chars: number, words: number, accuracy: number) => void;
  setPause: (pause: boolean) => void;
  setPassed: (show: boolean) => void;
  setShow: (show: boolean) => void;
};

export const useTypingStore = create<TypingState>((set) => ({
  show: false,
  passed: false,
  pause: false,
  chars: 0,
  words: 0,
  accuracy: 0,
  time: false,
  language: 0,
  loading: true,
  setLoading: (loading) => set({ loading }),
  setLanguage: (language) => set({ language }),
  setTime: (time) => set({ time }),
  setData: (chars, words, accuracy) => set({ chars, words, accuracy }),
  setPause: (pause) => {
    return set({ pause });
  },
  setPassed: async (passed) => {
    return set({ passed });
  },
  setShow: (show) => {
    return set({ show });
  },
  text: null,
  setText: (text) => set({ text }),
  typedText: "",
  setTypedText: (typedText) => {
    return set({ typedText });
  },
  place: 0,
  setPlace: (place) => {
    return set({ place });
  },
  readonly: false,
  setReadonly: (readonly) => {
    return set({ readonly });
  },
}));
