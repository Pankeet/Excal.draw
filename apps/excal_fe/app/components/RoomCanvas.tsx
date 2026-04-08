"use client";
import { useEffect, useState } from "react";
import Canvas from "./Canvas";

export default function RoomCanvas({roomId} : {roomId : string}){
    const [socket, setsocket] = useState<WebSocket | null>(null);
    const [token] = useState<string | null>(() => {
      if(typeof window === "undefined") return null;
      return localStorage.getItem("token");
    });
    
    useEffect(() => {
      if(!token) return;
      const ws = new WebSocket(`ws://localhost:8080?token=${token}`);
      ws.onopen = () => {
        setsocket(ws);
        ws.send(JSON.stringify({
          type : "join",
          roomId : roomId
        }))
      }
    },[roomId,token])
  
  if(!socket){
    return (
      <div className="flex justify-center items-center">
        Cannot connect to server ! Please try again later 
      </div>
    )
  }

   if(!token) {
      return (
        <div className="flex justify-center items-center">  
          Please login first to access the chat room.        
        </div>
      )
    }

  
  return (
    <Canvas roomId={roomId} socket={socket} token={token} />
  )
}