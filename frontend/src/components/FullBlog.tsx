import { useEffect, useState } from 'react';
import { motion } from 'framer-motion'; // Import motion from Framer Motion
import { Appbar } from "./Appbar";
import { Avatar } from "./BlogCard";
import { FaLinkedin, FaTwitter, FaGithub } from 'react-icons/fa';

export const FullBlog = ({ blog }) => {
    const createdAt = new Date(blog.createdAt);
    // Formatting the date
    const formattedDate = `${createdAt.getDate()} ${createdAt.toLocaleString('default', { month: 'long' })} ${createdAt.getFullYear()} ${createdAt.toLocaleTimeString()}`;

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

    return (
        <div>
            <Appbar />
            <motion.div 
                initial={{ width: 0 }} 
                animate={{ width: scrollProgress + '%' }}
                transition={{ duration: 0.1 }}
                className="bg-red-500 h-2 fixed top-0 left-0 z-50"
            />
            <div className="flex justify-center md:h-screen bg-gradient-to-r from-gray-300 ...">
                <div className="grid grid-cols-12 px-4 md:px-10 w-full max-w-screen-xl pt-12">
                    <div className="col-span-12 md:col-span-8">
                        <div className="text-5xl font-extrabold break-words">
                            {blog.title}
                        </div>
                        <div className="text-slate-500 pt-2">
                            Post on {formattedDate}
                        </div>
                        <div className="pt-4">
                            {blog.content}
                        </div>
                    </div>
                    <div className="col-span-12 md:col-span-4 mt-8 md:mt-0 ml-10">
                        <div className="text-slate-600 text-lg">
                            Author Info
                        </div>
                        <div className="flex w-full">
                            <div className="pr-4 flex flex-col justify-center">
                                <Avatar name={blog.author.name || "Anonymous"} />
                            </div>
                            <div>
                                <div className="text-xl font-bold">
                                    {blog.author.name || "Anonymous"}
                                </div>
                                <div className="pt-2 text-slate-500">
                                    {blog.author.bio || "Hey There!👋"}
                                    <div className="flex pt-2">
                                        {blog.author.linkedin && (
                                            <a href={blog.author.linkedin} target="_blank" rel="noopener noreferrer" className="mr-2 text-blue-600 hover:text-blue-800">
                                                <FaLinkedin className="mr-2" />
                                            </a>
                                        )}
                                        {blog.author.twitter && (
                                            <a href={blog.author.twitter} target="_blank" rel="noopener noreferrer" className="mr-2 text-blue-600 hover:text-blue-800">
                                                <FaTwitter className="mr-2" />
                                            </a>
                                        )}
                                        {blog.author.github && (
                                            <a href={blog.author.github} target="_blank" rel="noopener noreferrer" className="mr-2 text-blue-600 hover:text-blue-800">
                                                <FaGithub className="mr-2" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
