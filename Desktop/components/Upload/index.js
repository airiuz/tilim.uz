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
  changeArrow,
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
            setError("Noma’lum xatolik yuz berdi!");
          }
          setData((prev) => ({ ...prev, status: null }));
        });
    },
    [acceptedFiles, transcript]
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
    <>
      {!data.status ? (
        <div className="max-w-fit mx-auto p-[30px] bg-white dark:bg-darkSecondary shadow rounded-[18px]">
          <div className="space-y-[30px]">
            <Select stateTranscript={setTranscript} />
            <div className="flex space-x-7">
              <div className="space-y-7">
                <div className="flex space-x-2 items-center fill-primary dark:fill-darkPrimary">
                  {word}
                  <p className="leading-4 font-semibold dark:text-darkTernary">
                    DOCX
                    <br />
                    <span className="text-xs text-[#828696] font-normal">
                      hajm 20MB
                    </span>
                  </p>
                </div>
                <div className="flex space-x-2 items-center fill-primary dark:fill-darkPrimary">
                  {excel}
                  <p className="leading-4 font-semibold dark:text-darkTernary">
                    XLSX
                    <br />
                    <span className="text-xs text-[#828696] font-normal">
                      hajm 20MB
                    </span>
                  </p>
                </div>
                <div className="flex space-x-2 items-center fill-primary dark:fill-darkPrimary">
                  {powerPoint}
                  <p className="leading-4 font-semibold dark:text-darkTernary">
                    PPTX
                    <br />
                    <span className="text-xs text-[#828696] font-normal">
                      hajm 20MB
                    </span>
                  </p>
                </div>
                <div className="flex space-x-2 items-center fill-primary dark:fill-darkPrimary">
                  {txtFile}
                  <p className="leading-4 font-semibold dark:text-darkTernary">
                    TXT
                    <br />
                    <span className="text-xs text-[#828696] font-normal">
                      hajm 20MB
                    </span>
                  </p>
                </div>
              </div>
              <div
                {...getRootProps({
                  className: `w-[494px] ${
                    isDragReject
                      ? "border-[#EC594D] dark:border-[#B83034] bg-[#FFECEB]"
                      : "border-primary dark:border-darkPrimary bg-white border-dashed"
                  } 
                   ${
                     isDragAccept ? "bg-[#F1F9FF]" : "bg-white"
                   } outline-none dark:bg-[#232831] flex flex-col items-center py-5 justify-center space-y-4 rounded-lg cursor-pointer shadow-sm select-none  border-2 rounded-lg`,
                })}
              >
                {isDragReject ? (
                  <>
                    <span className="stroke-[#EC594D] dark:stroke-[#B83034]">
                      {uploadError}
                    </span>

                    <p className="dark:text-darkTernary">
                      Noto&lsquo;g&lsquo;ri turdagi fayl
                    </p>
                  </>
                ) : (
                  <>
                    <div className="w-[66px] h-[66px] fill-primary dark:fill-darkPrimary">
                      {upload}
                    </div>
                    {!isDragAccept ? (
                      <p className="text-center text-[#565656] dark:text-darkTernary">
                        Faylni yuklash uchun shu yerga olib
                        <br />
                        keling yoki&nbsp;
                        <span className="text-primary dark:text-darkPrimary">
                          shu yerni bosing
                        </span>
                      </p>
                    ) : null}
                  </>
                )}
                <input {...getInputProps()} />
              </div>
            </div>
            <div className="mt-10">
              {error ? (
                <div className="flex space-x-3.5 p-4 bg-[#F6F6F7] dark:bg-[#232831] rounded-[18px] max-w-[658px]">
                  <div className="shrink dark:stroke-[#B83034] stroke-[#EC594D]">
                    {warning}
                  </div>
                  <div>
                    <p className="text-[#EC594D] dark:text-[#B83034] text-lg font-semibold">
                      {error}
                    </p>
                    <p className="text-[#828696]">
                      Yuklash mumkin bo&lsquo;lgan hujjat turlari:&nbsp;
                      <span className="font-semibold">
                        DOCX, XLSX, PPTX, TXT.
                      </span>
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <div className="shrink stroke-[#273A5D] dark:stroke-darkTernary">
                    {info}
                  </div>
                  <p className="font-semibold dark:text-darkTernary">
                    Eslatma:&nbsp;
                    <span className="font-normal">
                      Ko&lsquo;pi bilan 1 ta hujjat yuklay olasiz
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}

      {data.status === "ready" || data.status === "pending" ? (
        <div className="max-w-fit mx-auto p-[30px] bg-white dark:bg-darkSecondary shadow rounded-[18px]">
          <div className="flex space-x-4 items-center">
            <div className="flex justify-between items-center px-5 py-[15px] bg-[#F6F6F7] dark:bg-[#232831] dark:text-darkTernary text-lg rounded-full w-[658px]">
              <span>{transcript === 1 ? "Lotin" : "Кирилл"}</span>
              <span className="stroke-[#273A5D] dark:stroke-darkTernary">
                {arrow}
              </span>
              <span>{transcript === 1 ? "Кирилл" : "Lotin"}</span>
            </div>
            <div
              className="cursor-pointer select-none dark:bg-darkPrimary p-3 rounded-2xl dark:text-darkTernary"
              onClick={() => {
                setTranscript((prev) => (prev === 0 ? 1 : 0));
              }}
            >
              <div className="w-6 h-6">{changeArrow}</div>
            </div>
          </div>
          <p className="mt-[30px] mb-[10px] text-lg dark:text-darkTernary">
            Tanlangan hujjat:
          </p>
          <div className="bg-[#F6F6F7] dark:bg-[#232831] rounded-xl py-3 px-3 flex justify-between items-center">
            <div className="flex items-center space-x-6 w-full">
              {type}
              <p className="text-lg font-semibold leading-6 max-w-[200px] truncate dark:text-darkTernary">
                {acceptedFiles[0].name}
                <br />
                <span className="font-[13px] font-normal text-[#828696]">
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
          <div className="mt-[30px] grid grid-cols-2 gap-5">
            <button
              className="py-3 px-8 text-lg dark:text-darkSecondary rounded-full border border-[#828696] dark:border-none dark:bg-[#FFEEED]"
              onClick={removeFile}
            >
              Bekor qilish
            </button>
            <button
              className="py-3 px-8 text-lg rounded-full text-white dark:text-darkTernary bg-primary dark:bg-darkPrimary"
              type="submit"
              onClick={postData}
            >
              Jo&lsquo;natish
            </button>
          </div>
        </div>
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
        //         <span className="font-[13px] font-normal text-[#828696]">
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
        <div className="max-w-fit mx-auto p-[30px] bg-white dark:bg-darkSecondary shadow rounded-[18px]">
          <div className="w-[658px] h-[224px] rounded-[18px] flex flex-col items-center justify-center bg-[#F6F6F7] dark:bg-[#232831] space-y-4">
            {uploadSuccess}
            <p className="text-lg font-medium text-center dark:text-darkTernary">
              Hujjat “{transcript === 1 ? "Kirill" : "Lotin"}” alifbosiga
              <br />
              muvaffaqiyatli o&lsquo;girildi
            </p>
          </div>
          <div className="bg-[#F6F6F7] dark:bg-[#232831] my-[30px] rounded-xl py-3 px-5 flex justify-between items-center">
            <div className="flex items-center space-x-6">
              {type}
              <p className="text-lg font-semibold leading-6 max-w-[200px] truncate dark:text-darkTernary">
                {acceptedFiles[0].name}
                <br />
                <span className="font-[13px] font-normal text-[#828696]">
                  {sizeFile}
                </span>
              </p>
            </div>

            <div className="flex items-center px-[15px] py-[10px] space-x-4 bg-white dark:bg-darkSecondary dark:text-darkTernary text-lg rounded-full">
              <span>{transcript === 1 ? "Lotin" : "Kirill"}</span>
              <span className="stroke-[#273A5D] dark:stroke-darkTernary">
                {arrow}
              </span>
              <span>{transcript === 1 ? "Kirill" : "Lotin"}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <button
              className="py-3 px-8 flex items-center space-x-4 justify-center text-lg dark:text-darkSecondary rounded-full border border-[#828696] dark:border-none dark:bg-[#FFEEED]"
              onClick={removeFile}
            >
              <span className="stroke-[#273A5D] rotate-180 dark:stroke-darkSecondary">
                {arrow}
              </span>
              <span>Boshiga</span>
            </button>
            <Link href={data.path}>
              <a
                className="py-3 flex justify-center items-center space-x-5 px-8 text-lg rounded-full text-white bg-[#34A853]"
                type="submit"
              >
                <span>Yuklab olish</span>
                <div className="w-6 h-6 fill-white">{download}</div>
              </a>
            </Link>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default Upload;
