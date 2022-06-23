"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const huffman = require("./huffman");
const lzw = require("./lzw");
const textArea = $("#text");
const selectInput = $("#algorithm");
const btnEncode = $(".btn-encode");
const btnDecode = $(".btn-decode");
const btnUpload = $(".btn-upload");
const txtInput = $("input");
let text, typeAlgorithm, codes, encodedArray, file;
textArea.on("change", function () {
    console.log(123);
    if ($(this).val()) {
        $(this).addClass("active");
    }
    else {
        $(this).removeClass("active");
    }
});
btnUpload.on("click", () => {
    txtInput.click();
});
txtInput.on("change", function () {
    file = $(this).prop("files")[0];
    let fileType = file.type;
    let validExtensions = ["text/plain"];
    if (validExtensions.includes(fileType)) {
        let fileReader = new FileReader();
        fileReader.onload = function () {
            textArea.val(String(fileReader.result));
            textArea.addClass("active");
        };
        fileReader.readAsText(txtInput.prop("files")[0]);
    }
});
btnEncode.on("click", () => {
    typeAlgorithm = String(selectInput.val());
    switch (typeAlgorithm) {
        case "huffman":
            text = String(textArea.val());
            codes = huffman.getCodesFromText(text); // Symbols codes
            encodedArray = huffman.encode(text, codes); // Get array of encoded symbols
            var encodedText = encodedArray.join("");
            textArea.val(encodedText);
            showConversionTableOfHuffman(text);
            break;
        case "lzw":
            text = String(textArea.val());
            var { output, dict, input, next } = lzw.lzw_encode(text);
            // var encodedText = output.join("");
            var encodedTextLZW = output
                .map((outputElement) => {
                return outputElement.charOutput;
            })
                .join("");
            textArea.val(encodedTextLZW);
            showConversionTableOfLZW(dict, input, output, next);
            break;
    }
});
btnDecode.on("click", () => {
    typeAlgorithm = String(selectInput.val());
    switch (typeAlgorithm) {
        case "huffman":
            if (!encodedArray) {
                alert("The conversion table is empty!");
                break;
            }
            text = huffman.decode(encodedArray, codes);
            textArea.val(text);
            break;
        case "lzw":
            text = String(textArea.val());
            let decodeText = lzw.lzw_decode(text);
            textArea.val(decodeText);
            break;
    }
});
const showConversionTableOfHuffman = (text) => {
    let frequencyArr = huffman.getFrequency(text);
    let codes = huffman.getCodesFromText(text);
    let html = "<tr><th>Character</th><th>Frequency</th><th>Code</th></tr>";
    for (let i = 0; i < frequencyArr.length; i++) {
        html += `
                    <tr>
                        <td>${frequencyArr[i][0]}</td>
                        <td>${frequencyArr[i][1]}</td>
                        <td>${codes.get(frequencyArr[i][0])}</td>
                    </tr>
        `;
    }
    $(".conversion-table").show();
    $(".conversion-table table").empty();
    $(".conversion-table table").append(html);
};
const showConversionTableOfLZW = (dict, input, output, next) => {
    let html = "<tr><th>Input</th><th>Output</th><th>Next</th><th>Dictionnary</th></tr>";
    var i = 0;
    for (const [key, value] of Object.entries(dict)) {
        html += `
                    <tr>
                        <td>${input[i].charInput}: ${input[i].code}</td>
                        <td>${output[i].charOutput}: ${output[i].code}</td>
                        <td>${next[i]}</td>
                        <td>${key}: ${value}</td>
                    </tr>
        `;
        i++;
    }
    html += `
                <tr>
                    <td>${input[i].charInput}: ${input[i].code}</td>
                    <td>${output[i].charOutput}: ${output[i].code}</td>
                    <td></td>
                    <td></td>
                </tr>
    `;
    $(".conversion-table").show();
    $(".conversion-table table").empty();
    $(".conversion-table table").append(html);
};
