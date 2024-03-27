import { useEffect, useState } from "react"
import axios from "axios";
import { BACKEND_URL } from "../config";


export const useBlog = ({ id }: { id: string }) => {
    const [loading, setLoading] = useState(true);
    const [blog, setBlog] = useState();

    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/v1/blog/${id}`, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
            .then(response => {
                setBlog(response.data.result);
                setLoading(false);
            })
    }, [id])

    return {
        loading,
        blog
    }

}

export const useBlogs = (page,pageSize) => {
    const [loading, setLoading] = useState(true);
    const [blogs, setBlogs] = useState([]); 
    const [totalPages, setTotalPages] = useState(1);
    useEffect(() => {
        setLoading(true); // Set loading to true when fetching new data
        axios.get(`${BACKEND_URL}/api/v1/blog/bulk?page=${page}&pageSize=${pageSize}`)
            .then(response => {
                setBlogs(response.data.result)                
                setTotalPages(Math.ceil(response.data.totalBlogs / pageSize));
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching blogs:', error);
                setLoading(false); // Set loading to false even if there's an error
            });
    }, [page, pageSize]);

    return {
        loading,
        blogs,
        totalPages
    }
}

export const useMyBlog = ({ id }: { id: string }) => {
    const [loading, setLoading] = useState(true);
    const [blogs, setBlogs] = useState([{
        
    }]);

    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/v1/blog/user/${id}`, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
            .then(response => {
                setBlogs(response.data.result);                
                setLoading(false);
            })
    }, [id])

    return {
        loading,
        blogs
    }
}