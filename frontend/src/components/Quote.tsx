import { FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa';

const Quote = () => {
  return (
    <div className='bg-gradient-to-r from-gray-500 to-gray-300 ... h-screen flex justify-center flex-col'>
        <div className="flex justify-center">
            <div className="max-w-lg">
                <div className="text-3xl font-bold">
                    "If your perspective to look at the world and describe things in general doesn't change, you are probably doing something wrong, Computer Science is much beyond what you think."
                </div>
                <div className="max-w-md text-xl font-semibold text-left mt-4">
                        <span>~ Prakhar Sinha </span>
                        <span className="inline-block ml-2">
                            <a href="https://twitter.com/i_M_Prakhar09" target="_blank" rel="noopener noreferrer">
                                <FaTwitter className="text-blue-500 hover:text-blue-700 cursor-pointer" />
                            </a>
                        </span>
                        <span className="inline-block ml-2">
                            <a href="https://www.linkedin.com/in/prakhar-sinha-a81672213/" target="_blank" rel="noopener noreferrer">
                                <FaLinkedin className="text-blue-500 hover:text-blue-700 cursor-pointer" />
                            </a>
                        </span>
                        <span className="inline-block ml-2">
                            <a href="https://github.com/PrakharSinha-09" target="_blank" rel="noopener noreferrer">
                                <FaGithub className="text-blue-500 hover:text-blue-700 cursor-pointer" />
                            </a>
                        </span>
                    </div>
            
            </div>
        </div>
    </div>
  )
}

export default Quote