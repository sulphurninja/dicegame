import { useState, useEffect, useContext } from "react";
import React from "react";
import { DataContext } from "../../store/GlobalState";
import Cookie from 'js-cookie';
import { Dice6, Users, User, Wallet } from 'lucide-react'
import axios from 'axios'
import ResultsTable from '../globals/ResultsTable'
import { useRouter } from "next/router";

export default function TimeRight() {
    const [time, setTime] = useState(new Date());
    const { state, dispatch } = useContext(DataContext);
    const { auth } = state


    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);


    const nextToDraw = new Date(
        time.getFullYear(),
        time.getMonth(),
        time.getDate(),
        time.getHours(),
        time.getMinutes() + 1,
        0,
        0
    );

    const timeDiff = Math.floor((nextToDraw - time) / 1000);
    const seconds = timeDiff % 60;
    const timeToDraw = `${seconds.toString().padStart(2, "0")}`;
    const nextToDrawtime = nextToDraw.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const [balance, setBalance] = useState(0)

    const [userName, setUserName] = useState(auth && auth.user && auth.user.userName ? auth.user.userName : "");


    useEffect(() => {
        // Retrieve username from localStorage on component mount
        const storedUserName = localStorage.getItem("userName");
        if (storedUserName) {
            setUserName(storedUserName);
        }
    }, []);

    useEffect(() => {
        if (auth && auth.user && auth.user.userName) {
            // Update state and localStorage when user is authenticated
            setUserName(auth.user.userName);
            localStorage.setItem("userName", auth.user.userName);
        }
    }, [auth]);

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


    const router = useRouter();

    const handleLogout = () => {
        Cookie.remove('refreshtoken', { path: '/api/auth/refreshToken' })
        localStorage.removeItem('firstLogin')
        dispatch({ type: 'AUTH', payload: {} })
        router.push('/')
    }

    const [isFullScreen, setIsFullScreen] = useState(false);

    const fullScreenButton = () => {
        if (!isFullScreen) {
            document.documentElement.requestFullscreen();
            setIsFullScreen(true);
        } else {
            document.exitFullscreen();
            setIsFullScreen(false);
        }
    };



    console.log(balance, 'balance')

    return (
        <div className="text-2xl   ">
            <h1 onClick={fullScreenButton} className='cursor-pointer absolute  text-white  lg:text-3xl lg:block'>🖥️ </h1>

            {/* <img src="/acc.png" onClick={handleLogout} className="h-5 mt-1 ml-auto rounded-sm" /> */}
            {/* <img src="/timer.png" onClick={handleLogout} className="h-14 ml-auto mt-1 rounded-sm" /> */}
            <p className="text-white  w-fit mb-2  rounded-md mt-2 px-2 ml-auto   shadow-[#FBEDB8] text-center  text-2xl  flex  items-center">
                ⌛ {timeToDraw}
            </p>

            <img src="/disclaimer.png" className="ml-auto h-14 mt-1 bg-black opacity-55" />


            <div className="flex text-white mt-2 text-sm">
                <Wallet className='text-white h-5  ml-auto' />
                <h1 className="bg-white rounded-lg text-black px-3 ">
                    {balance}.00
                </h1>
            </div>

            <div className="flex text-white mt-2 text-sm">
                <User className='text-white ml-auto' />

                <h1 className="bg-white rounded-lg text-black px-3 ">
                    {userName}
                </h1>
            </div>





        </div>
    );
}
