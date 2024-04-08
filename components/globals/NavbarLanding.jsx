import React from 'react'
import { Button } from '../ui/button'
import { Howl } from 'howler';
import Link from 'next/link'

export default function NavbarLanding() {
    const Sound = new Howl({
        src: ['/bleep.wav']
    });
    const playSound = () => {
        Sound.play();
    }
    return (
        <header className=' top-0 left-0 right-0 border-[#4543A9] py-4 px-4 bg-transparent absolute   z-[100] flex items-center border-b-[1px] mx-4 justify-between '>
            <h1 className='font-extrabold text-xl md:text-3xl uppercase  text-white'>Dice🎲</h1>
            <div className='justify-end flex'>

            </div>

            <div className='flex md:gap-8 '>
                <h1 className='text-[#00FEDF] text-xl  mt-2 uppercase font-bold'>Home</h1>
                <div className=' gap-4 hidden md:flex'>
                    <Link href='/register'>

                        <Button
                            size={'lg'}
                            onClick={playSound}
                            className="px-6 md:px-6   z-10  mb-8 md:mb-0 md:text-2xl text-lg cursor-pointer  w-fit border-t-2 rounded-full bg-[#4E01CE] border-[#4D4D4D] dark:bg-[#4E01CE] hover:bg-white hover:text-black group transition-all flex items-center justify-center gap-4 hover:shadow-xl dark:hover:shadow-neutral-500 duration-500"
                        >
                            <span className="dark:bg-clip-text uppercase font-bold  text-lg dark:text-transparent cursor-pointer  dark:bg-gradient-to-r from-neutral-500 to-neutral-600 hover:text-black   md:text-center font-sans dark:group-hover:bg-gradient-to-r dark:group-hover:from-black dark:group-hover:to-black">
                                REGISTER
                            </span>
                        </Button>
                    </Link>
                    <Link href='/login'>
                        <Button
                            size={'lg'}
                            onClick={playSound}
                            className="px-6 md:px-6   z-10  mb-8 md:mb-0 md:text-2xl text-lg cursor-pointer  w-fit border-t-2 rounded-full bg-[#7400D3] border-[#4D4D4D] dark:bg-[#7400D3] hover:bg-white hover:text-black group transition-all flex items-center justify-center gap-4 hover:shadow-xl dark:hover:shadow-neutral-500 duration-500"
                        >
                            <span className="dark:bg-clip-text uppercase font-bold  text-lg dark:text-transparent cursor-pointer  dark:bg-gradient-to-r from-neutral-500 to-neutral-600 hover:text-black   md:text-center font-sans dark:group-hover:bg-gradient-to-r dark:group-hover:from-black dark:group-hover:to-black">
                                SIGN IN
                            </span>
                        </Button>
                    </Link>
                </div>
            </div>
        </header>
    )
}