import React, { useEffect, useState, useRef, useContext } from 'react';
import Time from "../components/globals/Timerleft";
import TimeRight from "../components/globals/Timer";
import Dice from "../components/globals/Dice";
import { DM_Sans } from "next/font/google";
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import Buttons from '../components/globals/Buttons';
import { DataContext } from '../store/GlobalState';
import { Dice6, Users, User, Wallet } from 'lucide-react'
import axios from 'axios'

const inter = DM_Sans({ subsets: ["latin"] });


export default function Bet() {
    const router = useRouter();
    const diceRef = useRef(null);
    const { state, dispatch } = useContext(DataContext);
    const { auth } = state

    const handleLogout = () => {
        Cookies.remove('refreshtoken', { path: '/api/auth/refreshToken' });
        localStorage.removeItem('firstLogin');
        dispatch({ type: 'AUTH', payload: {} });
        router.push('/');
    };

    const [time, setTime] = useState(new Date());
    const [balance, setBalance] = useState(0);
    const [bets, setBets] = useState({}); // State to track bets placed on each number
    const [selectedNumber, setSelectedNumber] = useState(null); // State to track the selected number   

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
    const [selectedAmount, setSelectedAmount] = useState(0);
    const [winningAmount, setWinningAmount] = useState(0);
    const [winningNumber, setWinningNumber] = useState();
    const [numberBets, setNumberBets] = useState({});



    nextToDraw.setMinutes(nextToDraw.getMinutes() + 1);
    nextToDraw.setSeconds(0);

    const nextToDrawHours = nextToDraw.getHours();
    const nextToDrawMinutes = nextToDraw.getMinutes();
    const nextToDrawMeridian = nextToDrawHours >= 12 ? 'PM' : 'AM';

    const formattedNextToDrawHours = String(nextToDrawHours % 12).padStart(2, '0');
    const drawTime = `${formattedNextToDrawHours}:${nextToDrawMinutes.toString().padStart(2, '0')} ${nextToDrawMeridian}`;

    // console.log(drawTime, 'draw time',)


    useEffect(() => {
        if (timeToDraw === "00") {
            diceRef.current.rollDice();
            addWinnings();
        }
    }, [timeToDraw]);

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

    const handleBet = (number, amount) => {
        setBets(prevBets => ({
            ...prevBets,
            [number]: (prevBets[number] || 0) + amount
        }));
    };

    // console.log(bets, 'jmm')

    const handleAmountClick = (amount) => {
        setSelectedAmount(amount)
    }

    const handleNumberClick = (number) => {
        setNumberBets({ ...numberBets, [number]: (numberBets[number] || 0) + selectedAmount })
        setTotalAmount(totalAmount + selectedAmount)
    }

    const clearBets = () => {
        setSelectedAmount(0);
        setNumberBets({});
        setTotalAmount(0);
    }

    const imageAmounts = {};
    Object.keys(numberBets).forEach((number) => {
        const amount = numberBets[number];
        if (amount > 0) {
            imageAmounts[number] = (imageAmounts[number] || 0) + amount;
        }
    });
    const [index, setIndex] = useState(0);

    const [totalAmount, setTotalAmount] = useState(0);

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

    // console.log(numberBets, 'numberbets')

    const handlePlaceBets = async () => {
        if (totalAmount === 0) {
            return;
        } else {
            try {
                // Deduct the totalAmount from the user's balance
                if (balance < totalAmount) {
                    alert('Insufficient Balance!!')
                } else {
                    const response = await axios.post('/api/pushBets', { numberBets, totalAmount, userName });
                    if (response.data.success) {
                        setWinningAmount(response.data.winningAmount);
                        console.log('WINNING AMOUNT', response.data.winningAmount);
                        clearBets();
                    }
                    console.log('Bets published successfully!');
                    clearBets();
                }
            } catch (error) {
                console.error(error);
                console.log('Failed to publish bets');
            }
        }
    };

    // console.log('WINNING AMOUNT', winningAmount)


    const addWinnings = async () => {
        try {
            const response = await axios.post('/api/addWinnings', { winningAmount, userName });
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        async function fetchWinningNumber() {
            try {
                const response = await axios.get(`/api/getWinningNumber?drawTime=${drawTime}`);
                setWinningNumber(response.data.couponNum);
                console.log("Winning Number is:", response.data.couponNum)

            } catch (error) {
                console.log('Error fetching winning number:', error);
                return null;
            }
        }
        fetchWinningNumber();
        console.log(winningNumber, drawTime, "WINNINGNUMBER AND DRAWTIME")
    }, [timeToDraw]);



    useEffect(() => {
        const timer = setInterval(() => {
            const isLandscape = window.matchMedia("(orientation: landscape)").matches;
            setLandscapeMode(isLandscape);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const [landscapeMode, setLandscapeMode] = useState(false);

    useEffect(() => {
        if (!landscapeMode) {
            alert("To play the game, please switch to Landscape mode.");
        }
    }, [landscapeMode]);


 



    return (
        <div className="h-screen w-full absolute  overflow-hidden" style={{ backgroundImage: 'url(/felt.png),', backgroundSize: 'cover' }}>
            {!landscapeMode && (
                <div className="bg-white h-screen text-2xl font- mt-auto justify-center flex text-white text-center p-4">
                    <img src='/demo.gif' className='w-full' />
                </div>
            )}
            <div class="absolute h-full w-full bg-slate-950"><div class="absolute bottom-0 left-[-20%] right-0 top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]"></div><div class="absolute bottom-0 right-[-20%] top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]"></div></div>



            <main className={' w-full absolute h-screen overflow-hidden'}>
               

                <div className='flex justify-center'>
                    {/* <img src='/images/ribbon.png' className='mt-1' /> */}
                    <h1 className='text-white font-bold absolute text-2xl mt-2'>Dice</h1>
                    <img src='/dice.gif' className='h-8 absolute ml-24 mt-2' />

                </div>

                <TimeRight />




                <div className='grid grid-cols-3 -mt-12'>
                    <div className='grid grid-cols-3  ml-6 -mt-12  '>
                        {[1, 5, 10, 50, 100, 500].map(amount => (
                            <button
                                key={amount}
                                className={`rounded-full w-16 h-16 p-2 ${selectedAmount === amount ? 'bg-white' : 'bg-transparent'
                                    }`}
                                onClick={() => handleAmountClick(amount)}
                            >
                                <img src={`/${amount}.png`} className="h-full w-full  rounded-full" alt={amount} />
                            </button>
                        ))}

                    </div>
                    <div className="  scale-[30%] absolute ml-[35%] -mt-28 flex justify-center">
                        <Dice ref={diceRef} cheatValue={winningNumber} />
                    </div>


                </div>


                <div className="grid grid-rows-2 grid-cols-6 gap-8 ml-6 mt-6  ">
                    {[1, 2, 3, 4, 5, 6].map(number => (
                        <button className="text-white font-bold" key={number} onClick={() => handleNumberClick(number)}>

                            <div
                                src={`/images/${number}.png`}
                                className={` text-black bg-white p-2 w-1/2    ${number === index
                                    ? "border rounded-2xl"
                                    : "rounded-2xl border"
                                    } `}
                                alt={number}
                            >
                                {number}
                            </div>
                            {imageAmounts[number] > 0 && (
                                <div className=" w-fit px-2 ml-6 -mt-2   flex justify-center items-center  text-white  -800 bg-[#9449a7] text-lg  font-bold rounded-2xl">
                                    {imageAmounts[number]}
                                </div>
                            )}
                        </button>
                    ))}
                    <div>

                    </div>
                    <div className='bg-white p-2 ml-auto w-fit absolute mt-20   rounded-lg'>
                        <h1 className='text-black text-sm'>
                            TOTAL : {totalAmount}
                        </h1>

                    </div>
                    <div onClick={clearBets} className='bg-red-700 p-2 ml-36 w-fit absolute mt-20   rounded-lg'>
                        <h1 className='text-white text-sm'>
                            CLEAR BET
                        </h1>

                    </div>
                    <div onClick={handlePlaceBets} className='bg-green-200 text-white p-2 w-fit absolute ml-[76%] mt-20   rounded-lg'>
                        <h1 className='text-black font-bold text-sm'>
                            PLACE BET
                        </h1>

                    </div>
                </div>
            </main>
        </div>
    );
}
