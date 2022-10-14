import axios from "axios";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import debounce from "./utils/debounce";
import {
  changeIcon,
  copy,
  info_icon,
  like,
  microphone,
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
  const [showR, setShowR] = useState(false);
  const [showL, setShowL] = useState(false);
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

  const changeDirection = useCallback(() => {
    setDataValue((dataValue) => {
      postData(currentContent, !dataValue);
      return !dataValue;
    });
  }, [currentContent]);

  return (
    <div className="h-full">
      <div className="flex items-center justify-center">
        <div className="flex flex-col focus:border-2 focus:border-blue-500">
          <div className="flex justify-between w-full space-x-4 pr-14 items-center h-[109px]">
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  setTool(!tool);
                }}
                className="bg-[#D3DAFD] space-x-[14px] text-[16px]  py-[16px] px-[15px] rounded-xl flex items-center"
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
          <div className="relative">
            <Editor
              toolbarHidden={!tool ? true : false}
              editorState={editorState}
              stripPastedStyles={true}
              onEditorStateChange={onEditorStateChange}
              toolbarClassName="bg-green-500 w-[500px] h-[100px] border-b-2 "
              editorClassName="bg-white w-[683px] min-h-[195px] border-t border-[#E8EBF2] py-3 pl-3 pr-14"
              toolbar={{
                options: ["inline", "textAlign", "list", "history"],
              }}
            />
            <button onClick={tozala} className="absolute top-6 right-8">
              {tozalash}
            </button>
          </div>
          <div className="w-full flex justify-between px-10 items-center h-[49px] border-b border-[#E8EBF2]">
            <div className="flex space-x-[30px]">
              <button>{microphone}</button>
              <button>{volume}</button>
              <button>{copy}</button>
            </div>
            <p className="text-[16px] font-medium">
              {valueLength > 0 ? valueLength : 0}/5000
            </p>
          </div>
        </div>

        {/* Change icon */}
        <button
          className="h-[68px] w-[68px] bg-[#D3DAFD] rounded-[22px] absolute top-28 flex justify-center items-center"
          type="button"
          onClick={changeDirection}
        >
          {changeIcon}
        </button>

        {/* Right editor */}
        <div className="flex flex-col">
          <div className="flex justify-between w-full space-x-4 items-center pl-14  h-[109px]  bg-[#F4F7FC]">
            <p className="font-semibold">
              {dataValue ? "Кириллча" : "Lotincha"}
            </p>
          </div>
          <div
            className={tool ? "h-[100px] bg-white border-none" : " hidden"}
          ></div>
          <Editor
            toolbarHidden
            readOnly
            editorState={editorStatePreview}
            toolbarClassName="bg-green-500 w-[500px] h-[100px]"
            editorClassName="bg-[#F4F7FC] w-[683px] min-h-[195px] border-t border-[#E8EBF2] py-3 pl-3"
          />
          <div className="w-full flex justify-between px-10 items-center h-[49px] bg-[#F4F7FC] border-b border-[#E8EBF2]">
            <div>
              <button>{volume}</button>
            </div>
            <div className="flex space-x-[30px]">
              <button>{copy}</button>
              <button>{like}</button>
              <button>{share}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TextEditor;
