const canvas = document.querySelector('#canvas');
const content = canvas.getContext('2d');
let x_last = 0;
let y_last = 0;
let hue = 0;
let is_drawing = false;
let direction = true;

function initializeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    content.lineCap = 'round';
    content.lineJoin = 'round';
    content.lineWidth = 10;
}

function drawing(e) {
    if (!is_drawing) return;

    content.beginPath();
    content.moveTo(x_last, y_last);
    content.lineTo(e.offsetX, e.offsetY);
    content.stroke();

    [x_last, y_last] = [e.offsetX, e.offsetY];

    content.strokeStyle = `hsl(${hue}, 100%, 50%)`;
    if (hue >= 360) {
        hue = 0;
    }
    hue++;

    if (content.lineWidth > 50 || content.lineWidth < 10) {
        direction = !direction;
    }
    if (direction) {
        content.lineWidth++;
    } else {
        content.lineWidth--;
    }
}

canvas.addEventListener('mousemove', drawing);
canvas.addEventListener('mousedown', (e) => {
    is_drawing = true;
    [x_last, y_last] = [e.offsetX, e.offsetY];
});
canvas.addEventListener('mouseup', () => {
    is_drawing = false;
});
canvas.addEventListener('mouseout', () => {
    is_drawing = false;
});

initializeCanvas();
