"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@repo/ui/button";
import { UserDetails , RoomDetails} from "./ProfilePageTypes";
import RoomList from "./RoomCard";
import { getUserRoomDetails, getUserDetails } from "./fetchUserDetails";


export default function ProfilePage(){

    const hoverStyles = "-mb-3 border-b-2 border-transparent hover:border-purple-700/90 hover:text-purple-700/90 dark:text-white transition-all duration-200"

    const router = useRouter();
    const [userDetails,setUserDetails] = useState<UserDetails | null>(null);
    const [roomDetails,setRoomDetails] = useState<RoomDetails[] | null>(null);
    const [token] = useState<string | null>(() => {
      if(globalThis.window === undefined) return null;
      return localStorage.getItem("token");
    });


    useEffect(() => {
        if(!token) return;

        const getUser = async () => {
            const data = await getUserDetails(token);
            if(data) setUserDetails(data)
            else {
                localStorage.removeItem("token");
                router.push('/signin');
            }
        }

        const getUserRooms = async () => {
            const data = await getUserRoomDetails(token);
            if(data) setRoomDetails(data);
        }

        getUser();
        getUserRooms();
    },[token,router]);

    function Logout(){
        const token =  localStorage.getItem("token");
        if(token) localStorage.removeItem("token");
        router.push('/');
    }

    return (
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
                    <div>
                        <RoomList roomDetails={roomDetails} token={token ?? ""} getUserRoomDetails={async () => {
                            const data = await getUserRoomDetails(token);
                            setRoomDetails(data);
                        }}/>
                    </div>
                </div>
            </div>
        </div>
    )
}