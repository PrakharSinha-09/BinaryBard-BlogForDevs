import { useContext, useEffect, useState, useRef } from "react";
import { Avatar } from "./BlogCard";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { UserContext } from "../contexts/UserContext";
import logoImage from "../assets/photo1.png";

export const Appbar = () => {
    const { userInfo, setUserInfo } = useContext(UserContext);
    const [showDropdown, setShowDropdown] = useState(false);
    const [userDataFetched, setUserDataFetched] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!userDataFetched) {
            userData();
        }
    }, [userDataFetched]);

    useEffect(() => {
        const closeDropdown = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener("click", closeDropdown);

        return () => {
            document.removeEventListener("click", closeDropdown);
        };
    }, []);

    const userData = async () => {
        const response = await axios.get(`${BACKEND_URL}/api/v1/user/userInfo`, {
            headers: {
                Authorization: localStorage.getItem('token')
            }
        });
        localStorage.setItem('user', JSON.stringify(response.data.user));

        console.log(response.data.user);

        setUserInfo({
            id: response.data.user.id,
            name: response.data.user.name,
            email: response.data.user.email,
            bio: response.data.user.bio,
            twitter: response.data.user.twitter,
            linkedin: response.data.user.linkedin,
            github: response.data.user.github
        });
        setUserDataFetched(true);
    };

    const handleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/signup');
    };

    return (
        <div className="border-b flex justify-between px-10 py-4">
            <Link to={'/blogs'} className="flex flex-col justify-center cursor-pointer">
                <img src={logoImage} alt="Logo" className="h-12 w-16" />
            </Link>
            <div className="relative">
                <Link to={`/publish`}>
                    <button type="button" className="mr-4 text-white bg-green-700 hover:bg-green-800 focus:outline-none font-medium rounded-full text-sm px-5 py-1.5 text-center me-2 mb-2 ">New</button>
                </Link>

                <div className="relative inline-block text-left" ref={dropdownRef}>
                    <div>
                        <button onClick={handleDropdown}>
                            <Avatar name={`${userInfo?.name || "Anonymous"}` } />
                        </button>
                    </div>
                    {showDropdown && (
                        <div className="origin-top-right absolute right-0 mt-2 w-48 z-10 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                            <div className="py-1" role="none">
                                <Link to="/profile" className="block px-4 py-2 text-xl font-bold text-gray-700 hover:bg-gray-100 hover:text-gray-900 font-dancing " role="menuitem">Profile</Link>

                                <Link to={`/myblogs/${userInfo.id}`} className="font-bold font-dancing block px-4 py-2 text-xl text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem">My Blogs</Link>

                                <button onClick={handleLogout} className="font-bold font-dancing block w-full text-left px-4 py-2 text-xl text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem">Logout</button>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};
