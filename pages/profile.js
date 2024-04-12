import Image from "next/image";
import { DM_Sans } from "next/font/google";
import Navbar from "../components/globals/Navbar";
import { Button } from "../components/ui/button";
import { Dice6, Users, User } from 'lucide-react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../components/ui/card"
import Link from 'next/link'
import { useContext, useEffect, useState } from "react";
import { DataContext } from "../store/GlobalState";
import axios from "axios";
import RequestBalance from "../components/globals/RequestBalance";

const inter = DM_Sans({ subsets: ["latin"] });

export default function Profile() {
    const { state, dispatch } = useContext(DataContext);
    const { auth } = state;
    const [userName, setUserName] = useState(auth && auth.user && auth.user.userName ? auth.user.userName : "");


    useEffect(() => {
        if (auth && auth.user && auth.user.userName) {
            // Update state and localStorage when user is authenticated
            setUserName(auth.user.userName);
        }
    }, [auth]);

    useEffect(() => {
        if (auth && auth.user && auth.user.winHistory) {
            // Update state and localStorage when user is authenticated
            setWinHistory(auth.user.winHistory);
        }
    }, [auth]);

    const [winHistory, setWinHistory] = useState([]);
    const [name, setName] = useState("");





    const [userBets, setUserBets] = useState([]);

    useEffect(() => {
        // Fetch user bets when component mounts
        const fetchUserBets = async () => {
            try {
                // Replace 'YOUR_API_ENDPOINT' with the actual URL of your API endpoint
                const response = await axios.post('/api/fetchBets', { userName: userName });
                setUserBets(response.data.bets);
                // setLoading(false);
            } catch (error) {
                console.log('Unable to fetch user bets');
                // setLoading(false);
            }
        };

        fetchUserBets();

        // Cleanup function to cancel any ongoing requests if component unmounts
        return () => { };
    }, [auth]);

    console.log(userBets, 'bets?')
    return (
        <main
            className={` h-screen   bg-[#400D56]  ${inter.className}`}
        >
            <Navbar />

            <div className="h-[45rem] text-center   w-full dark:bg-black flex flex-col items-center justify-center overflow-hidden rounded-md">
                <div className=" w-full flex justify-center">
                    <div className="w-10/12 rounded-xl bg-white   justify-center ">
                        <h1 className="text-black font-bold">{userName}{ }</h1>
                        <h1 className={`${inter.className}  font-bold text-lg`}>Betslip</h1>

                        <div className="bg-black overflow-y-scroll h-32 rounded-lg text-xs text-white mx-4">
                            {userBets.length === 0 ? (
                                <p>No bets placed, place bets and win big!</p>
                            ) : (
                                <ul>
                                    {userBets.map((bet, index) => (
                                        <li key={index} className="flex justify-between py-2">
                                            <div className="flex-1">
                                                {/* <p>Number Bets: {JSON.stringify(bet.numberBets)}</p> */}
                                                <div className="text-white flex gap-4 p-4">
                                                    <p>{index + 1}</p>
                                                    <p>🪙 {bet.totalAmount}</p>
                                                </div>


                                            </div>
                                            <div className="flex-1 p-4">
                                                <p>Placed At: {new Date(bet.createdAt).toLocaleString('en-US', {
                                                    hour: 'numeric',
                                                    minute: 'numeric',
                                                    hour12: true
                                                })}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}

                        </div>


                    </div>

                </div>
                <div className="bg-black -900  mt-12 w-[70%] rounded-lg">
                    <h1 className=' text-white font-bold'>Request Balance</h1>

                    <RequestBalance />

                </div>

            </div>

            <nav className="fixed bottom-0 left-0 w-full bg-[#] text-white flex justify-center">
                <ul className="flex justify-around w-full max-w-screen-lg py-4">
                    <Link href='/home'>
                        <li className={`px-4 items-center  ${inter.className} `}>
                            <Dice6 className='text-white ml-2' />
                            <h1 className="text-center">Game</h1>
                        </li>
                    </Link>
                    <Link href='/refer'>
                        <li className={`px-4 items-center  ${inter.className} `}>
                            <Users className='text-white ml-2' />
                            <h1 className="text-center">Refer</h1>
                        </li>
                    </Link>
                    <Link href='/profile'>
                        <li className={`px-4 items-center  ${inter.className} `}>
                            <User className='text-white ml-2' />
                            <h1 className="text-center">Profile</h1>
                        </li>
                    </Link>
                    {/* Add more navigation items as needed */}
                </ul>
            </nav>

        </main>
    );
}
