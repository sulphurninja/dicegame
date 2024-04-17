import React, { useEffect, useState } from 'react';
import { FiHome, FiCheckSquare, FiBookOpen, FiTrendingUp, FiMessageSquare, FiHelpCircle, FiCalendar, FiUsers, FiFile, FiFileText, FiEdit, FiTrash2, FiGitPullRequest, FiPhoneOutgoing, FiNavigation2, FiSettings, FiMinusCircle, FiActivity } from 'react-icons/fi';
import { IoIosNotifications } from "react-icons/io";
import Link from 'next/link'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import axios from 'axios';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerTrigger, DrawerClose } from "../components/ui/drawer";
import RequestsList from '../components/globals/RequestLists';
import WithdrawalLists from '../components/globals/WithdrawalLists';

export default function Withdrawals() {
    const [users, setUsers] = useState([]);
    const [editUser, setEditUser] = useState(null);
    const [userName, setName] = useState('');
    const [role, setRole] = useState('');
    const [balance, setBalance] = useState(0);
    const [drawerOpen, setDrawerOpen] = useState(false); // State variable for drawer visibility


    return (
        <div className="flex min-h-screen text-center bg-gray-100">
            <aside className="w-16 md:w-20 lg:w-24 bg-[#1D1817] text-white" >
                <nav className="flex flex-col items-center">
                    <div className="py-4">
                        <Link href='/admin'>

                            <button className="text-2xl  text-gray-300 hover:text-[#F56565] transition duration-300 ease-in-out">
                                <FiHome className="lg:ml-1" />
                                <span className="hidden text-sm font-bold text-center md:inline">Home</span>
                            </button>
                        </Link>
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
                                <FiActivity className="lg:ml-6" />
                                <span className="hidden text-xs font-bold text-center md:inline">Withdrawals</span>
                            </button>
                        </Link>
                    </div>
                    <div className="py-4">
                    <Link href='/Update'>
                        <button className="text-2xl text-gray-300 hover:text-[#F56565] transition duration-300 ease-in-out">
                            <FiCheckSquare className="lg:ml-3" />
                            <span className="hidden text-center text-sm font-bold md:inline">Results</span>
                        </button>
                        </Link>
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
            <main className="flex-1 bg-neutral-300 p-6">
                <h1 className='text-xl font-bold'>Withdrawal Requests</h1>
                <WithdrawalLists />


            </main>
        </div>
    )
}
