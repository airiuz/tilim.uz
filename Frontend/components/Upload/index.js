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
  downloadFile,
  arrow,
  cancel,
  uploadExcel,
  uploadPptx,
  uploadTxt,
  download,
} from "../utils/icons";
import Select from "./Select";
import Link from "next/link";

const CancelToken = axios.CancelToken;

function Upload() {
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
    accept: {
      "document/docx": [".docx"],
      "document/xlsx": [".xlsx"],
      "document/pptx": [".pptx"],
      "document/txt": [".txt"],
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
          setData((prev) => ({ ...prev, path: res.data.out_file }));
          setData((prev) => ({ ...prev, status: "done" }));
        })
        .catch((error) => {
          if (error.response.status === 500) {
            setError(
              "Serverda xatolik yuz berdi iltimos birozdan song urunib koring!"
            );
          } else {
            console.log(error);
            setError(error.message);
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
      setError((prev) => ({ ...prev, uploadMessage: null }));
    },
    [type]
  );

  useEffect(() => {
    if (fileRejections[0]) {
      const newError = fileRejections[0].file.name.split(".");
      return setError(`"${
        newError[newError.length - 1]
      }" tipdagi xujjat yuklash mumkin
                      emas! Iltimos xujjat tipini tekshirib qaytattan urinib
                      ko’ring.`);
    }
    if (acceptedFiles.length === 0) {
      return;
    }
    const newType = acceptedFiles[0].name.split(".");
    if (newType[newType.length - 1] === "docx") {
      setType(uploadWord);
    } else if (newType[newType.length - 1] === "xlsx") {
      setType(uploadExcel);
    } else if (newType[newType.length - 1] === "pptx") {
      setType(uploadPptx);
    } else {
      setType(uploadTxt);
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
        <div className="max-w-fit mx-auto p-[30px] bg-white shadow rounded-[18px]">
          <div className="space-y-[30px]">
            <Select stateTranscript={setTranscript} />
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
                <div className="w-[66px] h-[66px] fill-[#3474DF]">{upload}</div>
                <p className="text-center text-[#565656]">
                  Faylni yuklash uchun shu yerga olib
                  <br />
                  keling yoki
                  <span className="text-primary"> shu yerni bosing</span>
                </p>
                <input {...getInputProps()} />
              </div>
            </div>
            <div className="mt-10">
              {error ? (
                <div className="flex space-x-3.5 p-4 bg-[#F6F6F7] rounded-[18px] max-w-[658px]">
                  <div className="shrink">{warning}</div>
                  <div>
                    <p className="text-[#EC594D] text-lg font-semibold">
                      {error}
                    </p>
                    <p className="text-[#828696]">
                      Yuklash mumkin bo’lgan xujjat tipi:&nbsp;
                      <span className="font-semibold">
                        DOCX, XLSX, PPTX, TXT.
                      </span>
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <div className="shrink">{info}</div>
                  <p className="font-semibold">
                    Eslatma:&nbsp;
                    <span className="font-normal">
                      Birvarakayiga faqat 1ta xujjat yuklay olasiz
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}

      {data.status === "ready" || data.status === "pending" ? (
        <div className="max-w-fit mx-auto p-[30px] bg-white shadow rounded-[18px]">
          <div className="flex justify-between items-center px-5 py-[15px] bg-[#F6F6F7] text-lg rounded-full w-[658px]">
            <span>{transcript === 1 ? "Lotin" : "Кирил"}</span>
            {arrow}
            <span>{transcript === 1 ? "Кирил" : "Lotin"}</span>
          </div>
          <p className="mt-[30px] mb-[10px] text-lg">Jo’natilgan xujjat:</p>
          <div className="bg-[#F6F6F7] rounded-xl py-3 px-3 flex justify-between items-center">
            <div className="flex items-center space-x-6 w-full">
              {type}
              <p className="text-lg font-semibold leading-6 max-w-[200px] truncate">
                {acceptedFiles[0].name}
                <br />
                <span className="font-[13px] font-normal text-[#828696]">
                  size: {sizeFile}
                </span>
              </p>
            </div>
            <button onClick={removeFile}>{uploadBin}</button>
          </div>
          <div className="mt-[30px] grid grid-cols-2 gap-5">
            <button
              className="py-3 px-8 text-lg rounded-full border border-[#828696]"
              type="submit"
              onClick={removeFile}
            >
              Bekor qilish
            </button>
            <button
              className="py-3 px-8 text-lg rounded-full text-white bg-primary"
              type="submit"
              onClick={postData}
            >
              Jonatish
            </button>
          </div>
        </div>
      ) : null}

      {data.status === "pending" ? (
        // <div className="max-w-fit mx-auto p-[30px] bg-white shadow rounded-[18px]">
        //   <p className="mb-[10px] text-lg">Yuklangan xujjat:</p>
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
        //       <span>{transcript === 1 ? "Lotin" : "Kiril"}</span>
        //       {arrow}
        //       <span>{transcript === 1 ? "Kiril" : "Lotin"}</span>
        //     </div>
        //   </div>
        //   <div className="w-[658px] h-[224px] rounded-[18px] flex flex-col items-center justify-center bg-[#F6F6F7] space-y-4">
        //     <HashLoader color="#3474DF" size={40} loading />
        //     <p className="text-lg font-medium text-center">Bajarilmoqda</p>
        //   </div>
        // </div>
        <div className="fixed inset-0 bg-[#273A5D]/50 grid place-content-center">
          <div className="px-[43px] pt-[45px] pb-10 bg-white flex flex-col items-center space-y-[25px] rounded-[28px]">
            <HashLoader color="#3474DF" size={40} loading />
            <p className="text-xl font-medium text-primary">Bajarilmoqda</p>
          </div>
        </div>
      ) : null}

      {data.status === "done" ? (
        <div className="max-w-fit mx-auto p-[30px] bg-white shadow rounded-[18px]">
          <div className="w-[658px] h-[224px] rounded-[18px] flex flex-col items-center justify-center bg-[#F6F6F7] space-y-4">
            {uploadSuccess}
            <p className="text-lg font-medium text-center">
              Xujjat “{transcript === 1 ? "Kiril" : "Lotin"}” alifbosiga
              <br />
              muvaffaqqiyatli o’girildi
            </p>
          </div>
          <div className="bg-[#F6F6F7] my-[30px] rounded-xl py-3 px-5 flex justify-between items-center">
            <div className="flex items-center space-x-6">
              {type}
              <p className="text-lg font-semibold leading-6 max-w-[200px] truncate">
                {acceptedFiles[0].name}
                <br />
                <span className="font-[13px] font-normal text-[#828696]">
                  {sizeFile}
                </span>
              </p>
            </div>

            <div className="flex items-center px-[15px] py-[10px] space-x-4 bg-white text-lg rounded-full">
              <span>{transcript === 1 ? "Lotin" : "Kiril"}</span>
              {arrow}
              <span>{transcript === 1 ? "Kiril" : "Lotin"}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <button
              className="py-3 px-8 text-lg rounded-full border border-[#828696]"
              type="submit"
              onClick={removeFile}
            >
              Bekor qilish
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
