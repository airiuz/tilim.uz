import styles from './index.module.css'
import {FileUploadIcon} from "@/src/common/Utils/icons";
import {Button} from "@/src/common/Button";

export const DragFileUpload = () => {
    return (
        <div className={styles.file__upload__container}>
            <h3 className={styles.file__upload__title}>
                Faynli yuklang
            </h3>
            <div className={styles.file__upload__icon}>{FileUploadIcon}</div>
            <div className={styles.file__upload__description}>Faylni shu yerga tashlang<br />yoki</div>
            <Button className={''}>
                Kompyuterdan tanlang
            </Button>
        </div>
    )
}