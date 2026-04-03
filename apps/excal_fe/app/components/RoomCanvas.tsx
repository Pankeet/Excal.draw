"use client";
import { useEffect, useState } from "react";
import Canvas from "./Canvas";

export default function RoomCanvas({roomId} : {roomId : string}){
    const [socket, setsocket] = useState<WebSocket | null>(null);
    //const token = localStorage.getItem("token");

    useEffect(() => {
      const ws = new WebSocket(`ws://localhost:8080?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJkOTVmYmRmZi00NWZkLTRlYjAtOTBmNS02YzdkNzIxYjhiNTYiLCJlbWFpbCI6InBhbmtlZXQxNkBnbWFpbC5jb20iLCJpYXQiOjE3NzUyMTkyMTgsImV4cCI6MTc3NTI0MDgxOH0.1z075_GxvTEOXWr-jyWdh87FHotyol4DKZQCEtDVEPc`);
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