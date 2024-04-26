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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion";

const inter = DM_Sans({ subsets: ["latin"] });

export default function Referrals() {
    const { state, dispatch } = useContext(DataContext);
    const { auth } = state;
    const [userName, setUserName] = useState(auth && auth.user && auth.user.userName ? auth.user.userName : "");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (auth && auth.user && auth.user.userName) {
            // Update state and localStorage when user is authenticated
            setUserName(auth.user.userName);
        }
    }, [auth]);


    const [referrals, setReferrals] = useState([]);





    // const [userBets, setUserBets] = useState([]);

    useEffect(() => {
        // Fetch user bets when component mounts
        const fetchReferrals = async () => {
            try {
                // Replace 'YOUR_API_ENDPOINT' with the actual URL of your API endpoint
                const response = await axios.post(`/api/referrals?userName=${userName}`);
                setReferrals(response.data);
                setLoading(false);
                // setLoading(false);
            } catch (error) {
                console.log('Unable to fetch referrals');
                // setLoading(false);
            }
        };

        fetchReferrals();

        // Cleanup function to cancel any ongoing requests if component unmounts
        return () => { };
    }, [userName]);

    console.log(referrals, ';refs')

    // console.log(userBets, 'bets?')
    return (
        <main
            className={` h-screen   bg-[#400D56]  ${inter.className}`}
        >
            <Navbar />
            <h1 className="text-white pt-20 text-center font-bold">My Referrals</h1>
            {/* <RequestBalance /> */}
            <Accordion type="single" collapsible className="w-full p-2  text-black">
                {loading ? (
                    <p className="text-white text-center mt-4">Loading referrals...</p>
                ) : referrals.length === 0 ? (
                    <p className="text-white text-center mt-4">You have no referrals yet.</p>
                ) : (
                    referrals.data.map((user, index) => (
                        <AccordionItem className='bg-white p-2 rounded-md' key={index} value={`user-${index}`}>
                            <AccordionTrigger>
                               {index +1}. <h1 className="font-bold">  {user.name}</h1>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="">
                                    <p>Username: {user.userName}</p>
                                    <p>Referral Winnings: {user.referralWinnings}</p>
                                    {/* Add more user information as needed */}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))
                )}
            </Accordion>
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
