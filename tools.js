let state = {
    tool: "pen",
    color: "#000000",
    size: 3,
    trazos: []
};

export function initTools(){
    document.querySelectorAll("[data-tool]").forEach(btn=>{
        btn.onclick = ()=> state.tool = btn.dataset.tool;
    });

    document.querySelectorAll("[data-color]").forEach(btn=>{
        btn.onclick = ()=> state.color = btn.dataset.color;
    });

    document.getElementById("sizePicker").oninput = e=>{
        state.size = e.target.value;
    };

    document.addEventListener("keydown",(e)=>{
        if(e.key==="p") state.tool="pen";
        if(e.key==="l") state.tool="line";
        if(e.key==="t") state.tool="text";
        if(e.key==="e") state.tool="eraser";
    });
}

export function getState(){
    return state;
}