export function initDraw(canvas : HTMLCanvasElement) {

        const ctx = canvas.getContext("2d");
        if(!ctx) return;

        ctx.fillStyle = "rgba(0,0,0)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        let clicked = false;
        let startX = 0;
        let startY = 0;
        
        canvas.addEventListener("mousedown",(e) => {
            clicked = true;
            const rect = canvas.getBoundingClientRect();

            startX = e.clientX - rect.left;
            startY = e.clientY - rect.top;
        });

        canvas.addEventListener("mouseup", (e) => {
            clicked = false;
            console.log("Mouse Up at: ", e.clientX, e.clientY); 
        })

        canvas.addEventListener("mousemove", (e) => {   
            if(clicked) {
                const rect = canvas.getBoundingClientRect();

                const currentX = e.clientX - rect.left;
                const currentY = e.clientY - rect.top;

                const width = currentX - startX;
                const height = currentY - startY;

                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = "black";
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                ctx.strokeStyle = "white";
                ctx.lineWidth = 2;
                ctx.strokeRect(startX, startY, width, height);
            }
        });
}