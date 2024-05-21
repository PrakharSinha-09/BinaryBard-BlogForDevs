import { Appbar } from "../components/Appbar";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";
import { ChangeEvent, useState, useRef, useEffect, forwardRef } from "react";
import { Spinner } from "../components/Spinner";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Publish = () => {
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const editorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const editor = editorRef.current;
        if (editor) {
            editor.addEventListener('input', handleInput);
        }
        return () => {
            if (editor) {
                editor.removeEventListener('input', handleInput);
            }
        };
    }, []);

    const handleInput = () => {
        const editor = editorRef.current;
        if (editor) {
            setDescription(editor.innerHTML);
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    

    const publishBlog = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post(
                `${BACKEND_URL}/api/v1/blog/new`,
                { title, content: description },
                { headers: { Authorization: localStorage.getItem("token") } }
            );
            setIsLoading(false);
            toast.success("🚀 Blog Published Successfully!", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                })
            navigate(`/blog/${response.data.id}`);
        } catch (error) {
            toast.error("🚀 Some Error Occured!", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                })
            setIsLoading(false);
            // Handle error
        }
    };

    return (
        <div>
            <Appbar />
            <div className="flex justify-center w-full h-screen pt-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"> 
                <div className="max-w-screen-lg w-full bg-white rounded-lg shadow-lg p-6">
                    <input 
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                        type="text" 
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none block w-full p-2.5 mb-4" 
                        placeholder="Title" 
                    />

                    <TextEditor ref={editorRef} onChange={handleInput} />

                    <button 
                        onClick={publishBlog}
                        type="submit" 
                        disabled={title.length === 0 || description.length === 0} 
                        className="text-center mt-4 w-32 inline-flex px-5 py-2.5 text-sm font-medium text-white bg-blue-700 rounded-lg focus:ring-4 focus:outline-none hover:bg-blue-800"
                    >
                        {isLoading ? <Spinner /> : <span>Publish Blog</span>}
                    </button>
                </div>
            </div>
        </div>
    );
};

interface TextEditorProps {
    ref: React.RefObject<HTMLDivElement>;
    onChange: () => void;
}

const TextEditor = forwardRef<HTMLDivElement, TextEditorProps>((props, ref) => {
    const { onChange } = props;

    const applyStyle = (command: string) => {
        document.execCommand(command, false, null);
    };

    return (
        <div className="mt-2">
            <div className="w-full mb-4">
                <div className="flex items-center justify-between border-b-2 pb-2 mb-2">
                    <button type="button" onClick={() => applyStyle('bold')} className="px-2 py-1 border rounded-lg mr-1 hover:bg-gray-200">Bold</button>
                    <button type="button" onClick={() => applyStyle('italic')} className="px-2 py-1 border rounded-lg mr-1 hover:bg-gray-200">Italic</button>
                    <button type="button" onClick={() => applyStyle('underline')} className="px-2 py-1 border rounded-lg mr-1 hover:bg-gray-200">Underline</button>
                    <button type="button" onClick={() => applyStyle('strikeThrough')} className="px-2 py-1 border rounded-lg mr-1 hover:bg-gray-200">Strikethrough</button>
                </div>
                <div className="my-2 bg-white rounded-lg w-full border p-2" contentEditable={true} ref={ref} onInput={onChange} style={{ minHeight: '200px' }} placeholder="Write an article..."></div>
            </div>
        </div>
    );
});

export default Publish;
