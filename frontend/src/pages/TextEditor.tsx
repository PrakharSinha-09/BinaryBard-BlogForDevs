import React, { useEffect, useRef } from 'react';

interface TextEditorProps {
    content: string;
    onContentChange: (content: string) => void;
}

const TextEditor: React.FC<TextEditorProps> = ({ content, onContentChange }) => {
    const editorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (editorRef.current) {
            editorRef.current.innerHTML = content;
        }
    }, [content]);

    const handleInput = () => {
        if (editorRef.current) {
            const selection = window.getSelection();
            const range = selection?.getRangeAt(0);
            const cursorPosition = range?.startOffset;

            onContentChange(editorRef.current.innerHTML);

            setTimeout(() => {
                if (range && selection) {
                    range.setStart(editorRef.current?.childNodes[0], cursorPosition || 0);
                    range.collapse(true);
                    selection.removeAllRanges();
                    selection.addRange(range);
                }
            }, 0);
        }
    };

    const formatText = (command: string) => {
        document.execCommand(command, false);
        handleInput(); 
    };

    return (
        <div>
            <div className="mb-2">
                <button type="button" onClick={() => formatText('bold')} className="px-2 py-1 border">B</button>
                <button type="button" onClick={() => formatText('italic')} className="px-2 py-1 border">I</button>
                <button type="button" onClick={() => formatText('underline')} className="px-2 py-1 border">U</button>
            </div>
            <div
                ref={editorRef}
                contentEditable
                onInput={handleInput}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 min-h-[200px]"
            ></div>
        </div>
    );
};

export default TextEditor;
