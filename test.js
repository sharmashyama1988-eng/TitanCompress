
const TitanCompressor = require('./engine.js');

const compressor = new TitanCompressor();

// Bahut saare repetitive data ke saath test karte hain
const testText = "Amit is building a compression engine. ".repeat(100) + 
                 "This engine is called TitanCompress. ".repeat(50) +
                 "It is better than ZIP because we control the dictionary! ".repeat(30);

console.log("--- TITAN COMPRESS PERFORMANCE REPORT ---");
console.log("Input Data Length:", testText.length, "bytes");

const start = Date.now();
const result = compressor.compress(testText);
const end = Date.now();

const compressedBytes = Math.ceil(result.compressedData.length / 8);
const compressionRatio = ((1 - (compressedBytes / testText.length)) * 100).toFixed(2);

console.log("-----------------------------------------");
console.log("Original Size:", testText.length, "bytes");
console.log("Compressed Size:", compressedBytes, "bytes");
console.log("Compression Ratio:", compressionRatio + "%");
console.log("Time Taken:", (end - start), "ms");
console.log("-----------------------------------------");

if (compressionRatio > 80) {
    console.log("RESULT: SUPERIOR COMPRESSION DETECTED! 🚀");
} else {
    console.log("RESULT: Standard Compression achieved.");
}
