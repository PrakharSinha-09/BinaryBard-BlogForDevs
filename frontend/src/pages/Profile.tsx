import { useEffect, useState} from "react";
import Modal from "react-modal";
import { BACKEND_URL } from "../config";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Appbar } from "../components/Appbar";
import { FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa';


export const Profile = () => {
    
    const [userInfo,setUserInfo]=useState({
        id: '',
        name: '',
        email: '',
        password:'',
        bio : '',
        twitter : '',
        linkedin: '',
        github: ''
    });   
   
    
    const [isModalOpen, setIsModalOpen] = useState(false);
   
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/api/v1/user/userInfo`,{
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                });
                setUserInfo({...response.data.user});
                // console.log(userInfo);
                
            } catch (error) {
                console.error("Error fetching user information:", error);
            }
        };

        fetchUserInfo();
    }, [])

    const handleClickEmail = () => {
        window.location.href = `mailto:${userInfo.email}`;
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserInfo({
          ...userInfo,
          [name]: value
        });
      };
    
    const handleSaveProfile = async () => {
        // Perform save logic here
        try {
            const response = await axios.post(`${BACKEND_URL}/api/v1/user/update`, {
                name:userInfo.name,
                email:userInfo.email,
                password:userInfo.password,
                twitter:userInfo.twitter,
                linkedin:userInfo.linkedin,
                github:userInfo.github,
                bio:userInfo.bio
            }, {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            });
            // Update local user info after successful update
            setUserInfo(response.data.user);
            navigate('/profile');
            window.location.reload();
            setIsModalOpen(false);
            
        } catch (error) {
            console.error("Error updating user information:", error);
        }
    };
    

    return (
        <>
            <Appbar />
            <div className={`flex flex-col items-center justify-center h-screen bg-gradient-to-r from-indigo-500 ... ${isModalOpen ? 'backdrop-blur-lg pointer-events-none' : ''}`}>
                <h2 className="text-2xl font-dancing font-bold mb-5">User Profile</h2>
                <div className="flex items-center justify-center mb-4">
                    {/* Profile Information */}
                    <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center mr-4">
                        {/* Avatar and Name */}
                        <div className="flex items-center justify-center bg-gray-200 w-24 h-24 rounded-full text-4xl text-gray-600 mb-4">
                            {userInfo?.name[0] || "A"}
                        </div>
                        {/* Name and Email */}
                        <div className="text-center">
                            <h2 className="text-lg font-semibold text-gray-800">Name : {userInfo?.name || "Anonymous"}</h2>
                            <p className="text-gray-600 cursor-pointer font-semibold" onClick={handleClickEmail}>Email : {userInfo.email}</p>
                            {/* Social Icons */}
                            <div className="flex justify-center mt-4">
                                {
                                    userInfo.twitter && (
                                    <a href={userInfo.twitter} target="_blank" rel="noopener noreferrer" className="mr-4">
                                        <FaTwitter className="text-blue-500 hover:text-blue-700 text-2xl" />
                                    </a>
                                    )
                                }
                                {
                                    userInfo.linkedin && (
                                    <a href={userInfo.linkedin} target="_blank" rel="noopener noreferrer" className="mr-4">
                                        <FaLinkedin className="text-blue-500 hover:text-blue-700 text-2xl" />
                                    </a>
                                    )
                                }
                                {
                                    userInfo.github && (
                                    <a href={userInfo.github} target="_blank" rel="noopener noreferrer">
                                        <FaGithub className="text-blue-500 hover:text-blue-700 text-2xl" />
                                    </a>

                                    )
                                }
                            </div>
                        </div>
                    </div>
                    {/* About Me */}
                    <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center ml-4 ">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">About Me</h2>
                        <p className="text-gray-600">{userInfo?.bio || "Hey There!"}</p>
                    </div>
                </div>
                {/* Update Profile Button */}
                {!isModalOpen && (
                    <button 
                        disabled={isModalOpen} 
                        onClick={handleOpenModal} 
                        className={`bg-${isModalOpen ? 'gray-300' : 'blue-500'} ${isModalOpen ? '' : 'hover:bg-blue-700'} text-white font-bold py-2 px-4 rounded`}
                    >
                        Update Profile
                    </button>
                )}
                {/* Modal for Updating Profile */}
                <Modal
                    isOpen={isModalOpen}
                    onRequestClose={handleCloseModal}
                    contentLabel="Update Profile Modal"
                    className="modal bg-gradient-to-r from-indigo-500 ..."
                    overlayClassName="overlay"
                    style={{
                        content: {
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            marginRight: '-50%',
                            border: 'none',
                            background: 'white',
                            borderRadius: '8px',
                            padding: '20px',
                            boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.1)',
                            maxWidth: '400px',
                            width: '100%',
                        }
                    }}
                >
                    <button onClick={handleCloseModal} className="absolute top-2 right-2 bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <div>
                        <h2 className="text-lg font-semibold mb-4">Update Profile</h2>
                        <form className="flex flex-col">
                            <label htmlFor="name" className="mb-2">Name:</label>
                            <input type="text" id="name" name="name" value={userInfo.name} onChange={handleChange} className="border rounded-md px-3 py-1 mb-4 max-w-md" />
                            <label htmlFor="email" className="mb-2">Email:</label>
                            <input type="email" id="email" name="email" value={userInfo.email} onChange={handleChange} className="border rounded-md px-3 py-1 mb-4 max-w-md" />
                            <label htmlFor="password" className="mb-2">Password:</label>
                            <input type="password" id="password" name="password" value={userInfo.password} onChange={handleChange} className="border rounded-md px-3 py-1 mb-4 max-w-md" />
                            <label htmlFor="twitter" className="mb-2">Twitter URL:</label>
                            <input type="text" id="twitter" name="twitter" value={userInfo.twitter} onChange={handleChange} className="border rounded-md px-3 py-1 mb-4 max-w-md" />
                            <label htmlFor="linkedin" className="mb-2">LinkedIn URL:</label>
                            <input type="text" id="linkedin" name="linkedin" value={userInfo.linkedin} onChange={handleChange} className="border rounded-md px-3 py-1 mb-4 max-w-md" />
                            <label htmlFor="github" className="mb-2">GitHub URL:</label>
                            <input type="text" id="github" name="github" value={userInfo.github} onChange={handleChange} className="border rounded-md px-3 py-1 mb-4 max-w-md" />
                            <label htmlFor="bio" className="mb-2">Bio</label>
                            <input type="text" id="bio" name="bio" value={userInfo.bio} onChange={handleChange} className="border rounded-md px-3 py-1 mb-4 max-w-md" />
    
                        </form>
                        <button onClick={handleSaveProfile} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Save</button>
                    </div>
                </Modal>
            </div>
        </>
    );
}    

