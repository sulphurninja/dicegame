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

const inter = DM_Sans({ subsets: ["latin"] });

export default function Home() {
  return (
    <main
      className={` h-screen   bg-[#400D56]  ${inter.className}`}
    >
      <Navbar />

      <div className="h-[20rem] text-center   w-full dark:bg-black flex flex-col items-center justify-center overflow-hidden rounded-md">
        <h1 className={`text-xl md:text-3xl mb-2 bg-black   bg-clip-text text-white  dark:bg-gradient-to-b from-white to-neutral-600 font-sans font-bold ${inter.className} `}>
          Place your bets, Win Big!
        </h1>
        <Image src='/dice.gif' height={50} width={50} className="m-4" />
        <Button
          size={'lg'}
          className="p-6 md:p-8 absolute z-10 mt-64 mb-8 md:mb-0 md:text-2xl text-xl cursor-pointer  w-fit border-t-2 rounded-full border-[#4D4D4D] dark:bg-[#1F1F1F] hover:bg-white hover:text-black group transition-all flex items-center justify-center gap-4 hover:shadow-xl dark:hover:shadow-neutral-500 duration-500"
        >
          <span className="dark:bg-clip-text  text- dark:text-transparent cursor-pointer  dark:bg-gradient-to-r from-neutral-500 to-neutral-600 hover:text-black   md:text-center font-sans dark:group-hover:bg-gradient-to-r dark:group-hover:from-black dark:group-hover:to-black">
            Play Now
          </span>
        </Button>
      </div>
      <div className="md:mt-12">
        <h1 className="ml-4 text-white">Explore</h1>
        <div className="mx-4  grid grid-cols-1 md:grid-cols-2 gap-4 md:justify-start md:mt-4 mt-4">
          <div>
            <Card>
              <CardHeader>
                <CardTitle>How to Play?</CardTitle>
                <CardDescription>Click to understand the rules to play the dice game</CardDescription>
              </CardHeader>
            </Card>
          </div>


          <div className="">
            <Card>
              <CardHeader>
                <CardTitle>Terms & Conditions</CardTitle>
                <CardDescription>Click to understand the terms & conditions to play the dice game</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
      <nav className="fixed bottom-0 left-0 w-full bg-[#] text-white flex justify-center">
        <ul className="flex justify-around w-full max-w-screen-lg py-4">
          <li className={`px-4 items-center  ${inter.className} `}>
            <Dice6 className='text-white ml-2' />
            <h1 className="text-center">Game</h1>
          </li>
          <li className={`px-4 items-center  ${inter.className} `}>
            <Users className='text-white ml-2' />
            <h1 className="text-center">Refer</h1>
          </li>
          <li className={`px-4 items-center  ${inter.className} `}>
            <User className='text-white ml-2' />
            <h1 className="text-center">Profile</h1>
          </li>
          {/* Add more navigation items as needed */}
        </ul>
      </nav>

    </main>
  );
}
