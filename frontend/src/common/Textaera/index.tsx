import React, {useEffect, useState} from 'react';
import {EditorProps, EditorState, RichUtils} from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import styles from './index.module.css'
import {useTextEditorStore} from "@/src/store/translate.store";

export function TextEditor() {
    const { editorState, setEditorState } = useTextEditorStore();

    const handleEditorChange = (newState:any) => {
        setEditorState(newState);
    };
    
    return (
        <>
            <Editor
                placeholder={"Matnni kitting"}
                editorState={editorState}
                onEditorStateChange={handleEditorChange}
                editorClassName={styles.editor}
                toolbarClassName={styles.editor__toolbar}
                toolbarHidden
            />
        </>
        
    );
}