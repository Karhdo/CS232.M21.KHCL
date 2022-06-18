import * as huffman from "./huffman";

const textArea = $("#text");
const selectInput = $("#algorithm");
const btnEncode = $(".btn-encode");
const btnDecode = $(".btn-decode");
const btnUpload = $(".btn-upload");
const txtInput = $("input");

let text: string, typeAlgorithm: string, codes: Map<string, string>, encodedArray: Array<any>, file: File;

textArea.on("change", function () {
    console.log(123);
    if ($(this).val()) {
        $(this).addClass("active");
    } else {
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

            let encodedText: string = encodedArray.join("");
            textArea.val(encodedText);
            showConversionTable(text);

            break;
        case "shanon-fano":
            console.log("Shanon-fano .....");
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
        case "shanon-fano":
            console.log("Shanon-fano .....");
            break;
    }
});

const showConversionTable = (text: string) => {
    let frequencyArr: [string, number][] = huffman.getFrequency(text);
    let codes: Map<string, string> = huffman.getCodesFromText(text);
    let html: string = "<tr><th>Character</th><th>Frequency</th><th>Code</th></tr>";

    for (let i: number = 0; i < frequencyArr.length; i++) {
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
