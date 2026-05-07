const fs = require('fs');
const TitanGEC = require('./titan_gec');
const CoordinateModel = require('./coordinate_model');
const PredictiveBitstream = require('./bitstream');

async function testRandomAccess() {
    const engine = new TitanGEC(512);
    const inputFile = 'd:\\TitanCompress\\test_large.txt';
    const compressedFile = 'd:\\TitanCompress\\test_large.tgec';

    console.log("🛠️  Step 1: Compressing file with Fragmented Headers...");
    await engine.compress(inputFile, compressedFile);

    console.log("\n📍 Step 2: Simulating Random Access (Reading Block #10 directly)...");
    
    const compressedData = fs.readFileSync(compressedFile);
    const bitstream = new PredictiveBitstream();
    const model = new CoordinateModel(512);

    // Skip Magic Header "TGEC" (4 bytes)
    let pointer = 4;
    let targetBlock = 10;
    let currentBlock = 0;

    while (currentBlock < targetBlock) {
        const m = compressedData.readFloatLE(pointer);
        const c = compressedData.readFloatLE(pointer + 4);
        const resSize = compressedData.readUInt16LE(pointer + 8);
        pointer += 10 + resSize;
        currentBlock++;
    }

    // Now pointer is at Block #10
    console.log(`📡 Block #10 found at offset ${pointer} bytes.`);
    
    const m = compressedData.readFloatLE(pointer);
    const c = compressedData.readFloatLE(pointer + 4);
    const resSize = compressedData.readUInt16LE(pointer + 8);
    const packedResidual = compressedData.slice(pointer + 10, pointer + 10 + resSize);

    console.log(`🧬 Reconstructing Block #10 [m=${m.toFixed(4)}, c=${c.toFixed(4)}]`);

    // Reconstruction logic
    const seed = targetBlock * 512; // Block offset in original file
    const predictStream = bitstream.generateStream(seed, 512);
    const xorResidual = bitstream.unpackResidual(packedResidual, 512);
    const residualBuffer = bitstream.xor(xorResidual, predictStream);
    
    const manifold = model.generateManifold({ m, c }, 512);
    const finalVector = model.reconstruct(manifold, Array.from(residualBuffer).map(b => b - 128));
    const finalBuffer = model.vectorToBuffer(finalVector);

    console.log(`✅ Reconstruction complete! First 50 chars of Block #10:`);
    console.log(`"${finalBuffer.toString('utf8').substring(0, 50)}..."`);
}

testRandomAccess();
