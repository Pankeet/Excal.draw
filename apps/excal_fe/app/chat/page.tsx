"use client"
import gsap from "gsap";
import { useLayoutEffect, useRef } from "react";

export default function ChatPage() {
    const containerRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from("h1", { duration: 1, y: -50, opacity: 0 });
            gsap.from("p", { duration: 1, y: 50, opacity: 0, delay: 0.4 });
        }, containerRef);

        return () => ctx.revert(); 
    }, []);

    return (
        <div ref={containerRef} className="flex flex-col items-center h-screen mt-28">
            <h1 className="text-4xl font-bold font-serif mb-4">
                Welcome to the Chat Page!
            </h1>
            <p className="text-lg text-gray-700">
                This is where you can chat with your friends.
            </p>
        </div>
    );
}