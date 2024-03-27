import { useState, useEffect,ChangeEvent, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BACKEND_URL } from '../config';
import axios from 'axios';

const UpdateBlog = () => {
    const { id } = useParams();
    const [blog, setBlog] = useState({});
    const [formData, setFormData] = useState({
        title: '',
        content: '',
    });
    const navigate=useNavigate()

    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/v1/blog/${id}`, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
        .then(response => {
            setBlog(response.data);
            setFormData({
                title: response.data.result.title,
                content: response.data.result.content,
            });
            
        })
        .catch(error => {
            console.error('Error fetching blog data:', error);
        });
    }, [id]);

    useEffect(() => {
    }, [blog]);
    
    useEffect(() => {
    }, [formData]);
    
    useEffect(() => {
    }, [formData.title]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Submit updated blog data to the server
        axios.put(`${BACKEND_URL}/api/v1/blog/${id}`, formData, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
        .then(() => {
            navigate(`/blogs/`)
        })
        .catch(error => {
            console.error('Error updating blog:', error);
        });
    };

    return (
        <div className="max-w-4xl mx-auto mt-8 p-4 bg-white shadow-md rounded-md">
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
                    <textarea
                        name="content"
                        value={formData.content}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
                        rows={6}
                    ></textarea>
                </div>
                <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md">Update Blog</button>
            </form>
        </div>
    );
};

export default UpdateBlog;
