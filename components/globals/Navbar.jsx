'use client'
import React from 'react'
import { Wallet } from 'lucide-react'


export default function Navbar() {
    return (
        <header className='fixed top-0 left-0 right-0 py-4 px-4 bg- dark:bg-black/40 backdrop-blur-lg z-[100] flex items-center border-b-[1px] border-neutral-900 justify-between '>
            <h1 className='font-bold text-xl text-white'>Dice🎲</h1>
            <div className=''>
            <div className='rounded-xl gap-4 px-4 p-1 flex justify-between border   '>
                <div>
                    <Wallet className='text-white' />
                </div>
                <h1 className='text-white ml-auto'>0.0</h1>
            </div>
            </div>
        </header>
    )
}
