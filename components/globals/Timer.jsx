import { useState, useEffect, useContext } from "react";
import React from "react";
import { DataContext } from "../../store/GlobalState";
import Cookie from 'js-cookie';
import { Dice6, Users, User, Wallet, SendToBack, SendToBackIcon, StepBack, LucideStepBack } from 'lucide-react'
import axios from 'axios'
import ResultsTable from '../globals/ResultsTable'
import { useRouter } from "next/router";
import { DM_Sans } from "next/font/google";
import { Howl } from "howler";
import { IoArrowBackOutline } from "react-icons/io5";
import Link from "next/link";

const inter = DM_Sans({ subsets: ["latin"] });

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

    const buttonClickSound4 = new Howl({
        src: ['/logout.mp3'],
    });


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


    nextToDraw.setMinutes(nextToDraw.getMinutes() + 1);
    nextToDraw.setSeconds(0);

    const nextToDrawHours = nextToDraw.getHours();
    const nextToDrawMinutes = nextToDraw.getMinutes();
    const nextToDrawMeridian = nextToDrawHours >= 12 ? 'PM' : 'AM';

    const formattedNextToDrawHours = String(nextToDrawHours % 12).padStart(2, '0');
    const drawTime = `${formattedNextToDrawHours}:${nextToDrawMinutes.toString().padStart(2, '0')} ${nextToDrawMeridian}`;


    const [balance, setBalance] = useState(0)

    const [userName, setUserName] = useState(auth && auth.user && auth.user.userName ? auth.user.userName : "");

    const [winningNumber, setWinningNumber] = useState();
    const [lastFiveWinningNumbers, setLastFiveWinningNumbers] = useState([]);

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
        router.push('/home')
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

    useEffect(() => {
        if (timeToDraw === "01") { // Fetch winning number only when timeToDraw is 5
            async function fetchWinningNumber() {
                try {
                    const response = await axios.get(`/api/getWinningNumber?drawTime=${drawTime}`);
                    const newWinningNumber = response.data.couponNum;
                    setWinningNumber(newWinningNumber);
                    setLastFiveWinningNumbers(prevNumbers => {
                        if (prevNumbers.length < 5) {
                            return [...prevNumbers, newWinningNumber];
                        } else {
                            prevNumbers.shift(); // Remove the oldest winning number
                            return [...prevNumbers, newWinningNumber];
                        }
                    });
                } catch (error) {
                    console.log('Error fetching winning number:', error);
                }
            }
            fetchWinningNumber();
        }
    }, [timeToDraw]);


    const handleLogoutClick = () => {
        setShowModal(false);
        handleLogout();
    };
    const handleband = () => {
        setShowModal(false);

    };

    const handleCloseClick = () => {
        setShowModal(true);
    };
    const [showModal, setShowModal] = useState(false);



    return (
        <div className="text-2xl   ">
            <div className="flex">
                <Link href='/home'>
                    <h1 className="text-white text-md mt-1 absolute ml-1">
                        <IoArrowBackOutline />
                    </h1>
                </Link>
            </div>
            {/* <img src="/acc.png" onClick={handleLogout} className="h-5 mt-1 ml-auto rounded-sm" /> */}
            {/* <img src="/timer.png" onClick={handleLogout} className="h-14 ml-auto mt-1 rounded-sm" /> */}
            <div className="bg-black shadow-md shadow-white mb-2  ml-auto ">
                <p className="text-white  w-fit   rounded-md m px-2 ml-auto   shadow-[#FBEDB8] text-center  text-xl gap-4 flex  items-center">
                    <h1 className='cursor-pointer   text-white font-bold    text-xl lg:block'> ⌛{timeToDraw} </h1>
                    <h1 onClick={fullScreenButton} className='cursor-pointer   text-black   text-xl lg:block'>🖥️
                    </h1>
                    <img className='h-5' src='/close.png' onClick={() => { buttonClickSound4.play(); handleCloseClick(); }} />

                </p>
            </div>
            {showModal && (
                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen">
                        <div className="relative bg-white w-80 rounded-lg shadow-lg">
                            <div className="p-4">
                                <h2 className="text-2xl font-bold mb-4">Logout</h2>
                                <p className="text-gray-700 text-sm">
                                    Are you sure you want to logout?
                                </p>
                            </div>
                            <div className="p-4  bg-gray-100 rounded-b-lg">
                                <button
                                    className="bg-red-500 hover:bg-red-700 text-white text-sm font-bold py-2 px-4 rounded"
                                    onClick={handleLogoutClick}
                                >
                                    Logout
                                </button>
                                <button
                                    className=" ml-4 hover:bg-red-700 text-black text-sm font-bold py-2 px-4 rounded"
                                    onClick={handleband}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="ml-auto h-14 mt-1  bg-[#FFB02E] rounded-md w-48  " >
                <h1 className={`text-sm  text-center font-bold ${inter.className}`}>Last 5 Results</h1>
                <div className="flex">
                    {lastFiveWinningNumbers.map((number, index) => (
                        <div key={index} className={`bg-black -800 text-white px-3 py-1 text-sm flex rounded-lg mx-[3px] ${inter.className}`}>
                            {number}
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex bg-white w-fit rounded-lg ml-auto text-white mt-2 p-1 text-sm">
                <User className='text-black h-5 ml-auto' />

                <h1 className={` text-black font-bold  px-1 ${inter.className}`}>
                    {userName}
                </h1>
            </div>

            <div className="flex bg-white w-fit rounded-lg ml-auto p-1 text-white mt-2 text-sm">
                <Wallet className='text-black h-5  ml-auto' />
                <h1 className={` text-black font-bold  px-2 ${inter.className}`}>
                    {balance}
                </h1>
            </div>







        </div>
    );
}
