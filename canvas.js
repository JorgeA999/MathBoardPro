const socket = io();

const canvas = document.getElementById('whiteboard');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 120;

canvas.setAttribute("tabindex", "0");

let texto = "";
let cursorPos = 0;
let mostrarCursor = true;

// Enfocar canvas y manejar eventos de teclado
canvas.addEventListener("click", () => canvas.focus());

// Captura completa de teclado
canvas.addEventListener("keydown", (e) => {
  e.preventDefault();

  if (e.key.length === 1) {
    insertarTexto(e.key);
  } else if (e.key === "Backspace") {
    borrarTexto();
  } else if (e.key === "ArrowLeft") {
    cursorPos = Math.max(0, cursorPos - 1);
  } else if (e.key === "ArrowRight") {
    cursorPos = Math.min(texto.length, cursorPos + 1);
  } else if (e.key === "Enter") {
    insertarTexto("\n");
  }

  dibujar();
});

function insertarTexto(char) {
  texto = texto.slice(0, cursorPos) + char + texto.slice(cursorPos);
  cursorPos++;
}

function borrarTexto() {
  if (cursorPos > 0) {
    texto = texto.slice(0, cursorPos - 1) + texto.slice(cursorPos);
    cursorPos--;
  }
}

// Cursor parpadeante
setInterval(() => {
  mostrarCursor = !mostrarCursor;
  dibujar();
}, 500);

// Dibujar texto y cursor
function dibujar() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "18px Arial";
  ctx.fillStyle = "black";

  const lineas = texto.split("\n");
  let y = 30;
  let contador = 0;

  for (let i = 0; i < lineas.length; i++) {
    let linea = lineas[i];
    ctx.fillText(linea, 10, y);

    // Dibujar cursor
    if (mostrarCursor && cursorPos >= contador && cursorPos <= contador + linea.length) {
      const antesCursor = linea.substring(0, cursorPos - contador);
      const ancho = ctx.measureText(antesCursor).width;

      ctx.beginPath();
      ctx.moveTo(10 + ancho, y - 18);
      ctx.lineTo(10 + ancho, y + 5);
      ctx.stroke();
    }

    contador += linea.length + 1;
    y += 25;
  }
}

dibujar();

// Enfocar canvas y manejar eventos de teclado fin

const colorPicker = document.getElementById('colorPicker');
const sizePicker = document.getElementById('sizePicker');
const clearBtn = document.getElementById('clearBtn');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let drawing = false;

// 🖱️ Cuando presionas el mouse


canvas.addEventListener('mousedown', (e) => {
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(e.clientX, e.clientY);
});

canvas.addEventListener('mousemove', (e) => {
    if (!drawing) return;

    ctx.lineWidth = sizePicker.value;
    ctx.lineCap = 'round';
    ctx.strokeStyle = colorPicker.value;

    ctx.lineTo(e.clientX, e.clientY);
    ctx.stroke();

    // ✅ ENVIAR AQUÍ (correcto)
    socket.emit('draw', {
        x: e.clientX,
        y: e.clientY,
        color: colorPicker.value,
        size: sizePicker.value
    });
});

// 👇 IMPORTANTE: en document, no solo canvas
document.addEventListener('mouseup', () => {
    drawing = false;
    ctx.beginPath();
});

canvas.addEventListener('mouseleave', () => {
    drawing = false;
});



// 🖱️ Cuando sueltas el mouse
canvas.addEventListener('mouseup', () => {
    drawing = false;
    ctx.beginPath();
});

// 🧽 Limpiar canvas
clearBtn.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    socket.emit('clear');
});

// 📡 Recibir dibujo de otros
socket.on('draw', (data) => {
    ctx.lineWidth = data.size;
    ctx.lineCap = 'round';
    ctx.strokeStyle = data.color;

    ctx.lineTo(data.x, data.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(data.x, data.y);
});

// 📡 Limpiar desde otros
socket.on('clear', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});