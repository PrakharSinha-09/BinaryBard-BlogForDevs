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

export const useBlogs = () => {
    const [loading, setLoading] = useState(true);
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/v1/blog/bulk`)
            .then(response => {
                setBlogs(response.data.result);
                // console.log(response.data.result);
                
                setLoading(false);
            })
    }, [])

    return {
        loading,
        blogs
    }
}