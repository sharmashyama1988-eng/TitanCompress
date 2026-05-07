
const LZUltra = require('./lz_ultra');
const FSECoder = require('./fse_core');
const fs = require('fs');

class TitanUltraX {
    constructor() {
        this.lz = new LZUltra();
        this.fse = new FSECoder();
    }

    async compressFile(inputPath, outputPath) {
        console.log(`\n💎 TITAN-ULTRA-X v1.0 [GOD-MODE ENABLED]`);
        console.log(`-----------------------------------------`);
        
        const rawData = fs.readFileSync(inputPath);
        const startTime = Date.now();

        // Stage 1: LZ Compression
        const lzData = this.lz.compress(rawData);
        
        // Convert LZ objects to a byte stream for FSE
        // We'll use a simple serialization for the prototype
        const lzBuffer = Buffer.from(JSON.stringify(lzData));
        
        // Stage 2: FSE Entropy Coding
        const fseResult = this.fse.encode(lzBuffer);

        // Final Packaging (Simulated header)
        const finalBuffer = Buffer.concat([
            Buffer.from("TITANX"), // Header
            fseResult.stream
        ]);

        fs.writeFileSync(outputPath, finalBuffer);

        const endTime = Date.now();
        const ratio = ((1 - (finalBuffer.length / rawData.length)) * 100).toFixed(2);

        console.log(`-----------------------------------------`);
        console.log(`✅ Compression Complete!`);
        console.log(`Original: ${rawData.length} bytes`);
        console.log(`TitanUltra-X: ${finalBuffer.length} bytes`);
        console.log(`Squeezed: ${ratio}%`);
        console.log(`Time: ${endTime - startTime}ms`);
        console.log(`-----------------------------------------`);
    }
}

// Run if called directly
if (require.main === module) {
    const engine = new TitanUltraX();
    
    // Create a dummy large test file if it doesn't exist
    const testFile = 'D:\\TitanCompress\\test_large.txt';
    const content = "This is a secret message. ".repeat(10000) + "Wait, there is more! ".repeat(5000);
    fs.writeFileSync(testFile, content);

    engine.compressFile(testFile, 'D:\\TitanCompress\\test_large.titanx');
}
