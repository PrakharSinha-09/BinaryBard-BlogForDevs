import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BlogCard } from '../components/BlogCard';
import { Appbar } from '../components/Appbar';
import { useBlogs } from '../hooks';
import { Skeleton } from '../components/Skeleton';
import { useNavigate } from 'react-router-dom';

const Blogs = () => {
    const navigate=useNavigate()
    const [page, setPage] = useState(1); // State to track current page
    const { loading, blogs,totalPages } = useBlogs(page,10);
    console.log(totalPages);
    
    // State to track the scroll position
    const [scrollProgress, setScrollProgress] = useState(0);

    const token=localStorage.getItem('token')
    if(!token){
        navigate('/signup')
    }

    // Function to handle next page
    const nextPage = () => {
        setPage(page + 1);   
        window.scrollTo({ top: 0, behavior: 'smooth' });     
    };

    // Function to handle previous page
    const prevPage = () => {
        if (page > 1) {
            setPage(page - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

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
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: scrollProgress + '%' }}
                transition={{ duration: 0.1 }}
                className="bg-red-500 h-2 fixed top-0 left-0 z-50"
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
            {/* Pagination buttons */}
            <div className="flex justify-center mt-4">
                <button onClick={prevPage} className="bg-gray-300 mb-2 font-semibold hover:bg-gray-400 text-gray-700 px-4 py-2 mr-2 rounded-md focus:outline-none" disabled={page === 1}>
                    Previous
                </button>
                <span className="text-gray-700">
                    Page {page} of {totalPages}
                </span>
                <button onClick={nextPage} className="bg-gray-300 mb-2 font-semibold hover:bg-gray-400 text-gray-700 px-4 py-2 ml-2 rounded-md focus:outline-none" disabled={page === totalPages}>
                    Next
                </button>
            </div>

        </div>
    );
};

export default Blogs;
