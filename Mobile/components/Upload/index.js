import { useDropzone } from "react-dropzone";
import axios from "axios";
import FormData from "form-data";
import { HashLoader } from "react-spinners";
import { useCallback, useState, useEffect, useRef } from "react";
import {
  excel,
  powerPoint,
  txtFile,
  upload,
  uploadBin,
  uploadSuccess,
  uploadWord,
  info,
  word,
  warning,
  arrow,
  uploadExcel,
  uploadPptx,
  uploadTxt,
  download,
  uploadError,
  changeIcon,
} from "../utils/icons";
import Select from "./Select";
import Link from "next/link";
import { useTheme } from "../utils/theme";

const CancelToken = axios.CancelToken;

function Upload() {
  const { mode } = useTheme();
  const cancelUpload = useRef();
  const [transcript, setTranscript] = useState(1);
  const [type, setType] = useState(null);
  const [sizeFile, setSizeFile] = useState(0);
  const [error, setError] = useState(null);
  const [data, setData] = useState({ status: null, path: null });
  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
    acceptedFiles,
    fileRejections,
  } = useDropzone({
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

  const postData = useCallback(
    (e) => {
      e.preventDefault();
      setData((prev) => ({ ...prev, status: "pending" }));
      const formData = new FormData();
      formData.append("t", transcript);

      if (acceptedFiles && acceptedFiles[0]) {
        formData.append("in_file", acceptedFiles[0]);
      }
      cancelUpload.current = CancelToken.source();
      axios
        .post("/api/changefile/", formData, {
          cancelToken: cancelUpload.current.token,
        })
        .then((res) => {
          setData({ status: "done", path: res.data.out_file });
        })
        .catch((error) => {
          if (error.response.status === 500) {
            setError(
              `Serverda xatolik yuz berdi, iltimos birozdan so‘ng urinib ko‘ring!`
            );
          } else {
            console.log(error);
            setError("Noma’lum xatolik yuz berdi!");
          }
          setData((prev) => ({ ...prev, status: null }));
        });
    },
    [acceptedFiles]
  );

  const removeFile = useCallback(
    (e) => {
      e.preventDefault();
      setType(null);
      setData((prev) => ({ ...prev, status: null }));
      setError(null);
    },
    [data]
  );
  useEffect(() => {
    if (fileRejections[0]?.errors) {
      console.log(fileRejections[0]?.errors);
      if (fileRejections[0]?.errors[0].code === "file-invalid-type") {
        const newError = fileRejections[0].file.name.split(".");
        return setError(`.${
          newError[newError.length - 1]
        } turdagi hujjat yuklash mumkin
                      emas! Iltimos hujjat turini tekshirib qaytadan yuklang.`);
      } else if (fileRejections[0]?.errors[0].code === "file-too-large") {
        setError("Fayl hajmi 20MB bo‘lishi kerak!");
      } else {
        setError("Bo‘sh hujjat yuklash mumkin emas!");
      }
    }
    if (acceptedFiles.length === 0) {
      return;
    }
    const newType = acceptedFiles[0].name.split(".");
    if (newType[newType.length - 1] === "docx") {
      setType(
        <span className="fill-primary dark:fill-darkPrimary">{uploadWord}</span>
      );
    } else if (newType[newType.length - 1] === "xlsx") {
      setType(
        <span className="fill-primary dark:fill-darkPrimary">
          {uploadExcel}
        </span>
      );
    } else if (newType[newType.length - 1] === "pptx") {
      setType(
        <span className="fill-primary dark:fill-darkPrimary">{uploadPptx}</span>
      );
    } else {
      <span className="fill-primary dark:fill-darkPrimary">{uploadPptx}</span>;
      setType(
        <span className="fill-primary dark:fill-darkPrimary">{uploadTxt}</span>
      );
    }

    const bytes = acceptedFiles[0]?.size;
    if (!+bytes) return "0 Bytes";

    const k = 1024;
    const dm = 2;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    setSizeFile(
      () => `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
    );
    setData((prev) => ({ ...prev, status: "ready" }));
  }, [acceptedFiles, fileRejections]);
  return (
    <div className="flex-1 flex flex-col justify-between pt-[30px] pb-20">
      {!data.status ? (
        <>
          <div>
            <Select stateTranscript={setTranscript} />
            <div className="flex flex-col items-center py-5 justify-center space-y-4">
              {error ? (
                <div className="flex flex-col w-full p-6 items-center border-[#EC594D] border-2 rounded-lg">
                  <div className="shrink w-[58px] h-[58px] dark:stroke-[#B83034] stroke-[#EC594D]">
                    {warning}
                  </div>
                  <div className="max-w-[256px]">
                    <p className="text-[#EC594D] text-center mt-5 mb-4 dark:text-[#B83034] text-lg font-semibold">
                      {error}
                    </p>
                    <p className="text-[#828696] text-center">
                      Yuklash mumkin bo&lsquo;lgan hujjat turlari:&nbsp;
                      <span className="font-semibold">
                        DOCX, XLSX, PPTX, TXT.
                      </span>
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-[66px] h-[66px] fill-primary mt-20 dark:fill-darkPrimary">
                    {upload}
                  </div>
                  <p className="text-center text-sm  max-w-[220px] text-[#565656] dark:text-darkTernary">
                    Shu DOCX, XLSX, PPTX, TXT turdagi xujjatlarni yuklay olasiz
                  </p>
                </>
              )}

              <input {...getInputProps()} />
            </div>
          </div>
          <div className="mt-8">
            <div className="flex items-center space-x-4">
              <div className="shrink stroke-[#273A5D] dark:stroke-darkTernary">
                {info}
              </div>
              <p className="font-semibold text-xs dark:text-darkTernary">
                Eslatma:&nbsp;
                <span className="font-normal">
                  Ko&lsquo;pi bilan 1 ta hujjat yuklay olasiz
                </span>
              </p>
            </div>
            <div
              {...getRootProps({
                className:
                  "dark:bg-[#232831] flex items-center rounded-xl py-4 space-x-3 mt-8 bg-primary dark:bg-darkPrimary justify-center text-white select-none",
              })}
            >
              <p className="text-sm dark:text-darkSecondary font-semibold">
                Xujjatni yuklash
              </p>
              <div className="w-6 h-6 fill-white dark:fill-darkSecondary">
                {upload}
              </div>
            </div>
          </div>
        </>
      ) : null}

      {data.status === "ready" || data.status === "pending" ? (
        <>
          <div>
            <div className="flex space-x-2 items-center">
              <div className="flex-1 flex px-5 justify-between items-center py-[15px] bg-[#F6F6F7] dark:bg-[#232831] dark:text-darkTernary rounded-full">
                <span>{transcript === 1 ? "Lotin" : "Кирилл"}</span>
                <span className="stroke-[#273A5D] dark:stroke-darkTernary">
                  {arrow}
                </span>
                <span>{transcript === 1 ? "Кирилл" : "Lotin"}</span>
              </div>
              <div className="dark:text-darkTernary px-4">
                <span
                  onClick={() => {
                    setTranscript((prev) => (prev === 0 ? 1 : 0));
                  }}
                >
                  {changeIcon}
                </span>
              </div>
            </div>
            <p className="mt-[30px] mb-[10px] text-sm dark:text-darkTernary">
              Jo&lsquo;natilgan xujjat:
            </p>
            <div className="bg-[#F6F6F7] dark:bg-[#232831] rounded-xl py-3 px-3 flex justify-between items-center">
              <div className="flex items-center space-x-6 w-full">
                {type}
                <p className="font-semibold leading-6 max-w-[200px] truncate dark:text-darkTernary">
                  {acceptedFiles[0].name}
                  <br />
                  <span className="text-[13px] font-normal text-[#828696]">
                    hajmi: {sizeFile}
                  </span>
                </p>
              </div>
              <button
                className="fill-[#FFEEED] dark:fill-darkSecondary"
                onClick={removeFile}
              >
                {uploadBin}
              </button>
            </div>
          </div>
          <div className="mt-[30px] grid grid-cols-2 gap-5">
            <button
              className="py-3 text-sm text-[#828696] dark:text-darkSecondary rounded-xl border border-[#828696] dark:border-none dark:bg-[#FFEEED]"
              onClick={removeFile}
            >
              Bekor qilish
            </button>
            <button
              className="py-3 text-sm rounded-xl text-white dark:text-darkTernary bg-primary dark:bg-darkPrimary"
              type="submit"
              onClick={postData}
            >
              Jo&lsquo;natish
            </button>
          </div>
        </>
      ) : null}

      {data.status === "pending" ? (
        // <div className="max-w-fit mx-auto p-[30px] bg-white shadow rounded-[18px]">
        //   <p className="mb-[10px] text-lg">Yuklangan Hujjat:</p>
        //   <div className="bg-[#F6F6F7] mb-[30px] rounded-xl py-3 px-3 flex justify-between items-center">
        //     <div className="flex items-center space-x-6 w-full">
        //       {type}
        //       <p className="text-lg font-semibold leading-6 max-w-[200px] truncate">
        //         {/* {acceptedFiles[0].name} */}
        //         <br />
        //         <span className="text-[13px] font-normal text-[#828696]">
        //           size: {sizeFile}
        //         </span>
        //       </p>
        //     </div>
        //     <div className="flex items-center px-[15px] py-[10px] space-x-4 bg-white text-lg rounded-full">
        //       <span>{transcript === 1 ? "Lotin" : "Kirill"}</span>
        //       {arrow}
        //       <span>{transcript === 1 ? "Kirill" : "Lotin"}</span>
        //     </div>
        //   </div>
        //   <div className="w-[658px] h-[224px] rounded-[18px] flex flex-col items-center justify-center bg-[#F6F6F7] space-y-4">
        //     <HashLoader color="#3474DF" size={40} loading />
        //     <p className="text-lg font-medium text-center">Bajarilmoqda</p>
        //   </div>
        // </div>
        <div className="fixed inset-0 bg-[#273A5D]/50 grid place-content-center">
          <div className="px-[43px] pt-[45px] pb-10 bg-white dark:bg-[#232831] flex flex-col items-center space-y-[25px] rounded-[28px]">
            <HashLoader
              color={mode === "dark" ? "#6A92CA" : "#3474DF"}
              size={40}
              loading
            />
            <p className="text-xl font-medium text-primary dark:text-darkPrimary">
              Bajarilmoqda
            </p>
          </div>
        </div>
      ) : null}

      {data.status === "done" ? (
        <>
          <div>
            <div className="h-[224px] rounded-[18px] flex flex-col items-center justify-center bg-[#F6F6F7] dark:bg-[#232831] space-y-4">
              <div className="stroke-[#34A853] w-[90px] h-[90px] dark:stroke-[#58AD6F]">
                {uploadSuccess}
              </div>
              <p className="text-lg font-medium text-center dark:text-darkTernary">
                Hujjat muvaffaqiyatli o&lsquo;girildi!
              </p>
            </div>
            <div className="bg-[#F6F6F7] dark:bg-[#232831] mt-[20px] rounded-xl p-3">
              <div className="flex justify-between items-center space-x-6">
                {type}
                <div className="flex items-center px-[15px] py-[10px] space-x-4 bg-white dark:bg-darkSecondary dark:text-darkTernary rounded-full">
                  <span>{transcript === 1 ? "Lotin" : "Kirill"}</span>
                  <span className="stroke-[#273A5D] dark:stroke-darkTernary">
                    {arrow}
                  </span>
                  <span>{transcript === 1 ? "Kirill" : "Lotin"}</span>
                </div>
              </div>
              <p className="text-lg mt-5 font-semibold max-w-[240px] leading-6 truncate dark:text-darkTernary">
                {acceptedFiles[0].name}
                <br />
                <span className="text-[13px] font-normal text-[#828696]">
                  {sizeFile}
                </span>
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <button
              className="py-3 flex items-center space-x-2 justify-center text-sm dark:text-darkSecondary rounded-xl border border-[#828696] dark:border-none dark:bg-[#FFEEED]"
              onClick={removeFile}
            >
              <span className="stroke-[#273A5D] rotate-180 dark:stroke-darkSecondary">
                {arrow}
              </span>
              <span className="text-[#273A5D] dark:text-darkSecondary">
                Boshiga
              </span>
            </button>
            <Link
              href={data.path}
              className="py-3 text-sm flex justify-center items-center space-x-3 rounded-xl text-white bg-[#34A853] dark:bg-[#58AD6F]"
            >
              <span>Yuklab olish</span>
              <div className="w-6 h-6 fill-white">{download}</div>
            </Link>
          </div>
        </>
      ) : null}
    </div>
  );
}

export default Upload;
