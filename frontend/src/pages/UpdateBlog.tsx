import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BACKEND_URL } from '../config';
import axios from 'axios';
import TextEditor from './TextEditor'; // Assuming you have a TextEditor component
import { Appbar } from '../components/Appbar';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UpdateBlog = () => {
    const { id } = useParams<{ id: string }>();
    const [formData, setFormData] = useState({
        title: '',
        content: '',
    });
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/v1/blog/${id}`, {
            headers: {
                Authorization: localStorage.getItem("token") || ''
            }
        })
        .then(response => {
            const { title, content } = response.data.result;
            setFormData({ title, content });
        })
        .catch(error => {
            console.error('Error fetching blog data:', error);
        });
    }, [id]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleContentChange = (content: string) => {
        setFormData({
            ...formData,
            content,
        });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await axios.put(`${BACKEND_URL}/api/v1/blog/${id}`, formData, {
                headers: {
                    Authorization: localStorage.getItem("token") || ''
                }
            });
            toast.success("🚀 Blog Updated Successfully!", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            navigate(`/blogs/`);
        } catch (error) {
            console.error('Error updating blog:', error);
        }
    };

    return (
        <div>
            <Appbar />
            <div className="flex justify-center w-full min-h-screen pt-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"> 
                <div className="max-w-screen-lg w-full bg-white rounded-lg shadow-lg p-6 overflow-y-auto">
                    <h2 className="text-2xl font-semibold mb-4">Update Blog</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="title" className="block text-gray-700 font-medium mb-1">Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="content" className="block text-gray-700 font-medium mb-1">Content</label>
                            <TextEditor
                                content={formData.content}
                                onContentChange={handleContentChange}
                            />
                        </div>
                        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md">Update Blog</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UpdateBlog;
