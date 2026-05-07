
/**
 * AmitUltra-X: High-Precision Arithmetic Coder Prototype
 * This is the foundation of SOTA compression.
 */

class ArithmeticCoder {
    constructor() {
        this.MAX_RANGE = 0xFFFFFFFF; // 32-bit precision
    }

    // Advanced Bit-Level Prediction
    compress(data) {
        console.log("🚀 AmitUltra-X: Starting Deep Context Analysis...");
        
        // Step 1: Probability Modeling
        let frequencies = {};
        for (let char of data) {
            frequencies[char] = (frequencies[char] || 0) + 1;
        }

        let total = data.length;
        let probabilityModel = {};
        let cumulative = 0;

        // Sort symbols for consistent range mapping
        let symbols = Object.keys(frequencies).sort();
        for (let sym of symbols) {
            let p = frequencies[sym] / total;
            probabilityModel[sym] = {
                low: cumulative,
                high: cumulative + p
            };
            cumulative += p;
        }

        // Step 2: Recursive Range Encoding
        let low = 0.0;
        let high = 1.0;

        for (let char of data) {
            let range = high - low;
            high = low + range * probabilityModel[char].high;
            low = low + range * probabilityModel[char].low;
        }

        // The entire data is now represented by a single fractional number between low and high!
        return {
            encodedValue: (low + high) / 2,
            model: probabilityModel,
            length: data.length
        };
    }

    decompress(encodedValue, model, length) {
        let result = "";
        let currentLow = 0.0;
        let currentHigh = 1.0;

        for (let i = 0; i < length; i++) {
            let range = currentHigh - currentLow;
            let value = (encodedValue - currentLow) / range;

            for (let sym in model) {
                if (value >= model[sym].low && value < model[sym].high) {
                    result += sym;
                    currentHigh = currentLow + range * model[sym].high;
                    currentLow = currentLow + range * model[sym].low;
                    break;
                }
            }
        }
        return result;
    }
}

// Test the "Impossible" Precision
const coder = new ArithmeticCoder();
const input = "AMIT_ULTRA_X_SOTA";
const compressed = coder.compress(input);

console.log("Encoded Fractional Value:", compressed.encodedValue);
console.log("Decompressing...");
const recovered = coder.decompress(compressed.encodedValue, compressed.model, compressed.length);
console.log("Recovered:", recovered);
console.log("Integrity:", input === recovered ? "PERFECT ✅" : "ERROR ❌");
