import { create } from "zustand";

type ITheme = {
  show: boolean;
  setShow: (show: boolean) => void;
};

export const useHelpStore = create<ITheme>((set) => ({
  show: false,
  setShow: (show) => {
    return set({ show });
  },
}));
