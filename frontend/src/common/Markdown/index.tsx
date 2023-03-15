import styles from './index.module.css'
import {
    BoldIcon,
    ItalicIcon,
    ListIcon,
    NumberListIcon,
    RedoIcon, ShowIcon,
    UnderlineIcon,
    UndoIcon, xMark
} from "@/src/common/Utils/icons";
import {useTextEditorStore} from "@/src/store/translate.store";
import {EditorState, RichUtils} from "draft-js";
import {useEffect, useState} from "react";
import {localStorageShowKey} from "@/src/constants";

function Markdown() {

    const [show, setShow] = useState<boolean>(false)

    const { editorState, setEditorState } = useTextEditorStore();

    useEffect(() => {
        const prevShow: string | null = localStorage.getItem(localStorageShowKey)
        if(prevShow !== null)  setShow(Boolean(Number(prevShow)))
    }, [])

    const handleBoldClick = (key: string, block: boolean = false) => {
        const newEditorState = block?RichUtils.toggleBlockType(editorState, key):RichUtils.toggleInlineStyle(editorState, key);
        setEditorState(newEditorState);
    };

    const undo = () => {
        const newEditorState = EditorState.undo(editorState);
        setEditorState(newEditorState);
    };

    const redo = () => {
        const newEditorState = EditorState.redo(editorState);
        setEditorState(newEditorState);
    };

    const handleSetShow = () => {
        localStorage.setItem(localStorageShowKey, String(Number(!show)))
        setShow(prev => !prev)
    }

    return (
        <>
            {
                !show?
                    <div className={styles.markdown__wrapper}>
                        <div onClick={handleSetShow} className={styles.markdown__close}>
                            {xMark}
                        </div>
                        <div className={styles.markdown__icons}>
                            <div onClick={() => handleBoldClick("BOLD")}>
                                {BoldIcon}
                            </div>
                            <div onClick={() => handleBoldClick("ITALIC")}>{ItalicIcon}</div>
                            <div onClick={() => handleBoldClick("UNDERLINE")}>{UnderlineIcon}</div>
                            <div onClick={() => handleBoldClick("ordered-list-item", true)}>{ListIcon}</div>
                            <div onClick={() => handleBoldClick("unordered-list-item", true)}>{NumberListIcon}</div>
                            <div onClick={undo}>{UndoIcon}</div>
                            <div onClick={redo}>{RedoIcon}</div>
                        </div>
                    </div>:
                    <div onClick={handleSetShow} className={styles.markdown__show}>
                        {ShowIcon}
                    </div>
            }
        </>

    );
}

export default Markdown;