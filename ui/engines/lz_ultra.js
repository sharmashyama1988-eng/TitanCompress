
/**
 * LZ-Ultra: Advanced Dictionary Matcher
 * Uses a rolling hash to find patterns in massive windows.
 */

class LZUltra {
    constructor(windowSize = 1024 * 1024 * 64) { // 64MB Window by default
        this.windowSize = windowSize;
        this.hashTable = new Map();
    }

    compress(data) {
        console.log("🔍 LZ-Ultra: Scanning for patterns (64MB Window)...");
        const output = [];
        let i = 0;

        while (i < data.length - 3) {
            // Create a hash of the next 3 bytes
            const hash = (data[i] << 16) | (data[i+1] << 8) | data[i+2];
            
            if (this.hashTable.has(hash)) {
                let matchPos = this.hashTable.get(hash);
                
                // Validate match and find length
                if (i - matchPos < this.windowSize) {
                    let len = 0;
                    while (i + len < data.length && data[matchPos + len] === data[i + len] && len < 255) {
                        len++;
                    }

                    if (len >= 3) {
                        output.push({ type: 'match', distance: i - matchPos, length: len });
                        i += len;
                        continue;
                    }
                }
            }

            // Update hash table with current position
            this.hashTable.set(hash, i);
            output.push({ type: 'literal', value: data[i] });
            i++;
        }

        // Handle remaining bytes
        while (i < data.length) {
            output.push({ type: 'literal', value: data[i] });
            i++;
        }

        return output;
    }

    // NEW: Lossless Reconstruction
    decompress(compressedData) {
        let output = [];
        for (let item of compressedData) {
            if (item.type === 'literal') {
                output.push(item.value);
            } else if (item.type === 'match') {
                let start = output.length - item.distance;
                for (let j = 0; j < item.length; j++) {
                    output.push(output[start + j]);
                }
            }
        }
        return Buffer.from(output);
    }
}

export default LZUltra;
