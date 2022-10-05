import React, { useState } from "react";
import Layout from "../components/Layout";
import FormData from "form-data";
import axios from "axios";
import {
  documentIcon,
  download,
  exclamination,
  info_icon,
} from "../components/utils/icons";

function Documents() {
  let formData = new FormData();
  const [fileName, setFileName] = useState(false);
  const [data, setData] = useState("");
  const [file, setFile] = useState("");
  const [errorValue, setErrorValue] = useState(false);
  const [status, setStatus] = useState("");
  const [value, setvalue] = useState(1);
  const [progress, setProgress] = useState(0);

  const onFileChange = (e) => {
    console.log(e.target.files[0]);
    // setFile(e.target.files[0].name);
    formData.append("t", value);
    if (e.target && e.target.files[0]) {
      formData.append("in_file", e.target.files[0]);
    }
  };

  const SubmitFileData = () => {
    setProgress(0);
    axios
      .post(
        "/api/changefile/",
        formData
        // ,{
        //   onUploadProgress: (event) => {
        //     console.log(event.loaded);
        //     const percent = (event.loaded / event.total) * 100;
        //     setProgress(percent.toFixed(1));
        //   },
        // }
      )
      .then((res) => {
        setFileName(true);
        setProgress("100.0");
        console.log(res);

        setData(res.data.out_file);
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
        setErrorValue(true);
        setProgress(null);
        setStatus(error.response.status);
      });
  };
  console.log(status);
  console.log(progress);
  return (
    <Layout>
      <div className="flex justify-center items-center h-[70vh]">
        <div className="flex flex-col justify-center items-center w-full">
          <div className="w-1/2 flex justify-center"></div>

          <label className="flex flex-col justify-center items-center w-1/2 h-64 bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
            <div className="flex flex-col justify-center space-y-8 items-center pt-5 pb-6">
              <div className="flex space-x-4">
                <img className="w-10 h-10" src="/img/word.png" alt="image" />
                <img className="w-10 h-10" src="/img/pptx.png" alt="image" />
                <img className="w-10 h-10" src="/img/excel.png" alt="image" />
              </div>
              <p className="mb-2 text-sm ">
                <span className="font-semibold">Faylni yuklash</span> uchun
                shuyerga bosing
              </p>
              <p className="text-xs">
                WORD, PPTX, EXCEL va boshqa fayllarni yuklang
              </p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              className="hidden"
              onChange={onFileChange}
            />
          </label>
          {file && (
            <p className="flex my-3 gap-1 border-2 w-1/2 py-2 items-center justify-center">
              {documentIcon}
              {file}
            </p>
          )}
          {/* <p
            style={{
              width: progress + "%",
              backgroundColor: "red",
            }}
            className="flex my-3 gap-1 border-2 w-1/2 py-2 items-center justify-center"
          >
            werew
          </p> */}
          {fileName && (
            <div className="w-1/2 bg-gray-200 rounded-lg h-5 mt-4 mb-2 dark:bg-gray-700">
              <div
                className={`bg-cyan-600 h-5 py-2 rounded-lg flex justify-center items-center text-white ${
                  fileName ? "w-[100%]" : "w-[0%]"
                } `}
              >
                {fileName && <p>100%</p>}
              </div>
            </div>
          )}
          <div className="w-screen flex justify-center my-3">
            <select
              id="countries"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm block w-1/2 p-2.5"
            >
              <option value={1}>Lotin-Kirill</option>
              <option value={0}>Kirill-Lotin</option>
            </select>
          </div>
          {!fileName ? (
            <button
              onClick={SubmitFileData}
              className="w-1/2 bg-cyan-800 text-white py-2"
            >
              Jo'natish
            </button>
          ) : (
            <a
              className="w-1/2 bg-cyan-800 text-white py-2 mt-2 flex justify-center items-center"
              href={data}
            >
              <span>{download}</span>
              <span>Download</span>
            </a>
          )}
        </div>
      </div>
      {errorValue && (
        <div className="flex justify-center items-center absolute inset-0 bg-black bg-opacity-70">
          <div className="flex flex-col border-2 bg-white rounded-md border-cyan-600 h-[200px] w-[400px] justify-evenly px-4">
            <span className="self-center">{exclamination}</span>
            {status === 400 ? (
              <p className="text-center">Internetni tekshiring</p>
            ) : (
              <p className="text-center">
                Noto'g'ri fayl tanlandi iltimos tekshirib qayta urinib ko'ring!
              </p>
            )}
            <button
              onClick={() => {
                setErrorValue(false);
              }}
              className="bg-cyan-600 text-white px-12 py-3 rounded-lg"
            >
              Yopish
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default Documents;
