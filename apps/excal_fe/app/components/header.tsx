import Link from "next/link";

export default function Header(){
    return (
        <header className="fixed top-4 left-1/2 z-20 -translate-x-1/2">
            <nav className="flex lg:gap-16 md:gap-12 gap-3 items-center text-black font-serif justify-between backdrop-blur-md bg-white border border-black shadow-xl rounded-2xl py-3 px-7">
                <Link href="/" className="lg:text-2xl md:text-xl text-md font-semibold lg:mr-24 mr-5">Excal.Com</Link>
                <Link href="/about" className="lg:text-xl md:text-lg text-md whitespace-nowrap">About us</Link>
                <Link href="/chat" className="lg:text-xl md:text-lg text-md">Chat</Link>
                <Link href="/signup" className="lg:text-xl md:text-lg text-md">Signup</Link>
            </nav>
        </header>
    )
}