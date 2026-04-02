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

    exsistingshapes.map((shape) => {
        if(shape.type === "rect"){
            ctx.strokeStyle = "white";
            ctx.lineWidth = 2;
            ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
        }
    })
}

async function getexsistingShapes(roomId : string){
    const res = await axios.get(`http://localhost:8000/api/v1/chats/${roomId}`);
    const messages = res.data?.messages;

    const shapes = messages.map((x : {message : string}) => {
        const messageData = JSON.parse(x.message);
        return messageData;
    });
    return shapes;
}

export async function initDraw(canvas : HTMLCanvasElement , roomId : string , socket : WebSocket) {

        const exsistingshapes: Shape[] = await getexsistingShapes(roomId);
        const ctx = canvas.getContext("2d");
        if(!ctx) return;

        ctx.fillStyle = "rgba(0,0,0)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        preCanvas(exsistingshapes,ctx,canvas);

        let clicked = false;
        let startX = 0;
        let startY = 0;
        
        canvas.addEventListener("mousedown",(e) => {
            clicked = true;
            const pos = getMousePos(canvas,e);
            startX = pos.x;
            startY = pos.y;
        });

        canvas.addEventListener("mouseup", (e) => {
            clicked = false;
            const pos = getMousePos(canvas,e);
            const width = pos.x - startX;
            const height = pos.y - startY;

            exsistingshapes.push({
                type : "rect",
                x : startX,
                y : startY,
                width : width,
                height : height
            })
        })

        canvas.addEventListener("mousemove", (e) => {   
            if(clicked) {
                const pos = getMousePos(canvas,e);
                const width = pos.x - startX;
                const height = pos.y - startY;
                preCanvas(exsistingshapes,ctx,canvas);
                ctx.strokeStyle = "white";
                ctx.lineWidth = 2;
                ctx.strokeRect(startX, startY, width, height);
            }
        });
}