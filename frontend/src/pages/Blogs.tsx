import axios from 'axios';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion'; // Import motion from Framer Motion
import { BACKEND_URL } from '../config';
import { BlogCard } from '../components/BlogCard';
import { Appbar } from '../components/Appbar';
import { useBlogs } from '../hooks';
import { Skeleton } from '../components/Skeleton';
import { useNavigate } from 'react-router-dom';

const Blogs = () => {
    const { loading, blogs } = useBlogs();
    console.log(blogs);

    // State to track the scroll position
    const [scrollProgress, setScrollProgress] = useState(0);
    const navigate=useNavigate()

    const token=localStorage.getItem('token')
    if(!token){
        navigate('/signup')
    }

    useEffect(() => {
        // Event listener to track scroll position
        const handleScroll = () => {
            const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
            const scrollTop = window.scrollY;
            const progress = (scrollTop / scrollTotal) * 100;
            setScrollProgress(progress);
        };

        window.addEventListener('scroll', handleScroll);

        // Cleanup
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div>
            <Appbar />
            <motion.div // Use motion.div for Framer Motion animation
                initial={{ width: 0 }} // Initial width of the progress bar
                animate={{ width: scrollProgress + '%' }} // Animation to make it progress based on scroll
                transition={{ duration: 0.1 }} // Animation duration
                className="bg-red-500 h-2 fixed top-0 left-0 z-50" // Styling for the progress bar
            />
            <div className='flex justify-center bg-gradient-to-r from-indigo-500 ...'>
                <div>
                    {loading ? (
                        <div>
                            <Skeleton />
                            <Skeleton />
                            <Skeleton />
                            <Skeleton />
                            <Skeleton />
                            <Skeleton />
                            <Skeleton />
                        </div>
                    ) : (
                        blogs.map((blog) => (
                            <BlogCard
                                key={blog.id}
                                authorName={blog.author.name || "Anonymous"}
                                title={blog.title}
                                content={blog.content}
                                publishedDate={blog.createdAt}
                                id={blog.id}
                                personalView={false}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Blogs;
