import { create } from "zustand";
import { IUser } from "../constants";

interface IText {
  id: number;
  text: string;
  type: string;
}

type TypingState = {
  show: boolean;
  passed: boolean;
  pause: string | null;
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
  duration: number;
  users: IUser[];
  first: boolean;
  setFirst: (first: boolean) => void;
  setUsers: (users: IUser[]) => void;
  setDuration: (duration: number) => void;
  setReadonly: (readonly: boolean) => void;
  setPlace: (place: number) => void;
  setTypedText: (text: string) => void;
  setText: (text: IText) => void;
  setLoading: (loading: boolean) => void;
  setLanguage: (language: number) => void;
  setTime: (time: boolean) => void;
  setData: (chars: number, words: number, accuracy: number) => void;
  setPause: (pause: string | null) => void;
  setPassed: (show: boolean) => void;
  setShow: (show: boolean) => void;
};

export const useTypingStore = create<TypingState>((set) => ({
  show: false,
  passed: false,
  pause: null,
  chars: 0,
  words: 0,
  accuracy: 0,
  time: false,
  language: 0,
  loading: false,
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

  duration: 60,
  setDuration: (duration) => set({ duration }),

  users: [],
  setUsers: (users: IUser[]) => set({ users }),

  first: true,
  setFirst: (first: boolean) => set({ first }),
}));
