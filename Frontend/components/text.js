import axios from "axios";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import debounce from "./utils/debounce";
import { changeIcon, copy, info_icon, pencil } from "./utils/icons";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { stateFromMarkdown } from "draft-js-import-markdown";
import { stateToMarkdown } from "draft-js-export-markdown";
import { replaceData } from "draft-js/lib/DraftEntity";

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
  const [showR, setShowR] = useState(false);
  const [showL, setShowL] = useState(false);
  const [alert, setAlert] = useState(false);
  const [alertLength, setAlertLength] = useState(false);
  const [dataLength, setDatatLength] = useState(0);
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

        let value = "";
        if (blockTexts.filter((t) => t).length) {
          value = blockTexts.join("\n").trim();

          console.log(value + "<>");
        }
        setCopyValue(value);
        if (length <= 5000) {
          postData(newCurrentContent, dataValue);
        } else {
          setAlertLength(true);
          setTimeout(() => setAlertLength(false), 3000);
        }
        setValueLength(length);
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
  const [tool, setTool] = useState(false);

  function showToolTipRight() {
    setShowR(true);
    setTimeout(() => {
      // After 3 seconds set the show value to false
      setShowR(false);
    }, 3000);
  }

  function showToolTipLeft() {
    setShowL(true);
    setTimeout(() => {
      // After 3 seconds set the show value to false
      setShowL(false);
    }, 3000);
  }

  const changeDirection = useCallback(() => {
    setDataValue((dataValue) => {
      postData(currentContent, !dataValue);
      return !dataValue;
    });
  }, [currentContent]);

  return (
    <div className="h-full my-6">
      <div className="flex items-center my-2 justify-center">
        <div className="flex flex-col focus:border-2 focus:border-blue-500">
          <div className="flex justify-between w-full space-x-4 items-center h-[109px] bg-red-200 ">
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  setTool(!tool);
                }}
                className="bg-[#D3DAFD]  py-[16px] px-[15px] rounded-xl flex items-center"
              >
                Matn tahriri{pencil}
              </button>
              <button
                onClick={tozala}
                className="bg-slate-300  py-1 px-3 rounded-xl hidden"
              >
                Tozalash
              </button>
            </div>
            <div>
              <p className="font-semibold">
                {dataValue ? "Lotincha" : "Кириллча"}
              </p>
            </div>
          </div>
          <Editor
            toolbarHidden={!tool ? true : false}
            editorState={editorState}
            stripPastedStyles={true}
            onEditorStateChange={onEditorStateChange}
            toolbarClassName="bg-green-500 w-[500px] h-[100px] border-b-2 "
            editorClassName="bg-white w-[683px] min-h-[244px] border-t border-[#E8EBF2] max-h-[400px] p-3 overflow-y-scroll"
            wrapperClassName="demo-wrapper"
            toolbar={{
              options: ["inline", "textAlign", "list", "history"],
            }}
          />
          <div className="w-full flex justify-between px-10 items-center h-[50px] bg-cyan-800 text-gray-200">
            <p>{valueLength > 0 ? valueLength : 0}/5000</p>
            <div className="flex justify-evenly items-center gap-2">
              <CopyToClipboard text={copyValue}>
                <div className="flex items-center space-x-2">
                  {showR ? (
                    <div
                      role="tooltip"
                      class="py-2 px-3 text-[10px] font-medium bg-gray-900 rounded-lg shadow-sm"
                    >
                      Nusxalandi!
                      <div class="tooltip-arrow" data-popper-arrow></div>
                    </div>
                  ) : null}
                  <button onClick={showToolTipRight}>{copy}</button>
                </div>
              </CopyToClipboard>

              <button
                onClick={(e) => {
                  setAlert(true);
                  e.preventDefault();
                  setTimeout(() => {
                    setAlert(false);
                  }, 2000);
                }}
                className="px-4 py-1 bg-orange-600 rounded-3xl"
              >
                Tekshirish
              </button>
            </div>
          </div>
        </div>
        <button
          className="h-[68px] w-[68px] bg-[#D3DAFD] rounded-[22px] absolute top-24 flex justify-center items-center"
          type="button"
          onClick={changeDirection}
        >
          {changeIcon}
        </button>
        <div className="flex flex-col">
          <div className="flex justify-between w-full space-x-4 px-3 items-center py-2  h-[109px]  bg-gray-200">
            <p className="font-semibold">
              {dataValue ? "Кириллча" : "Lotincha"}
            </p>
            <button className="bg-gray-200 invisible text-gray-200 cursor-auto  py-1 px-3 rounded-xl">
              Tozalash
            </button>
          </div>
          <div
            className={tool ? "h-[100px] bg-white border-none" : " hidden"}
          ></div>
          <Editor
            toolbarHidden
            readOnly
            editorState={editorStatePreview}
            toolbarClassName="bg-green-500 w-[500px] h-[100px] demo-toolbar-custom border-b-2"
            editorClassName="bg-gray-300 border-white w-[683px] min-h-[244px] border-t border-[#E8EBF2] p-3 overflow-y-scroll"
            wrapperClassName="demo-wrapper"
          />
          {/* <p>{data}</p> */}
          <div className="w-full flex justify-between px-10 items-center h-[50px] bg-cyan-800 text-gray-200">
            <p>{dataLength === "" ? 0 : dataLength}</p>
            <CopyToClipboard text={data}>
              <div className="flex items-center space-x-2">
                {showL ? (
                  <div
                    role="tooltip"
                    className="py-2 px-3 text-[10px] font-medium bg-gray-900 rounded-lg shadow-sm"
                  >
                    Nusxalandi!
                    <div className="tooltip-arrow" data-popper-arrow></div>
                  </div>
                ) : (
                  <></>
                )}
                <button onClick={showToolTipLeft}>{copy}</button>
              </div>
            </CopyToClipboard>
          </div>
        </div>
      </div>
      {alert && (
        <div className="absolute flex justify-center top-[56px] w-full">
          <div className="bg-cyan-50 border w-auto border-cyan-400 rounded text-cyan-800 text-sm p-4 flex items-center space-x-2">
            <div>{info_icon}</div>
            <div>
              <p>
                <span className="font-bold">Xabarnoma: </span>
                Tekshirish funksiyasi hozirda jarayonda, noqulaylik uchun uzur!
              </p>
            </div>
          </div>
        </div>
      )}

      {alertLength && (
        <div className="absolute flex justify-center top-[56px] w-full ">
          <div className="bg-red-50 border mx-8 border-red-400 rounded text-red-800 text-sm p-4 flex items-center space-x-2">
            <div>{info_icon}</div>
            <div className="w-full">
              <p>
                <span className="font-bold">Xatolik: </span>
                5000 dan kop belgilarni tarjima qilmaydi
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TextEditor;
