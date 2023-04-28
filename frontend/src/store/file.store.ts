import { create } from "zustand";

type ITheme = {
  file: null | File;
  setFile: (show: null | File, reject?: boolean) => void;
  reject: boolean;
  name: string | null;
  setName: (name: string | null) => void;
};

export const useFileStore = create<ITheme>((set) => ({
  file: null,
  setFile: (file, reject) => {
    return set({ file, reject });
  },
  reject: false,
  name: null,
  setName: (name) => {
    return set({ name });
  },
}));
