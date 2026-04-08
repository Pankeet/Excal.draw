import { useEffect, useRef } from "react";
import { initDraw } from "../draw";

export default function Canvas({roomId,socket,token} : {roomId : string; socket:WebSocket; token : string}){
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
      const canvas = canvasRef.current;
      if(canvas) {
        const cleanup = initDraw(canvas,roomId,socket,token);
        return cleanup;
      } 
    },[roomId,socket,token]); 

   return (
    <div>
      <canvas ref={canvasRef} width={2000} height={1000}/>
    </div>
  );
}