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

export default function RequestandWithdraw() {
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
            <h1 className="text-white pt-20 text-center font-bold">Requests & Withdrawals</h1>
            <RequestBalance />

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
