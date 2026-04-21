import { useEffect, useRef , useState } from "react";
import IconButton from "./IconButton";
import { Circle, Pencil , RectangleHorizontal, Type } from "lucide-react";
import { DrawFunction } from "../app/draw/Draw";

type Shape = "circle" | "rect" | "text" | "pencil" ;

export default function Canvas({roomId,socket,token} : Readonly<{roomId : string; socket:WebSocket; token : string}>){
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const drawRef = useRef<DrawFunction | null>(null);
    const [selectedTool , setselectedTool ] = useState<Shape>("rect");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    drawRef.current?.destroy();

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      drawRef.current?.preCanvas();
  };

    const draw = new DrawFunction(canvas, roomId, token, socket);
    drawRef.current = draw;
    draw.init();

    window.addEventListener("resize", resize);

    return () => {
      draw.destroy();
      window.removeEventListener("resize", resize);
    };
  }, [roomId, socket, token]);

    useEffect(() => {
      drawRef.current?.setTool(selectedTool);
    },[selectedTool])

    const getCursor = (tool: Shape): React.CSSProperties["cursor"] => {
      switch (tool) {
        case "text":
          return "text";
        case "pencil":
          return "url(/pencil.png), auto";
        default:
          return "crosshair";
    }
  };
   return (
    <div className="overflow-hidden">
      <TopBar activated={selectedTool} setactivated={setselectedTool}/>
      <canvas 
        ref={canvasRef} 
        width={window.innerWidth} 
        height={window.innerHeight}
        style={{cursor : getCursor(selectedTool)}}
        />
    </div>
  );
}

function TopBar({activated,setactivated}:Readonly<{
  activated : Shape,
  setactivated : (s: Shape) => void
}>){
  return (
    <div className="fixed top-4 left-1/2 z-10 -translate-x-1/2 border border-bg p-3 rounded-2xl">
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