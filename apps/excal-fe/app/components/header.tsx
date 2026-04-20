"use client";
import Link from "next/link";
import { CircleUser } from "lucide-react"; 

export default function Header(){

    const navStyles = "lg:text-xl md:text-lg text-md hover:text-red-400 hover:border-b-2 hover:border-red-400 transition-all hover:scale-105"
    return (
        <header className="fixed top-4 left-1/2 z-20 -translate-x-1/2">
            <nav className="flex lg:gap-16 md:gap-12 gap-3 items-center text-black font-serif justify-between backdrop-blur-md bg-white/30 border border-black shadow-xl rounded-2xl py-3 px-7">
                <Link href="/" className="lg:text-2xl md:text-xl text-md font-semibold lg:mr-20 mr-5">Excal.draw</Link>
                <button className= {`${navStyles }`}>Theme</button>
                <Link href="/chat" className={`${navStyles }`}>Chat</Link>
                <Link href="/signin" className={`${navStyles }`}>
                    <CircleUser size={28} />
                </Link>
            </nav>
        </header>
    )
}