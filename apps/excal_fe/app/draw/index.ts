import axios from "axios";

type Shape = {
    type : "rect";
    x: number;
    y: number;
    width: number;
    height: number;
} | {
    type : "circle";
    x: number;
    y: number;
    radius: number;
} ;

function getMousePos(canvas: HTMLCanvasElement, e: MouseEvent) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}

function preCanvas(exsistingshapes: Shape[], ctx : CanvasRenderingContext2D, canvas : HTMLCanvasElement){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  exsistingshapes.forEach((shape) => {
      if(shape.type === "rect"){
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
      }

      if(shape.type === "circle"){
        ctx.beginPath();
        ctx.arc(shape.x, shape.y, shape.radius, 0, Math.PI * 2);
        ctx.fillStyle = "royalblue";
        ctx.fill();
      }
  })
}

async function getexsistingShapes(roomId : string , token : string ) : Promise<Shape []> {
    const res = await axios.get(`http://localhost:8000/api/v1/chats/${roomId}`,{
        headers: {
            Authorization: token
        }
    });
    
    const messages = res.data?.messages || [];

    const shapes = messages.map((x : {message : string}) => {
        const messageData = JSON.parse(x.message);
        return messageData;
    });
    return shapes;
}

export function initDraw(
  canvas: HTMLCanvasElement,
  roomId: string,
  socket: WebSocket,
  token : string
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};

  let exsistingshapes: Shape[] = [];
  getexsistingShapes(roomId, token).then((shapes) => {
    exsistingshapes = shapes;
    preCanvas(exsistingshapes, ctx, canvas);
  });

  const handleMessage = (event: MessageEvent) => {
    const message = JSON.parse(event.data);
    if (message.type === "chat") {
      const parsedShape = JSON.parse(message.message);
      exsistingshapes.push(parsedShape);
      preCanvas(exsistingshapes, ctx, canvas);
    }
  };

  socket.addEventListener("message", handleMessage);

  let clicked = false;
  let startX = 0;
  let startY = 0;

  const handleMouseDown = (e: MouseEvent) => {
    clicked = true;
    const pos = getMousePos(canvas, e);
    startX = pos.x;
    startY = pos.y;
  };

  const handleMouseUp = (e: MouseEvent) => {
    clicked = false;
    const pos = getMousePos(canvas, e);
    const width = pos.x - startX;
    const height = pos.y - startY;

    const shape = {
      type: "rect" as const,
      x: startX,
      y: startY,
      width,
      height,
    };

    exsistingshapes.push(shape);
    preCanvas(exsistingshapes, ctx, canvas);
    socket.send(
      JSON.stringify({
        type: "chat",
        roomId,
        message: JSON.stringify(shape),
      })
    );
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!clicked) return;
    const pos = getMousePos(canvas, e);
    const width = pos.x - startX;
    const height = pos.y - startY;
    preCanvas(exsistingshapes, ctx, canvas);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.strokeRect(startX, startY, width, height);
  };

  canvas.addEventListener("mousedown", handleMouseDown);
  canvas.addEventListener("mouseup", handleMouseUp);
  canvas.addEventListener("mousemove", handleMouseMove);

  return () => {
    canvas.removeEventListener("mousedown", handleMouseDown);
    canvas.removeEventListener("mouseup", handleMouseUp);
    canvas.removeEventListener("mousemove", handleMouseMove);
    socket.removeEventListener("message", handleMessage);
    socket.onmessage = null;
  };
}