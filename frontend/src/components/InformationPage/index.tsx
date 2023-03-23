import styles from './index.module.css';
import {ReactNode} from "react";

export const InformationTextWrapper = ({children}: {children: ReactNode}) => {
    return (
        <div className={styles.content__wrapper}>
            {children}
        </div>
    )
}