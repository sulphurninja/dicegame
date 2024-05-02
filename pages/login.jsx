import React, { useContext, useState } from 'react';
import { DM_Sans } from 'next/font/google';
import { DataContext } from "../store/GlobalState";
import { postData } from "../utils/fetchData";
import Cookie from "js-cookie";
import { useRouter } from "next/router";
import { Toaster } from '../components/ui/sonner';
import { toast } from 'sonner';


const inter = DM_Sans({ subsets: ['latin'] });

export default function Login() {
    const initialState = { userName: "", password: "" };
    const [userData, setUserData] = useState(initialState);
    const [error, setError] = useState(false);
    const { userName, password } = userData;
    const { state = {}, dispatch } = useContext(DataContext);
    const { auth = {} } = state;
    const router = useRouter();

    const handleChangeInput = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };


    const handleSubmit = async e => {
        e.preventDefault()

        const res = await postData('auth/login', userData)

        if (res.error) {
            window.location.reload();
            return;
        }

        dispatch({
            type: 'AUTH', payload: {
                token: res.access_token,
                user: res.user
            }
        })

        Cookie.set('refreshtoken', res.refresh_token, {
            path: '/api/auth/accessToken',
            expires: 7
        })

        localStorage.setItem('firstLogin', true)
        // check if user has admin privileges
        if (res.user && res.user.role === 'admin') {
            router.push("/admin"); // Redirect to admin page
            toast("🙏 Welcome Admin!");
        } else if (res.user && res.user.role === 'user') {
            router.push("/home"); // Redirect to home page or any other page
            toast("🙏 Welcome", { userName });
        } else if(res.err === 'Your account has been deactivated. Please contact support for assistance.') {
           
            toast.error("Your account has been deactivated. Please contact support for assistance");
        }
    }

    const [isChecked, setChecked] = useState(true);

    const handleCheckboxChange = () => {
        setChecked(!isChecked);
    };
    return (
        <main className={`min-h-screen bg-[#102815] wow ${inter.className}`}>
            <header className='top-0 left-0 right-0 py-4 px-4 bg-transparent backdrop-blur-sm z-[100] flex items-center text-center border-b-[1px] border-[#4543A9]  justify-center'>
                <h1 className={`text-white text-lg md:text-2xl text-center ${inter.className}`}>गुडगुडी - Login 🎲</h1>
            </header>
            <div className="container bg-primary shadow-white/60  shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-xl mx-auto p-6 md:w-1/2 w-10/12 text-black mt-8">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <h1 className='text-center text-2xl text-white font-bold'>Login</h1>
                        <p className='text-md text-center text-white'>Welcome Back!</p>
                    </div>

                    <div className="flex flex-col text-white">
                        <label className="">Username</label>
                        <input type="text" id="username"
                            name="userName"
                            value={userName}
                            onChange={handleChangeInput}
                            className="border rounded-md px-4 p-1 text-black  " />

                    </div>
                    <div className="flex flex-col text-white">
                        <label className="">Password</label>
                        <input type="password" id="password"
                            name="password"
                            value={password}
                            onChange={handleChangeInput}
                            placeholder='******' className="border rounded-md p-1 px-4 text-black " />
                    </div>

                    <div className='flex justify-center '>
                        <button type="submit" className="bg-white/90 md:w-1/2 w-10/12 mt-4 rounded-md text-black p-2">Submit</button>
                    </div>
                    <p className='text-white'>Not an User ?
                        <a href='/register' className='text-green-200 cursor-pointer'> Register Now!</a>
                    </p>
                </form>
                <Toaster />

            </div>
        </main>
    );
}
