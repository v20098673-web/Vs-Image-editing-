const upload = document.getElementById("upload");
const img = document.getElementById("preview");

const filters = {
    brightness: 100,
    contrast: 100,
    saturate: 100,
    blur: 0,
    grayscale: 0,
    sepia: 0
};

upload.addEventListener("change", () => {
    img.src = URL.createObjectURL(upload.files[0]);
});

document.querySelectorAll("input[type=range]").forEach(slider => {
    slider.addEventListener("input", () => {
        filters[slider.id] = slider.value;
        applyFilters();
    });
});

function applyFilters() {
    img.style.filter = `
        brightness(${filters.brightness}%)
        contrast(${filters.contrast}%)
        saturate(${filters.saturate}%)
        blur(${filters.blur}px)
        grayscale(${filters.grayscale}%)
        sepia(${filters.sepia}%)
    `;
}

function resetFilters() {
    filters.brightness = 100;
    filters.contrast = 100;
    filters.saturate = 100;
    filters.blur = 0;
    filters.grayscale = 0;
    filters.sepia = 0;

    for (let key in filters) {
        document.getElementById(key).value = filters[key];
    }
    applyFilters();
}

function downloadImage() {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.filter = img.style.filter;
    ctx.drawImage(img, 0, 0);
    const link = document.createElement("a");
    link.download = "edited-image.png";
    link.href = canvas.toDataURL();
    link.click();
}
