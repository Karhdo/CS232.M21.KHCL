export interface inputString {
    charInput: string,
    code: number
}

export interface outputString {
    charOutput: string,
    code: number
}

// LZW-compress a string
export function lzw_encode(s: any) {
    var dict = {};
    var data = (s + "").split("");
    console.log("data:", data);
    var input: Array<inputString> = [];
    var output: Array<outputString> = [];
    var next = [];
    var currChar;
    var phrase = data[0];
    var code = 256;
    for (var i = 1; i < data.length; i++) {
        currChar = data[i];
        input.push({charInput: phrase, code: phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0)});
        next.push(currChar);
        if (dict[phrase + currChar] != null) {
            phrase += currChar;
            input.pop();
        } else {
            output.push({charOutput: String.fromCharCode(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0)), code: phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0)});
            dict[phrase + currChar] = code;
            code++;
            phrase = currChar;
        }
    }

    input.push({charInput: phrase, code: phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0)});
    output.push({charOutput: String.fromCharCode(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0)), code: phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0)});
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
function a () {
    
}

// Decompress an LZW-encoded string
export function lzw_decode(s: any) {
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
        } else {
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
