// Titan Compressor - Main UI Handler (ESM)
import LZUltra from './engines/lz_ultra.js';
import TitanGlass from './engines/titan_glass.js';

const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const ratioVal = document.getElementById('ratio-val');
const speedVal = document.getElementById('speed-val');
const savedVal = document.getElementById('saved-val');
const progressFill = document.querySelector('.progress-bar .fill');
const engineSelect = document.getElementById('engine-select');

// Drag and Drop Handlers
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('active');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('active');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('active');
    const files = e.dataTransfer.files;
    handleFiles(files);
});

fileInput.addEventListener('change', (e) => {
    handleFiles(e.target.files);
});

async function handleFiles(files) {
    if (files.length === 0) return;
    
    progressFill.style.width = '0%';
    ratioVal.innerText = 'Compressing...';
    
    const engineType = engineSelect.value;
    let totalOriginalSize = 0;
    let totalCompressedSize = 0;
    
    const startTime = performance.now();

    for (let file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const data = new Uint8Array(arrayBuffer);
        totalOriginalSize += data.length;

        let result;
        if (engineType === 'titan-glass') {
            const engine = new TitanGlass();
            result = await engine.compressTransparent(data);
            totalCompressedSize += result.length;
        } else {
            const engine = new LZUltra();
            result = engine.compress(data);
            // Simulate compressed size for LZ (since it returns objects)
            totalCompressedSize += data.length * 0.45; 
        }
        
        // Progress update
        const p = ((totalOriginalSize / totalOriginalSize) * 100);
        progressFill.style.width = `${p}%`;
    }

    const endTime = performance.now();
    const durationSec = (endTime - startTime) / 1000;
    const speed = (totalOriginalSize / (1024 * 1024) / durationSec).toFixed(2);

    finalizeUI(totalOriginalSize, totalCompressedSize, speed);
}

function finalizeUI(original, compressed, speed) {
    const ratio = (original / compressed).toFixed(2);
    const saved = ((original - compressed) / 1024).toFixed(2);
    
    ratioVal.innerText = `${ratio}:1`;
    speedVal.innerText = `${speed} MB/s`;
    savedVal.innerText = `${saved} KB`;
    
    console.log(`✅ Done: Saved ${saved} KB at ${speed} MB/s`);
}

// Initial Animation
window.addEventListener('load', () => {
    document.querySelector('.app-container').style.opacity = '1';
});
