import axios from "axios";
import { EditorState, convertToRaw, convertFromRaw, RichUtils } from "draft-js";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import debounce from "../utils/debounce";
import { changeIcon, info_icon, tozalash } from "../utils/icons";
import { stateFromMarkdown } from "draft-js-import-markdown";
import { stateToMarkdown } from "draft-js-export-markdown";
import RightTools from "./rightTools";
import LeftTools from "./leftTools";
import { getEditorText } from "./utils";

const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((module) => module.Editor),
  { ssr: false }
);

function convertTo(currentContent) {
  const rawContent = convertToRaw(currentContent);
  const links = {};
  Object.keys(rawContent.entityMap)
    .filter((key) => rawContent.entityMap[key].type === "LINK")
    .map((key) => {
      links[key] = rawContent.entityMap[key].data.url;
      rawContent.entityMap[key].data.url = key;
      delete rawContent.entityMap[key].data.title;
    });
  rawContent.blocks.forEach((block) => {
    block.text = block.text.replaceAll("\n", "♥");
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
  rawContent.blocks.forEach((block) => {
    block.text = block.text.replaceAll("♥", "\n");
  });
  Object.keys(links).forEach((key) => {
    rawContent.entityMap[key].data.url = links[key];
  });
  const newCurrentContent = convertFromRaw(rawContent);
  return newCurrentContent;
}

function TextEditor() {
  const editor = useRef();
  const [originalContent, setOriginalContent] = useState();
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [editorStatePreview, setEditorStatePreview] = useState(
    EditorState.createEmpty()
  );
  const [text, setText] = useState("");
  const [textPreview, setTextPreview] = useState("");
  const [direction, setDirection] = useState(true);

  const [wordError, setWordError] = useState(false);

  const postData = useCallback(
    debounce((currentContent, latin2cyrill) => {
      const [html, links] = convertTo(currentContent);
      if (html === "") {
        setEditorStatePreview(EditorState.createEmpty());
        return;
      }
      axios
        .post("/api/change/", {
          data: html,
          type: latin2cyrill ? "1" : "0",
        })
        .then(function (response) {
          const newCurrentContent = convertFrom(response.data.text, links);
          setEditorStatePreview(
            EditorState.createWithContent(newCurrentContent)
          );
        })
        .catch(function (error) {
          console.log(error);
        });
    }, 500),
    []
  );
  const currentContent = editorState.getCurrentContent();
  const currentContentPreview = editorStatePreview.getCurrentContent();

  useEffect(() => {
    setText(getEditorText(currentContent));
  }, [currentContent]);

  useEffect(() => {
    setTextPreview(getEditorText(currentContentPreview));
  }, [currentContentPreview]);

  useEffect(() => {
    const length = getEditorText(currentContent).length;

    if (length > 0 && length <= 5000) {
      postData(currentContent, direction);
    }
  }, [currentContent, direction]);

  const tozala = useCallback(() => {
    setEditorState(EditorState.createEmpty());
    setEditorStatePreview(EditorState.createEmpty());
  }, [editorState, editorStatePreview]);

  const onEditorStateChange = useCallback(
    (newEditorState) => {
      const newCurrentContent = newEditorState.getCurrentContent();
      if (newCurrentContent !== currentContent) {
        const length = getEditorText(newCurrentContent).length;
        if (length > 5000) {
          setWordError(true);
          setTimeout(() => {
            setWordError(false);
          }, 2000);
        }
      }
      setEditorState(newEditorState);
    },
    [currentContent]
  );

  const changeDirection = useCallback(() => {
    setDirection((direction) => !direction);
  }, []);

  const handleKeyCommand = useCallback(
    (e) => {
      const newState = RichUtils.handleKeyCommand(editorState, e);
      if (newState) {
        setEditorState(newState);
        setEditorStatePreview(newState);
        return true;
      }
      return false;
    },
    [editorState, editorStatePreview]
  );

  const onMicrophoneData = useCallback(
    (data) => {
      setOriginalContent((originalContent) => {
        if (data.type === "start") {
          return currentContent;
        }
        if (data.type === "end") {
          return null;
        }
        if (!originalContent) {
          return originalContent;
        }

        const [html, links] = convertTo(originalContent);
        const newHtml = (html && html.length > 2 ? html + " " : "") + data.text;
        const newCurrentContent = convertFrom(newHtml, links);
        const newEditorState = EditorState.createWithContent(newCurrentContent);
        setEditorState(newEditorState);
        if (data.is_final) {
          return newCurrentContent;
        }
        return originalContent;
      });
    },
    [currentContent]
  );

  return (
    <div className="mb-12 editorShadow">
      <div className="flex justify-center">
        <div className="flex flex-col relative border-t border-[#E8EBF2] dark:border-darkSecondary w-1/2">
          <div className="flex justify-end w-full space-x-4 pr-14 items-center h-[80px]">
            <div>
              <p className="font-semibold dark:text-darkTernary text-lg">
                {direction ? "Lotin" : "Кирилл"}
              </p>
            </div>
          </div>
          <div className="py-3 border-t border-[#E8EBF2] dark:border-[#495054] px-7">
            <Editor
              editorRef={(ref) => (editor.current = ref)}
              editorState={editorState}
              stripPastedStyles={true}
              handleKeyCommand={handleKeyCommand}
              onEditorStateChange={onEditorStateChange}
              placeholder={direction ? "Matnni kiriting" : "Матнни киритинг"}
              toolbarClassName="w-[500px] absolute dark:bg-darkSecondary top-[10px] left-0"
              editorClassName="bg-white dark:text-darkTernary dark:bg-darkSecondary min-h-[195px] pr-14"
              toolbar={{
                options: ["inline", "list", "history"],
              }}
            />
            {text.length > 0 ? (
              <button
                type="button"
                onClick={tozala}
                className="absolute top-[110px] right-6 stroke-[#273A5D] dark:stroke-darkTernary"
              >
                {tozalash}
              </button>
            ) : null}
          </div>
          <LeftTools
            value={text}
            speakValue={direction ? text : textPreview}
            editorRef={editor}
            onMicrophoneData={onMicrophoneData}
          />
        </div>

        {/* Change icon */}
        <button
          className="h-[68px] w-[68px] bg-[#D3DAFD] dark:bg-darkPrimary rounded-[22px] absolute top-[97px] flex justify-center items-center z-10"
          type="button"
          onClick={changeDirection}
        >
          {changeIcon}
        </button>

        {/* Right editor */}
        <div className="flex flex-col relative w-1/2">
          <div className="flex justify-between w-full space-x-4 items-center pl-14  h-[81px]  bg-[#F4F7FC] dark:bg-[#232831] dark:border-[#232831] border-t border-[#E8EBF2]">
            <p className="font-semibold dark:text-darkTernary text-lg">
              {direction ? "Кирилл" : "Lotin"}
            </p>
          </div>
          <Editor
            handleKeyCommand={handleKeyCommand}
            toolbarHidden
            readOnly
            editorState={editorStatePreview}
            editorClassName="bg-[#F4F7FC] dark:bg-[#232831] dark:text-darkTernary min-h-[195px] border-t border-[#E8EBF2] dark:border-[#495054] py-3 pl-7"
          />
          <RightTools
            value={textPreview}
            speakValue={direction ? text : textPreview}
          />
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
              : "-top-20 transition-all duration-700"
          }`}
        >
          {info_icon}
        </div>
        <div
          className={`relative ${
            wordError
              ? "top-0  transition-all duration-1000"
              : "-top-20  transition-all duration-700"
          }`}
        >
          Belgilar sani 5000 tadan oshmasligi kerak
        </div>
      </div>
    </div>
  );
}

export default TextEditor;
