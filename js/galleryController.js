//gallery controller js
function renderGallery() {
    const galleryContainer = document.querySelector('.gallery-container');
    galleryContainer.innerHTML = gImgs.map(img =>
        `<img src="${img.url}" class="gallery-image" onclick="onImageSelect('${img.url}')" />`
    ).join('');
}
