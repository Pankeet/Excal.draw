"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import toast from "react-hot-toast"
import { Button } from "@repo/ui/button";
import Header from "@/components/Header";

type UserDetails = {
    username : string,
    email : string,
    avatar : string,
    rooms : string[],
    chats : string[]
}

export default function ProfilePage(){

    const hoverStyles = "-mb-3 border-b-2 border-transparent hover:border-purple-700/90 hover:text-purple-700/90 dark:text-white transition-all duration-200"

    const router = useRouter();
    const [userDetails,setUserDetails] = useState<UserDetails | null>();
    const [token] = useState<string | null>(() => {
      if(globalThis.window === undefined) return null;
      return localStorage.getItem("token");
    });

    useEffect(() => {
        if(!token) return;

        const getUserDetails = async () =>{
            const toastId = toast.loading("Loading User Profile.....")
            try{
                const res = await axios.get("https://excal-draw-http-server.onrender.com/api/v1/user-details", {
                    headers : {
                        Authorization : token
                    }
                });
                toast.success("",{id:toastId});
                setUserDetails(res.data);
            }catch (e: unknown) {
                if (axios.isAxiosError(e)) {
                    toast.error(e.response?.data?.message || "Something went wrong" , {id:toastId});
                } else {
                    toast.error("Server not reachable!", {id:toastId});
                }
                console.error(e);
                router.push('/signup')
            }
        };
        getUserDetails();
    },[token,router]);

    function Logout(){
        const token =  localStorage.getItem("token");
        if(token) localStorage.removeItem("token");
        router.push('/');
    }

    return (
    <>
        <Header />
        <div className="flex justify-between mx-auto gap-8 w-screen h-screen bg-linear-to-br from-white to-[#eae6ff] pt-6 font-serif dark:from-slate-700 dark:to-slate-900">
            <div className="bg-white/60 backdrop-blur-xl dark:bg-slate-800/60 rounded-3xl shadow-lg mt-20 ml-10 h-9/12">
                <div className="flex flex-col h-full mt-10">
                    <div className="relative flex justify-center">
                        <div className="absolute w-24 h-24 bg-purple-600/80 blur-3xl animate-pulse rounded-full"></div>
                        <div className="z-10">
                            <Image
                            height={80}
                            width={80}
                            className="w-24 h-24 rounded-3xl"
                            alt="Profile Picture"
                            src={userDetails?.avatar || "/default-avatar.png"}
                            />
                        </div>
                    </div>
                    <div className="w-full max-h-full text-center pb-4 -mt-6 pt-10 bg-white/50 backdrop-blur-xl shadow-[0_-8px_20px_rgba(0,0,0,0.08)] rounded-3xl">
                        <div className="text-3xl text-slate-900 mt-3 px-6">{userDetails?.username}</div>
                        <div className="text-lg text-slate-700/50 mt-2 px-6">Product Manager Google</div>
                        <div className="flex gap-5 justify-center mt-6">
                            <Button variant="primary" size="md" name="New Chat" onClick={() => {}}/>
                            <Button variant="secondary" size="md" name="Logout" onClick={() => Logout()} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-lg mt-20 p-6 mr-24">
                <div className="flex justify-between gap-96">
                    <span className="text-2xl text-slate-900 dark:text-white">My Whiteboards</span>
                    <Button name="View all" variant="secondary" size="sm" onClick={() => router.push('/chat')} />
                </div>
                <div className="flex justify-start gap-5 mt-4 border-b border-slate-400/40 py-3 text-slate-900 text-lg">
                    <div className={hoverStyles}>
                        Recent
                    </div>
                    <div  className={hoverStyles}>
                        Favourites
                    </div>
                    <div  className={hoverStyles}>
                        Public
                    </div>
                </div>
                <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-lg py-10 px-3">
                    <div className="text-black text-xl">
                        Recent Whiteboards
                    </div>
                </div>
            </div>
        </div>
    </>
    )
}