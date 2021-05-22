// Save Txt
$("#saveSort").click(function () {
    var name;
    while (!valueIsEmpty(name)) {
        name = prompt("File name:");
    }
    var textToWrite = document.getElementById("inputTextArea").value;
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

// Import Txt
$("#importSort").change(function (event) {
    var reader = new FileReader();
    reader.onload = function () {
        document.getElementById("inputTextArea").textContent = reader.result;
    };
    reader.readAsText(event.target.files[0]);
});

// Bubble Sort
$("#bubble").click(function () {
    var text = document.getElementById("inputTextArea").value;
    var isValid = /^[0-9,.]*$/.test(text);
    if (isValid) {
        var array = text.split(",");
        var dataArray = [];
        for (var i = 0; i < array.length; i++) {
            dataArray.push(parseFloat(array[i]));
        }
        // Time 0
        var t0 = performance.now();
        // Algorithm
        var len = dataArray.length;
        for (var i = 0; i < len; i++) {
            var min = i;
            for (var j = i + 1; j < len; j++) {
                if (dataArray[min] > dataArray[j]) {
                    min = j;
                }
            }
            if (min !== i) {
                var tmp = dataArray[i];
                dataArray[i] = dataArray[min];
                dataArray[min] = tmp;
            }
        }
        // Time 1
        var t1 = performance.now();
        // Show String Ascending
        var txt = "";
        for (var i = 0; i < dataArray.length; i++) {
            if (i == dataArray.length - 1) {
                txt += dataArray[i];
            } else {
                txt += dataArray[i] + ",";
            }
        }
        document.getElementById("OutputTextAreaAscending").textContent = txt;

        // Show String Descending
        var txt = "";
        dataArray.reverse();
        for (var i = 0; i < dataArray.length; i++) {
            if (i == dataArray.length - 1) {
                txt += dataArray[i];
            } else {
                txt += dataArray[i] + ",";
            }
        }
        document.getElementById("OutputTextAreaDescending").textContent = txt;
        // Calculate Time
        var time = (t1 - t0).toFixed(4);
        document.getElementById("timeText").innerHTML =
            "Time: " + time + " (ms)";
    } else {
        alert("Only numbers sepparated by a comma");
    }
});

// Selection Sort
$("#selection").click(function () {
    var text = document.getElementById("inputTextArea").value;
    var isValid = /^[0-9,.]*$/.test(text);
    if (isValid) {
        var array = text.split(",");
        var dataArray = [];
        for (var i = 0; i < array.length; i++) {
            dataArray.push(parseFloat(array[i]));
        }
        // Time 0
        var t0 = performance.now();
        // Algorithm
        var len = dataArray.length;
        for (var i = 0; i < len; i++) {
            for (var j = 0; j < len; j++) {
                if (dataArray[j] > dataArray[j + 1]) {
                    var tmp = dataArray[j];
                    dataArray[j] = dataArray[j + 1];
                    dataArray[j + 1] = tmp;
                }
            }
        }
        // Time 1
        var t1 = performance.now();
        // Show String Ascending
        var txt = "";
        for (var i = 0; i < dataArray.length; i++) {
            if (i == dataArray.length - 1) {
                txt += dataArray[i];
            } else {
                txt += dataArray[i] + ",";
            }
        }
        document.getElementById("OutputTextAreaAscending").textContent = txt;

        // Show String Descending
        var txt = "";
        dataArray.reverse();
        for (var i = 0; i < dataArray.length; i++) {
            if (i == dataArray.length - 1) {
                txt += dataArray[i];
            } else {
                txt += dataArray[i] + ",";
            }
        }
        document.getElementById("OutputTextAreaDescending").textContent = txt;
        // Calculate Time
        var time = (t1 - t0).toFixed(4);
        document.getElementById("timeText").innerHTML =
            "Time: " + time + " (ms)";
    } else {
        alert("Only numbers sepparated by a comma");
    }
});

// Insertion Sort
$("#insertion").click(function () {
    var text = document.getElementById("inputTextArea").value;
    var isValid = /^[0-9,.]*$/.test(text);
    if (isValid) {
        var array = text.split(",");
        var dataArray = [];
        for (var i = 0; i < array.length; i++) {
            dataArray.push(parseFloat(array[i]));
        }
        // Time 0
        var t0 = performance.now();
        // Algorithm
        var len = dataArray.length;
        for (var i = 1; i < len; i++) {
            var key = dataArray[i];
            var j = i - 1;
            while (j >= 0 && dataArray[j] > key) {
                dataArray[j + 1] = dataArray[j];
                j = j - 1;
            }
            dataArray[j + 1] = key;
        }
        // Time 1
        var t1 = performance.now();
        // Show String Ascending
        var txt = "";
        for (var i = 0; i < dataArray.length; i++) {
            if (i == dataArray.length - 1) {
                txt += dataArray[i];
            } else {
                txt += dataArray[i] + ",";
            }
        }
        document.getElementById("OutputTextAreaAscending").textContent = txt;

        // Show String Descending
        var txt = "";
        dataArray.reverse();
        for (var i = 0; i < dataArray.length; i++) {
            if (i == dataArray.length - 1) {
                txt += dataArray[i];
            } else {
                txt += dataArray[i] + ",";
            }
        }
        document.getElementById("OutputTextAreaDescending").textContent = txt;
        // Calculate Time
        var time = (t1 - t0).toFixed(4);
        document.getElementById("timeText").innerHTML =
            "Time: " + time + " (ms)";
    } else {
        alert("Only numbers sepparated by a comma");
    }
});

// Merge Sort
$("#merge").click(function () {
    var text = document.getElementById("inputTextArea").value;
    var isValid = /^[0-9,.]*$/.test(text);
    if (isValid) {
        var array = text.split(",");
        var dataArray = [];
        for (var i = 0; i < array.length; i++) {
            dataArray.push(parseFloat(array[i]));
        }
        // Time 0
        var t0 = performance.now();
        // Algorithm
        dataArray = mergeSort(dataArray);
        // Time 1
        var t1 = performance.now();
        // Show String Ascending
        var txt = "";
        for (var i = 0; i < dataArray.length; i++) {
            if (i == dataArray.length - 1) {
                txt += dataArray[i];
            } else {
                txt += dataArray[i] + ",";
            }
        }
        document.getElementById("OutputTextAreaAscending").textContent = txt;

        // Show String Descending
        var txt = "";
        dataArray.reverse();
        for (var i = 0; i < dataArray.length; i++) {
            if (i == dataArray.length - 1) {
                txt += dataArray[i];
            } else {
                txt += dataArray[i] + ",";
            }
        }
        document.getElementById("OutputTextAreaDescending").textContent = txt;
        // Calculate Time
        var time = (t1 - t0).toFixed(4);
        document.getElementById("timeText").innerHTML =
            "Time: " + time + " (ms)";
    } else {
        alert("Only numbers sepparated by a comma");
    }
});

function merge(left, right) {
    var result = [],
        leftLen = left.length,
        rightLen = right.length,
        l = 0,
        r = 0;
    while (l < leftLen && r < rightLen) {
        if (left[l] < right[r]) {
            result.push(left[l]);
            l++;
        } else {
            result.push(right[r]);
            r++;
        }
    }
    return result.concat(left.slice(l)).concat(right.slice(r));
}

function mergeSort(arr) {
    var len = arr.length;
    if (len < 2) {
        return arr;
    }
    var mid = Math.floor(len / 2),
        left = arr.slice(0, mid),
        right = arr.slice(mid);
    return merge(mergeSort(left), mergeSort(right));
}

// Quick Sort
$("#quick").click(function () {
    var text = document.getElementById("inputTextArea").value;
    var isValid = /^[0-9,.]*$/.test(text);
    if (isValid) {
        var array = text.split(",");
        var dataArray = [];
        for (var i = 0; i < array.length; i++) {
            dataArray.push(parseFloat(array[i]));
        }
        // Time 0
        var t0 = performance.now();
        // Algorithm
        dataArray = QuickSort(dataArray);
        // Time 1
        var t1 = performance.now();
        // Show String Ascending
        var txt = "";
        for (var i = 0; i < dataArray.length; i++) {
            if (i == dataArray.length - 1) {
                txt += dataArray[i];
            } else {
                txt += dataArray[i] + ",";
            }
        }
        document.getElementById("OutputTextAreaAscending").textContent = txt;

        // Show String Descending
        var txt = "";
        dataArray.reverse();
        for (var i = 0; i < dataArray.length; i++) {
            if (i == dataArray.length - 1) {
                txt += dataArray[i];
            } else {
                txt += dataArray[i] + ",";
            }
        }
        document.getElementById("OutputTextAreaDescending").textContent = txt;
        // Calculate Time
        var time = (t1 - t0).toFixed(4);
        document.getElementById("timeText").innerHTML =
            "Time: " + time + " (ms)";
    } else {
        alert("Only numbers sepparated by a comma");
    }
});

function QuickSort(arr) {
    function partition(left, right) {
        var pivot = parseInt((left + right) / 2);
        var i = left;
        var j = right;
        while (i <= j) {
            while (arr[i] < arr[pivot]) {
                i++;
            }
            while (arr[j] > arr[pivot]) {
                j--;
            }
            if (i <= j) {
                var temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
                i++;
                j--;
            }
        }
        return i;
    }
    var left = 0;
    var right = arr.length - 1;
    var index1 = partition(left, right);
    var index2 = index1 - 2;
    while (left < index1 - 1) {
        index1 = partition(left, index1);
    }
    while (right > index2) {
        index2 = partition(index2, right);
    }
    return arr;
}

// Heap Sort
$("#heap").click(function () {
    var text = document.getElementById("inputTextArea").value;
    var isValid = /^[0-9,.]*$/.test(text);
    if (isValid) {
        var array = text.split(",");
        var dataArray = [];
        for (var i = 0; i < array.length; i++) {
            dataArray.push(parseFloat(array[i]));
        }
        // Time 0
        var t0 = performance.now();
        // Algorithm
        heapSort(dataArray);
        // Time 1
        var t1 = performance.now();
        // Show String Ascending
        var txt = "";
        for (var i = 0; i < dataArray.length; i++) {
            if (i == dataArray.length - 1) {
                txt += dataArray[i];
            } else {
                txt += dataArray[i] + ",";
            }
        }
        document.getElementById("OutputTextAreaAscending").textContent = txt;

        // Show String Descending
        var txt = "";
        dataArray.reverse();
        for (var i = 0; i < dataArray.length; i++) {
            if (i == dataArray.length - 1) {
                txt += dataArray[i];
            } else {
                txt += dataArray[i] + ",";
            }
        }
        document.getElementById("OutputTextAreaDescending").textContent = txt;
        // Calculate Time
        var time = (t1 - t0).toFixed(4);
        document.getElementById("timeText").innerHTML =
            "Time: " + time + " (ms)";
    } else {
        alert("Only numbers sepparated by a comma");
    }
});

function heapSort(arr) {
    var n = arr.length;

    for (var i = n / 2 - 1; i >= 0; i--) heapify(arr, n, i);

    for (var i = n - 1; i > 0; i--) {
        var temp = arr[0];
        arr[0] = arr[i];
        arr[i] = temp;

        heapify(arr, i, 0);
    }
}

function heapify(arr, n, i) {
    var largest = i;
    var l = 2 * i + 1;
    var r = 2 * i + 2;

    if (l < n && arr[l] > arr[largest]) largest = l;

    if (r < n && arr[r] > arr[largest]) largest = r;

    if (largest != i) {
        var swap = arr[i];
        arr[i] = arr[largest];
        arr[largest] = swap;

        heapify(arr, n, largest);
    }
}

// Generate Numbers
$("#random").click(function () {
    var qty;
    while (!valueIsEmpty(qty)) {
        qty = prompt("Quantity of numbers:");
    }
    var min;
    while (!valueIsEmpty(min)) {
        min = prompt("Min Value:");
    }
    var max;
    while (!valueIsEmpty(max)) {
        max = prompt("Max Value:");
    }
    qty = parseInt(qty, 10);
    min = parseInt(min, 10);
    max = parseInt(max, 10);
    var txt = "";
    for (var i = 0; i < qty; i++) {
        var x = Math.floor(Math.random() * (max - min) + min);
        if (i == qty - 1) {
            txt += x;
        } else {
            txt += x + ",";
        }
    }
    document.getElementById("inputTextArea").textContent = txt;
});

// Verify if the string is Empty.
function valueIsEmpty(label) {
    return label && label !== "";
}

function destroyClickedElement(event) {
    document.body.removeChild(event.target);
}
