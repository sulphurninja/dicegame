import Image from "next/image";
import { DM_Sans } from "next/font/google";
import Navbar from "../components/globals/Navbar";
import { Button } from "../components/ui/button";
import { Dice6, Users, User, Copy } from 'lucide-react'; // Assuming "Copy" is the icon for copying
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from "react";
import { DataContext } from "../store/GlobalState";

const inter = DM_Sans({ subsets: ["latin"] });

export default function Refer() {
    const router = useRouter();
    const { state, dispatch } = useContext(DataContext);
    const { auth } = state;
    const [linkCopied, setLinkCopied] = useState(false);

    useEffect(() => {
        if (auth && auth.user && auth.user.referralCode) {
            // Update state and localStorage when user is authenticated
            setReferralCode(auth.user.referralCode);
            // localStorage.setItem("userName", auth.user.referralCode);
        }
    }, [auth]);

    const [referralCode, setReferralCode] = useState(auth && auth.user && auth.user.referralCode ? auth.user.referralCode : "");
    const [copied, setCopied] = useState(false);

    const shortenURL = async () => {
        const longURL = `${window.location.origin}/register?referralCode=${referralCode}`;
        try {
            const response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(longURL)}`);
            const data = await response.text();
            return data;
        } catch (error) {
            console.error('Error shortening URL:', error);
            return null;
        }
    };

    const copyReferralCode = async () => {
        try {
            await navigator.clipboard.writeText(referralCode);
            setCopied(true);
            console.log('Referral code copied to clipboard');
        } catch (error) {
            console.error('Failed to copy referral code:', error);
        }
    };

    const shareReferralLink = async () => {
        try {
            const shortenedURL = await shortenURL();
            if (shortenedURL) {
                await navigator.clipboard.writeText(shortenedURL);
                console.log('Referral link copied to clipboard');
                setLinkCopied(true);
            } else {
                console.error('Failed to shorten URL');
            }
        } catch (error) {
            console.error('Failed to copy referral link:', error);
        }
    };
    
    const [userName, setUserName] = useState(auth && auth.user && auth.user.userName ? auth.user.userName : "");


    useEffect(() => {
        if (auth && auth.user && auth.user.userName) {
            // Update state and localStorage when user is authenticated
            setUserName(auth.user.userName);
        }
    }, [auth]);

    useEffect(() => {
        if (auth && auth.user && auth.user.referralCode) {
            // Update state and localStorage when user is authenticated
            setReferralCode(auth.user.referralCode);
        }
    }, [auth]);

    const [winHistory, setWinHistory] = useState([]);
    // const [name, setName] = useState("");

    // const fetchUserData = async () => {
    //     try {
    //         const response = await fetch(`/api/users?userName=${userName}`);
    //         if (!response.ok) {
    //             throw new Error('Failed to fetch user data');
    //         }
    //         const userData = await response.json();
    //         // Assuming the user data includes winHistory
    //         // setWinHistory(userData.winHistory);
    //         setName(userData.name)
    //     } catch (error) {
    //         console.error('Error fetching user data:', error);
    //     }
    // };

    // // Call the fetchUserData function when the component mounts
    // useEffect(() => {
    //     fetchUserData();
    // }, [auth]);

    useEffect(() => {
        if (auth && auth.user && auth.user.winHistory) {
            // Update state and localStorage when user is authenticated
            setWinHistory(auth.user.winHistory);
        }
    }, [auth]);

    console.log(auth.user, 'winwin')

    return (
        <main className={` h-screen   bg-[#400D56]  ${inter.className}`}>
            <Navbar />
            <div className="h-[20rem] text-center   w-full dark:bg-black flex flex-col items-center justify-center overflow-hidden rounded-md">
                <h1 className={`text-xl md:text-3xl mb-2 bg-black   bg-clip-text text-white  dark:bg-gradient-to-b from-white to-neutral-600 font-sans font-bold ${inter.className}`}>
                    Refer your friends and Win Big Together!
                </h1>
                <Image src='/dice.gif' height={50} width={50} className="m-4" />
                <Button
                    size={'lg'}
                    className="p-6 md:p-8 absolute z-10 mt-64 mb-8 md:mb-0 md:text-2xl text-xl cursor-pointer  w-fit border-t-2 rounded-full border-[#4D4D4D] dark:bg-[#1F1F1F] hover:bg-white hover:text-black group transition-all flex items-center justify-center gap-4 hover:shadow-xl dark:hover:shadow-neutral-500 duration-500"
                    onClick={shareReferralLink}
                >
                    Share Referral Link
                </Button>
                {linkCopied && <p className="text-sm text-green-500 mt-2">Referral Link copied!</p>} {/* Display message if link is copied */}
            </div>
            <div className="mt-4 text-center">
                <p className="text-2xl leading-relaxed text-white">Your referral code:</p>
                <div className="flex items-center justify-center">
                    <span className="font-bold flex gap-4 bg-white text-black p-1 px-2 rounded-full mr-2">{referralCode}
                        <Copy className="text-black cursor-pointer mt-1" size={14} onClick={copyReferralCode} />
                    </span>
                </div>
                {copied && <p className="text-sm text-green-500 mt-2">Referral code copied!</p>}
            </div>
            <div className="mt-12 bg-white  mx-4 rounded-xl  md:h-36 h-36 overflow-y-scroll text-black flex justify-center text-center">
                <div className="bg-white justify-start  rounded-full">
                    <p className="text-2xl leading-relaxed">Referral Winnings:</p>
                    <div>
                        {winHistory && winHistory.length > 0 ? (
                            <div className="">
                                {winHistory.map((entry, index) => (
                                    <div className="text-white p-3 w-full bg-black flex justify-between">
                                        <h1 key={index}>{`${index + 1}. ${entry.from}`}</h1>
                                        <h1 className="text-amber-300 font-bold" key={index}>{`🪙 ${entry.amount}`}</h1>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>No win history available</p>
                        )}
                    </div>
                </div>

            </div>
            <nav className="fixed bottom-0 left-0 w-full bg-[#] text-white flex justify-center">
                <ul className="flex justify-around w-full max-w-screen-lg py-4">
                    <Link href='/home'>
                        <li className={`px-4 items-center  ${inter.className}`}>
                            <Dice6 className='text-white ml-2' />
                            <h1 className="text-center">Game</h1>
                        </li>
                    </Link>
                    <Link href='/refer'>
                        <li className={`px-4 items-center  ${inter.className}`}>
                            <Users className='text-white ml-2' />
                            <h1 className="text-center">Refer</h1>
                        </li>
                    </Link>
                    <Link href='/profile'>
                        <li className={`px-4 items-center  ${inter.className}`}>
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
