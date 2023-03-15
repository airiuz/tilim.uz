import {CheckedIcon} from "@/src/common/Utils/icons";
import styles from "./index.module.css"

export const Checkbox = ({checked, onChange} : {checked: boolean, onChange: () => void}) => {
    return (
        <div className={styles.checkbox__container}>
            {/*<input type={'checkbox'} checked={checked} />*/}
            {
                checked&&<div>{CheckedIcon}</div>
            }
        </div>
    )
}