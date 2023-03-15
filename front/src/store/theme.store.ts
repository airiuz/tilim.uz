import create from 'zustand';
import { EditorState } from 'draft-js';
import {localStorageThemeKey, THEME} from "@/src/constants";

type ITheme = {
    theme: THEME.LIGHT | THEME.DARK;
    setTheme: (theme: THEME.LIGHT | THEME.DARK) => void;
};

export const useThemeStore = create<ITheme>((set) => ({
    theme: THEME.LIGHT,
    setTheme: (theme) => {
        localStorage.setItem(localStorageThemeKey, theme)
        return set({theme})
    },
}));