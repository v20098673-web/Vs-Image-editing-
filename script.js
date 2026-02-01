const canvas=document.getElementById("canvas");
const ctx=canvas.getContext("2d");
let img=new Image(),history=[],redoStack=[];

upload.onchange=e=>{
img.src=URL.createObjectURL(e.target.files[0]);
img.onload=()=>{canvas.width=img.width;canvas.height=img.height;draw();save();}
};

function draw(){
ctx.clearRect(0,0,canvas.width,canvas.height);
ctx.filter=`brightness(${brightness.value}%) contrast(${contrast.value}%) grayscale(${grayscale.value}%)`;
ctx.drawImage(img,0,0);
}

document.querySelectorAll("input[type=range]").forEach(s=>s.oninput=()=>{draw();save();});

function rotate(){const t=document.createElement("canvas");t.width=canvas.height;t.height=canvas.width;
const tc=t.getContext("2d");tc.translate(t.width/2,t.height/2);tc.rotate(Math.PI/2);
tc.drawImage(canvas,-canvas.width/2,-canvas.height/2);canvas.width=t.width;canvas.height=t.height;ctx.drawImage(t,0,0);save();}

function flip(){ctx.translate(canvas.width,0);ctx.scale(-1,1);ctx.drawImage(canvas,0,0);save();}
function crop(){const w=canvas.width/2,h=canvas.height/2;const d=ctx.getImageData(0,0,w,h);canvas.width=w;canvas.height=h;ctx.putImageData(d,0,0);save();}
function addText(){ctx.font="40px Arial";ctx.fillStyle="red";ctx.fillText(textInput.value,50,50);save();}
function addSticker(e){ctx.font="50px serif";ctx.fillText(e,100,100);save();}

function aiEnhance(){brightness.value=115;contrast.value=120;grayscale.value=0;draw();save();}
function aiSmartFilter(){const r=Math.random();if(r<0.33){brightness.value=110;contrast.value=125;}
else if(r<0.66){grayscale.value=100;}else{brightness.value=105;contrast.value=110;}draw();save();}
function aiFocus(){ctx.filter="blur(6px)";ctx.drawImage(canvas,0,0);ctx.filter="none";save();}

async function removeBgAI(){alert("Add remove.bg API key in code");}

function aiUpscale(){alert("Upscale API hook ready");}

function save(){history.push(canvas.toDataURL());redoStack=[];}
function undo(){if(history.length>1){redoStack.push(history.pop());load(history.at(-1));}}
function redo(){if(redoStack.length){const d=redoStack.pop();history.push(d);load(d);}}
function load(s){const i=new Image();i.src=s;i.onload=()=>ctx.drawImage(i,0,0);}
function download(){const a=document.createElement("a");a.download="ai-editor.png";a.href=canvas.toDataURL();a.click();}