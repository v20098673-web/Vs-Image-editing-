const upload = document.getElementById("upload");
const landing = document.getElementById("landing");
const editor = document.getElementById("editor");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let img = new Image();

upload.onchange = e => {
  img.src = URL.createObjectURL(e.target.files[0]);
  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    landing.classList.add("hidden");
    editor.classList.remove("hidden");
  };
};

function download() {
  const a = document.createElement("a");
  a.download = "edited-image.png";
  a.href = canvas.toDataURL();
  a.click();
}

function resetEditor() {
  editor.classList.add("hidden");
  landing.classList.remove("hidden");
}
