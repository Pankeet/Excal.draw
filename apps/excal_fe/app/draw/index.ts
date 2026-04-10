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
        ctx.stroke();
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

    try{
      const shapes = messages.map((x : {message : string}) => {
          const messageData = JSON.parse(x.message);
          return messageData;
      });
      return shapes;
  }catch(e){
    console.error(e);
    alert("Sorry ! We are unable to fetch the older chats at the moment !");
    return [];
  }
}

export function initDraw(
  canvas: HTMLCanvasElement,
  roomId: string,
  socket: WebSocket,
  token : string,
  selectedTool : "rect" | "circle" | "pencil"
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
    let shape : Shape;
    const width = pos.x - startX;
    const height = pos.y - startY;
    if(selectedTool === "rect"){
      shape = {
        type: "rect",
        x: startX,
        y: startY,
        width,
        height,
      };
    }
    else if(selectedTool === "circle"){
     const centerX = startX + width / 2;
     const centerY = startY + height / 2;

      const radius = Math.hypot(width, height) / 2;
      shape = {
        type : "circle",
        x : centerX,
        y : centerY,
        radius : radius
      }
    }
    else {
      return;
    }
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
    if(selectedTool === "rect"){
      ctx.strokeStyle = "white";
      ctx.lineWidth = 2;
      ctx.strokeRect(startX, startY, width, height);
    }
    else if(selectedTool === "circle"){
      const radiusX = startX + width / 2;
      const radiusY = startY + height / 2;
      const radius = Math.hypot(width, height) / 2;
      ctx.beginPath();
      ctx.arc(radiusX,radiusY,radius,0,2 * Math.PI);
      ctx.strokeStyle = "white";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
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