"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lzw_decode = exports.lzw_encode = void 0;
// LZW-compress a string
function lzw_encode(s) {
    var dict = {};
    var data = (s + "").split("");
    console.log("data:", data);
    var input = [];
    var output = [];
    var next = [];
    var currChar;
    var phrase = data[0];
    var code = 256;
    for (var i = 1; i < data.length; i++) {
        currChar = data[i];
        input.push({ charInput: phrase, code: phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0) });
        next.push(currChar);
        if (dict[phrase + currChar] != null) {
            phrase += currChar;
            input.pop();
        }
        else {
            output.push({ charOutput: String.fromCharCode(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0)), code: phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0) });
            dict[phrase + currChar] = code;
            code++;
            phrase = currChar;
        }
    }
    input.push({ charInput: phrase, code: phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0) });
    output.push({ charOutput: String.fromCharCode(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0)), code: phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0) });
    console.log("output:", output);
    console.log("input:", input);
    console.log("dict: ", dict);
    // for (var i = 0; i < output.length; i++) {
    //     output[i] = String.fromCharCode(output[i]);
    // }
    return {
        output,
        dict,
        input,
        next,
    };
}
exports.lzw_encode = lzw_encode;
function a() {
}
// Decompress an LZW-encoded string
function lzw_decode(s) {
    var dict = {};
    var data = (s + "").split("");
    var currChar = data[0];
    var oldPhrase = currChar;
    var out = [currChar];
    var code = 256;
    var phrase;
    for (var i = 1; i < data.length; i++) {
        var currCode = data[i].charCodeAt(0);
        if (currCode < 256) {
            phrase = data[i];
        }
        else {
            phrase = dict[currCode] ? dict[currCode] : oldPhrase + currChar;
        }
        out.push(phrase);
        currChar = phrase.charAt(0);
        dict[code] = oldPhrase + currChar;
        code++;
        oldPhrase = phrase;
    }
    console.log('-----Decode-----');
    console.log(dict);
    return out.join("");
}
exports.lzw_decode = lzw_decode;
