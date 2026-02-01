document.addEventListener("DOMContentLoaded", () => {

  /* ---------- ELEMENTS ---------- */
  const upload = document.getElementById("upload");
  const landing = document.getElementById("landing");
  const editor = document.getElementById("editor");
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  const brightness = document.getElementById("brightness");
  const contrast = document.getElementById("contrast");
  const grayscale = document.getElementById("grayscale");
  const textInput = document.getElementById("textInput");

  /* ---------- STATE ---------- */
  let img = new Image();
  let rotation = 0;
  let flipX = 1;

  /* ---------- IMAGE UPLOAD ---------- */
  upload.addEventListener("change", (e) => {
    if (!e.target.files[0]) return;

    img.src = URL.createObjectURL(e.target.files[0]);
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      resetTransform();
      render();
      landing.classList.add("hidden");
      editor.classList.remove("hidden");
    };
  });

  /* ---------- MAIN RENDER ---------- */
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

    ctx.drawImage(
      img,
      -img.width / 2,
      -img.height / 2
    );

    ctx.restore();
    ctx.filter = "none";
  }

  /* ---------- SLIDERS ---------- */
  document.querySelectorAll("input[type=range]").forEach(slider => {
    slider.addEventListener("input", render);
  });

  /* ---------- TOOLS ---------- */
  window.rotate = () => {
    rotation += Math.PI / 2;
    render();
  };

  window.flip = () => {
    flipX *= -1;
    render();
  };

  window.addText = () => {
    ctx.save();
    ctx.font = "40px Arial";
    ctx.fillStyle = "red";
    ctx.fillText(textInput.value, 40, 60);
    ctx.restore();
  };

  window.aiEnhance = () => {
    brightness.value = 115;
    contrast.value = 120;
    grayscale.value = 0;
    render();
  };

  /* ---------- FILTER PRESETS ---------- */
  window.applyFilter = (type) => {
    brightness.value = 100;
    contrast.value = 100;
    grayscale.value = 0;

    const presets = {
      vintage: () => { brightness.value = 110; contrast.value = 90; grayscale.value = 10; },
      bw: () => { grayscale.value = 100; contrast.value = 120; },
      warm: () => { brightness.value = 105; contrast.value = 110; },
      cool: () => { brightness.value = 95; contrast.value = 105; },
      dramatic: () => { brightness.value = 90; contrast.value = 140; },
      soft: () => { brightness.value = 115; contrast.value = 85; },
      retro: () => { brightness.value = 105; contrast.value = 95; grayscale.value = 20; },
      cinematic: () => { brightness.value = 90; contrast.value = 130; },
      bright: () => { brightness.value = 130; contrast.value = 120; }
    };

    if (presets[type]) presets[type]();
    render();
  };

  /* ---------- DOWNLOAD ---------- */
  window.download = () => {
    const a = document.createElement("a");
    a.download = "edited-image.png";
    a.href = canvas.toDataURL("image/png");
    a.click();
  };

  /* ---------- RESET ---------- */
  function resetTransform() {
    rotation = 0;
    flipX = 1;
  }

  window.resetEditor = () => {
    editor.classList.add("hidden");
    landing.classList.remove("hidden");
    resetTransform();
  };

});
