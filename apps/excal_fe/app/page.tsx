"use client";
import { Button } from "@repo/ui/button";
import { InputBox } from "@repo/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {  

  const router = useRouter();
  const [ roomid , setroomid] = useState("");

  return (
    <div className="grid place-items-center">
      <h1 className="text-3xl font-serif">
        Excal.Com
      </h1>
      <InputBox type="number" size="md" inputTitle="roomId" value={roomid} onChange={(e) => setroomid(e.target.value)}  />
      <Button variant="primary" size="md" name="create-room" onClick={ () => router.push(`/chat/${roomid}`)} />
    </div>
  );
}
