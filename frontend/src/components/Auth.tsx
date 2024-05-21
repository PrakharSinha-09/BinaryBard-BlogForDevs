import { SignupInput } from "@prakharsinha09/icoders-blog-commons"
import axios from "axios";
import { ChangeEvent, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { BACKEND_URL } from "../config";
import { Spinner } from "./Spinner";
import logoImage from "../assets/photo1.png"; // Import the logo image

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Auth = ({type}:{type:"signup" | "signin"}) => {
    const navigate = useNavigate();

    const [signupInput,setSignupInput]=useState<SignupInput>({
        name:"",
        email:"",
        password:"",
        bio:"",
        twitter:"",
        linkedin:"",
        github:"",
    })

    const [isLoading, setIsLoading] = useState(false);
    const [buttonDisabled,setButtonDisabled]=useState(false)
      
    async function sendRequest() {
        setIsLoading(true);
        setButtonDisabled(true)
        try {
            const response = await axios.post(`${BACKEND_URL}/api/v1/user/${type === "signup" ? "signup" : "signin"}`, signupInput);
            if(type==='signin')
            {
                const token=response.data.token
                localStorage.setItem('token',token) 
                toast.success('🚀 Login Successful!', {
                    position: "bottom-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    
                    });    
                       
                navigate('/blogs')
            }
            else{
                toast.success('🚀 Signup Successful!', {
                    position: "bottom-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    });
                navigate("/signin");
            }
        } catch(e) {
            toast.error("error",{
                position: "bottom-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            })
        }
        setIsLoading(false);
        setButtonDisabled(false)
    }
  return (
      <div className="h-screen flex justify-center flex-col bg-gradient-to-r from-indigo-500 ...">
        <div className="flex justify-center">
            <div> 
            <img src={logoImage} alt="Logo" className="animate-bounce rounded-md mx-auto w-24 h-auto mb-4" />

                <div className="px-10">
                    <div className="text-3xl font-extrabold">
                        Create an account
                    </div>
                    <div className="text-slate-500">
                        {type === "signin" ? "Don't have an account?" : "Already have an account?" }
                        <Link className="pl-2 underline font-semibold" to={type === "signin" ? "/signup" : "/signin"}>
                            {type === "signin" ? "Sign up" : "Sign in"}
                        </Link>
                    </div>
                </div>
                <div className="">
                    {type === "signup" ? <LabelledInput label="Name" placeholder="Your Name" onChange={(e) => {
                        setSignupInput({
                            ...signupInput,
                            name: e.target.value
                        })
                    }} /> : null}
                    <LabelledInput type={"email"} label="Email" placeholder="xyz@email.com" onChange={(e) => {
                        setSignupInput({
                            ...signupInput,
                            email: e.target.value
                        })
                    }} />
                    <LabelledInput label="Password" type={"password"} placeholder="123456" onChange={(e) => {
                        setSignupInput({
                            ...signupInput,
                            password: e.target.value
                        })
                    }} />
                    {type === "signup" ? <LabelledInput label="Bio" placeholder="About You" onChange={(e) => {
                        setSignupInput({
                            ...signupInput,
                            bio: e.target.value
                        })
                    }} /> : null}
                    {type === "signup" ? <LabelledInput label="Twitter URL" placeholder="https://twitter.com/username" onChange={(e) => {
                        setSignupInput({
                            ...signupInput,
                            twitter: e.target.value
                        })
                    }} /> : null}
                    {type === "signup" ? <LabelledInput label="LinkedIn URL" placeholder="https://www.linkedin.com/in/username" onChange={(e) => {
                        setSignupInput({
                            ...signupInput,
                            linkedin: e.target.value
                        })
                    }} /> : null}
                    {type === "signup" ? <LabelledInput label="GitHub URL" placeholder="https://github.com/username" onChange={(e) => {
                        setSignupInput({
                            ...signupInput,
                            github: e.target.value
                        })
                    }} /> : null}
                    <button onClick={sendRequest} disabled={buttonDisabled} type="button" className="mt-8 w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">{isLoading? <Spinner /> : type === "signup" ? "Sign up" : "Sign in"}</button>
                    
                </div>
            </div>
        </div>
    </div>
  )
}

interface LabelledInputType {
    label: string;
    placeholder: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    type?: string;
}

function LabelledInput({ label, placeholder, onChange, type }: LabelledInputType) {
    const isRequired = label === "Email" || label === "Password"; // Check if the field is required
    return (
        <div>
            <label className="block mb-2 text-sm text-black font-semibold pt-4">
                {label}
                {isRequired && <span className="text-red-700"> *</span>}
            </label>
            <input
                onChange={onChange}
                type={type || "text"}
                id="first_name"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none block w-full p-2.5"
                placeholder={placeholder}
                required={isRequired} // Set required attribute based on field requirement
            />
        </div>
    );
}
