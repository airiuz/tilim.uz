import styles from "./index.module.css";
import { FileUploadIcon } from "@/src/common/Utils/icons";
import { Button } from "@/src/common/Button";
import { useDropzone } from "react-dropzone";
import { useEffect, useMemo, useState } from "react";
import { useFileStore } from "@/src/store/file.store";

export const DragFileUpload = () => {
  const { setFile } = useFileStore();
  const [mobile, setMobile] = useState(false);
  const { getRootProps, acceptedFiles, fileRejections } = useDropzone({
    minSize: 1,
    maxSize: 20971520,
    accept: {
      "application/vnd.openxmlformats-officedocument.presentationml.presentation":
        [".pptx"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "text/plain": [".txt"],
    },
  });

  useEffect(() => {
    if (acceptedFiles.length) setFile(acceptedFiles[0]);
    if (fileRejections.length) setFile(fileRejections[0].file, true);
  }, [acceptedFiles, fileRejections]);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const allowedExtensions = ["txt", "pptx", "docx", "xlsx"];
    const fileList = event.target.files;
    if (fileList && fileList.length > 0) {
      const selectedFile = fileList[0];
      const fileExtension = selectedFile.name.split(".").pop()?.toLowerCase();
      if (fileExtension && allowedExtensions.includes(fileExtension)) {
        setFile(fileList[0]);
      }
    }
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      setMobile(window.innerWidth < 1140);
    }
  }, []);

  return (
    <div {...getRootProps({ className: "dropzone" })}>
      <div className={styles.file__upload__container}>
        <h3 className={styles.file__upload__title}>Faylni yuklang</h3>
        <div className={styles.file__upload__icon}>{FileUploadIcon}</div>
        <div className={styles.file__upload__description}>
          Faylni shu yerga tashlang
          <br />
          yoki
        </div>
        <div className={styles.input__container}>
          <Button className={styles.button}>
            {mobile ? "Yuklang" : "Kompyuterdan tanlang"}
          </Button>
          <input onChange={handleFileChange} type={"file"} />
        </div>
      </div>
    </div>
  );
};
