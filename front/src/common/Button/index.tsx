"use client";
import styles from "./index.module.css";
import {ArrowIcon} from "@/src/common/Utils/icons";
import {ReactNode, useState} from "react";


export const TranslatorButton = ({animation}: {animation: boolean}) => {
    const [activeButton, setActiveButton] = useState<{first: boolean, second: boolean}>({
        first: !animation,
        second: false
    })
    return (
        <div className={styles.translator__button__container}>
            <div className={`${!(activeButton.first || activeButton.second)?styles.animation:activeButton.first?styles.active:""}`}>
                <span>Lotin</span>
                <span>{ArrowIcon}</span>
                <span>Kiril</span>
            </div>
            <div className={`${!(activeButton.first || activeButton.second)?styles.animation:activeButton.second?styles.active:""}`}>
                <span>Kiril</span>
                <span>{ArrowIcon}</span>
                <span>Lotin</span>
            </div>
        </div>
    )
}

export const Button = ({children, className}: {children: ReactNode, className: string}) => {
    return (
        <button className={`${styles.button}${className}`}>
            {children}
        </button>
    )
}