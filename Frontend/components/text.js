import axios from "axios";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import debounce from "./utils/debounce";
import {
  active_volume,
  changeIcon,
  copy,
  dislike,
  dislike_active,
  info_icon,
  like,
  like_bold,
  microphone,
  nusxa,
  nusxa_icon,
  pencil,
  share,
  tozalash,
  volume,
} from "./utils/icons";
import { stateFromMarkdown } from "draft-js-import-markdown";
import { stateToMarkdown } from "draft-js-export-markdown";

const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((module) => module.Editor),
  { ssr: false }
);

function convertTo(currentContent) {
  const rawContent = convertToRaw(currentContent);
  // console.log(rawContent);
  const links = {};
  Object.keys(rawContent.entityMap)
    .filter((key) => rawContent.entityMap[key].type === "LINK")
    .map((key) => {
      links[key] = rawContent.entityMap[key].data.url;
      rawContent.entityMap[key].data.url = key;
      delete rawContent.entityMap[key].data.title;
    });
  const newCurrentContent = convertFromRaw(rawContent);
  let markdown = stateToMarkdown(newCurrentContent);
  // markdown = markdown.replaceAll("\n", "ĭ");
  // markdown = markdown.replaceAll(" ", "Į ");

  return [markdown, links];
}

function convertFrom(markdown, links) {
  // markdown = markdown.replaceAll("ĭ", "\n");
  // markdown = markdown.replaceAll("Į ", " ");

  const currentContent = stateFromMarkdown(markdown);
  const rawContent = convertToRaw(currentContent);
  // console.log(links);
  Object.keys(links).forEach((key) => {
    // console.log(rawContent.entityMap);
    rawContent.entityMap[key].data.url = links[key];
  });
  const newCurrentContent = convertFromRaw(rawContent);
  return newCurrentContent;
}

function TextEditor() {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [editorStatePreview, setEditorStatePreview] = useState(
    EditorState.createEmpty()
  );
  const [valueLength, setValueLength] = useState();
  const [data, setData] = useState("");
  const [dataValue, setDataValue] = useState(true);
  const [copyValue, setCopyValue] = useState("");
  const [dataLength, setDatatLength] = useState(false);
  const [micro, setMicro] = useState(false);
  const [nusxa, setNusxa] = useState(false);
  const [rnusxa, setRnusxa] = useState(false);
  const [likebtn, setLikebtn] = useState(false);
  const [lvolume, setLvolume] = useState(false);
  const [rvolume, setRvolume] = useState(false);
  const [dislikebtn, setDislikebtn] = useState(false);
  const [wordError, setWordError] = useState(false);

  // document
  //   .querySelector([(title = "Bold")] < img)
  //   .setAttribute(src, "https://www.w3schools.com/images/w3lynx_200.png");

  const postData = useCallback(
    debounce((currentContent, latin2cyrill) => {
      const [html, links] = convertTo(currentContent);
      if (html === "") {
        setData("");
        setEditorStatePreview(EditorState.createEmpty());
        return;
      }
      // console.log(html);
      axios
        .post("/api/change/", {
          data: html,
          type: latin2cyrill ? "1" : "0",
        })
        .then(function (response) {
          // console.log(response.data);
          console.log(response.data + "response");
          console.log(response);
          const newCurrentContent = convertFrom(response.data, links);
          // console.log(convertToRaw(newCurrentContent));
          setDatatLength(response.data.length);
          setEditorStatePreview(
            EditorState.createWithContent(newCurrentContent)
          );
          setData(response.data);
          console.log(html + "myvalue");
        })
        .catch(function (error) {
          console.log(error);
        });
    }, 500),
    []
  );

  const tozala = useCallback((e) => {
    e.preventDefault();
    setEditorState(EditorState.createEmpty());
    setEditorStatePreview(EditorState.createEmpty());
    setValueLength(0);
    setData("");
    setDatatLength(false);
  }, []);

  const microphonebtn = useCallback((e) => {
    e.preventDefault;
    setMicro(true);
    setNusxa(false);
    setTimeout(() => {
      setMicro(false);
    }, 1500);
  }, []);

  const nusxabtn = useCallback((e) => {
    e.preventDefault;
    setNusxa(true);
    setMicro(false);
    setTimeout(() => {
      setNusxa(false);
    }, 1500);
  }, []);

  const nusxarightbtn = useCallback((e) => {
    e.preventDefault;
    setRnusxa(true);
    setTimeout(() => {
      setRnusxa(false);
    }, 1500);
  }, []);

  const currentContent = editorState.getCurrentContent();
  const onEditorStateChange = useCallback(
    (newEditorState) => {
      const newCurrentContent = newEditorState.getCurrentContent();

      if (newCurrentContent !== currentContent) {
        const rawContent = convertToRaw(newCurrentContent);
        const blockTexts = rawContent.blocks.map((block) => {
          return block.text.trim();
        });

        const length = blockTexts.join("").trim().length;

        console.log(blockTexts);
        if (length > 0) {
          setDatatLength(true);
        }
        let value = "";
        if (blockTexts.filter((t) => t).length) {
          value = blockTexts.join("\n").trim();
        }
        setCopyValue(value);
        if (length <= 5000) {
          postData(newCurrentContent, dataValue);
        } else {
          setWordError(true);
          setTimeout(() => {
            setWordError(false);
          }, 2000);
        }

        setValueLength(length + blockTexts.length - 1);
      }

      setEditorState(newEditorState);

      // setEditorStatePreview(
      //   EditorState.set(editorStatePreview, {
      //     currentContent: editorState.getCurrentContent(),
      //   })
      // );
    },
    [currentContent, dataValue]
  );

  const changeDirection = useCallback(() => {
    setDataValue((dataValue) => {
      postData(currentContent, !dataValue);
      return !dataValue;
    });
  }, [currentContent]);

  return (
    <div className="h-screen">
      <div className="flex justify-center">
        <div className="flex flex-col relative border-t border-[#E8EBF2]">
          <div className="flex justify-end w-full space-x-4 pr-14 items-center h-[80px]">
            <div>
              <p className="font-semibold">{dataValue ? "Lotin" : "Кирил"}</p>
            </div>
          </div>
          <div>
            <Editor
              editorState={editorState}
              stripPastedStyles={true}
              placeholder={dataValue ? "Matinni kiriting" : "Матинни киритинг"}
              onEditorStateChange={onEditorStateChange}
              toolbarClassName="w-[500px] absolute top-[10px] left-0"
              editorClassName="bg-white w-[683px] min-h-[195px] border-t border-[#E8EBF2] py-3 pl-3 pr-14"
              toolbar={{
                options: ["inline", "list", "history"],
              }}
            />
            {dataLength && (
              <button onClick={tozala} className="absolute top-[110px] right-6">
                {tozalash}
              </button>
            )}
          </div>
          <div className="w-full flex justify-between px-10 items-center h-[49px] border-b border-[#E8EBF2]">
            <div className="flex space-x-[30px]">
              <button
                className="active:text-primary text-[#0D2148]"
                onClick={microphonebtn}
              >
                {microphone}
              </button>
              <button
                onClick={() => {
                  setLvolume(!lvolume);
                  setRvolume(false);
                }}
                className="active:text-primary text-[#0D2148]"
              >
                {lvolume ? active_volume : volume}
              </button>
              <button
                className="active:text-primary text-[#0D2148]"
                onClick={nusxabtn}
              >
                {copy}
              </button>
            </div>
            <p className="text-[16px] font-medium">
              {valueLength > 0 ? valueLength : 0}/5000
            </p>
          </div>
          <div
            className={`flex absolute bottom-[-86px] overflow-hidden space-x-[10px] text-white mt-[12px]  bg-[#3474DF] h-[74px]  py-[15px] items-center rounded-[4px] ${
              micro
                ? "w-[273px] px-[15px] transition-all duration-300"
                : "w-0 px-0 ease-linear duration-300"
            }`}
          >
            <div
              className={`relative ${
                micro
                  ? "top-0  transition-all duration-1000"
                  : "-top-24  transition-all duration-500"
              }`}
            >
              {info_icon}
            </div>
            <div
              className={`relative ${
                micro
                  ? "top-0  transition-all duration-1000"
                  : "-top-24  transition-all duration-500"
              }`}
            >
              <p>“Ovozli yozish” </p>
              <p>ishlab chiqish jarayonida</p>
            </div>
          </div>
          <div
            className={`flex space-x-[10px] absolute bottom-[-68px] mt-12  text-white overflow-hidden bg-[#3474DF] h-[56px] py-[14px] items-center rounded-[4px] ease-linear duration-300 ${
              nusxa ? "  w-[196px] px-[30px]" : "w-[0px] "
            }`}
          >
            <div
              className={`relative ${
                nusxa
                  ? "top-0  transition-all duration-1000"
                  : "-top-20  transition-all duration-500"
              }`}
            >
              Nusxa olindi
            </div>
            <div
              className={`relative  ${
                nusxa
                  ? "top-0 transition-all duration-1000"
                  : "-top-20 transition-all duration-500"
              }`}
            >
              {nusxa_icon}
            </div>
          </div>
        </div>

        {/* Change icon */}
        <button
          className="h-[68px] w-[68px] bg-[#D3DAFD] rounded-[22px] absolute top-[97px] flex justify-center items-center z-10"
          type="button"
          onClick={changeDirection}
        >
          {changeIcon}
        </button>

        {/* Right editor */}
        <div className="flex flex-col relative">
          <div className="flex justify-between w-full space-x-4 items-center pl-14  h-[81px]  bg-[#F4F7FC] border-t border-[#E8EBF2]">
            <p className="font-semibold">{dataValue ? "Кирил" : "Lotin"}</p>
          </div>
          <Editor
            toolbarHidden
            readOnly
            editorState={editorStatePreview}
            placeholder={dataValue ? "Матинни киритинг" : "Matinni kiriting"}
            editorClassName="bg-[#F4F7FC] w-[683px] min-h-[195px] border-t border-[#E8EBF2] py-3 pl-3"
          />
          <div className="w-full flex justify-between px-10 items-center h-[49px] bg-[#F4F7FC] border-b border-[#E8EBF2]">
            <div>
              <button
                onClick={() => {
                  setRvolume(!rvolume);
                  setLvolume(false);
                }}
                className="active:text-primary text-[#0D2148]"
              >
                {rvolume ? active_volume : volume}
              </button>
            </div>
            <div className="flex space-x-[30px]">
              <button
                className="text-[#0D2148] active:text-primary"
                onClick={nusxarightbtn}
              >
                {copy}
              </button>
              <button
                onClick={() => {
                  setLikebtn(!likebtn);
                }}
              >
                {likebtn ? like_bold : like}
              </button>
              <button
                onClick={() => {
                  setDislikebtn(!dislikebtn);
                }}
              >
                {dislikebtn ? dislike_active : dislike}
              </button>
            </div>
          </div>
          <div className="flex justify-end ">
            <div
              className={`flex space-x-[10px] absolute bottom-[-68px] mt-12  text-white overflow-hidden bg-[#3474DF] h-[56px] py-[14px] items-center rounded-[4px] ease-linear duration-300 ${
                rnusxa ? "  w-[196px] px-[30px]" : "w-[0px] "
              }`}
            >
              <div
                className={`relative ${
                  rnusxa
                    ? "top-0  transition-all duration-1000"
                    : "-top-20  transition-all duration-700"
                }`}
              >
                Nusxa olindi
              </div>
              <div
                className={`relative  ${
                  rnusxa
                    ? "top-0 transition-all duration-1000"
                    : "-top-20 transition-all duration-700"
                }`}
              >
                {nusxa_icon}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`flex fixed top-24 z-50 inset-x-1/3 ml-8 space-x-[13px] w-[430px] px-[15px] text-white overflow-hidden bg-[#3474DF]  items-center rounded-[4px] ease-linear duration-300
        ${wordError ? "h-[66px] py-[15px]" : "h-0 py-0"}
        `}
      >
        <div
          className={`relative  ${
            wordError
              ? "top-0 transition-all duration-1000"
              : "-top-20 transition-all duration-500"
          }`}
        >
          {info_icon}
        </div>
        <div
          className={`relative ${
            wordError
              ? "top-0  transition-all duration-1000"
              : "-top-20  transition-all duration-500"
          }`}
        >
          Belgilar sani 5000 tadan oshmasligi kerak
        </div>
      </div>
    </div>
  );
}

export default TextEditor;
