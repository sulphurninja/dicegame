import React, { useEffect, useState, useRef } from 'react';
import Time from "../components/globals/Timerleft";
import TimeRight from "../components/globals/Timer";
import Dice from "../components/globals/Dice";
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

export default function Bet() {
    const router = useRouter();
    const diceRef = useRef(null);

    const handleLogout = () => {
        Cookies.remove('refreshtoken', { path: '/api/auth/refreshToken' });
        localStorage.removeItem('firstLogin');
        dispatch({ type: 'AUTH', payload: {} });
        router.push('/');
    };

    const [time, setTime] = useState(new Date());

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

    useEffect(() => {
        if (timeToDraw === "00") {
            diceRef.current.rollDice();
        }
    }, [timeToDraw]);

    return (
        <div className="h-screen w-screen absolute bg-green-700 overflow-hidden" style={{ backgroundImage: 'url(/felt.png),', backgroundSize: 'cover' }}>
            <div className="flex justify-center w-full bg-black">
                <h1 className="text-center text-white text-2xl p-4">Dice🎲</h1>
                <img src="/close.png" onClick={handleLogout} className="h-8 mb-8  ml-auto " />
            </div>
            <main className={'grid grid-cols-3 w-full absolute h-screen overflow-hidden'}>
                <div className="">
                    <Time />
                </div>
                <div className="  scale-50 h-56 flex justify-center">
                   <Dice ref={diceRef} />
                </div>
                <TimeRight />
            </main>
        </div>
    );
}
