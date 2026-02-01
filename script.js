document.addEventListener("DOMContentLoaded", () => {

  const upload = document.getElementById("upload");
  const uploadBtn = document.getElementById("uploadBtn");
  const landing = document.getElementById("landing");
  const editor = document.getElementById("editor");
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  const brightness = document.getElementById("brightness");
  const contrast = document.getElementById("contrast");
  const grayscale = document.getElementById("grayscale");

  let img = new Image();
  let rotation = 0;
  let flipX = 1;

  /* FORCE FILE PICKER OPEN */
  uploadBtn.addEventListener("click", () => {
    upload.click();
  });

  /* FILE SELECTED */
  upload.addEventListener("change", e => {
    if (!e.target.files[0]) return;

    img.src = URL.createObjectURL(e.target.files[0]);
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      landing.classList.add("hidden");
      editor.classList.remove("hidden");
      render();
    };
  });

  function render() {
    if (!img.src) return;

    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.filter = `
      brightness(${brightness.value}%)
      contrast(${contrast.value}%)
      grayscale(${grayscale.value}%)
    `;

    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(rotation);
    ctx.scale(flipX, 1);
    ctx.drawImage(img, -img.width / 2, -img.height / 2);

    ctx.restore();
  }

  document.querySelectorAll("input[type=range]").forEach(slider =>
    slider.addEventListener("input", render)
  );

  window.rotate = () => {
    rotation += Math.PI / 2;
    render();
  };

  window.flip = () => {
    flipX *= -1;
    render();
  };

  window.applyFilter = (type) => {
    brightness.value = 100;
    contrast.value = 100;
    grayscale.value = 0;

    if (type === "vintage") { brightness.value = 110; contrast.value = 90; }
    if (type === "bw") grayscale.value = 100;
    if (type === "dramatic") contrast.value = 140;
    if (type === "bright") brightness.value = 130;

    render();
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
    rotation = 0;
    flipX = 1;
  };

});
