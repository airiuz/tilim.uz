"use client";
import {ReactNode} from "react";
import {useThemeStore} from "@/src/store/theme.store";


export const Providers = ({children}: {
    children: ReactNode;
}) => {
    const {theme} = useThemeStore()
    return (
        <div data-theme={theme}>
            {children}
        </div>
    )
}
