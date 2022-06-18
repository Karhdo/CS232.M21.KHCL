"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTree = exports.getFrequency = exports.getRelativeFrequency = exports.getCodesFromText = exports.getEntropyOfText = exports.decode = exports.encode = void 0;
/** ENCODE TEXT */
function encode(text, codes) {
    const result = [];
    for (let i = 0; i < text.length; i++) {
        result.push(codes.get(text[i]));
    }
    return result;
}
exports.encode = encode;
/** DECODE TEXT */
function decode(text, codes) {
    let result = "";
    for (let i = 0; i < text.length; i++) {
        // eslint-disable-next-line no-loop-func
        codes.forEach((code, symbol) => {
            if (text[i] === code) {
                result += symbol;
            }
        });
    }
    return result;
}
exports.decode = decode;
/** GET ENTROPY */
function getEntropyOfText(text) {
    const relFreq = getRelativeFrequency(getFrequency(text));
    let entropy = 0;
    for (let i = 0; i < relFreq.length; i++) {
        entropy += relFreq[i][1] * Math.log2(relFreq[i][1]);
    }
    return -entropy;
}
exports.getEntropyOfText = getEntropyOfText;
/** GET SYMBOLS CODES FROM TEXT */
function getCodesFromText(text) {
    const frequencyArr = getFrequency(text);
    const symbols = frequencyArr.map((item) => item[0]);
    const tree = getTree(frequencyArr);
    const codes = new Map(); // Array with symbols and codes
    symbols.forEach((element) => {
        codes.set(element, getSymbolCode(tree, element));
    });
    return codes;
}
exports.getCodesFromText = getCodesFromText;
//** GET RELATIVE FREQUENCY */
function getRelativeFrequency(arr) {
    let length = 0;
    const resArr = [];
    for (let i = 0; i < arr.length; i++) {
        length += arr[i][1];
    }
    for (let i = 0; i < arr.length; i++) {
        const relFreq = arr[i][1] / length;
        resArr.push([arr[i][0], relFreq]);
    }
    return resArr;
}
exports.getRelativeFrequency = getRelativeFrequency;
/** GET CODE FOR SYMBOL */
function getSymbolCode(tree, symbol, code = "") {
    let arr = [];
    if (typeof tree.leafs === undefined) {
        return code;
    }
    arr = tree.leafs;
    if (arr[0].symbols.length === 1 && arr[0].symbols[0] === symbol)
        return code + 0;
    if (arr[0].symbols.length === 1 && arr[0].symbols[0] !== symbol) {
        if (arr[1].symbols.length === 1 && arr[1].symbols[0] === symbol)
            return code + 1;
        if (arr[1].symbols.includes(symbol) === true)
            return getSymbolCode(arr[1], symbol, code + 1);
    }
    if (arr[1].symbols.length === 1 && arr[1].symbols[0] === symbol)
        return code + 1;
    if (arr[1].symbols.length === 1 && arr[1].symbols[0] !== symbol) {
        if (arr[0].symbols.length === 1 && arr[0].symbols[0] === symbol)
            return code + 0;
        if (arr[0].symbols.includes(symbol) === true)
            return getSymbolCode(arr[0], symbol, code + 0);
    }
    if (arr[0].symbols.length >= 2 && arr[0].symbols.includes(symbol))
        return getSymbolCode(arr[0], symbol, code + 0);
    if (arr[1].symbols.length >= 2 && arr[1].symbols.includes(symbol))
        return getSymbolCode(arr[1], symbol, code + 1);
}
/** GET SYMBOLS FREQUENCY FROM TEXT */
function getFrequency(text) {
    const freq = new Map();
    for (let i = 0; i < text.length; i++) {
        let counter = 0;
        for (let j = 0; j < text.length; j++) {
            if (!freq.has(text[i])) {
                if (text[i] === text[j] && i !== j) {
                    counter++;
                }
            }
        }
        if (!freq.has(text[i])) {
            freq.set(text[i], counter + 1);
        }
    }
    return Array.from(freq).sort((a, b) => b[1] - a[1]); //Descending sort
}
exports.getFrequency = getFrequency;
/** GENERATE HUFFMAN TREE */
function getTree(arr) {
    arr = arr.map((elem) => ({
        symbols: [elem[0]],
        weight: elem[1],
        leafs: [],
    }));
    let min1;
    let min2;
    let node;
    while (arr.length > 2) {
        min1 = searchMinWeightNode(arr);
        arr.splice(arr.indexOf(min1), 1);
        min2 = searchMinWeightNode(arr);
        arr.splice(arr.indexOf(min2), 1);
        node = createNode(min1, min2);
        arr.push(node);
    }
    return createNode(arr[0], arr[1]);
}
exports.getTree = getTree;
/** CREATE TREE NODE FROM TWO NODES */
function createNode(node1, node2) {
    const weight = node1.weight + node2.weight;
    const symbols = node1.symbols.concat(node2.symbols);
    const leafs = [node1, node2];
    return {
        symbols,
        weight,
        leafs,
    };
}
/** SEARCH NODE WITH MINIMAL WEIGHT IN TREE */
function searchMinWeightNode(arr, minNumber = -1) {
    let min = 9999;
    let result;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].weight <= min && arr[i].weight >= minNumber) {
            min = arr[i].weight;
            result = arr[i];
        }
    }
    return result;
}
