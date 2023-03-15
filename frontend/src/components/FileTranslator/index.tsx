import styles from './index.module.css'
import {Checkbox} from "@/src/common/Checkbox";
import {TranslatorButton} from "@/src/common/Button";
import {DragFileUpload} from "@/src/common/DragFileUpload";

export const FileTranslator = () => {
    return (
        <div className={styles.file__translator__wrapper}>
            <div className={styles.file__translator__header}>
                <div className={styles.checkbox__container}>
                    <Checkbox checked={false} onChange={() => console.log(2)} />
                    <span>Xatoliklarni to’g’irlash</span>
                </div>
                <TranslatorButton animation={false} />
            </div>
            <div className={styles.file__upload__container}>
                <DragFileUpload />
                <div className={styles.allowed__files}>
                    <h4><span>*</span> Ruxsat etilgan formatlar: </h4>
                    <span>DOCX</span>
                    <span>XLSX</span>
                    <span>PPTX</span>
                    <span>TXT</span>
                </div>
            </div>
        </div>
    )
}