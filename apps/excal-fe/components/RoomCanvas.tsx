"use client";
import { useEffect, useState } from "react";
import Canvas from "./Canvas";

export default function RoomCanvas({roomId} : Readonly<{roomId : string}>){
    const [socket, setsocket] = useState<WebSocket | null>(null);
    const [token] = useState<string | null>(() => {
      if(globalThis.window === undefined) return null;
      return localStorage.getItem("token");
    });
    
    useEffect(() => {
      if(!token) return;
      const ws = new WebSocket(`wss://excal-draw.onrender.com?token=${token}`);
      ws.onopen = () => {
        setsocket(ws);
        ws.send(JSON.stringify({
          type : "join",
          roomId : roomId
        }))
      }
      return () => {
        ws.close();
      };

    },[roomId,token])
  
    if(!socket){
      return (
        <div className="flex justify-left w-full text-2xl text-red-400">
          Connecting....
        </div>
      )
    }
    
   if(!token) {
      return (
        <div className="flex justify-center items-center h-screen text-xl text-red-800">  
          Please login first to access the chat room.        
        </div>
      )
    }

  return (
    <Canvas roomId={roomId} socket={socket} token={token} />
  )
}