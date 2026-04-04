'use client'
import gsap from 'gsap';
import { useEffect, useRef } from 'react';

type feature = {
    title :string,
    description : string
}

const features : feature[] = [
    {
        title: 'Real-time Collaboration :',
        description:
            'Multiple users can draw, edit, and chat together in a shared whiteboard session.',
    },
    {
        title: 'Interactive Drawing Tools :',
        description:
            'Shape, text, freehand and object tools designed for quick idea capture and visual thinking.',
    },
    {
        title: 'Live Chat & Comments :',
        description:
            'Stay in sync with teammates through integrated chat and contextual feedback.',
    },
    {
        title: 'Smooth Animations :',
        description:
            'GSAP-powered motion adds polish and improves the flow of every interaction.',
    },
]

export default function AboutPage() {
    const heroRef = useRef<HTMLDivElement | null>(null)
    const cardRefs = useRef<HTMLDivElement[]>([])

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(heroRef.current, {
                y: 40,
                opacity: 0,
                duration: 0.5,
                ease: 'power3.out',
            })

            gsap.from(cardRefs.current, {
                y: 30,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out',
                delay: 0.3,
            })
        })

        return () => ctx.revert()
    }, [])

    return (
        <main className="font-serif px-8 py-12 max-w-295 lg:my-16 md:my-14 my-12 mx-auto min-h-screen text-slate-900 bg-linear-to-tl from-[#f8fbff] to-white">
            <section className="grid lg:gap-10 gap-5 align-items-center mb-16 lg:grid-cols-[1.1fr_1fr]" ref={heroRef}>
                <div>
                    <p className="inline-block mb-4 text-[#2563eb] font-semibold tracking-[0.18rem]">ABOUT US</p>
                    <h1 className='leading-[1.05] m-0 text-[clamp(2rem,4vw,4rem)]'>Build ideas together in a living whiteboard space.</h1>
                    <p className="mt-6 max-w-3xl text-slate-600 text-lg leading-normal">
                        Collaboration for creators, teams, and visual thinkers.
                        Share boards, chat in real time, and animate your workflow with smooth motion.
                    </p>
                </div>
                <div className="hero-visual relative flex justify-center items-center min-h-80">
                    <div className="absolute w-56 h-56 rounded-full bg-[rgba(37,99,235,0.12)] animate-pulse" />
                    <div className="relative p-8 w-full max-w-80 rounded-3xl text-center z-auto bg-[radial-gradient(circle_at_top_left,#ffffff,#eef5ff)] shadow-[0_28px_80px_rgba(15,23,42,0.12)]">
                        <span className='inline-flex px-3.5 py-2 bg-indigo-50 text-indigo-800 rounded-[999px] text-sm mb-4'>Live</span>
                        <strong className='block text-2xl mt-3 text-slate-900'>Multi-user Canvas</strong>
                    </div>
                </div>
            </section>

            <section className="pt-2">
                <div className="section-title">
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
                            className="px-8 py-6 rounded-3xl bg-white border border-[rgba(15,23,42,0.06)] shadow-[0_16px_40px_rgba(15,23,42,0.08)] transition-shadow duration-300 ease-in-out hover:-translate-y-1.5 hover:shadow-[0_22px_50px_rgba(15,23,42,0.12)]"
                            ref={(el) => {
                                if (!el) return
                                cardRefs.current[index] = el
                            }}
                        >
                            <span className="inline-block font-semibold mb-4 text-blue-400">0{index + 1}</span>
                            <h3 className='mb-3 text-2xl'>{feature.title}</h3>
                            <p className='m-0 text-slate-600 leading-[1.75]'>{feature.description}</p>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    )
}