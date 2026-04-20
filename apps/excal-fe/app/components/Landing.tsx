'use client'
import { useLayoutEffect } from 'react';
import Link from "next/link";
import gsap from 'gsap';

type feature = {
    title :string,
    description : string
}

const features : feature[] = [
    {
        title: 'Real-time Collaboration',
        description:
            'Multiple users can draw, edit, and chat together in a shared whiteboard session.',
    },
    {
        title: 'Interactive Drawing Tools ',
        description:
            'Shape, text, freehand and object tools designed for quick idea capture and visual thinking.',
    },
    {
        title: 'Live Chat & Comments ',
        description:
            'Stay in sync with teammates through integrated chat and contextual feedback.',
    },
    {
        title: 'Smooth Animations ',
        description:
            'GSAP-powered motion adds polish and improves the flow of every interaction.',
    },
]

export default function LandingPage() {

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".section-start", {
                scale: 1.2,
                opacity: 0,
                duration: 1.5,
                ease: 'power3.out',
            })

            gsap.from(".section-end", {
                scale: 1.2,
                opacity: 0,
                duration: 1.5,
                ease: 'power3.out',
                delay: 0.4
            })
        })

        return () => ctx.revert()
    }, [])

    return (
        <main className="font-serif px-8 py-12 lg:mt-48 md:mt-20 mt-16 lg:mx-14 md:mx-10 mx-1 min-h-screen text-slate-900 bg-linear-to-tl from-[#f8fbff] to-white">
            <section className="grid lg:gap-10 gap-5 align-items-center mb-16 lg:grid-cols-[1.1fr_1fr] section-start">
                <div>
                    <h1 className='leading-[1.05] m-0 text-[clamp(2rem,4vw,4rem)]'>Build ideas together in a living whiteboard space.</h1>
                    <p className="mt-6 max-w-3xl text-slate-600 text-lg leading-normal mb-10">
                        Collaboration for creators, teams, and visual thinkers.
                        Share boards, chat in real time, and animate your workflow with smooth motion.
                    </p>
                    <Link href="/signup" className='text-xl border-black px-7 py-3 border rounded-xl hover:scale-105 hover:shadow-xl hover:shadow-black/30 transition-shadow duration-300'>Sign Up</Link>
                </div>
                <div className="relative flex justify-center items-center min-h-80">
                    <div className="absolute w-72 h-72 rounded-full bg-purple-600/30 blur-3xl animate-pulse" />
                    <div className="relative p-8 w-full max-w-80 rounded-3xl z-10 bg-white/80 backdrop-blur-xl border border-white/40 shadow-[0_30px_80px_rgba(37,99,235,0.25)]">
                        <span className='inline-flex px-3.5 py-2 bg-indigo-50 text-indigo-800 rounded-[999px] text-sm mb-4 text-left'>Live</span>
                        <strong className='block text-2xl mt-3 text-slate-900 text-center'>Multi-user Canvas</strong>
                    </div>
                </div>
            </section>

            <section className="lg:mt-36">
                <div className="section-end">
                    <h2 className='mb-3 text-[clamp(2rem,3vw,2.75rem)]'>What makes our app special</h2>
                    <p className='max-w-4xl text-slate-500 leading-[1.8]'>
                        We combine fast drawing, collaborative communication, and polished motion
                        to keep every session feeling alive.
                    </p>
                </div>

                <div className="grid gap-6 mt-10 lg:grid-cols-2 grid-cols-1">
                    {features.map((feature, index) => (
                        <div
                            key={feature.title}
                            className="px-8 py-6 rounded-3xl bg-white border border-[rgba(15,23,42,0.06)] shadow-[0_16px_40px_rgba(15,23,42,0.08)] will-change-transform transition-all duration-300 ease-in-out hover:shadow-[0_22px_50px_rgba(15,23,42,0.2)] hover:scale-105">
                            <span className="inline-block font-semibold mb-4 text-blue-400">0{index + 1}</span>
                            <h3 className='mb-3 text-2xl'>{feature.title}</h3>
                            <p className='m-0 text-slate-600 leading-[1.75] text-md'>{feature.description}</p>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    )
}