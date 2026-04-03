import { useEffect, useRef } from "react";
import { initDraw } from "../draw";

export default function Canvas({roomId,socket} : {roomId : string;socket:WebSocket}){
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
      const canvas = canvasRef.current;
      if(canvas) {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        initDraw(canvas,roomId,socket);
      } 
    },[roomId,socket]); 

   return (
    <div>
      <h1 className="text-3xl font-bold underline">
        Chat Room !
      </h1>
      <canvas ref={canvasRef} width={2000} height={1000}/>
    </div>
  );
}