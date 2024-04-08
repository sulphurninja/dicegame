import React from 'react';
import { DM_Sans } from 'next/font/google';
import { useForm } from 'react-hook-form';
import Banner from '../components/globals/Banner';
import NavbarLanding from '../components/globals/NavbarLanding';
import Newsletter from '../components/globals/Newsletter';
import Table from '../components/globals/Table';
import { Chakra_Petch } from 'next/font/google';

const inter = DM_Sans({ subsets: ['latin'] });
const chakra = Chakra_Petch({ subsets: ['latin'], weight: ["300", "400", "500", "600", "700"], });


export default function Index() {
    const { handleSubmit, register, formState: { errors } } = useForm();

    const onSubmit = (data) => {
        console.log(data);
    };

    return (
        <main className={`min-h-full bg-[#00003E] ${inter.className}`}>
            <NavbarLanding />
            <Banner />
            <h1 className={`text-white flex justify-around font-bold text-3xl ${chakra.className}`}>LATEST ACTIVITIES</h1>
            <p className='text-white justify-around flex mb-4'>Each time you reach a new level you'll get a reward</p>

            <div className='flex justify-center'>
            <Table/>

            </div>
            <Newsletter />
            <footer className='text-white text-center mt-4 p-4'>
            COPYRIGHT © GUDI GUDI | DESIGNED BY VIRATCS IT. ALL RIGHTS RESERVED
            </footer>
        </main>
    );
}
