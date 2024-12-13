const canvas = document.getElementById('drawingCanvas'); //to get canvas element
const ctx = canvas.getContext('2d'); //canvas context
const cursor = document.querySelector('.cursor'); //cursor to draw
const eraserButton = document.getElementById('eraserButton'); // eraser button
let eraserMode = false; //to track is user wants to erase strokes
let isDrawing = false; // to track if the mouse or stylus is pressed down to draw or erase
const eraserRadius = 10; // to define the radius for the eraser
const cursorSizer = document.getElementById("cursorSizer");
const clearButton = document.querySelector(".clearButton");//button to clear the canvas on a single click

const downloadButton = document.getElementById('downloadButton'); //download button
const formatSelect = document.getElementById('formatSelect'); //download format

// to set canvas dimensions
let canvasHeight = window.innerHeight;
let canvasWidth = window.innerWidth;
canvas.width = canvasWidth;//-140;
canvas.height = canvasHeight;// - 50;
//**************************************************************************** */
const gridLayer = document.getElementById("grid");
const ctxGrid = gridLayer.getContext('2d');
// to set grid canvas dimensions
gridLayer.width = canvasWidth;//-140;
gridLayer.height = canvasHeight;//-50;
//**************************************************************************** */



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
    // drawGrid();
}

// function to save canvas data to local storage
function saveCanvas() {
    const canvasData = canvas.toDataURL();
    localStorage.setItem('canvasData', canvasData);
}

// clear all --> function to erase everything on canvas at once
clearButton.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    saveCanvas();
});



// to resice the cursor
function cursorReSizeinator() {
    cursor.style.width = cursorSizer.value + 'px';
    cursor.style.height = cursorSizer.value + 'px';
    // eraserRadius = cursorSizer.value;
}

//cursor size --> to make cursor change size everytime range is changed
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
        //to change icons depending upon action, from eraser to pencil
        let actionIcon = document.getElementById("action-icon");
        actionIcon.src = "./icons/pencil.png";
        
    } else {
        cursor.style.backgroundColor = 'black'; // change cursor back to original color

        //to change icons depending upon action, from pencil to eraser
        let actionIcon = document.getElementById("action-icon");
        actionIcon.src = "./icons/eraser.png";
    }
});

// to handle window resize to maintain canvas size
// window.addEventListener('resize', () => {
//     canvas.width = window.innerWidth - 150;
//     canvas.height = window.innerHeight - 150;
// });
window.addEventListener('resize', () => {
    canvas.width = canvasContainer.clientWidth-270; // Update canvas width
    canvas.height = canvasContainer.clientHeight-15; // Update canvas height
    gridLayer.width = canvasContainer.clientWidth-270; // Update grid layer width
    gridLayer.height = canvasContainer.clientHeight-15; // Update grid layer height
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


//--------Grid options--------
const gridSize = 10; // pixels
const gridColor = '#aaa'; // light gray
const gridStyle = 'solid'; // solid, dashed, or dotted

// Function to draw the grid
function drawGrid() {
//   const canvasWidth = canvas.width;
//   const canvasHeight = canvas.height;

  // Draw horizontal grid lines
  for (let y = 0; y <= canvasHeight; y += gridSize) {
    ctxGrid.beginPath();
    ctxGrid.strokeStyle = gridColor;
    ctxGrid.lineWidth = 1;
    ctxGrid.moveTo(0, y);
    ctxGrid.lineTo(canvasWidth, y);
    ctxGrid.stroke();
  }

  // Draw vertical grid lines
  for (let x = 0; x <= canvasWidth; x += gridSize) {
    ctxGrid.beginPath();
    ctxGrid.strokeStyle = gridColor;
    ctxGrid.lineWidth = 0;
    ctxGrid.moveTo(x, 0);
    ctxGrid.lineTo(x, canvasHeight);
    ctxGrid.stroke();
  }
}

// Call the drawGrid function to draw the grid
drawGrid();
//----------------------download feature---------------------
downloadButton.addEventListener('click', () => {
    const format = formatSelect.value; // Get selected format
    if (format === 'png') {
        const link = document.createElement('a'); // Create an anchor element
        link.download = 'canvas-image.png'; // Set the name for the downloaded file
        link.href = canvas.toDataURL('image/png'); // Convert canvas to data URL
        link.click(); // Trigger the download
    } else if (format === 'pdf') {
        const { jsPDF } = window.jspdf; // Get jsPDF from the global window object
        const pdf = new jsPDF();
        const imgData = canvas.toDataURL('image/png'); // Convert canvas to data URL
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 10, canvas.height / 10); // Add image to PDF
        pdf.save('canvas-image.pdf'); // Save the PDF
    }
});

//---------------infinit scrolling---------------

document.addEventListener("wheel", (event) => {
    // event.preventDefault(); // Prevent default scrolling behavior

    if (event.deltaY > 0) {
        // Save the current canvas state
        const currentCanvasData = canvas.toDataURL();

        // Increase the height of the canvas and grid layer
        canvasHeight += Math.ceil(event.deltaY); // Increment the height based on deltaY
        canvas.height = canvasHeight; // Set the new height for the canvas
        gridLayer.height = canvasHeight; // Set the new height for the grid layer

        // Redraw the saved canvas state
        const img = new Image();
        img.src = currentCanvasData;
        img.onload = () => {
            ctx.drawImage(img, 0, 0); // Draw the saved canvas state back onto the canvas
        };

        drawGrid(); // Redraw the grid
        console.log("Height increased to:", canvasHeight);
    }
});


// let lastScrollTop = 0; // Variable to store the last scroll position

// // Add wheel event listener to the window
// window.addEventListener('wheel', (event) => {
//     // Check the deltaY property to determine scroll direction
//     if (event.deltaY < 0) {
//         // User scrolled up
//         console.log(`scrolled up`);
//         // Add your logic for scroll up here
//     } else if (event.deltaY > 0) {
//         drawGrid();
//         canvas.heigth = canvasHeight+Math.floor(event.deltaY);
//         gridLayer.height = canvasHeight+Math.floor(event.deltaY);
//         console.log(`Scrolled Down`);
//         // Add your logic for scroll down here
//     }
// });