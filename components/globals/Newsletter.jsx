import React from 'react'

export default function Newsletter() {
    return (
        <div className='bg-[#00003E] mt-12 flex justify-center'>
            <div className='bg-[#310E9E] w-10/12 flex justify-between p-8 rounded-lg'>
                <div className='grid md:grid-cols-3 '>
                    <img src='/images/footer-left-top.png' className='hidden md:block' />
                    <div className='text-white text-center'>
                        <h1 className='text-white md:text-xl text-xs font-bold'>WANT GAMING & ESPORTS NEWS STRAIGHT TO YOUR INBOX?</h1>
                        <h1 className='mt-4 text-xs font-bold'>To Get Exclusive Benefits</h1>
                        <div className='bg-white p-1 mt-12 rounded-full'>
                            <input className='bg-white rounded-full' />
                            <button className='bg-[#4E01CE] p-2 rounded-full md:ml-8 mt-auto'>SUBSCRIBE</button>
                        </div>

                    </div>


                    <img src='/images/footer-right.png' />

                </div>

            </div>
        </div>
    )
}
