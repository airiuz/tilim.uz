import dynamic from 'next/dynamic';
import React, {useEffect, useState} from 'react';
import {EditorProps, EditorState, RichUtils} from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import styles from './index.module.css'
import {useTextEditorStore} from "@/src/store/translate.store";

const RichTextEditor = dynamic(() => import('react-draft-wysiwyg').then((mod) => mod.Editor), {
    ssr: false,
});

export function TextEditor({maxHeight = 304, placeholder}: {maxHeight: number, placeholder: string}) {
    const { editorState, setEditorState } = useTextEditorStore();

    const handleEditorChange = (newState:any) => {
        setEditorState(newState);
    };

    return (
        <>
            <RichTextEditor
                placeholder={placeholder}
                editorState={editorState}
                onEditorStateChange={handleEditorChange}
                editorStyle={{maxHeight}}
                editorClassName={`${styles.editor}`}
                toolbarClassName={styles.editor__toolbar}
                toolbarHidden
            />
        </>

    );
}