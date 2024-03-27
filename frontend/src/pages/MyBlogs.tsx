import { useEffect, useState } from 'react';
import { motion } from 'framer-motion'; // Import motion from Framer Motion
import { BlogCard } from '../components/BlogCard';
import { Appbar } from '../components/Appbar';
import { useMyBlog } from '../hooks';
import { Skeleton } from '../components/Skeleton';
import { Link, useNavigate, useParams } from 'react-router-dom';

interface Blog {
    id: string;
    author: {
      name: string;
    };
    title: string;
    content: string;
    createdAt: string;
  }

const Blogs = () => {
    const { id } = useParams();
    const { loading, blogs } = useMyBlog({ id: id || "" });

    const navigate=useNavigate()
    const token=localStorage.getItem('token')
    if(!token){
        navigate('/signup')
    }
    // State to track the scroll position
    const [scrollProgress, setScrollProgress] = useState(0);

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

    useEffect(() => {
        console.log('blogs update');
    }, [blogs]);

    if (loading) {
        return (
            <div>
                <Appbar />
                <motion.div // Use motion.div for Framer Motion animation
                    initial={{ width: 0 }} // Initial width of the progress bar
                    animate={{ width: scrollProgress + '%' }} // Animation to make it progress based on scroll
                    transition={{ duration: 0.1 }} // Animation duration
                    className="bg-red-500 h-2 fixed top-0 left-0 z-50" // Styling for the progress bar
                />
                <div className="flex justify-center bg-gradient-to-r from-indigo-500 ...">
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
        );
    }

    if (!blogs) {
        return (
            <>
                <Appbar />
                <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-indigo-500 ...">
                    <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">No Blogs Found! ☹️</h1>
                    <p className="text-lg text-gray-600">Looks like, you haven't written any blogs!
                        <Link className='italic font-semibold text-blue-600' to={`/publish`}>
                            Click Here To Start Your Writing Journey!
                        </Link>
                    </p>
                </div>
            </>
        );
    }

    return (
        <div>
            <Appbar />
            <motion.div 
                initial={{ width: 0 }}
                animate={{ width: scrollProgress + '%' }}
                transition={{ duration: 0.1 }}
                className="bg-red-500 h-2 fixed top-0 left-0 z-50"
            />
            <div className='flex justify-center bg-gradient-to-r from-indigo-500 ... '>
                <div>
                    {blogs.map((blog: Blog) => (
                        <BlogCard
                            key={blog.id}
                            authorName={blog.author.name || "Anonymous"}
                            title={blog.title}
                            content={blog.content}
                            publishedDate={blog.createdAt}
                            id={blog.id}
                            personalView={true}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Blogs;
