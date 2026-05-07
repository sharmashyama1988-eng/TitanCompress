const fs = require('fs');
const CoordinateModel = require('./coordinate_model');
const PredictiveBitstream = require('./bitstream');

class TitanGEC {
    constructor(blockSize = 512) {
        this.blockSize = blockSize;
        this.model = new CoordinateModel(blockSize);
        this.bitstream = new PredictiveBitstream();
    }

    /**
     * Compress a file using Geometric Entropy logic
     */
    async compress(inputPath, outputPath) {
        const rawData = fs.readFileSync(inputPath);
        const startTime = Date.now();
        const compressedBlocks = [];

        console.log(`🚀 Titan-GEC: Vectorizing ${rawData.length} bytes...`);

        for (let i = 0; i < rawData.length; i += this.blockSize) {
            const block = rawData.slice(i, i + this.blockSize);
            const vector = this.model.bufferToVector(block);

            // 1. Find the Geometric Manifold (m, c)
            const fit = this.model.findLinearFit(vector);
            const manifold = this.model.generateManifold(fit, block.length);

            // 2. Calculate Entropy Residual
            const residual = this.model.calculateResidual(vector, manifold);
            const residualBuffer = Buffer.from(residual.map(r => Math.round(r) + 128)); // Shift to positive

            // 3. Predictive Bit-Mapping (XOR with deterministic stream)
            const seed = i; // Use offset as seed
            const predictStream = this.bitstream.generateStream(seed, block.length);
            const xorResidual = this.bitstream.xor(residualBuffer, predictStream);

            // 4. Pack into Fragmented Header
            // Header structure: [M (4b)][C (4b)][ResidualSize (2b)][ResidualData]
            const mBuf = Buffer.alloc(4);
            mBuf.writeFloatLE(fit.m);
            const cBuf = Buffer.alloc(4);
            cBuf.writeFloatLE(fit.c);
            
            const packedResidual = this.bitstream.packResidual(xorResidual);
            const resSizeBuf = Buffer.alloc(2);
            resSizeBuf.writeUInt16LE(packedResidual.length);

            const blockOutput = Buffer.concat([mBuf, cBuf, resSizeBuf, packedResidual]);
            compressedBlocks.push(blockOutput);
        }

        const finalOutput = Buffer.concat([
            Buffer.from("TGEC"), // Magic
            Buffer.concat(compressedBlocks)
        ]);

        fs.writeFileSync(outputPath, finalOutput);
        const endTime = Date.now();

        console.log(`✅ Geometric Compression Complete!`);
        console.log(`Original: ${rawData.length} bytes`);
        console.log(`Compressed: ${finalOutput.length} bytes`);
        console.log(`Efficiency: ${((1 - (finalOutput.length / rawData.length)) * 100).toFixed(2)}%`);
        console.log(`Time: ${endTime - startTime}ms`);
    }

    /**
     * Decompress a specific block (Random Access)
     */
    decompressBlock(compressedData, blockIndex) {
        // This simulates random access by seeking to a block
        // In a real FS-level implementation, we'd have an offset table
        // For now, we linear-scan or assume fixed-size headers for the prototype
    }
}

module.exports = TitanGEC;
