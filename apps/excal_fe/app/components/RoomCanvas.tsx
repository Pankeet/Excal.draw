"use client";
import { useEffect, useState } from "react";
import Canvas from "./Canvas";

export default function RoomCanvas({roomId} : {roomId : string}){
    const [socket, setsocket] = useState<WebSocket | null>(null);
    //const token = localStorage.getItem("token");

    useEffect(() => {
      const ws = new WebSocket(`ws://localhost:8080?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJkOTVmYmRmZi00NWZkLTRlYjAtOTBmNS02YzdkNzIxYjhiNTYiLCJlbWFpbCI6InBhbmtlZXQxNkBnbWFpbC5jb20iLCJpYXQiOjE3NzUxOTM0NTEsImV4cCI6MTc3NTIxNTA1MX0.Eif-TSvoO_HK533ld-IorDs6guQX8baTTdgstq4AORw`);
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
      <div>
        Connecting to server....
      </div>
    )
  }

  return (
    <Canvas roomId={roomId} socket={socket} />
  )
}