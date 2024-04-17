'use client'
import React, { useContext, useEffect, useState } from 'react'
import { Wallet } from 'lucide-react'
import { DataContext } from '../../store/GlobalState';
import Cookie from 'js-cookie'
import { useRouter } from 'next/router';
import axios from 'axios';
import { Button } from '../ui/button';

export default function Navbar() {
    const { state, dispatch } = useContext(DataContext);
    const { auth } = state
    const [balance, setBalance] = useState(0)

    const router = useRouter();

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const response = await axios.get(`/api/updateBalance?userName=${auth.user.userName}`);
                const updatedBalance = response.data.balance;
                setBalance(updatedBalance);
            } catch (error) {
                console.error('Error fetching balance:', error);
            }
        };



        const interval = setInterval(fetchBalance, 1000); // Fetch balance every 3 seconds
        return () => clearInterval(interval);
    }, [auth]);

    const handleLogout = () => {
        Cookie.remove('refreshtoken', { path: '/api/auth/refreshToken' })
        localStorage.removeItem('firstLogin')
        dispatch({ type: 'AUTH', payload: {} })
        router.push('/')
    }
    const handleLogoutClick = () => {
        handleLogout();
    };

    return (
        <header className='fixed top-0 left-0 right-0 py-4 px-4 bg- dark:bg-black/40 backdrop-blur-lg z-[100] flex items-center border-b-[1px] border-neutral-900 justify-between '>
            <h1 className='font-bold text-xl text-white'>Dice🎲</h1>
            <div className=' flex gap-4'>
                <div className='rounded-md bg-black  gap-4 px-3 p-1 flex mt-1 justify-between border   '>
                    <div>
                        <Wallet className='text-white' />
                    </div>
                    <h1 className='text-white ml-auto'>{balance}</h1>

                </div>
                <Button
                    className="bg-red-500 hover:bg-red-700 text-white text-sm font-bold  px-4  rounded"
                    onClick={handleLogoutClick}
                >
                    Logout
                </Button>
            </div>
        </header>
    )
}
