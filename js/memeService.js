// memeService.js

var gImgs = [
    { id: 1, url: 'gallery/1.jpg', keywords: ['funny', 'cat'] },
    { id: 2, url: 'gallery/2.jpg', keywords: ['funny', 'dog'] },
    { id: 3, url: 'gallery/3.jpg', keywords: ['funny', 'baby'] },
    { id: 4, url: 'gallery/4.jpg', keywords: ['funny', 'man'] },
    { id: 5, url: 'gallery/5.jpg', keywords: ['funny', 'woman'] }
];

var gMeme = {
    selectedImgId: 1,
    selectedLineIdx: 0,
    lines: []
};

function getMeme() {
    return gMeme;
}

function setLineTxt(txt) {
    gMeme.lines[gMeme.selectedLineIdx].txt = txt;
}

function setImg(id) {
    gMeme.selectedImgId = id;
}

function saveMeme() {
    let savedMemes = JSON.parse(localStorage.getItem('savedMemes')) || [];
    savedMemes.push({ ...gMeme });
    localStorage.setItem('savedMemes', JSON.stringify(savedMemes));
}

function loadMemes() {
    return JSON.parse(localStorage.getItem('savedMemes')) || [];
}
