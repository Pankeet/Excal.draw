import { useEffect, useRef , useState } from "react";
import { initDraw } from "../draw";
import IconButton from "./IconButton";
import { Circle, Pencil , RectangleHorizontal, Type } from "lucide-react";

type Shape = "circle" | "rect" | "text" | "pencil" ;

export default function Canvas({roomId,socket,token} : Readonly<{roomId : string; socket:WebSocket; token : string}>){
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [selectedTool , setselectedTool ] = useState<Shape>("rect");
    const toolRef = useRef<Shape>("rect");

    useEffect(() => {
      const canvas = canvasRef.current;
      if(canvas) {
        toolRef.current = selectedTool;
        const cleanup = initDraw(canvas,roomId,socket,token,toolRef.current);
        return cleanup;
      } 
    },[roomId,socket,token,selectedTool]); 

   return (
    <div className="overflow-hidden">
      <TopBar activated={selectedTool} setactivated={setselectedTool}/>
      <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight}/>
    </div>
  );
}

function TopBar({
  activated,setactivated
}:Readonly<{
  activated : Shape,
  setactivated : (s: Shape) => void
}>){
  return (
    <div className="fixed top-4 left-1/2 z-20 -translate-x-1/2 border border-bg p-3 rounded-2xl">
      <div className="flex gap-3">

        <IconButton 
          onClick={() => {
            setactivated("pencil");
          }}
          icon={<Pencil />} 
          activated={activated === "pencil"} />

        <IconButton 
          onClick={() => {
            setactivated("circle");
          }}
          icon={<Circle />}
          activated={activated === "circle"} />

        <IconButton
          onClick={() => {
            setactivated("rect");
          }}
          icon={<RectangleHorizontal />}
          activated={activated === "rect"} />

          <IconButton
          onClick={() => {
            setactivated("text");
          }}
          icon={<div><Type /></div>}
          activated={activated === "text"} />
      </div>
    </div>
  )
}