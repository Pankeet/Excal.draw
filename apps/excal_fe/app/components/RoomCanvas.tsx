"use client";
import { useEffect, useState } from "react";
import Canvas from "./canvas";

export default function RoomCanvas({roomId} : {roomId : string}){
    const [socket, setsocket] = useState<WebSocket | null>(null);

    useEffect(() => {
      const ws = new WebSocket("ws:localhost:8080");
      ws.onopen = () => {
        setsocket(ws);
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