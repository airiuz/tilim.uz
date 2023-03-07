import axios from "axios";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import debounce from "../components/utils/debounce";
import { changeIcon, info_icon, tozalash } from "../components/utils/icons";
import { stateFromMarkdown } from "draft-js-import-markdown";
import { stateToMarkdown } from "draft-js-export-markdown";
import RightTools from "../components/utils/rightTools";
import LeftTools from "../components/utils/leftTools";
import Layout from "../components/Layout/index";

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

function Home() {
  const editor = useRef();
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [editorStatePreview, setEditorStatePreview] = useState(
    EditorState.createEmpty()
  );
  const [valueLength, setValueLength] = useState();
  const [data, setData] = useState("");
  const [dataValue, setDataValue] = useState(true);
  const [textValue, setTextValue] = useState("");
  const [dataLength, setDatatLength] = useState(false);
  const [wordError, setWordError] = useState(false);
  const [editorValue, setEditorValue] = useState("");
  const [placeholderl, setPlaceholderL] = useState("Matnni kiriting");
  const [placeholderr, setPlaceholderR] = useState("Матнни киритинг");
  const [placeholder, setPlaceholder] = useState(true);

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
          const newCurrentContent = convertFrom(response.data.text, links);
          setDatatLength(response.data.text.length);
          setEditorStatePreview(
            EditorState.createWithContent(newCurrentContent)
          );
          if (response.data.text !== "\u200b") {
            setData(response.data.text);
          }
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
    setTextValue("");
    setData("");
    setDatatLength(false);
  }, []);

  const currentContent = editorState.getCurrentContent();
  const onEditorStateChange = useCallback(
    (newEditorState) => {
      const newCurrentContent = newEditorState.getCurrentContent();
      if (newCurrentContent !== currentContent) {
        const rawContent = convertToRaw(newCurrentContent);
        const value = rawContent.blocks.map((block) => block.text).join("`\n`");
        const newvalue = value.replaceAll("`", "");
        setTextValue(value);
        setData(value);
        setEditorValue(value);
        const length = newvalue.length;
        setValueLength(length);

        if (length > 0) {
          setDatatLength(true);
        }
        if (length <= 5000) {
          postData(newCurrentContent, dataValue);
        } else {
          setWordError(true);
          setTimeout(() => {
            setWordError(false);
          }, 2000);
        }
      }
      setEditorState(newEditorState);
    },
    [currentContent, dataValue, data, textValue]
  );
  const changeDirection = useCallback(() => {
    setDataValue((dataValue) => {
      postData(currentContent, !dataValue);
      setPlaceholderL(placeholderr);
      setPlaceholderR(placeholderl);
      return !dataValue;
    });
  }, [currentContent, editorState, editorStatePreview]);

  console.log();

  return (
    <Layout>
      <div className="bg-[#E8EAED] dark:bg-[#232831] h-screen">
        <div className="flex justify-center items-center bg-[#E8EAED] dark:bg-[#232831] px-[52px] text-[18px] h-[64px]">
          <p className="font-semibold dark:text-darkTernary text-lg w-full">
            {dataValue ? "Lotin" : "Кирилл"}
          </p>
          <button
            className="flex justify-center items-center w-full text-[#0D2148] dark:text-darkTernary"
            type="button"
            onClick={changeDirection}
          >
            {changeIcon}
          </button>
          <p className="font-semibold flex justify-end dark:text-darkTernary text-lg w-full">
            {dataValue ? "Кирилл" : "Lotin"}
          </p>
        </div>

        {/* Editors */}
        <div className="editorShadow">
          <div className="flex flex-col justify-between space-y-[10px]">
            <div className="flex flex-col">
              <div className="">
                <div className="flex justify-between rounded-t-[18px] bg-white dark:bg-darkSecondary p-[15px]">
                  <LeftTools
                    textLength={valueLength}
                    value={textValue}
                    editorRef={editor}
                  />

                  {textValue.length > 0 ? (
                    <button
                      onClick={tozala}
                      className=" stroke-[#273A5D] dark:stroke-darkTernary ml-2"
                    >
                      {tozalash}
                    </button>
                  ) : null}
                </div>
                <Editor
                  editorRef={(ref) => (editor.current = ref)}
                  toolbarHidden
                  editorState={editorState}
                  stripPastedStyles={true}
                  onEditorStateChange={onEditorStateChange}
                  placeholder={placeholder ? placeholderl : null}
                  editorClassName={`bg-white dark:text-darkTernary dark:bg-darkSecondary px-[20px] rounded-b-[20px] ${
                    valueLength > 0 ? "min-h-[70px]" : "min-h-[84vh]"
                  }`}
                />
              </div>
            </div>

            {textValue.length > 0 && (
              <div className="flex flex-col">
                <div className="rounded-t-[18px] bg-white dark:bg-darkSecondary p-[15px]">
                  <RightTools value={data} />
                </div>
                <Editor
                  toolbarHidden
                  readOnly
                  editorState={editorStatePreview}
                  editorClassName="bg-white dark:text-darkTernary dark:bg-darkSecondary min-h-[70px] px-[20px] rounded-b-[20px]"
                />
              </div>
            )}
          </div>
          <div
            className={`flex fixed text-[18px] top-24 z-50 ml-8 w-[330px] text-white overflow-hidden bg-[#3474DF]  items-center rounded-[4px] ease-linear duration-300
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
      </div>
    </Layout>
  );
}

export default Home;

export async function getServerSideProps({ req }) {
  const device = req.headers["user-agent"].includes("Mobile");

  if (req.headers.host === "m.tilim.uz" && !device) {
    return { redirect: { destination: "https://www.tilim.uz/" } };
  }

  return {
    props: {},
  };
}
