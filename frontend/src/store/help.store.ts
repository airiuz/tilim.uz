import create from 'zustand';
import { EditorState } from 'draft-js';
import {localStorageThemeKey, THEME} from "@/src/constants";

type ITheme = {
    show: boolean;
    setShow: (show :boolean) => void;
};

export const useHelpStore = create<ITheme>((set) => ({
    show: false,
    setShow: (show) => {
        return set({show})
    },
}));