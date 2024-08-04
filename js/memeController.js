function switchLine() {
    gMeme.selectedLineIdx = (gMeme.selectedLineIdx + 1) % gMeme.lines.length 
    const line = gMeme.lines[gMeme.selectedLineIdx] 
    document.querySelector('.text-input').value = line.txt 
    document.querySelector('.color-picker').value = line.color 
    renderMeme() 
}

function increaseFontSize() {
    gMeme.lines[gMeme.selectedLineIdx].size += 2  
    renderMeme() 
}

function decreaseFontSize() {
    gMeme.lines[gMeme.selectedLineIdx].size -= 2  
    renderMeme() 
}

function onImageSelect(imageUrl) {
    console.log('onImageSelect called with URL:', imageUrl) 
    if (!gElCanvas || !gCtx) {
        console.error('Canvas or context is not initialized') 
        return 
    }

    gCurrText = ''  
    document.querySelector('.text-input').value = '' 

    const img = new Image() 
    img.src = imageUrl 
    img.onload = () => {
        console.log('Image loaded:', img) 
        gElCanvas.width = img.width 
        gElCanvas.height = img.height 
        gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height) 
        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height) 
        gCurrImage = img 
    } 
}

function renderMeme(withFrame = true) {
    const meme = getMeme() 
    const img = new Image() 
    img.src = `gallery/${meme.selectedImgId}.jpg` 
    img.onload = () => {
        gElCanvas.width = img.width 
        gElCanvas.height = img.height 
        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height) 
        meme.lines.forEach((line, idx) => {
            gCtx.lineWidth = 2 
            gCtx.strokeStyle = 'black' 
            gCtx.fillStyle = line.color 
            gCtx.font = `${line.size}px Arial` 
            gCtx.textAlign = 'center' 
            gCtx.textBaseline = 'middle' 
            gCtx.fillText(line.txt, gElCanvas.width / 2, line.y) 
            gCtx.strokeText(line.txt, gElCanvas.width / 2, line.y) 

            if (withFrame && idx === meme.selectedLineIdx) {
                const textWidth = gCtx.measureText(line.txt).width 
                const textHeight = line.size 
                gCtx.strokeStyle = 'red' 
                gCtx.strokeRect(
                    (gElCanvas.width / 2) - (textWidth / 2) - 10,
                    line.y - (textHeight / 2) - 10,
                    textWidth + 20,
                    textHeight + 20
                ) 
            }
        }) 
    } 
}

function onTextInput() {
    const text = document.querySelector('.text-input').value 
    setLineTxt(text) 
    renderMeme() 
}

function onColorChange() {
    const color = document.querySelector('.color-picker').value 
    gMeme.lines[gMeme.selectedLineIdx].color = color 
    renderMeme() 
}

function onClearCanvas() {
    gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height) 
    gMeme.lines = [
        { txt: 'I sometimes eat Falafel', size: 20, color: 'red', x: 50, y: 50 },
        { txt: 'And I like it!', size: 20, color: 'blue', x: 50, y: 100 }
    ] 
    document.querySelector('.text-input').value = '' 
    renderMeme() 
}

function downloadMeme() {
    const link = document.createElement('a') 
    link.href = gElCanvas.toDataURL('image/png') 
    link.download = 'meme.png' 
    link.click() 
    renderMeme() 
}


function resizeCanvas() {
    console.log('resizeCanvas called') 
    const elContainer = document.querySelector('.canvas-container') 
    gElCanvas.width = elContainer.clientWidth - 40 
    gElCanvas.height = elContainer.clientHeight - 40 
    renderMeme() 
}

function getCanvasCenter() {
    return {
        x: gElCanvas.width / 2,
        y: gElCanvas.height / 2,
    } 
}
