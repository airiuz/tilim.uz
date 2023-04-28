import styles from "./index.module.css";
import { FileIcon } from "@/src/common/Utils/icons";
import { Exit } from "@/src/common/Exit";
import { useFileStore } from "@/src/store/file.store";
import { useEffect, useState } from "react";

export const FileItem = () => {
  const { file, setFile, reject, setName } = useFileStore();
  const [size, setSize] = useState("0 Bytes");
  useEffect(() => {
    const bytes = file?.size;
    if (bytes) {
      const k = 1024;
      const dm = 2;
      const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      setSize(
        () => `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
      );
    }
  }, []);
  const handleDelete = () => {
    setFile(null);
    setName(null);
  };
  return (
    <div
      className={`${styles.file__container} ${reject && styles.rejected__file}`}
    >
      <div className={styles.fileItem__wrapper}>
        <div className={styles.icon__container}>{FileIcon}</div>
        <div className={styles.data__container}>
          <h3>{file?.name}</h3>
          <span>{size}</span>
        </div>
      </div>
      <Exit handleClick={handleDelete} />
    </div>
  );
};
