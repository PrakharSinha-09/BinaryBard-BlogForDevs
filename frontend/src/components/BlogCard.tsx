import { Link, useNavigate } from "react-router-dom"
import { BACKEND_URL } from "../config";
import axios from "axios";

interface BlogCardProps{
    authorName:string,
    title:string,
    content:string,
    publishedDate: string,
    id:string,
    personalView:boolean,
}

export const BlogCard=({
        authorName,
        title,
        content,
        publishedDate,
        id,
        personalView,
    }:BlogCardProps)=>{

        const navigate=useNavigate()
        const createdAt = new Date(publishedDate);
        const formattedDate = `${createdAt.getDate()} ${createdAt.toLocaleString('default', { month: 'long' })} ${createdAt.getFullYear()} ${createdAt.toLocaleTimeString()}`;

        const handleEditClick = () => {
            window.location.href = `/update-blog/${id}`;
        };

        const handleDelete=()=>{
            axios.delete(`${BACKEND_URL}/api/v1/blog/${id}`, {
                headers: {
                    Authorization: localStorage.getItem("token")
                }
            })
            .then(response => {
                alert('Blog Deleted Successfully!')
                navigate('/blogs')
            })
            .catch(error => {
                console.error('Error deleting blog:', error);
            });
        }
    
        return (
            <div className="p-4 border-b border-slate-200 pb-4 w-screen max-w-screen-md cursor-pointer relative">
                <Link to={`/blog/${id}`}>
                    <div className="flex">
                        <Avatar name={authorName} />
                        <div className="font-bold pl-2 text-md flex justify-center flex-col">{authorName}</div>
                        <div className="pl-2 flex justify-center flex-col">
                            <Circle />
                        </div>
                        <div className="pl-2 font-semibold text-sm flex justify-center flex-col text-red-700">
                           Published On {formattedDate}
                        </div>
                    </div>
                    <div className="text-xl font-semibold pt-2">
                        {title}
                    </div>
                    <div className="text-md font-thin">
                        {content.slice(0, 100) + "..."}
                    </div>
                    <div className="text-sm font-semibold pt-4 text-green-800">
                        {`${Math.ceil(content.length / 100)} minute(s) read`}
                    </div>
                </Link>
                {personalView && (
                <div className="absolute bottom-2 right-2">
                    <button onClick={handleEditClick} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2 sm:py-2 sm:px-4">Edit Blog</button>
                    <button onClick={handleDelete} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded sm:py-2 sm:px-4">Delete Blog</button>
                </div>
            )}
            </div>
        );
}

export function Circle() {
    return <div className="h-1 w-1 rounded-full bg-slate-500">

    </div>
}

export function Avatar({name}:{name :string}){
    
    return (
        <div className="relative inline-flex items-center justify-center w-7 h- overflow-hidden bg-gray-300 rounded-full">
            <span className="font-semibold text-xl">{name[0]}</span>
        </div>
    )
}