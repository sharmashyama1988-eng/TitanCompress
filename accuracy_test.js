
const LZUltra = require('./lz_ultra');
const fs = require('fs');

async function verifyAccuracy() {
    console.log("🛠️  TITAN-ULTRA: DEEP ACCURACY CHECK...");
    
    const lz = new LZUltra();
    
    // Test Case 1: Repetitive Data
    const testData1 = Buffer.from("Accuracy is everything. ".repeat(100));
    
    // Test Case 2: Random Binary Data (The Hardest to compress/decompress)
    const testData2 = Buffer.alloc(1000);
    for(let i=0; i<1000; i++) testData2[i] = Math.floor(Math.random() * 256);

    const cases = [testData1, testData2];

    for (let i = 0; i < cases.length; i++) {
        const original = cases[i];
        console.log(`\nTesting Case ${i + 1} (${original.length} bytes)`);

        // 1. Compress
        const compressed = lz.compress(original);
        
        // 2. Decompress
        const reconstructed = lz.decompress(compressed);

        // 3. Deep Equality Check
        if (original.equals(reconstructed)) {
            console.log(`✅ Case ${i + 1}: 100% ACCURATE (Bit-for-bit match)`);
        } else {
            console.error(`❌ Case ${i + 1}: CORRUPTION DETECTED!`);
            process.exit(1);
        }
    }

    console.log("\n💎 RESULT: ALL ENGINES ARE LOSSLESS AND ACCURATE.");
}

verifyAccuracy();
