export function drawAll(ctx, state, trazoActual=[]){

    ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);

    state.trazos.forEach(t=>{
        ctx.beginPath();

        if(t.tipo==="line"){
            ctx.strokeStyle = t.color;
            ctx.lineWidth = t.size;
            ctx.moveTo(t.x1,t.y1);
            ctx.lineTo(t.x2,t.y2);
            ctx.stroke();
        }

        if(["pen","highlighter","eraser"].includes(t.tipo)){

            if(t.tipo==="eraser"){
                ctx.globalCompositeOperation="destination-out";
                ctx.lineWidth = t.size*2;
            } else {
                ctx.globalCompositeOperation="source-over";
                ctx.strokeStyle = t.color;
                ctx.lineWidth = t.size;
                ctx.globalAlpha = t.tipo==="highlighter"?0.3:1;
            }

            t.puntos.forEach((p,i)=>{
                if(i===0) ctx.moveTo(p.x,p.y);
                else ctx.lineTo(p.x,p.y);
            });

            ctx.stroke();
            ctx.globalAlpha=1;
        }

        if(t.tipo==="text"){
            ctx.fillStyle = t.color;
            ctx.fillText(t.texto,t.x,t.y);
        }
    });

    // trazo en vivo
    if(trazoActual.length>0){
        ctx.beginPath();
        trazoActual.forEach((p,i)=>{
            if(i===0) ctx.moveTo(p.x,p.y);
            else ctx.lineTo(p.x,p.y);
        });
        ctx.stroke();
    }
}