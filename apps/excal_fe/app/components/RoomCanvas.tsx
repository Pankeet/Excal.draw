"use client";
import { useEffect, useState } from "react";
import Canvas from "./Canvas";

export default function RoomCanvas({roomId} : {roomId : string}){
    const [socket, setsocket] = useState<WebSocket | null>(null);
    const [token, setToken] = useState<string | null>(null);
    
    useEffect(() => {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);
      if (!storedToken) return;
      const ws = new WebSocket(`ws://localhost:8080?token=${storedToken}`);
      ws.onopen = () => {
        setsocket(ws);
        ws.send(JSON.stringify({
          type : "join",
          roomId : roomId
        }))
      }
    },[roomId])

  if(!socket){
    return (
      <div className="flex justify-center items-center">
        Connecting to server....
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