"use client";
import { useEffect, useState } from "react";
import Canvas from "./Canvas";

export default function RoomCanvas({roomId} : {roomId : string}){
    const [socket, setsocket] = useState<WebSocket | null>(null);
    const token = localStorage.getItem("token");

    useEffect(() => {
      const ws = new WebSocket(`ws:localhost:8080?token=${token}`);
      ws.onopen = () => {
        setsocket(ws);
        ws.send(JSON.stringify({
          type: "create",
          roomId : roomId
        }));
        
        ws.send(JSON.stringify({
          type : "join",
          roomId : roomId
        }))
      }
    })

  if(!socket){
    return (
      <div>
        Connecting to server....
      </div>
    )
  }

  return (
    <Canvas roomId={roomId} socket={socket} />
  )
}