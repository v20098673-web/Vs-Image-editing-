self.addEventListener("install",e=>{
e.waitUntil(caches.open("ai-editor").then(c=>c.addAll(["index.html","style.css","script.js"])));
});