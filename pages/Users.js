import React, { useEffect, useState } from 'react';
import { FiHome, FiCheckSquare, FiBookOpen, FiTrendingUp, FiMessageSquare, FiHelpCircle, FiCalendar, FiUsers, FiFile, FiFileText, FiEdit, FiTrash2, FiGitPullRequest, FiPhoneOutgoing, FiNavigation2, FiSettings, FiMinusCircle, FiActivity } from 'react-icons/fi';
import { IoIosNotifications } from "react-icons/io";
import Link from 'next/link'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import axios from 'axios';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerTrigger, DrawerClose } from "../components/ui/drawer";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [editUser, setEditUser] = useState(null);
    const [userName, setName] = useState('');
    const [role, setRole] = useState('');
    const [balance, setBalance] = useState(0);
    const [drawerOpen, setDrawerOpen] = useState(false); // State variable for drawer visibility
    const [password, setPassword] = useState('');

    useEffect(() => {
        async function fetchUsers() {
            const { data } = await axios.get('/api/userlist');
            setUsers(data);
        }
        fetchUsers();
    }, []);

    const handleEdit = (user) => {
        setEditUser(user);
        setName(user.userName);
        setRole(user.role);
        setDrawerOpen(true); // Open the drawer when editing
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/userlist?id=${id}`);
            setUsers(users.map(user => {
                if (user._id === id) {
                    return { ...user, isDeleted: true }; // Mark the user as deleted
                }
                return user;
            }));
        } catch (error) {
            console.error(error);
        }
    };

    const handleUpdateUser = async () => {
        try {
            const { data } = await axios.put(`/api/userlist?id=${editUser._id}`, {
                userName,
                role,
                balance,
                password // Include the password field
            });
            console.log(data);
            setUsers(
                users.map((user) =>
                    user._id === editUser._id ? { ...user, userName, role, balance } : user
                )
            );
            setEditUser(null);

            setName('');
            setRole('');
            setBalance(0);
        } catch (error) {
            console.error(error);
        }
    };

    const handleActivate = async (id) => {
        try {
            await axios.put(`/api/userlist?id=${id}`, { isDeleted: false });
            setUsers(users.map(user => {
                if (user._id === id) {
                    return { ...user, isDeleted: false }; // Mark the user as active
                }
                return user;
            }));
        } catch (error) {
            console.error(error);
        }
    };

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
                                <FiActivity className="lg:ml-5" />
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
                    <div className="py-4">
                        <button className="text-2xl text-gray-300 hover:text-[#F56565] transition duration-300 ease-in-out">
                            <FiHelpCircle className="lg:ml-1" />
                            <span className="hidden text-sm font-bold md:inline">Help</span>
                        </button>
                    </div>
                </nav>
            </aside >
            <main className="flex-1 bg-neutral-300 p-6">
                <h1 className='text-xl font-bold'>USERS</h1>
                <Accordion type="single" collapsible className="w-full">
                    {users.map((user, index) => (
                        <AccordionItem key={index} value={`user-${index}`}>
                            <AccordionTrigger>
                                <h1 className={user.isDeleted ? 'text-red-500' : ''}>{user.userName}</h1>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className='text-start'>
                                    <p>Username: {user.userName}</p>
                                    <p>Role: {user.role}</p>
                                    <p>Balance: {user.balance}</p>
                                    <p>Password: {user.password}</p>
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                    {user.isDeleted ? (
                                        <Button onClick={() => handleActivate(user._id)} className="flex items-center bg-green-500 hover:bg-green-800 text-white py-1 px-2 rounded-md">
                                            Activate
                                        </Button>
                                    ) : (
                                        <Drawer >
                                            <DrawerTrigger asChild>
                                                <Button onClick={() => handleEdit(user)} className="flex items-center  text-white py-1 px-2 rounded-md">
                                                    <FiEdit className="mr-1" />
                                                    Edit
                                                </Button>
                                            </DrawerTrigger>
                                            <DrawerContent>
                                                <DrawerHeader>
                                                    <DrawerTitle>Edit User</DrawerTitle>
                                                </DrawerHeader>
                                                <form className='p-12'>
                                                    <label className=''>
                                                        Username:
                                                    </label>
                                                    <Input type="text" className='' value={userName} onChange={(e) => setName(e.target.value)} />

                                                    <label>
                                                        Role:
                                                        <Input type="text" value={role} onChange={(e) => setRole(e.target.value)} />
                                                    </label>
                                                    <label>
                                                        Balance:
                                                        <Input type="number" value={balance} onChange={(e) => setBalance(e.target.value)} />
                                                    </label>
                                                    <label>
                                                        Update Password:
                                                        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                                    </label>
                                                    <DrawerFooter>
                                                        <Button type="button" onClick={handleUpdateUser}>Update</Button>
                                                        <DrawerClose onClick={() => setDrawerOpen(false)}>Close</DrawerClose>
                                                    </DrawerFooter>
                                                </form>
                                            </DrawerContent>
                                        </Drawer>

                                    )}
                                    <Button onClick={() => handleDelete(user._id)} className="flex items-center bg-red-500 hover:bg-red-800 text-white py-1 px-2 rounded-md">
                                        <FiTrash2 className="mr-1" />
                                        Deactivate
                                    </Button>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </main>
        </div>
    )
}
