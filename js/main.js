var gElCanvas 
var gCtx 
var gCurrText = '' 
var gCurrColor = '#000000' 
var gCurrImage = null 

function onInit() {
    console.log('onInit called') 
    gElCanvas = document.querySelector('.canvas')  
    if (!gElCanvas) {
        console.error('Canvas element not found') 
        return 
    }
    gCtx = gElCanvas.getContext('2d') 
    if (!gCtx) {
        console.error('Failed to get canvas context') 
        return 
    }
    console.log('gCtx initialized:', gCtx) 
    renderGallery() 
    renderMeme() 
    window.addEventListener('resize', resizeCanvas) 
}

document.addEventListener('DOMContentLoaded', onInit) 

function resizeCanvas() {
    console.log('resizeCanvas called') 
    const elContainer = document.querySelector('.canvas-container') 
    gElCanvas.width = elContainer.clientWidth - 40 
    gElCanvas.height = elContainer.clientHeight - 40 
    renderMeme() 
}
//commit