import { useEffect, useRef } from "react";
import { initDraw } from "../draw";

export default function Canvas({roomId,socket,token} : {roomId : string; socket:WebSocket; token : string}){
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
      const canvas = canvasRef.current;
      if(canvas) {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        initDraw(canvas,roomId,socket,token);
      } 
    },[roomId,socket,token]); 

   return (
    <div>
      <canvas ref={canvasRef} width={2000} height={1000}/>
    </div>
  );
}