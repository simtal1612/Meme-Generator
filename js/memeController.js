//meme controller js
function switchLine() {
    gMeme.selectedLineIdx = (gMeme.selectedLineIdx + 1) % gMeme.lines.length
    updateControlBox()
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

        const selectedImg = gImgs.find(img => img.url === imageUrl)
        if (selectedImg) {
            gMeme.selectedImgId = selectedImg.id
        }

        renderMeme()
    }
}

function renderMeme(withFrame = true) {
    const meme = getMeme()
    const selectedImg = gImgs.find(img => img.id === meme.selectedImgId)
    if (!selectedImg) return

    const img = new Image()
    img.src = selectedImg.url
    img.onload = () => {
        gElCanvas.width = img.width
        gElCanvas.height = img.height
        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
        meme.lines.forEach((line, idx) => {
            gCtx.lineWidth = 2
            gCtx.strokeStyle = 'black'
            gCtx.fillStyle = line.color
            gCtx.font = `${line.size}px ${line.fontFamily}`
            gCtx.textAlign = line.align
            gCtx.textBaseline = 'middle'

            const textWidth = gCtx.measureText(line.txt).width
            const textHeight = line.size

            line.width = textWidth
            line.height = textHeight

            gCtx.fillText(line.txt, line.x, line.y)
            gCtx.strokeText(line.txt, line.x, line.y)

            if (withFrame && idx === meme.selectedLineIdx) {
                gCtx.strokeStyle = 'red'
                gCtx.strokeRect(
                    line.x - textWidth / 2 - 10,
                    line.y - textHeight / 2 - 10,
                    textWidth + 20,
                    textHeight + 20
                )
            }
        })
    }
}
//
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

function onFontFamilyChange() {
    const fontFamily = document.querySelector('.font-family').value
    gMeme.lines[gMeme.selectedLineIdx].fontFamily = fontFamily
    renderMeme()
}

function onFontSizeChange() {
    const fontSize = document.querySelector('.font-size').value
    gMeme.lines[gMeme.selectedLineIdx].size = parseInt(fontSize)
    renderMeme()
}

function setTextAlign(align) {
    gMeme.lines[gMeme.selectedLineIdx].align = align
    renderMeme()
}

function moveLineUp() {
    gMeme.lines[gMeme.selectedLineIdx].y -= 5
    renderMeme()
}

function moveLineDown() {
    gMeme.lines[gMeme.selectedLineIdx].y += 5
    renderMeme()
}

function deleteLine() {
    gMeme.lines.splice(gMeme.selectedLineIdx, 1)
    gMeme.selectedLineIdx = Math.max(0, gMeme.selectedLineIdx - 1)
    renderMeme()
}

function onClearCanvas() {
    gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
    gMeme.lines = []
    document.querySelector('.text-input').value = ''
    renderMeme()
}

function downloadMeme() {
    renderMeme(false) 
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

function addLine() {
    const newLine = {
        txt: 'New line text',
        size: 20,
        color: 'black',
        fontFamily: 'Arial',
        align: 'center',
        x: gElCanvas.width / 2,
        y: gElCanvas.height / 2 + 50 * gMeme.lines.length
    }

    gMeme.lines.push(newLine)
    gMeme.selectedLineIdx = gMeme.lines.length - 1

    updateControlBox()
    renderMeme()
}

function updateControlBox() {
    const line = gMeme.lines[gMeme.selectedLineIdx]
    document.querySelector('.text-input').value = line.txt
    document.querySelector('.color-picker').value = line.color
    document.querySelector('.font-family').value = line.fontFamily
    document.querySelector('.font-size').value = line.size
}

function handleCanvasClick(event) {
    const rect = gElCanvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    for (let i = 0; i < gMeme.lines.length; i++) {
        const line = gMeme.lines[i]
        const textWidth = gCtx.measureText(line.txt).width
        const textHeight = line.size
        const xStart = line.x - textWidth / 2 - 10
        const xEnd = line.x + textWidth / 2 + 10
        const yStart = line.y - textHeight / 2 - 10
        const yEnd = line.y + textHeight / 2 + 10

        if (x >= xStart && x <= xEnd && y >= yStart && y <= yEnd) {
            gMeme.selectedLineIdx = i
            updateControlBox()
            renderMeme()
            break
        }
    }
}

gElCanvas.addEventListener('click', handleCanvasClick)
