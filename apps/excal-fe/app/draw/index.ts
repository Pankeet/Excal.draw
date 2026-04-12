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
} | {
  type : "text",
  x: number,
  y: number,
  text: string
} | {
  type : "pencil",
  x : number,
  y : number
};

function getMousePos(canvas: HTMLCanvasElement, e: MouseEvent) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}

function SendMsg(socket : WebSocket, roomId : string , shape : Shape){
  socket.send(
      JSON.stringify({
        type: "chat",
        roomId,
        message: JSON.stringify(shape),
      })
    );
}

function getInputElement(pos : {x:number, y:number}) : HTMLInputElement{
  const input = document.createElement("input");
      input.type = "text";
      input.style.position = "absolute";
      input.style.left = `${pos.x}px`;
      input.style.top = `${pos.y}px`;
      input.style.font = "16px Arial";
      input.style.border = "none";
      input.style.borderBottom = "2px solid white";
      input.style.padding = "4px 6px";
      input.style.outline = "none";
      input.style.background = "transparent";
      input.style.color = "white";

      return input;
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

      if(shape.type === "text"){
        ctx.font = "16px Arial";
        ctx.fillStyle = "white";
        ctx.fillText(shape.text, shape.x, shape.y);
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
  selectedTool : Shape["type"]
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};

  let exsistingshapes: Shape[] = [];
  let shape : Shape;
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
    if(selectedTool === "text"){
      e.preventDefault();   
      e.stopPropagation();
      const input = getInputElement(pos);
      document.body.appendChild(input);
      input.focus();
      let removed = false;

      const removeInput = () => {
        if (removed) return;
        submit();
      };

      const submit = () => {
        const text = input.value.trim();
        if (text) {
          const shape: Shape = {
            type: "text",
            x: pos.x,
            y: pos.y,
            text,
          };

          exsistingshapes.push(shape);
          preCanvas(exsistingshapes, ctx, canvas);
          SendMsg(socket, roomId, shape);
        }
        input.remove();
        removed = true;
      };

      input.addEventListener("blur", removeInput);
    }
  };

  const handleMouseUp = (e: MouseEvent) => {
    clicked = false;
    const pos = getMousePos(canvas, e);
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
    SendMsg(socket,roomId,shape);
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
    else if(selectedTool === "text"){
      canvas.style.cursor = "text";
    }
    else {
       canvas.style.cursor = "crosshair"
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