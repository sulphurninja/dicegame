import React, { useEffect, useState, useRef, useContext } from 'react';
import Time from "../components/globals/Timerleft";
import TimeRight from "../components/globals/Timer";
import Dice from "../components/globals/Dice";
import { DM_Sans } from "next/font/google";
import Cookies from 'js-cookie';
import { Howl } from 'howler';
import { useRouter } from 'next/router';
import Buttons from '../components/globals/Buttons';
import { DataContext } from '../store/GlobalState';
import { Dice6, Users, User, Wallet } from 'lucide-react'
import axios from 'axios'
import { Toaster } from '../components/ui/sonner';
import { toast } from 'sonner';
import { Button } from '../components/ui/button'
import { motion } from 'framer-motion'

const inter = DM_Sans({ subsets: ["latin"] });


export default function Bet() {
    const router = useRouter();
    const diceRef = useRef(null);
    const { state, dispatch } = useContext(DataContext);
    const { auth } = state

 

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
    const [winningAmounts, setWinningAmounts] = useState([]);
    const [winningNumber, setWinningNumber] = useState();
    const [numberBets, setNumberBets] = useState({});
    const [betSuccessMessage, setBetSuccessMessage] = useState(""); // State variable for bet success message
    const [pushedBets, setPushedBets] = useState([]);// State variable to store pushed bet
    const [pushedBetsArray, setPushedBetsArray] = useState([]);
    const [showWinningModal, setShowWinningModal] = useState(false); // State to manage modal visibility


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
        } else if (timeToDraw === "58") {
            setShowWinningModal(true);
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

    const buttonClickSound3 = new Howl({
        src: ['/select.mp3'],
    });

    const buttonClickSound = new Howl({
        src: ['/clear.mp3'],
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
                    const response = await axios.post('/api/pushBets', { numberBets, totalAmount, userName, winningNumber });
                    if (response.data.success) {
                        setWinningAmounts(prevWinningAmounts => [...prevWinningAmounts, response.data.winningAmount]); // Store winning amount in array
                        console.log('WINNING AMOUNT', response.data.winningAmount);
                        clearBets();
                        setPushedBets(prevPushedBets => [...prevPushedBets, numberBets]); // Update pushed bets as an array
                        toast("✅ Bet Placed successfully!"); // Update success message
                        setPushedBetsArray(prev => [...prev, pushedBets]); // Add the newly pushed bets to the array

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
            const response = await axios.post('/api/addWinnings', { winningAmounts, userName });
            if (response.data.success) {
                toast(`🏆 You Won + ${response.data.totalWinningAmount}`);
                setWinningAmounts([]);
                setPushedBets([]);
                setPushedBetsArray([]);
            }
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        if (timeToDraw === "05") { // Fetch winning number only when timeToDraw is 5
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
        }
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
            // alert("To play the game, please switch to Landscape mode.");
        }
    }, [landscapeMode]);

    useEffect(() => {
        // Clear the bet success message after 10 seconds only if it is received from pushBets
        if (betSuccessMessage) {
            const timer = setTimeout(() => {
                setBetSuccessMessage("");
            }, 10000);

            return () => clearTimeout(timer); // Clear the timeout on component unmount
        }
    }, [betSuccessMessage]);

    console.log(pushedBetsArray, 'pushed bets array')

    // Function to close the winning modal
    useEffect(() => {
        const handleCloseModal = () => {
            if (timeToDraw === "50") {
                setShowWinningModal(false);
            }
        };
        handleCloseModal();
    }, [timeToDraw]);

    const handleCloseModal = () => {
        setShowWinningModal(false);
    }



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

                {showWinningModal && (
                    <motion.div
                        className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50"
                        initial={{ opacity: 0, scale: 0.5 }} // Initial animation properties
                        animate={{ opacity: 1, scale: 1 }} // Animation properties on appearance
                        transition={{ duration: 0.5 }} // Animation duration
                    >
                        <motion.div
                            className="bg-black  shadow-[0_3px_10px_rgb(0,0,0,0.2)] shadow-white  p-16   z-[100] rounded-lg"
                            initial={{ opacity: 0, y: -50 }} // Initial animation properties
                            animate={{ opacity: 1, y: 0 }} // Animation properties on appearance
                            transition={{ delay: 0.2, duration: 0.5 }} // Animation duration and delay
                        >
                            <h2 className="text-4xl font-bold text-white  text-center">Winning Number</h2>
                            <div className='flex mt-2 gap-2 justify-center'>
                                <img src='/win.gif' className='h-12   mt-2' />
                                <h1 className="text-6xl font-bold mt-auto  text-center text-purple-100 -200">{winningNumber}</h1>

                            </div>
                            <div className='w-full flex justify-center'>
                                <Button className="mt-4 bg-amber-600 text-white px-6 py-2 rounded-lg" onClick={handleCloseModal} >OK</Button>
                            </div>

                        </motion.div>
                    </motion.div>
                )}
               

                <div className='grid grid-cols-3 -mt-12'>
                    <div className='grid grid-cols-3  ml-6 -mt-12  '>
                        {[1, 5, 10, 50, 100, 500].map(amount => (
                            <button
                                key={amount}
                                className={`rounded-full w-16 h-16 p-2 ${selectedAmount === amount ? 'bg-white' : 'bg-transparent'
                                    }`}
                                onClick={() => { buttonClickSound3.play(); handleAmountClick(amount) }}
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
                                className={` text-black bg-white p-2 w-1/2 text-2xl    ${number === index
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
                    <div className='bg-white p-2 ml-auto w-fit absolute mt-20    rounded-lg'>
                        <h1 className='text-black text-sm'>
                            TOTAL : {totalAmount}
                        </h1>

                    </div>
                    <div onClick={() => {
                        buttonClickSound.play();
                        clearBets();
                    }} className='bg-red-700 p-2 ml-36 z-10 w-fit absolute mt-20   rounded-lg' >
                        <h1 className='text-white text-sm'>
                            CLEAR BET
                        </h1>

                    </div>

                    <Toaster />

                    <div onClick={clearBets} className='bg-[#B33659] shadow-white  -700  px-2  ml-80  absolute mt-20 h-16 overflow-hidden  text-center   rounded-lg'>
                        <h2 className='font-bold text-white  text-xs'> Current Bet:</h2>

                        {/* <h1 className='text-xs font-bold  text-white'>Current Bet</h1> */}

                        {pushedBets.map((bet, index) => (
                            <div key={index} className='w-56 overflow-x-scroll'>
                                <div className='text-white gap-4 justify-center flex'>
                                    {Object.entries(bet).map(([number, amount]) => (
                                        <p className='text-xs gap-4 font-bold font-mono' key={number}>
                                            <div className='bg-white text-black h-6 w-8 mt-1 rounded-full'>
                                                <span className='text-sm'>{number}</span>
                                            </div>
                                            <div className='flex'>
                                                🪙
                                                <span className='text-green-200'>{amount}</span>
                                            </div>
                                        </p>
                                    ))}
                                </div>
                            </div>
                        ))}

                    </div>
                    <div onClick={handlePlaceBets} className='bg-green-200 z-10 text-white p-2 w-fit absolute ml-[76%] mt-20   rounded-lg'>
                        <h1 className='text-black font-bold text-sm'>
                            PLACE BET
                        </h1>

                    </div>
                </div>
            </main >
        </div >
    );
}
