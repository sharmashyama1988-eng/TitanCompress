/**
 * TitanCompress: Predictive Bitstream
 * Uses a seed to generate a predictive bitstream for XOR-based residual compression.
 */

class PredictiveBitstream {
    constructor(seed = 0) {
        this.seed = seed;
    }

    /**
     * A simple deterministic PRNG (Mulberry32)
     */
    static lcg(a) {
        return function() {
          let t = a += 0x6D2B79F5;
          t = Math.imul(t ^ t >>> 15, t | 1);
          t ^= t + Math.imul(t ^ t >>> 7, t | 61);
          return ((t ^ t >>> 14) >>> 0) / 4294967296;
        }
    }

    /**
     * Generate a predictive byte stream of N length
     */
    generateStream(seed, length) {
        const next = PredictiveBitstream.lcg(seed);
        const stream = Buffer.alloc(length);
        for (let i = 0; i < length; i++) {
            stream[i] = Math.floor(next() * 256);
        }
        return stream;
    }

    /**
     * XOR two buffers
     */
    xor(buf1, buf2) {
        const result = Buffer.alloc(buf1.length);
        for (let i = 0; i < buf1.length; i++) {
            result[i] = buf1[i] ^ buf2[i];
        }
        return result;
    }

    /**
     * Pack residual values (which should be small/mostly zero after XOR)
     * Using a simple bit-packing logic for the prototype.
     */
    packResidual(residual) {
        // In a real implementation, we would use an Entropy Coder here (FSE/Huffman)
        // For this zero-dependency prototype, we use a Run-Length Encoding variant
        const packed = [];
        let i = 0;
        while (i < residual.length) {
            let count = 1;
            while (i + count < residual.length && residual[i + count] === residual[i] && count < 255) {
                count++;
            }
            packed.push(residual[i]);
            packed.push(count);
            i += count;
        }
        return Buffer.from(packed);
    }

    unpackResidual(packed, originalLength) {
        const unpacked = [];
        for (let i = 0; i < packed.length; i += 2) {
            const val = packed[i];
            const count = packed[i + 1];
            for (let j = 0; j < count; j++) {
                unpacked.push(val);
            }
        }
        return Buffer.from(unpacked);
    }
}

module.exports = PredictiveBitstream;
