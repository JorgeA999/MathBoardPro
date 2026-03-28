export function handleLine(state,x1,y1,x2,y2){
    state.trazos.push({
        tipo:"line",
        x1,y1,x2,y2,
        color:state.color,
        size:state.size
    });
}