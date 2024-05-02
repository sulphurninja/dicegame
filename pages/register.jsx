import React, { useContext, useState, useEffect } from 'react';
import { DM_Sans } from 'next/font/google';
import { useForm } from 'react-hook-form';
import { DataContext } from '../store/GlobalState';
import { useRouter } from 'next/router';
import { postData } from '../utils/fetchData';
import { toast } from 'sonner';
import { Toaster } from '../components/ui/sonner';

const inter = DM_Sans({ subsets: ['latin'] });

export default function Register() {
    const initialState = { userName: '', password: '', name: '', referralCode: '' }
    const [userData, setUserData] = useState(initialState)
    const { userName, password, name, referralCode } = userData
    const { state, dispatch } = useContext(DataContext)
    const [showModal, setShowModal] = useState(false)
    const router = useRouter();

    useEffect(() => {
        // Extract referral code from URL query parameters
        const { referralCode } = router.query;
        if (referralCode) {
            setUserData(prevState => ({
                ...prevState,
                referralCode: referralCode
            }));
        }
    }, [router.query]);

    const handleChangeInput = e => {
        const { name, value } = e.target
        setUserData({ ...userData, [name]: value })
    }
    const handleSubmit = async e => {
        e.preventDefault()

        const res = await postData('auth/register', userData)
        if (res.msg === 'Successful Registration!') {
            toast("Registration Successful")
            router.push('/login')
            // console.log('JSON files generated successfully.');
        } else if (res.err === 'Username already exists!') {
            toast.error('Username already exists');
        } else if (res.err) {
            toast.error('An error occurred. Please try again later.');
        }
        console.log(res)
    }
    return (
        <main className={`min-h-screen bg-[#102815] wow ${inter.className}`}>
            <header className='top-0 left-0 right-0 py-4 px-4 bg-transparent backdrop-blur-sm z-[100] flex items-center text-center border-b-[1px] border-[#4543A9]  justify-center'>
                <h1 className={`text-white text-lg md:text-2xl text-center ${inter.className}`}>गुडगुडी - Register 🎲</h1>
            </header>
            <div className="container bg-primary shadow-white/60  shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-xl mx-auto p-6 md:w-1/2 w-10/12 text-black mt-8">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <h1 className='text-center text-2xl text-white font-bold'>Register</h1>
                        <p className='text-md text-center text-white'>Welcome!</p>
                    </div>

                    <div className="flex flex-col text-white">
                        <label className="">Name</label>
                        <input type="text" value={name} name="name" id="name" onChange={handleChangeInput} className="border rounded-md px-4 p-1 text-black  " />
                    </div>
                    <div className="flex flex-col text-white">
                        <label className="">Username</label>
                        <input type="text" value={userName} name="userName" id="userName" onChange={handleChangeInput}
                            placeholder="Username" className="border rounded-md px-4 p-1 text-black  " />
                    </div>
                    <div className="flex flex-col text-white">
                        <label className="">Password</label>
                        <input type="password" name='password' id="password" value={password} onChange={handleChangeInput} placeholder='******' className="border rounded-md p-1 px-4 text-black " />
                    </div>

                    <div className="flex flex-col text-white">
                        <label className="">Referral Code (if any)</label>
                        <input type="text" name='referralCode' id="referralCode" value={referralCode} onChange={handleChangeInput} placeholder='Enter referral code here' className="border rounded-md p-1 px-4 text-black " />
                    </div>

                    <div className='flex justify-center '>
                        <button type="submit" className="bg-white/90 hover:bg-green-200  md:w-1/2 w-10/12 mt-4 rounded-md text-black p-2">Register</button>
                    </div>
                    <p className='text-white'>Already an User ?
                        <a href='/login' className='text-green-200 cursor-pointer'> Login Now!</a>
                    </p>
                </form>
                <Toaster />
            </div>
        </main>
    );
}
