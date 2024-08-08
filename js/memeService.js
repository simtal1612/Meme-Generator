'use strict'
var gImgs = [
    { id: 1, url: 'gallery/1.jpg', keywords: ['funny', 'cat'] },
    { id: 2, url: 'gallery/2.jpg', keywords: ['funny', 'dog'] },
    { id: 3, url: 'gallery/3.jpg', keywords: ['funny', 'baby'] },
    { id: 4, url: 'gallery/4.jpg', keywords: ['funny', 'man'] },
    { id: 5, url: 'gallery/5.jpg', keywords: ['funny', 'woman'] },
    { id: 6, url: 'gallery/6.jpg', keywords: ['funny', 'cat'] },
    { id: 7, url: 'gallery/7.jpg', keywords: ['funny', 'dog'] },
    { id: 8, url: 'gallery/8.jpg', keywords: ['funny', 'baby'] },
    { id: 9, url: 'gallery/9.jpg', keywords: ['funny', 'man'] },
    { id: 10, url: 'gallery/10.jpg', keywords: ['funny', 'woman'] },
    { id: 11, url: 'gallery/11.jpg', keywords: ['funny', 'cat'] },
    { id: 12, url: 'gallery/12.jpg', keywords: ['funny', 'dog'] },
    { id: 13, url: 'gallery/13.jpg', keywords: ['funny', 'baby'] },
    { id: 14, url: 'gallery/14.jpg', keywords: ['funny', 'man'] },
    { id: 15, url: 'gallery/15.jpg', keywords: ['funny', 'woman'] },
    { id: 16, url: 'gallery/16.jpg', keywords: ['funny', 'woman'] },
    { id: 17, url: 'gallery/17.jpg', keywords: ['funny', 'woman'] },
    { id: 18, url: 'gallery/18.jpg', keywords: ['funny', 'woman'] },
]

var gMeme = {
    selectedImgId: 1,
    selectedLineIdx: 0,
    lines: []
}

function getMeme() {
    return gMeme
}

function setLineTxt(txt) {
    gMeme.lines[gMeme.selectedLineIdx].txt = txt
}

function setImg(id) {
    gMeme.selectedImgId = id
}

function saveMeme() {
    let savedMemes = JSON.parse(localStorage.getItem('savedMemes')) || []
    savedMemes.push({ ...gMeme })
    localStorage.setItem('savedMemes', JSON.stringify(savedMemes))
}

function loadMemes() {
    return JSON.parse(localStorage.getItem('savedMemes')) || []
}
