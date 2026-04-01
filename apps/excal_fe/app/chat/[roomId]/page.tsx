"use client";
import { initDraw } from "@/app/draw";
import { useEffect , useRef } from "react";

export default function Home() {  

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if(canvas) {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      initDraw(canvas);
    } 

    return () => {
      if(canvas) {
        const ctx = canvas.getContext("2d");
        if(ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      } 
    }
  }, []); 

  return (
    <div>
      <h1 className="text-3xl font-bold underline">
        Chat Room !
      </h1>
      <canvas ref={canvasRef} width={2000} height={1000}/>
    </div>
  );
}
