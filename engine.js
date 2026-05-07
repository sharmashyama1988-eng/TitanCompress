
const fs = require('fs');

class HuffmanNode {
    constructor(char, freq, left = null, right = null) {
        this.char = char;
        this.freq = freq;
        this.left = left;
        this.right = right;
    }
}

class TitanCompressor {
    constructor() {
        this.codes = {};
        this.reverseCodes = {};
    }

    getFrequencies(data) {
        const freq = {};
        for (let char of data) {
            freq[char] = (freq[char] || 0) + 1;
        }
        return freq;
    }

    buildTree(frequencies) {
        const nodes = Object.entries(frequencies).map(([char, freq]) => new HuffmanNode(char, freq));
        if (nodes.length === 0) return null;
        while (nodes.length > 1) {
            nodes.sort((a, b) => a.freq - b.freq);
            const left = nodes.shift();
            const right = nodes.shift();
            const parent = new HuffmanNode(null, left.freq + right.freq, left, right);
            nodes.push(parent);
        }
        return nodes[0];
    }

    generateCodes(node, currentCode = "") {
        if (!node) return;
        if (node.char !== null) {
            this.codes[node.char] = currentCode;
            this.reverseCodes[currentCode] = node.char;
        }
        this.generateCodes(node.left, currentCode + "0");
        this.generateCodes(node.right, currentCode + "1");
    }

    // LZ77 implementation (Simple pattern matching)
    lz77Compress(input, windowSize = 4096) {
        let i = 0;
        const output = [];
        while (i < input.length) {
            let matchLength = 0;
            let matchOffset = 0;
            const start = Math.max(0, i - windowSize);
            
            for (let j = start; j < i; j++) {
                let len = 0;
                while (i + len < input.length && input[j + len] === input[i + len] && len < 255) {
                    len++;
                }
                if (len > matchLength) {
                    matchLength = len;
                    matchOffset = i - j;
                }
            }

            if (matchLength >= 3) {
                output.push({ offset: matchOffset, length: matchLength });
                i += matchLength;
            } else {
                output.push(input[i]);
                i++;
            }
        }
        return output;
    }

    compress(data) {
        // Step 1: LZ77 (Pattern Matching)
        console.log("Stage 1: LZ77 Dictionary Matching...");
        const lzData = this.lz77Compress(data);
        const serializedLZ = JSON.stringify(lzData);
        
        // Step 2: Huffman (Entropy Coding)
        console.log("Stage 2: Huffman Entropy Coding...");
        const freqs = this.getFrequencies(serializedLZ);
        const root = this.buildTree(freqs);
        this.generateCodes(root);

        let binaryString = "";
        for (let char of serializedLZ) {
            binaryString += this.codes[char];
        }
        
        return {
            compressedData: binaryString,
            metadata: this.codes,
            originalSize: data.length,
            lzSize: serializedLZ.length
        };
    }
}

module.exports = TitanCompressor;
