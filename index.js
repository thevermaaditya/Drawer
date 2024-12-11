const canvas = document.getElementById('drawingCanvas'); //to get canvas element
const ctx = canvas.getContext('2d'); //canvas context
const cursor = document.querySelector('.cursor'); //cursor to draw
const eraserButton = document.getElementById('eraserButton'); // eraser button
let eraserMode = false; //to track is user wants to erase strokes
let isDrawing = false; // to track if the mouse or stylus is pressed down to draw or erase
const eraserRadius = 10; // to define the radius for the eraser
const cursorSizer = document.getElementById("cursorSizer");
const clearButton = document.querySelector(".clearButton");//button to clear the canvas on a single click

//function to load the canvas in same state as it was before page refresh
function loadCanvas() {
    const savedCanvas = localStorage.getItem('canvasData');
    if (savedCanvas) {
        const img = new Image();
        img.src = savedCanvas;
        img.onload = () => {
            ctx.drawImage(img, 0, 0);
        };
    }
}

// function to save canvas data to local storage
function saveCanvas() {
    const canvasData = canvas.toDataURL();
    localStorage.setItem('canvasData', canvasData);
}

// function to erase everything on canvas at once
clearButton.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    saveCanvas();
});


// to set canvas dimensions
canvas.width = window.innerWidth - 200;
canvas.height = window.innerHeight - 200;
// to resice the cursor
function cursorReSizeinator() {
    cursor.style.width = cursorSizer.value + 'px';
    cursor.style.height = cursorSizer.value + 'px';
    // eraserRadius = cursorSizer.value;
}
//to make cursor change size everytime range is changed
cursorSizer.addEventListener('input', cursorReSizeinator);
//to resizethe cursor at start
cursorReSizeinator();

// function to update cursor position
function updateCursorPosition(e) {
    cursor.style.top = e.pageY + 'px';
    cursor.style.left = e.pageX + 'px';

    // to get canvas bounds
    const canvasRect = canvas.getBoundingClientRect();
    //to determine if the cursor is inside the canvas
    const isInCanvas = e.clientX >= canvasRect.left && e.clientX <= canvasRect.right &&
        e.clientY >= canvasRect.top && e.clientY <= canvasRect.bottom;

    if (isDrawing && isInCanvas) {
        if (!eraserMode) {
            // to set the stroke width
            ctx.lineWidth = cursorSizer.value;
            // to make the stroke rounded
            ctx.lineCap = 'round';
            // to et the stroke color
            ctx.strokeStyle = '#2A3335';

            // to adjust mouse coordinates relative to the canvas in-order to draw/erase stroke
            const mouseX = e.clientX - canvasRect.left;
            const mouseY = e.clientY - canvasRect.top;

            // to draw line to the current position
            ctx.lineTo(mouseX, mouseY);
            // to render the stroke 
            ctx.stroke();
            // to begin a new path
            ctx.beginPath();
            // to move to the current position
            ctx.moveTo(mouseX, mouseY);
        } else {
            // to erase footprints if in eraser mode and drawing
            const eraserX = e.clientX - canvasRect.left;
            const eraserY = e.clientY - canvasRect.top;

            ctx.clearRect(eraserX - eraserRadius, eraserY - eraserRadius, cursorSizer.value * 2, cursorSizer.value * 2);
        }
    }
}


//--------------------------Mouse and Pointer Events--------------------------
canvas.addEventListener('pointerdown', (e) => {
    isDrawing = true; // to set drawing state to true
    ctx.beginPath(); // to begin a new path
    updateCursorPosition(e); // to update cursor position on pointer down
});

canvas.addEventListener('pointerup', () => {
    isDrawing = false; // to set drawing state to false
    ctx.beginPath(); // to begin a new path to avoid connecting lines
    saveCanvas();
});

// use pointermove for both mouse and tablet input
canvas.addEventListener('pointermove', updateCursorPosition);

// update cursor position on mouse move
window.addEventListener('mousemove', (e) => {
    if (!isDrawing) {
        updateCursorPosition(e);
    }
});

//------------------------------toggle eraser mode------------------------------
eraserButton.addEventListener('click', () => {
    eraserMode = !eraserMode;

    if (eraserMode) {
        cursor.style.backgroundColor = 'grey'; // change cursor color to indicate eraser mode
        eraserButton.textContent = 'Switch to Drawing'; // change button text
    } else {
        cursor.style.backgroundColor = 'black'; // change cursor back to original color
        eraserButton.textContent = 'Toggle Eraser'; // reset button text
    }
});

// to handle window resize to maintain canvas size
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth - 150;
    canvas.height = window.innerHeight - 150;
});

// to prevent default touch actions to avoid scrolling on touch devices
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
});
canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
});

// Loading canvas data to not let user loos it on a refresh
window.addEventListener('load', loadCanvas);
