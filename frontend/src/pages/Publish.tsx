import { Appbar } from "../components/Appbar"
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";
import { ChangeEvent, useState } from "react";
import { Spinner } from "../components/Spinner";

const Publish = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [buttonDisable, setButtonDisable] = useState(false);

    const navigate = useNavigate();

    return <div>
        <Appbar />
        <div className="flex justify-center w-full h-screen pt-8 bg-gradient-to-r from-indigo-500 ..."> 
            <div className="max-w-screen-lg w-full">
                <input onChange={(e) => {
                    setTitle(e.target.value)
                }} type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none block w-full p-2.5" placeholder="Title" />

                <TextEditor onChange={(e) => {
                    setDescription(e.target.value)
                }} />

                <button onClick={async () => {
                    setIsLoading(true)
                    setButtonDisable(true)
                    const response = await axios.post(`${BACKEND_URL}/api/v1/blog/new`, {
                        title,
                        content: description
                    }, {
                        headers: {
                            Authorization: localStorage.getItem("token")
                        }
                    });
                    setIsLoading(false)
                    setButtonDisable(false)
                   
                    
                    navigate(`/blog/${response.data.id}`)
                }} type="submit" disabled={buttonDisable} className="text-center mt-4 w-32 inline-flex px-5 py-2.5 text-sm font-medium text-white bg-blue-700 rounded-lg focus:ring-4 focus:outline-none hover:bg-blue-800">
                    {isLoading ? <Spinner /> : (
                        <span>Publish Blog</span>
                    )}
                </button>
            </div>
        </div>
    </div>
}


function TextEditor({ onChange }: {onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void}) {
    return <div className="mt-2">
        <div className="w-full mb-4 ">
            <div className="flex items-center justify-between border">
            <div className="my-2 bg-white rounded-b-lg w-full">
                <textarea onChange={onChange} id="editor" rows={8} className="focus:outline-none block w-full px-0 text-sm text-gray-800 bg-white border-0 pl-2" placeholder="Write an article..." required />
            </div>
            
        </div>
       </div>
    </div>
}

export default Publish