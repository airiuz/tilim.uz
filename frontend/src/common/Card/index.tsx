
import styles from './index.module.css'
import {ReactNode} from "react";

interface ICard {
    children: ReactNode,
    className: string | undefined,
}

export const Card = ({children, className = ""}: ICard) => {
    return (
        <div className={`${styles.container} ${className}`}>
            {children}
        </div>
    )
}