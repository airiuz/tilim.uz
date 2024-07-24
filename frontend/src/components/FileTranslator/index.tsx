"use client";
import styles from "./index.module.css";
import { Checkbox } from "@/src/common/Checkbox";
import {
  ArrowForTranslator,
  Button,
  KirilForTranslator,
  LotinForTranslator,
  TranslatorButton,
} from "@/src/common/Button";
import { useEffect, useState } from "react";
import { useFileStore } from "@/src/store/file.store";
import { FileItem } from "@/src/components/FileTranslator/fileItem";
import { DragFileUpload } from "@/src/common/DragFileUpload";
import { CheckedIcon, DownLoadIcon } from "@/src/common/Utils/icons";
import { useFile } from "@/src/hooks/file.hook";

const status = {
  default: <div>O'girish</div>,
  loading: <div>O'girilmoqda...</div>,
  success: <div className={styles.success}>{DownLoadIcon} Yuklab olish</div>,
};

export const FileTranslator = () => {
  const { file, reject, name } = useFileStore();

  const [statusButton, setStatusButton] = useState(status.default);

  const [checkbox, setCheckbox] = useState(true);

  const [transcript, setTranscript] = useState(true);

  const { loading, postData } = useFile();

  const handleSubmit = async () => {
    if (name && typeof window !== "undefined") {
      window.open(`${window.location.origin}${name}`, "_blank");
    }
    setStatusButton(status.loading);
    await postData(String(Number(transcript)));
  };

  useEffect(() => {
    if (!name) {
      setStatusButton(status.default);
    } else {
      setStatusButton(status.success);
    }
  }, [file, name]);

  return (
    <section className={styles.section}>
      <div className={styles.file__translator__wrapper}>
        <div className={styles.file__translator__header}>
          <div
            className={styles.checkbox__container}
            onClick={() => setCheckbox((prev) => !prev)}
          >
            <Checkbox checked={checkbox} />
            <span>Xatoliklarni to‘g‘rilash</span>
          </div>
          <TranslatorButton
            animation={false}
            firstChild={
              <>
                <LotinForTranslator />
                <ArrowForTranslator />
                <KirilForTranslator />
              </>
            }
            secondChild={
              <>
                <KirilForTranslator />
                <ArrowForTranslator />
                <LotinForTranslator />
              </>
            }
            onClick={setTranscript}
          />
        </div>
        {file ? (
          <div className={styles.result__container}>
            <div className={styles.wrapper__2}>
              <FileItem />
              {reject && (
                <div className={styles.allowed__files__2}>
                  <h4>
                    <span>*</span>{" "}
                    <div>
                      Bu tipdagi hujjat yuklash mumkin emas! Iltimos hujjat
                      tipini tekshirib qaytatdan urinib ko‘ring. <br />
                      Ruxsat etilgan formatlar:
                      <span>DOCX</span>
                      <span>XLSX</span>
                      <span>PPTX</span>
                      <span>TXT</span>
                    </div>
                  </h4>
                </div>
              )}
            </div>

            <div className={styles.wrapper__3}>
              {name && (
                <span className={styles.successText}>
                  {CheckedIcon} O‘girildi! va xatoliklar to‘g‘rilandi!
                </span>
              )}
              <Button
                className={`${false && styles.loading}`}
                disabled={reject || loading}
                onClick={handleSubmit}
              >
                {statusButton}
              </Button>
            </div>
          </div>
        ) : (
          <div className={styles.file__upload__container}>
            <DragFileUpload />
            <div className={styles.allowed__files}>
              <h4>
                <span>*</span> Ruxsat etilgan formatlar:{" "}
              </h4>
              <span>DOCX</span>
              <span>XLSX</span>
              <span>PPTX</span>
              <span>TXT</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
