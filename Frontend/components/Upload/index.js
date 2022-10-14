import { useDropzone } from "react-dropzone";
import axios from "axios";
import FormData from "form-data";
import { HashLoader } from "react-spinners";
import { useCallback, useRef, useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import {
  excel,
  powerPoint,
  txtFile,
  upload,
  uploadBin,
  uploadSuccess,
  uploadWord,
  warning,
  word,
} from "../utils/icons";
import Select from "./Select";

function Upload() {
  const router = useRouter();
  const [progress, setProgress] = useState(null);
  const [sizeFile, setSizeFile] = useState(0);
  const postData = useCallback(
    (data) => {
      setProgress("0");
      axios
        .post("/api/record", data, {
          onUploadProgress: (event) => {
            const percent = (event.loaded / event.total) * 100;
            setProgress(percent.toFixed(1));
          },
        })
        .then((res) => {
          setProgress("100.0");
          console.log(res.data);
          router.push(`/audio/${res.data.slug}/`);
        })
        .catch((error) => {
          setProgress(null);
          console.log(error);
        });
    },
    [router]
  );

  const loading = progress !== null;
  const uploading = loading && progress !== "100.0";
  const pending = loading && progress === "100.0";

  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
    acceptedFiles,
  } = useDropzone();

  useEffect(() => {
    if (acceptedFiles.length === 0) {
      return;
    }
    const formData = new FormData();
    formData.append("file", acceptedFiles[0]);

    postData(formData);
    const bytes = acceptedFiles[0].size;
    if (!+bytes) return "0 Bytes";

    const k = 1024;
    const dm = 2;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    setSizeFile(
      () => `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
    );
  }, [acceptedFiles]);

  return (
    <>
      <div className="max-w-fit mx-auto p-[30px] bg-white shadow rounded-[18px]">
        {false ? (
          <div className="space-y-[30px]">
            <Select />
            <div className="flex space-x-7">
              <div className="space-y-7">
                <div className="flex space-x-2 items-center">
                  {word}
                  <p className="leading-4 font-semibold">
                    DOCX
                    <br />
                    <span className="text-xs text-[#828696] font-normal">
                      max size 1GB
                    </span>
                  </p>
                </div>
                <div className="flex space-x-2 items-center">
                  {excel}
                  <p className="leading-4 font-semibold">
                    XLSX
                    <br />
                    <span className="text-xs text-[#828696] font-normal">
                      max size 1GB
                    </span>
                  </p>
                </div>
                <div className="flex space-x-2 items-center">
                  {powerPoint}
                  <p className="leading-4 font-semibold">
                    PPTX
                    <br />
                    <span className="text-xs text-[#828696] font-normal">
                      max size 1GB
                    </span>
                  </p>
                </div>
                <div className="flex space-x-2 items-center">
                  {txtFile}
                  <p className="leading-4 font-semibold">
                    TXT
                    <br />
                    <span className="text-xs text-[#828696] font-normal">
                      max size 1GB
                    </span>
                  </p>
                </div>
              </div>
              <div
                {...getRootProps({
                  className: `w-[494px] ${
                    isDragAccept ? "bg-[#F1F9FF]" : "bg-white"
                  } outline-none flex flex-col items-center py-5 justify-center space-y-4 rounded-lg cursor-pointer shadow-sm select-none  border-2 border-dashed border-primary rounded-lg`,
                })}
              >
                {upload}
                <p className="text-center text-[#565656]">
                  Faylni yuklash uchun shu yerga olib
                  <br />
                  keling yoki
                  <span className="text-primary"> shu yerni bosing</span>
                </p>
                ``
                <input {...getInputProps()} />
              </div>
            </div>
            <div className="flex items-center mt-10 space-x-2">
              {warning}
              <p className="font-semibold">
                Eslatma:&nbsp;
                <span className="font-normal">
                  Birvarakayiga faqat 1ta xujjat yuklay olasiz
                </span>
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="w-[658px] h-[224px] rounded-[18px] flex flex-col items-center justify-center bg-[#F6F6F7] space-y-4">
              {uploadSuccess}
              <p className="text-lg font-medium text-center">
                Xujjat muvaffaqqiyatli
                <br />
                yuklandi!
              </p>
            </div>
            <div className="my-[30px] border border-[#E8EBF2] rounded-xl py-3 px-5 flex justify-between items-center">
              <div className="flex items-center space-x-6">
                {uploadWord}
                <p className="text-lg font-semibold leading-6">
                  Word file: name of the file
                  <br />
                  <span className="font-[13px] font-normal text-[#828696]">
                    size: 120mb
                  </span>
                </p>
              </div>
              <button>{uploadBin}</button>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <button className="py-5 text-lg rounded-full border border-[#E8EBF2] bg-[#F6F6F7] text-[#828696]">
                Bekor qilish
              </button>
              <button className="py-5 text-lg rounded-full text-white bg-primary">
                Jonatish
              </button>
            </div>
          </>
        )}
      </div>
      {loading ? (
        <div className="fixed flex z-[100] inset-0 flex-col items-center bg-[#262E36]/20 backdrop-blur-[10px] justify-center">
          <div
            className={`flex flex-col items-center space-y-2 ${
              !pending && "hidden"
            }`}
          >
            <HashLoader color="#fff" loading />
            <p className="uppercase text-white text-xl">fayl tekshirilmoqda</p>
          </div>
          <div
            className={`space-y-2 bg-white p-8 rounded-[14px] ${
              uploading ? "block" : "hidden"
            }`}
          >
            <p className="text-2xl font-semibold">Yuklanmoqda:</p>
            <div className="flex justify-between items-end">
              <div className="flex items-center space-x-4">
                <p className="text-[10px]">
                  Audio file name<br></br>
                  {sizeFile}
                </p>
              </div>
              <div className="flex justify-between text-sm">
                <span className="">{progress}%</span>
              </div>
            </div>
            <div className="w-[350px] rounded-md overflow-hidden bg-[#F4F6FB] h-8 relative">
              <div
                className="h-full absolute left-0 bg-gradient-to-l from-[#736EFE] to-[#5EFCE8]"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default Upload;
