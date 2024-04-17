import React, { useContext } from 'react';
import { FiHome, FiCheckSquare, FiBookOpen, FiTrendingUp, FiMessageSquare, FiHelpCircle, FiUsers, FiSettings } from 'react-icons/fi';
import { IoIosNotifications } from "react-icons/io";
import Link from 'next/link'
import Navbar from '../components/globals/Navbar'
import { DataContext } from '../store/GlobalState';
import { MdCancel } from "react-icons/md";
import Cookie from 'js-cookie'

export default function Admin() {
    const { state, dispatch } = useContext(DataContext);
    const { auth } = state;
    const handleLogout = () => {
        Cookie.remove('refreshtoken', { path: '/api/auth/refreshToken' })
        localStorage.removeItem('firstLogin')
        dispatch({ type: 'AUTH', payload: {} })
        window.location.href = '/';
    }
    if (!auth || !auth.user || auth.user.role !== 'admin') {
        return <div className="min-h-screen flex items-center text-xl justify-center font-bold text-red-500">
            <MdCancel className='text-xl' /> Not authorized, Contact Admin!
        </div>;
    }


    return (
        <>
            {/* <Navbar/> */}
            <div className="flex min-h-screen text-center bg-gray-100" >
                <aside className="w-16 md:w-20 lg:w-24 bg-[#1D1817] text-white" >
                    <nav className="flex flex-col items-center">
                        <div className="py-4">
                            <button className="text-2xl  text-gray-300 hover:text-[#F56565] transition duration-300 ease-in-out">
                                <FiHome className="lg:ml-1" />
                                <span className="hidden text-sm font-bold text-center md:inline">Home</span>
                            </button>
                        </div>
                        <div className="py-4">
                            <Link href='/Users'>
                                <button className="text-2xl text-gray-300 hover:text-[#F56565] transition duration-300 ease-in-out">
                                    <FiUsers className="lg:ml-1" />
                                    <span className="hidden text-sm text-center font-bold md:inline">Users</span>
                                </button>
                            </Link>
                        </div>
                        <div className="py-4">
                        <Link href='/Requests'>
                            <button className="text-2xl text-gray-300 hover:text-[#F56565] transition duration-300 ease-in-out">
                                <IoIosNotifications className="lg:ml-3" />
                                <span className="hidden text-xs font-bold text-center md:inline">Requests</span>
                            </button>
                            </Link>
                        </div>
                        <div className="py-4">
                            <button className="text-2xl text-gray-300 hover:text-[#F56565] transition duration-300 ease-in-out">
                                <FiCheckSquare className="lg:ml-3" />
                                <span className="hidden text-center text-sm font-bold md:inline">Results</span>
                            </button>
                        </div>
                        <div className="py-4">
                            <button className="text-2xl text-gray-300 hover:text-[#F56565] transition duration-300 ease-in-out">
                                <FiSettings className="lg:ml-4" />
                                <span className="hidden text-sm font-bold md:inline">Settings</span>
                            </button>
                        </div>
                        {/* <div className="py-4">
                            <Link href='/Attendance'>
                                <button className="text-2xl text-gray-300 hover:text-[#F56565] transition duration-300 ease-in-out">
                                    <FiCalendar className="lg:ml-4" />
                                    <span className="hidden text-sm font-bold md:inline">Calendar</span>
                                </button>
                            </Link>
                        </div> */}
                        <div className="py-4">
                            <button className="text-2xl text-gray-300 hover:text-[#F56565] transition duration-300 ease-in-out">
                                <FiHelpCircle className="lg:ml-1" />
                                <span className="hidden text-sm font-bold md:inline">Help</span>
                            </button>
                        </div>

                    </nav>
                </aside >

                <main className="flex-1   bg-neutral-300  p-6">
                    <header className="flex items-center justify-between mb-6">
                        <div className='w-[15%]  h-[10%]'>
                            {/* <h1 className='font-bold'>Dice - Admin</h1> */}
                            <img src='/dice.gif' className='h-8' />

                        </div>

                        <h1 className="text-lg font-bold text-black font-sans">Hello Admin!</h1>

                        <button
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-2 rounded"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </header>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                        {/* Task Card */}
                        <Link href='/Users'>
                            <div className="p-4 bg-[#1D1817] rounded-md hover:bg-[#C53131] cursor-pointer transition duration-300 ease-in-out">
                                <FiCheckSquare className="absolute" />
                                <h2 className="text-lg font-bold font-sans text-[#FEFEFF] mb-2">Users </h2>
                                <p className="text-[#D7D3D0] font-sans">Your Users appear here</p>
                            </div>
                        </Link>
                        {/* Tutorial Card */}
                        <Link href='/Requests'>
                            <div className="p-4 bg-[#1D1817] rounded-md hover:bg-[#C53131] cursor-pointer transition duration-300 ease-in-out">
                                <FiBookOpen className="absolute" />
                                <h2 className="text-lg font-bold font-sans text-[#FEFEFF] mb-2">Requests</h2>
                                <p className="text-[#D7D3D0] font-sans">Balance Requests</p>
                            </div>
                        </Link>
                        {/* Progress Card */}
                        <Link href='/Update'>
                            <div className="p-4 bg-[#1D1817] rounded-md hover:bg-[#C53131] cursor-pointer transition duration-300 ease-in-out">
                                <FiTrendingUp className="absolute" />
                                <h2 className="text-lg font-bold font-sans text-[#FEFEFF] mb-2">Update Winning Numbers</h2>
                                <p className="text-[#D7D3D0] font-sans">Update Results</p>
                            </div>
                        </Link>
                        {/* Discussion Card */}
                        <Link href='/settings'>
                            <div className="p-4 bg-[#1D1817] rounded-md hover:bg-[#C53131] cursor-pointer transition duration-300 ease-in-out">
                                <FiMessageSquare className="absolute" />
                                <h2 className="text-lg font-bold font-sans text-[#FEFEFF] mb-2">Settings</h2>
                                <p className="text-[#D7D3D0] font-sans">Update Account settings</p>
                            </div>
                        </Link>
                        {/* <Link href='/Attendance'>
                            <div className="p-4 bg-[#1D1817] rounded-md hover:bg-[#C53131] cursor-pointer transition duration-300 ease-in-out">
                                <FiCalendar className="absolute" />
                                <h2 className="text-lg font-bold font-sans text-[#FEFEFF] mb-2">Attendance</h2>
                                <p className="text-[#D7D3D0] font-sans">Track your attendance</p>
                            </div>
                        </Link> */}
                        {/* Help Card */}
                        <Link href='/help'>
                            <div className="p-4 bg-[#1D1817] rounded-md hover:bg-[#C53131] cursor-pointer transition duration-300 ease-in-out">
                                <FiHelpCircle className="absolute" />
                                <h2 className="text-lg font-bold font-sans text-[#FEFEFF] mb-2">Help</h2>
                                <p className="text-[#D7D3D0] font-sans">Support & Guidance</p>
                            </div>
                        </Link>

                    </div>
                    <footer className='mt-12'>

                        <h1 className='text-black font- mt-10 lg:mt-24'>  COPYRIGHT © GUDI GUDI | DESIGNED BY VIRATCS IT. ALL RIGHTS RESERVED</h1>

                    </footer>

                </main>
            </div>
        </>
    );
}
