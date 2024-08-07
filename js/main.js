// main.js

document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.generate-meme-button').addEventListener('click', generateRandomMeme);
    document.querySelector('.save-meme-button').addEventListener('click', saveCurrentMeme);
    onInit();
});

// Existing main.js functionality
var gElCanvas;
var gCtx;
var gCurrText = '';
var gCurrColor = '#000000';
var gCurrImage = null;
var gDragging = false;
var gResizing = false;
var gRotating = false;
var gDragStart = { x: 0, y: 0 };
var gSelectedLine = null;

function onInit() {
    console.log('onInit called');
    gElCanvas = document.querySelector('.canvas');
    if (!gElCanvas) {
        console.error('Canvas element not found');
        return;
    }
    gCtx = gElCanvas.getContext('2d');
    if (!gCtx) {
        console.error('Failed to get canvas context');
        return;
    }
    console.log('gCtx initialized:', gCtx);
    renderGallery();
    renderMeme();
    renderSavedMemes();  // Add this line to render saved memes on load
    window.addEventListener('resize', resizeCanvas);
    gElCanvas.addEventListener('mousedown', handleMouseDown);
    gElCanvas.addEventListener('mousemove', handleMouseMove);
    gElCanvas.addEventListener('mouseup', handleMouseUp);
    gElCanvas.addEventListener('mouseout', handleMouseUp);

    // Load meme from local storage if available
    const storedMeme = localStorage.getItem('gMeme');
    if (storedMeme) {
        gMeme = JSON.parse(storedMeme);
        renderMeme();
    }
}

function resizeCanvas() {
    console.log('resizeCanvas called');
    const elContainer = document.querySelector('.canvas-container');
    gElCanvas.width = elContainer.clientWidth - 40;
    gElCanvas.height = elContainer.clientHeight - 40;
    renderMeme();
}

function generateRandomMeme() {
    const randomImg = gImgs[Math.floor(Math.random() * gImgs.length)];
    const memeText = getRandomText();

    gMeme.selectedImgId = randomImg.id;
    gMeme.lines = [{
        txt: memeText,
        size: 30,
        color: 'white',
        fontFamily: 'Impact',
        align: 'center',
        x: getCanvasCenter().x,
        y: getCanvasCenter().y,
        rotation: 0
    }];

    // Save the meme data to local storage
    localStorage.setItem('gMeme', JSON.stringify(gMeme));

    // Render the meme
    renderMeme();
}

function getRandomText() {
    const texts = [
        "When you realize...",
        "That moment when...",
        "When your code works...",
        "Just chilling...",
        "Monday vibes..."
    ];
    return texts[Math.floor(Math.random() * texts.length)];
}

function getCanvasCenter() {
    return {
        x: gElCanvas.width / 2,
        y: gElCanvas.height / 2
    };
}

function renderMeme(withFrame = true) {
    const meme = getMeme();
    const selectedImg = gImgs.find(img => img.id === meme.selectedImgId);
    if (!selectedImg) return;

    const img = new Image();
    img.src = selectedImg.url;
    img.onload = () => {
        gElCanvas.width = img.width;
        gElCanvas.height = img.height;
        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height);
        meme.lines.forEach((line, idx) => {
            gCtx.save();
            gCtx.translate(line.x, line.y);
            gCtx.rotate(line.rotation * Math.PI / 180);
            gCtx.lineWidth = 2;
            gCtx.strokeStyle = 'black';
            gCtx.fillStyle = line.color;
            gCtx.font = `${line.size}px ${line.fontFamily}`;
            gCtx.textAlign = line.align;
            gCtx.textBaseline = 'middle';

            const textWidth = gCtx.measureText(line.txt).width;
            const textHeight = line.size;

            line.width = textWidth;
            line.height = textHeight;

            gCtx.fillText(line.txt, 0, 0);
            gCtx.strokeText(line.txt, 0, 0);

            if (withFrame && idx === meme.selectedLineIdx) {
                gCtx.strokeStyle = 'red';
                gCtx.strokeRect(
                    -textWidth / 2 - 10,
                    -textHeight / 2 - 10,
                    textWidth + 20,
                    textHeight + 20
                );
            }
            gCtx.restore();
        });
    };
}

function addSticker(sticker) {
    const newLine = {
        txt: sticker,
        size: 50,
        color: 'black',
        fontFamily: 'Arial',
        align: 'center',
        x: getCanvasCenter().x,
        y: getCanvasCenter().y + 50 * gMeme.lines.length,
        rotation: 0
    };

    gMeme.lines.push(newLine);
    gMeme.selectedLineIdx = gMeme.lines.length - 1;

    renderMeme();
}

function saveCurrentMeme() {
    saveMeme();
    renderSavedMemes();  // Add this line to refresh the saved memes list
}

function renderSavedMemes() {
    const savedMemes = loadMemes();
    const container = document.querySelector('.saved-memes-container');
    container.innerHTML = '';

    savedMemes.forEach((meme, idx) => {
        const memeCanvas = document.createElement('canvas');
        memeCanvas.width = 150;
        memeCanvas.height = 150;
        memeCanvas.classList.add('saved-meme');
        container.appendChild(memeCanvas);

        const ctx = memeCanvas.getContext('2d');
        const img = new Image();
        const selectedImg = gImgs.find(img => img.id === meme.selectedImgId);
        if (!selectedImg) return;

        img.src = selectedImg.url;
        img.onload = () => {
            ctx.drawImage(img, 0, 0, memeCanvas.width, memeCanvas.height);
            meme.lines.forEach(line => {
                ctx.save();
                ctx.translate(line.x / 2, line.y / 2);
                ctx.rotate(line.rotation * Math.PI / 180);
                ctx.lineWidth = 2;
                ctx.strokeStyle = 'black';
                ctx.fillStyle = line.color;
                ctx.font = `${line.size / 2}px ${line.fontFamily}`;
                ctx.textAlign = line.align;
                ctx.textBaseline = 'middle';
                ctx.fillText(line.txt, 0, 0);
                ctx.strokeText(line.txt, 0, 0);
                ctx.restore();
            });
        };

        memeCanvas.addEventListener('click', () => loadMeme(idx));
    });
}

function loadMeme(index) {
    const savedMemes = loadMemes();
    gMeme = savedMemes[index];
    localStorage.setItem('gMeme', JSON.stringify(gMeme));
    renderMeme();
}

function handleCanvasClick(event) {
    const rect = gElCanvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    for (let i = 0; i < gMeme.lines.length; i++) {
        const line = gMeme.lines[i];
        const textWidth = gCtx.measureText(line.txt).width;
        const textHeight = line.size;
        const xStart = line.x - textWidth / 2 - 10;
        const xEnd = line.x + textWidth / 2 + 10;
        const yStart = line.y - textHeight / 2 - 10;
        const yEnd = line.y + textHeight / 2 + 10;

        if (x >= xStart && x <= xEnd && y >= yStart && y <= yEnd) {
            gMeme.selectedLineIdx = i;
            gSelectedLine = line;
            gDragStart = { x, y };
            gDragging = true;
            updateControlBox();
            renderMeme();
            break;
        }
    }
}

function handleMouseDown(event) {
    const rect = gElCanvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (event.altKey) {
        // Start resizing
        gResizing = true;
    } else if (event.shiftKey) {
        // Start rotating
        gRotating = true;
    } else {
        handleCanvasClick(event);
    }
}

function handleMouseMove(event) {
    if (!gDragging && !gResizing && !gRotating) return;

    const rect = gElCanvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const dx = x - gDragStart.x;
    const dy = y - gDragStart.y;

    if (gDragging && gSelectedLine) {
        gSelectedLine.x += dx;
        gSelectedLine.y += dy;
        gDragStart = { x, y };
        renderMeme();
    } else if (gResizing && gSelectedLine) {
        gSelectedLine.size += dy / 10; // Adjust this value to control resize speed
        gDragStart = { x, y };
        renderMeme();
    } else if (gRotating && gSelectedLine) {
        gSelectedLine.rotation += dx / 2; // Adjust this value to control rotation speed
        gDragStart = { x, y };
        renderMeme();
    }
}

function handleMouseUp() {
    gDragging = false;
    gResizing = false;
    gRotating = false;
    gSelectedLine = null;
}

function updateControlBox() {
    const line = gMeme.lines[gMeme.selectedLineIdx];
    document.querySelector('.text-input').value = line.txt;
    document.querySelector('.color-picker').value = line.color;
    document.querySelector('.font-family').value = line.fontFamily;
    document.querySelector('.font-size').value = line.size;
}

function onImageUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
            gElCanvas.width = img.width;
            gElCanvas.height = img.height;
            gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height);

            gMeme.selectedImgId = -1; // Custom image, not from gallery
            gCurrImage = img;

            renderMeme();
        };
    };

    reader.readAsDataURL(file);
}

function onTextInput() {
    const text = document.querySelector('.text-input').value;
    setLineTxt(text);
    renderMeme();
}

function setLineTxt(txt) {
    gMeme.lines[gMeme.selectedLineIdx].txt = txt;
    renderMeme();
}

function onColorChange() {
    const color = document.querySelector('.color-picker').value;
    gMeme.lines[gMeme.selectedLineIdx].color = color;
    renderMeme();
}

function onFontFamilyChange() {
    const fontFamily = document.querySelector('.font-family').value;
    gMeme.lines[gMeme.selectedLineIdx].fontFamily = fontFamily;
    renderMeme();
}

function onFontSizeChange() {
    const fontSize = document.querySelector('.font-size').value;
    gMeme.lines[gMeme.selectedLineIdx].size = parseInt(fontSize);
    renderMeme();
}

function moveLineUp() {
    gMeme.lines[gMeme.selectedLineIdx].y -= 5;
    renderMeme();
}

function moveLineDown() {
    gMeme.lines[gMeme.selectedLineIdx].y += 5;
    renderMeme();
}

function deleteLine() {
    gMeme.lines.splice(gMeme.selectedLineIdx, 1);
    gMeme.selectedLineIdx = Math.max(0, gMeme.selectedLineIdx - 1);
    renderMeme();
}

function onClearCanvas() {
    gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height);
    gMeme.lines = [];
    document.querySelector('.text-input').value = '';
    renderMeme();
}

function downloadMeme() {
    renderMeme(false); 
    const link = document.createElement('a');
    link.href = gElCanvas.toDataURL('image/png');
    link.download = 'meme.png';
    link.click();
    renderMeme(); 
}
