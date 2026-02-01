document.addEventListener("DOMContentLoaded", () => {

const upload = document.getElementById("upload");
const landing = document.getElementById("landing");
const editor = document.getElementById("editor");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const brightness = document.getElementById("brightness");
const contrast = document.getElementById("contrast");
const grayscale = document.getElementById("grayscale");
const textInput = document.getElementById("textInput");

let img = new Image();

upload.addEventListener("change", e => {
  img.src = URL.createObjectURL(e.target.files[0]);
  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    draw();
    landing.classList.add("hidden");
    editor.classList.remove("hidden");
  };
});

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.filter = `
    brightness(${brightness.value}%)
    contrast(${contrast.value}%)
    grayscale(${grayscale.value}%)
  `;
  ctx.drawImage(img, 0, 0);
}

document.querySelectorAll("input[type=range]").forEach(slider => {
  slider.addEventListener("input", draw);
});

window.rotate = () => {
  const t = document.createElement("canvas");
  t.width = canvas.height;
  t.height = canvas.width;
  const tc = t.getContext("2d");
  tc.translate(t.width / 2, t.height / 2);
  tc.rotate(Math.PI / 2);
  tc.drawImage(canvas, -canvas.width / 2, -canvas.height / 2);
  canvas.width = t.width;
  canvas.height = t.height;
  ctx.drawImage(t, 0, 0);
};

window.flip = () => {
  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(canvas, 0, 0);
};

window.addText = () => {
  ctx.font = "40px Arial";
  ctx.fillStyle = "red";
  ctx.fillText(textInput.value, 50, 50);
};

window.aiEnhance = () => {
  brightness.value = 115;
  contrast.value = 120;
  grayscale.value = 0;
  draw();
};

window.download = () => {
  const a = document.createElement("a");
  a.download = "edited-image.png";
  a.href = canvas.toDataURL();
  a.click();
};

window.resetEditor = () => {
  editor.classList.add("hidden");
  landing.classList.remove("hidden");
};

  window.applyFilter = (type) => {

  // Reset first
  brightness.value = 100;
  contrast.value = 100;
  grayscale.value = 0;

  switch (type) {
    case "normal":
      break;

    case "vintage":
      brightness.value = 110;
      contrast.value = 90;
      grayscale.value = 10;
      break;

    case "bw":
      grayscale.value = 100;
      contrast.value = 120;
      break;

    case "warm":
      brightness.value = 105;
      contrast.value = 110;
      break;

    case "cool":
      brightness.value = 95;
      contrast.value = 105;
      break;

    case "dramatic":
      brightness.value = 90;
      contrast.value = 140;
      break;

    case "soft":
      brightness.value = 115;
      contrast.value = 85;
      break;

    case "retro":
      brightness.value = 105;
      contrast.value = 95;
      grayscale.value = 20;
      break;

    case "cinematic":
      brightness.value = 90;
      contrast.value = 130;
      break;

    case "bright":
      brightness.value = 130;
      contrast.value = 120;
      break;
  }

  draw(); // redraw canvas
};

});
