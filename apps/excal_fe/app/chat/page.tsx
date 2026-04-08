"use client"
import gsap from "gsap";
import axios from "axios";
import { Button } from "@repo/ui/button";
import { InputBox } from "@repo/ui/input";
import { useLayoutEffect, useRef , useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/header";

export default function ChatPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [ roomName , setroomName] = useState("");
     const [ joinroomName , setjoinroom] = useState("");
    const router = useRouter();

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from("h1", { duration: 1, y: -50, opacity: 0 });
            gsap.from("p", { duration: 1, y: 50, opacity: 0, delay: 0.4 });
        }, containerRef);

        return () => ctx.revert(); 
    }, []);

    async function create_room(){
        if(roomName.trim() === ""){
            alert("Room Name cannot be Empty !");
            return;
        }

        const token = localStorage.getItem("token");
        const data = {
            slug : roomName
        }
        try{
            const res = await axios.post("http://localhost:8000/api/v1/create-room", data, {
                headers : {
                    Authorization : token
                }
            });
            const roomId = res.data.roomId;
            router.push(`/chat/${roomId}`);
        }catch (e: unknown) {
            if (axios.isAxiosError(e)) {
                alert(e.response?.data?.message || "Something went wrong");
            } else {
                alert("Server not reachable!");
            }
            console.error(e);
        }
    }

    async function join_room(){
        if(joinroomName.trim() === ""){
            alert("Room Name cannot be Empty !");
            return;
        }

        const token = localStorage.getItem("token");
        try{
            const res = await axios.get(`http://localhost:8000/api/v1/room/${joinroomName}`,{
                headers : {
                    Authorization : token
                }
            });
            const roomId = res.data.roomId;
            router.push(`/chat/${roomId}`);
        }catch (e: unknown) {
            if (axios.isAxiosError(e)) {
                alert(e.response?.data?.message || "Something went wrong");
            } else {
                alert("Server not reachable!");
            }
            console.error(e);
        }
    }

    return (
        <>   
            <Header />     
            <div ref={containerRef} className="grid place-content-center h-screen">
                <h1 className="lg:text-4xl text-lg font-bold font-serif mb-4">
                    Welcome to the <b className="text-purple-600">Chat Page !</b>
                </h1>
                <p className="text-center lg:text-lg text-md text-gray-700 ">
                    This is where you can chat with your <i className="text-purple-600">friends</i>.
                </p>
                <div className="lg:mt-10 mt-7 flex flex-col justify-center items-center">
                    <InputBox inputTitle="Room-Name :" type="text" placeholder="Math_PnC" size="lg" value={roomName} onChange={(e) => setroomName(e.target.value)} 
                    onKeyDown={(e) => {
                        if(e.key === "Enter" && !e.shiftKey){
                            e.preventDefault();
                            create_room();
                        }
                    }}/>
                    <Button name="Create Room" variant="primary" size="lg" onClick={create_room} />
                </div>
                <div className="lg:mt-10 mt-7 flex flex-col justify-center items-center">
                    <InputBox inputTitle="Room-Name :" type="text" size="lg" value={joinroomName} onChange={(e) => setjoinroom(e.target.value)} 
                    onKeyDown={(e) => {
                        if(e.key === "Enter" && !e.shiftKey){
                            e.preventDefault();
                            join_room();
                        }
                    }}/>
                    <Button name="Join Room" variant="primary" size="lg" onClick={join_room} />
                </div>
            </div>
        </>
    );
}