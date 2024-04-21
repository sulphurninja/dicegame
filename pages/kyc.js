import React, { useEffect, useState } from 'react'
import { FiHome, FiCheckSquare, FiBookOpen, FiTrendingUp, FiMessageSquare, FiHelpCircle, FiUsers, FiSettings, FiActivity, FiFile } from 'react-icons/fi';
import { IoIosNotifications } from "react-icons/io";
import Link from 'next/link'
import Navbar from '../components/globals/Navbar'
import { DataContext } from '../store/GlobalState';
import { MdCancel } from "react-icons/md";
import Cookie from 'js-cookie'
import axios from 'axios';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';
import { Button } from '../components/ui/button';

export default function kyc() {
    const [kyc, setKyc] = useState([])

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await axios.get('/api/getKyc');
                setKyc(response.data);
                console.log(kyc, 'kyc');
            } catch (error) {
                console.error('Error fetching kycs:', error);
            }
        };
        fetchRequests();
    }, []);


    const handleApproveKyc = async (id) => {
        try {
            await axios.post('/api/approveKyc', { id });
            // After successful approval, fetch KYC documents again to update the UI
            const response = await axios.get('/api/getKyc');
            setKyc(response.data);
        } catch (error) {
            console.error('Error approving KYC:', error.message);
        }
    };

    const handleRejectKyc = async (id) => {
        try {
            await axios.post('/api/rejectKyc', { id });
            // After successful rejection, fetch KYC documents again to update the UI
            const response = await axios.get('/api/getKyc');
            setKyc(response.data);
        } catch (error) {
            console.error('Error rejecting KYC:', error.message);
        }
    };


    return (
        <>
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
                            <Link href='/Withdrawals'>
                                <button className="text-2xl text-gray-300 hover:text-[#F56565] transition duration-300 ease-in-out">
                                    <FiActivity className="lg:ml-5" />
                                    <span className="hidden text-xs font-bold text-center md:inline">Withdrawals</span>
                                </button>
                            </Link>
                        </div>
                        <div className="py-4">
                            <Link href='/kyc'>
                                <button className="text-2xl text-gray-300 hover:text-[#F56565] transition duration-300 ease-in-out">
                                    <FiFile className="lg:ml-2" />
                                    <span className="hidden text-xs font-bold text-center md:inline">KYC</span>
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

                        >
                            Logout
                        </button>
                    </header>
                    <Accordion type="single" collapsible className="w-full">
                        {kyc.map((kycDoc, index) => (
                            <AccordionItem key={index} value={`kycDoc-${index}`}>
                                <AccordionTrigger>
                                    <h1 className='' key={kycDoc._id}>{kycDoc.userName}</h1>
                                </AccordionTrigger>
                                <AccordionContent >
                                    <div>
                                        <div className='text-start'>
                                            <h1 className='text-2xl text-black' key={kycDoc._id}>📱 {kycDoc.mobNo}</h1>
                                        </div>
                                        <div className='grid grid-cols-2 gap-6 mt-4'>

                                            {/* <h1 className='text-lg text-black' key={kycDoc._id}>Aadhar Image</h1> */}
                                            <img src={kycDoc.aadharImage} className='h-12 ' />
                                            <img src={kycDoc.panImage} className='h-12 ' />
                                            <img src={kycDoc.cancelledCheckImage} className='h-12 ' />
                                        </div>
                                        <Button className='w-full mt-4 ' onClick={() => handleApproveKyc(kycDoc._id)}>Approve KYC</Button>
                                        <Button className='w-full mt-4  bg-red-500' onClick={() => handleRejectKyc(kycDoc._id)}>Reject KYC</Button>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                    <footer className='mt-12'>

                        <h1 className='text-black font- mt-10 lg:mt-24'>  COPYRIGHT © GUDI GUDI | DESIGNED BY VIRATCS IT. ALL RIGHTS RESERVED</h1>

                    </footer>

                </main>
            </div>
        </>
    )
}
