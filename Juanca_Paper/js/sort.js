// Save Txt
$("#saveSort").click(function () {
    var name;
    while (!valueIsEmpty(name)) {
        name = prompt("File name:");
    }
    var textToWrite = document.getElementById("inputTextArea").value;
    console.log(textToWrite);
    var textFileAsBlob = new Blob([textToWrite], { type: "text/plain" });
    var fileNameToSaveAs = name + ".txt";
    var downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "Download File";
    if (window.webkitURL != null) {
        downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
    } else {
        downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
        downloadLink.onclick = destroyClickedElement;
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
    }

    downloadLink.click();
});

// Save Txt
$("#saveSort").click(function () {
    var name;
    while (!valueIsEmpty(name)) {
        name = prompt("File name:");
    }
    var textToWrite = document.getElementById("inputTextArea").value;
    console.log(textToWrite);
    var textFileAsBlob = new Blob([textToWrite], { type: "text/plain" });
    var fileNameToSaveAs = name + ".txt";
    var downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "Download File";
    if (window.webkitURL != null) {
        downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
    } else {
        downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
        downloadLink.onclick = destroyClickedElement;
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
    }

    downloadLink.click();
});

// Verify if the string is Empty.
function valueIsEmpty(label) {
    return label && label !== "";
}

function destroyClickedElement(event) {
    document.body.removeChild(event.target);
}
