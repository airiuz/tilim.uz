
export enum Links {
    HOME = '/',
    DOCUMENT = '/document',
    TYPING = '/typing',
    ABOUT = '/about',
}

export enum THEME {
    DARK = 'dark',
    LIGHT = 'light',
}

export const localStorageThemeKey = 'theme'

export const localStorageShowKey = "show__markdown"

export type FlexDirection = "column" | "inherit" | "-moz-initial" | "initial" | "revert" | "unset" | "column-reverse" | "row" | "row-reverse" | undefined;