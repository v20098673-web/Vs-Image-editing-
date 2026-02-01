
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

  /* reliable picker */
  uploadBtn.addEventListener("click", () => upload.click());

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

  /* AUTO-FIT ANY DIMENSION (aspect ratio safe) */
  function render() {
    if (!img.src) return;

    ctx.save();
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.filter = `
      brightness(${brightness.value}%)
      contrast(${contrast.value}%)
      grayscale(${grayscale.value}%)
    `;

    const canvasRatio = canvas.width / canvas.height;
    const imgRatio = img.width / img.height;
    let drawW, drawH;

    if (imgRatio > canvasRatio) {
      drawW = canvas.width;
      drawH = canvas.width / imgRatio;
    } else {
      drawH = canvas.height;
      drawW = canvas.height * imgRatio;
    }

    ctx.translate(canvas.width/2, canvas.height/2);
    ctx.rotate(rotation);
    ctx.scale(flipX, 1);
    ctx.drawImage(img, -drawW/2, -drawH/2, drawW, drawH);
    ctx.restore();
  }

  document.querySelectorAll("input[type=range]").forEach(s =>
    s.addEventListener("input", render)
  );

  /* BASIC */
  window.rotate = () => { rotation += Math.PI/2; render(); };
  window.flip = () => { flipX *= -1; render(); };

  /* FILTER PRESETS */
  window.applyFilter = (t) => {
    brightness.value = 100; contrast.value = 100; grayscale.value = 0;
    if (t==="bw") grayscale.value = 100;
    if (t==="vintage"){ brightness.value=110; contrast.value=90; }
    if (t==="bright"){ brightness.value=130; contrast.value=120; }
    if (t==="warm"){ brightness.value=105; contrast.value=110; }
    if (t==="cool"){ brightness.value=95; contrast.value=105; }
    if (t==="dramatic"){ brightness.value=90; contrast.value=140; }
    render();
  };

  /* AI */
  window.aiAutoEnhance = () => {
    brightness.value=115; contrast.value=120; grayscale.value=0; render();
  };
  window.aiSmartFilter = (type) => {
    brightness.value=100; contrast.value=100; grayscale.value=0;
    if (type==="portrait"){ brightness.value=110; contrast.value=115; }
    if (type==="landscape"){ contrast.value=130; }
    if (type==="night"){ brightness.value=90; contrast.value=140; }
    render();
  };
  window.aiBlurBG = () => {
    ctx.save(); ctx.filter="blur(8px)"; ctx.drawImage(canvas,0,0); ctx.restore();
  };

  /* REAL AI BG REMOVER (API required) */
  window.removeBgAI = async () => {
    alert("Add remove.bg API key in script.js");
    const API_KEY = "YOUR_REMOVE_BG_API_KEY";
    const blob = await new Promise(r=>canvas.toBlob(r));
    const fd = new FormData();
    fd.append("image_file", blob); fd.append("size","auto");
    const res = await fetch("https://api.remove.bg/v1.0/removebg",{
      method:"POST", headers:{ "X-Api-Key": API_KEY }, body: fd
    });
    if (!res.ok) return alert("BG remove failed");
    const out = await res.blob();
    const ni = new Image();
    ni.src = URL.createObjectURL(out);
    ni.onload = ()=>{ canvas.width=ni.width; canvas.height=ni.height; ctx.drawImage(ni,0,0); };
  };

  window.download = () => {
    const a=document.createElement("a");
    a.download="edited-image.png"; a.href=canvas.toDataURL(); a.click();
  };

  window.resetEditor = () => {
    editor.classList.add("hidden"); landing.classList.remove("hidden");
    rotation=0; flipX=1;
  };
});
