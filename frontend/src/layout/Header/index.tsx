"use client";
import {
    AboutIcon,
    DarkModeBtn,
    DocumentIcon,
    LightModeBtn,
    LogoIcon,
    RocketIcon,
    TranslatorIcon
} from "@/src/common/Utils/icons";
import styles from "./index.module.css"
import Link from "next/link";
import {usePathname} from "next/navigation";
import {Links, localStorageThemeKey, THEME} from "@/src/constants";
import {useThemeStore} from "@/src/store/theme.store";
import {useEffect} from "react";


export default function Header() {

    const pathname = usePathname()

    const { theme, setTheme } = useThemeStore()

    const switchTheme = () => setTheme(theme === THEME.DARK?THEME.LIGHT:THEME.DARK)

    const activeLink = (page: string) => pathname === page ? styles.active : '';

    useEffect(() => {
        const currentTheme = localStorage.getItem(localStorageThemeKey)
        if(currentTheme)
            setTheme(currentTheme as THEME.LIGHT | THEME.DARK)
        else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
            setTheme(THEME.DARK)
    }, [])

    return (
        <header className={styles.header}>
            <div className={styles.header__container}>
                <div>
                    <div className={styles.header__logo}>
                        {LogoIcon}
                        <span>
                            TILIM.UZ
                        </span>
                    </div>
                </div>
                <div className={styles.header__links__container}>
                    <div className={styles.header__links__wrapper}>

                        <Link href={Links.HOME} className={activeLink(Links.HOME)}>
                            <div>
                                <div className={styles.icon__wrapper}>
                                    {TranslatorIcon}
                                </div>
                                <span>
                                    Lotin-kiril
                                </span>
                            </div>
                            <div></div>
                        </Link>
                        <Link href={Links.DOCUMENT} className={activeLink(Links.DOCUMENT)}>
                            <div>
                                <div className={styles.icon__wrapper}>
                                    {DocumentIcon}
                                </div>
                                <span>
                                    Xujjatlar bilan ishlash
                                </span>
                            </div>
                            <div></div>
                        </Link>

                        <Link href={Links.TYPING} className={activeLink(Links.TYPING)}>
                            <div>
                                <div className={styles.icon__wrapper}>
                                    {RocketIcon}
                                </div>
                                <span>
                                    Tez yozishni sinash
                                </span>
                            </div>
                            <div></div>
                        </Link>

                        <Link href={Links.ABOUT} className={activeLink(Links.ABOUT)}>
                            <div>
                                <div className={styles.icon__wrapper}>
                                    {AboutIcon}
                                </div>
                                <span>
                                    Loyiha haqida
                                </span>
                            </div>
                            <div></div>
                        </Link>
                    </div>
                </div>
                <div onClick={switchTheme}>
                    {theme===THEME.LIGHT?DarkModeBtn:LightModeBtn}
                </div>
            </div>
        </header>
    )
}