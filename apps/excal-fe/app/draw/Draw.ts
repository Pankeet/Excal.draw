import { getexsistingShapes } from "./GetExsistingShapes";
import { Shape } from "./Shape";

export class DrawFunction {
    private readonly canvas: HTMLCanvasElement;
    private readonly ctx: CanvasRenderingContext2D;
    private readonly token : string;
    private shape : Shape | undefined;
    private handleMessage!: (event: MessageEvent) => void;
    private handleMouseDown!: (event: MouseEvent) => void;
    private handleMouseUp!: (event: MouseEvent) => void;
    private handleMouseMove!: (event: MouseEvent) => void;    
    protected existingShapes : Shape [];
    protected readonly roomId : string;
    protected readonly Socket : WebSocket;
    protected selectedTool : Shape["type"];
    
    protected clicked: boolean = false;
    protected startX : number;
    protected startY :  number; 

    constructor(canvas : HTMLCanvasElement, roomId : string , token : string , socket : WebSocket){
        this.canvas = canvas;
        const ctx = this.canvas.getContext("2d");
        if(!ctx) throw new Error("Canvas not supported !");
        this.ctx = ctx;
        this.Socket = socket;
        this.existingShapes = [];
        this.roomId = roomId;
        this.token = token;
        this.startX = 0;
        this.startY = 0;
        this.selectedTool = "rect";
        this.initHandler();
        this.mouseHandler();
        console.log("DrawFunction created");
    }

    destroy() {
        console.log("DrawFunction destroyed");
        this.canvas.removeEventListener("mousedown", this.handleMouseDown);
        this.canvas.removeEventListener("mouseup", this.handleMouseUp);
        this.canvas.removeEventListener("mousemove", this.handleMouseMove);
        this.Socket.removeEventListener("message", this.handleMessage);
    }  

    setTool(tool : Shape["type"]){
        this.selectedTool = tool;
        this.clicked = false;
    }

    async init(){
        const shapes = await getexsistingShapes(this.roomId, this.token) 
        this.existingShapes = shapes;
        this.preCanvas();
    }

    initHandler() {
        this.handleMessage = (event: MessageEvent) => {
        const message = JSON.parse(event.data);
        if (message.type === "chat") {
            const parsedShape = JSON.parse(message.message);
            this.existingShapes.push(parsedShape);
            this.preCanvas();
        }
        }
        this.Socket.addEventListener("message", this.handleMessage);
    }

    getMousePos(e: MouseEvent) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    SendMsg(){
        if(!this.shape) return;
        this.Socket.send(
            JSON.stringify({
                type: "chat",
                roomId : this.roomId,
                message: JSON.stringify(this.shape),
            })
        );
    }

    getInputElement(pos : {x:number, y:number}) : HTMLInputElement{
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

    protected preCanvas(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.existingShapes.forEach((shape) => {
            if(shape.type === "rect"){
                this.ctx.strokeStyle = "white";
                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
            }

            if(shape.type === "circle"){
                this.ctx.beginPath();
                this.ctx.arc(shape.x, shape.y, shape.radius, 0, Math.PI * 2);
                this.ctx.stroke();
            }

            if(shape.type === "text"){
                this.ctx.font = "16px Arial";
                this.ctx.fillStyle = "white";
                this.ctx.fillText(shape.text, shape.x, shape.y);
            }
        })
    }

    protected mouseHandler(){
        this.canvas.style.cursor = this.selectedTool === "text" ? "text" : "crosshair";
        this.handleMouseDown = (e: MouseEvent) => {
            this.clicked = true;
            const pos = this.getMousePos(e);
            this.startX = pos.x;
            this.startY = pos.y;
            if(this.selectedTool === "text"){
              e.preventDefault();   
              e.stopPropagation();
              this.clicked = false;
              const input = this.getInputElement(pos);
              document.body.appendChild(input);
              input.focus();
              let removed : boolean = false;
        
              const removeInput = () => {
                if (removed) return;
                submit();
              };
        
              const submit = () => {
                const text : string = input.value.trim();
                if (text) {
                  this.shape = {
                    type: "text",
                    x: pos.x,
                    y: pos.y,
                    text: text,
                  };
        
                  this.existingShapes.push(this.shape);
                  this.preCanvas();
                  this.SendMsg();
                }

                input.remove();
                removed = true;
              };
              input.addEventListener("blur", removeInput);
            }
          };
        
        this.handleMouseUp = (e: MouseEvent) => {
            this.clicked = false;
            const pos = this.getMousePos(e);
            const width = pos.x - this.startX;
            const height = pos.y - this.startY;

            if(this.selectedTool === "rect"){
                this.shape = {
                    type: "rect",
                    x: this.startX,
                    y: this.startY,
                    width,
                    height,
                };
            }
            else if(this.selectedTool === "circle"){
                const centerX = this.startX + width / 2;
                const centerY = this.startY + height / 2;

                const radius = Math.hypot(width, height) / 2;
                this.shape = {
                    type : "circle",
                    x : centerX,
                    y : centerY,
                    radius : radius
                }
            }

            else {
                return;
            }

            this.existingShapes.push(this.shape);
            this.preCanvas();
            this.SendMsg();
        };

        this.handleMouseMove = (e: MouseEvent) => {
            if (!this.clicked) return;
            const pos = this.getMousePos(e);
            const width = pos.x - this.startX;
            const height = pos.y - this.startY;
            this.preCanvas();
            if(this.selectedTool === "rect"){
                this.ctx.strokeStyle = "white";
                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(this.startX, this.startY, width, height);
            }
            else if(this.selectedTool === "circle"){
                const radiusX = this.startX + width / 2;
                const radiusY = this.startY + height / 2;
                const radius = Math.hypot(width, height) / 2;
                this.ctx.beginPath();
                this.ctx.arc(radiusX,radiusY,radius,0,2 * Math.PI);
                this.ctx.strokeStyle = "white";
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
            }
        };

        this.canvas.addEventListener("mousedown", this.handleMouseDown);
        this.canvas.addEventListener("mouseup", this.handleMouseUp);
        this.canvas.addEventListener("mousemove", this.handleMouseMove);
    }
};