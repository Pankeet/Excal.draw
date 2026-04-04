import Link from "next/link";

export default function Header(){
    return (
        <header className="fixed top-4 left-1/2 z-50 -translate-x-1/2 ">
            <nav className="flex lg:gap-16 md:gap-12 gap-10 items-center text-black font-serif justify-between backdrop-blur-md bg-white/15 border border-black shadow-xl rounded-2xl py-3 px-7">
                <Link href="/" className="lg:text-2xl md:text-xl text-lg font-semibold lg:mr-24">Excal.Com</Link>
                <Link href="/about" className="lg:text-xl md:text-lg text-base">About</Link>
                <Link href="/contact" className="lg:text-xl md:text-lg text-base">Contact</Link>
                <Link href="/chat" className="lg:text-xl md:text-lg text-base">Chat</Link>
                <Link href="/signup" className="lg:text-xl md:text-lg text-base">Signup</Link>
            </nav>
        </header>
    )
}