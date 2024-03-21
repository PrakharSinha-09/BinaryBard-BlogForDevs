import axios from 'axios'
import {useState,useEffect} from 'react'
import { BACKEND_URL } from '../config'
import { BlogCard } from '../components/BlogCard'
import { Appbar } from '../components/Appbar'
import { useBlogs } from '../hooks'
import { Skeleton } from '../components/Skeleton'

const Blogs = () => {
    const {loading,blogs}=useBlogs()
        console.log(blogs);
        
        if (loading) {
            return <div>
                <Appbar /> 
                <div  className="flex justify-center">
                    <div>
                        <Skeleton />
                        <Skeleton />
                        <Skeleton />
                        <Skeleton />
                        <Skeleton />
                        <Skeleton />
                        <Skeleton />
                    </div>
                </div>
            </div>
        }
    
    
  return (
    <div>
        <Appbar />
        <div className='flex justify-center'>
            <div>
            {
                blogs.map((blog)=>(
                    <BlogCard
                    key={blog.id}
                    authorName={blog.author.name || "Anonymous"}
                    title={blog.title}
                    content={blog.content}
                    publishedDate={blog.createdAt}
                    id={blog.id}
                    />
                ))
            }

            </div>
        </div>
    </div>
  )
}

export default Blogs