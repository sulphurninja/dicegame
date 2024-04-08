import React from 'react'
import { Chakra_Petch } from 'next/font/google';
import { Button } from '../ui/button';

const chakra = Chakra_Petch({ subsets: ['latin'], weight: ["300", "400", "500", "600", "700"], });


export default function Banner() {
    return (
        <section id="banner-section" className='flex justify-center bg-[#102815]   overflow-hidden leading-[3em] flex-col' >
            <div className={`${chakra.className} text-center `}>
                <h1 className='text-white text-4xl md:text-7xl leading-[4em] font-bold'>PLAY & GAIN</h1>
                <h1 className='text-[#00FEDF] text-4xl md:text-7xl md:mt-4 -mt-9   font-bold'>REWARDS</h1>
            </div>
            <div>

            </div>
            <p className='text-center text-[#D3DBF8]'>Free, Fun & Fair Rewards For Everyone</p>
            <div className='flex justify-center'>
                <Button
                    size={'lg'}
                    className="p-6 md:p-6 mt-4  z-10  mb-8 md:mb-0 md:text-2xl text-xl cursor-pointer  w-fit border-t-2 rounded-full bg-[#7400D3] border-[#4D4D4D] dark:bg-[#7400D3] hover:bg-white hover:text-black group transition-all flex items-center justify-center gap-4 hover:shadow-xl dark:hover:shadow-neutral-500 duration-500"
                >
                    <span className="dark:bg-clip-text uppercase font-bold  text-lg dark:text-transparent cursor-pointer  dark:bg-gradient-to-r from-neutral-500 to-neutral-600 hover:text-black   md:text-center font-sans dark:group-hover:bg-gradient-to-r dark:group-hover:from-black dark:group-hover:to-black">
                        Start Betting!
                    </span>
                </Button>
            </div>

            <div className=' justify-between flex'>
                <div className='-mt-12 hidden md:block'>
                    <img src='/images/coin-1.png' className=' w-64' />
                    <img src='/images/coin-2.png' className=' w-64 -ml-32' />
                </div>
                <div className='flex justify-around mt-8'>
                    <img src='/images/banner-left-obj.png' className='hidden md:flex mt-12  h-[60%]' />
                    <img src='/images/top-game-5.png' className='md:ml-0 ml-16 w-64' />
                    <img src='/images/banner-right-obj.png' className='hidden md:flex h-[60%]  mt-24 ' />

                </div>
                <div className='hidden md:block -mt-12'>
                    <img src='/images/coin-3.png' className=' w-64' />
                    <img src='/images/coin-4.png' className=' w-64 ml-32 absolute' />
                </div>

            </div>

            <div className='flex  justify-center '>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-3 justify-center p-8 bg-[#0D0D59] w-10/12 rounded-lg'>
                    <div className='flex'>

                        <div className='flex gap-4'>
                            <img src='/images/banner-bottom-1.png' className='h-24' />
                            <div>
                                <h1 className='text-white text-4xl '>PLAY</h1>
                                <p className='leading-normal   text-[#D3DBF8]'>
                                    A huge collection of web and mobile games.
                                </p>
                            </div>
                        </div>

                    </div>


                    <div className='flex gap-4'>
                        <img src='/images/banner-bottom-2.png' className='h-24' />
                        <div>
                            <h1 className='text-white text-4xl '>WIN</h1>
                            <p className='leading-normal   text-[#D3DBF8]'>
                                Points and cash from playing and competing.
                            </p>
                        </div>
                    </div>
                    <div className='flex gap-4'>
                        <img src='/images/banner-bottom-3.png' className='h-24' />
                        <div>
                            <h1 className='text-white text-4xl '>EARN</h1>
                            <p className='leading-normal   text-[#D3DBF8]'>
                                Your Wombucks or prize money from challenges.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
            <div className=' p-4 bg-[#00003E] text-white'>
                <div className=' mt-8  flex justify-around items-center   shadow-lg'>
                    <div>
                        <div className='text-4xl'>
                            <p> BIGGEST</p>
                            <p> WINNINGS</p>
                            <button className='bg-blue-800 ml-6 mt-6 rounded-full text-sm px-4 md:text-2xl  md:py-1 md:px-4'> START PLAYING </button>
                        </div>
                    </div>
                    <div>
                        <img
                            src='/images/tropy.png' />
                    </div>
                </div>
            </div>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 bg-[#00003E] pt-12 '>
                <div className='justify-center gap-6 flex'>
                    <img src='/images/counter-icon-1.png' />
                    <div>
                        <h1 className='text-white font-bold text-xl'>$ 133501</h1>
                        <h1 className='text-white font-bold text-sm '>JACKPOT</h1>
                    </div>

                </div>
                <div className='justify-center gap-6 flex'>
                    <img src='/images/counter-icon-2.png' />
                    <div>
                        <h1 className='text-white font-bold text-xl'>$ 133501</h1>
                        <h1 className='text-white font-bold text-sm '>JACKPOT</h1>
                    </div>

                </div>
                <div className='justify-center gap-6 flex'>
                    <img src='/images/counter-icon-3.png' />
                    <div>
                        <h1 className='text-white font-bold text-xl'>$ 133501</h1>
                        <h1 className='text-white font-bold text-sm '>JACKPOT</h1>
                    </div>

                </div>  <div className='justify-center gap-6 flex'>
                    <img src='/images/counter-icon-4.png' />
                    <div>
                        <h1 className='text-white font-bold text-xl'>$ 133501</h1>
                        <h1 className='text-white font-bold text-sm '>JACKPOT</h1>
                    </div>

                </div>

            </div>
        </section>
    )
}
