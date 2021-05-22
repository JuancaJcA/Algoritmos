var rows = 0;
var columns = 0;

function buildMatrix() {
    if (rows != 0 && columns != 0) {
        $("#matrix").empty();
        var s = "<legend>Matrix</legend>";
        for (let i = 0; i < rows; i++) {
            s += "<div class='pure-g' style='padding-top:10px;'>";
            for (let j = 0; j < columns; j++) {
                s +=
                    "<div class='pure-u-2-24'><input type='number' style='width:80px;' id='" +
                    i +
                    j +
                    "'></div>";
            }
            s += "</div>";
        }
        $("#matrix").append(s);

        $("#demand").empty();
        var d =
            "<legend>Demand</legend><div class='pure-g' style='padding-top:10px;'>";
        for (let i = 0; i < columns; i++) {
            d +=
                "<div class='pure-u-2-24'><input type='number' style='width:80px;' id='" +
                i +
                "'></div>";
        }
        d += "</div>";
        $("#demand").append(d);

        $("#supply").empty();
        var m = "<legend>Availability</legend>";
        for (let i = 0; i < rows; i++) {
            m +=
                "<div class='pure-g' style='padding-top:10px;'><input type='number' style='width:80px;' id='" +
                i +
                "'></div>";
        }
        $("#supply").append(m);
    }
}

function solve() {
    if (columns != 0 && rows != 0) {
        // Armar array
        var demandaHTML = $("#demand").find("input");
        var demanda = [];
        for (let i = 0; i < columns; i++) {
            if ($(demandaHTML[i]).val() === "") {
                demanda.push(0);
            } else {
                demanda.push(parseInt($(demandaHTML[i]).val()));
            }
        }

        var ofertaHTML = $("#supply").find("input");
        var oferta = [];
        for (let i = 0; i < rows; i++) {
            if ($(ofertaHTML[i]).val() === "") {
                oferta.push(0);
            } else {
                oferta.push(parseInt($(ofertaHTML[i]).val()));
            }
        }

        var matrixHTML = $("#matrix").find("div.pure-g");
        var matriz = [];
        for (let i = 0; i < rows; i++) {
            let rowHTML = $(matrixHTML[i]).find("input");
            let rowArray = [];
            for (let j = 0; j < columns; j++) {
                if ($(rowHTML[j]).val() === "") {
                    rowArray.push(0);
                } else {
                    rowArray.push(parseInt($(rowHTML[j]).val()));
                }
            }
            matriz.push(rowArray);
        }

        var cramer = transporte(matriz, demanda, oferta);
        var matrixNew = addValuesMatrix(matriz);
        tabelajzingMatrix(matrixNew, "metaConfigTableCramer", "matrixCramer");
        return cramer;
    }
}

function save() {
    if (columns != 0 && rows != 0) {
        // Armar array
        var demandaHTML = $("#demand").find("input");
        var demanda = [];
        for (let i = 0; i < columns; i++) {
            if ($(demandaHTML[i]).val() === "") {
                demanda.push(0);
            } else {
                demanda.push(parseInt($(demandaHTML[i]).val()));
            }
        }

        var ofertaHTML = $("#supply").find("input");
        var oferta = [];
        for (let i = 0; i < rows; i++) {
            if ($(ofertaHTML[i]).val() === "") {
                oferta.push(0);
            } else {
                oferta.push(parseInt($(ofertaHTML[i]).val()));
            }
        }

        var matrixHTML = $("#matrix").find("div.pure-g");
        var matriz = [];
        for (let i = 0; i < rows; i++) {
            let rowHTML = $(matrixHTML[i]).find("input");
            let rowArray = [];
            for (let j = 0; j < columns; j++) {
                if ($(rowHTML[j]).val() === "") {
                    rowArray.push(0);
                } else {
                    rowArray.push(parseInt($(rowHTML[j]).val()));
                }
            }
            matriz.push(rowArray);
        }

        return {
            matrix: matriz,
            demand: demanda,
            availability: oferta,
        };
    }
}

function importedSolve(matrix, demand, availability) {
    var cramerArr = transporte(matrix, demand, availability);
    var matrixNew = addValuesMatrix(matrix);
    tabelajzingMatrix(matrixNew, "metaConfigTableCramer", "matrixCramer");

    var cramerMax = addValuesMatrix(cramerArr.max);
    var cramerMin = addValuesMatrix(cramerArr.min);

    tabelajzingCramer(
        cramerMax,
        "Max ",
        cramerArr.costMax,
        "metaConfigTableCramerMax",
        "matrixCramerMax"
    );

    tabelajzingCramer(
        cramerMin,
        "Min ",
        cramerArr.costMin,
        "metaConfigTableCramerMin",
        "matrixCramerMin"
    );
}

$(document).ready(function () {
    $("#columns").val("");
    $("#rows").val("");
    $("#columns").on("input change", function (e) {
        columns = $(this).val();
        buildMatrix();
    });
    $("#rows").on("input change", function (e) {
        rows = $(this).val();
        buildMatrix();
    });
    $("#solve").on("click", function (e) {
        var cramerArr = solve();
        var cramerMax = addValuesMatrix(cramerArr.max);
        var cramerMin = addValuesMatrix(cramerArr.min);

        tabelajzingCramer(
            cramerMax,
            "Max ",
            cramerArr.costMax,
            "metaConfigTableCramerMax",
            "matrixCramerMax"
        );

        tabelajzingCramer(
            cramerMin,
            "Min ",
            cramerArr.costMin,
            "metaConfigTableCramerMin",
            "matrixCramerMin"
        );
    });
    // Save Json
    $("#saveCramer").on("click", function (e) {
        var json = save();

        var name;
        while (!valueIsEmpty(name)) {
            name = prompt("File name:");
        }
        downloadJson(JSON.stringify(json), name);
    });
    $("#importCramer").on("change", function (e) {
        var reader = new FileReader();
        reader.onload = function (event) {
            var jsonObj = JSON.parse(event.target.result);
            var matrix = jsonObj["matrix"];
            var demand = jsonObj["demand"];
            var availability = jsonObj["availability"];
            importedSolve(matrix, demand, availability);
        };
        reader.readAsText(e.target.files[0]);
    });
});

function downloadJson(exportObj, exportName) {
    var dataStr = "data:text/json;charset=utf-8," + exportObj;
    var nodes = document.createElement("a");
    nodes.setAttribute("href", dataStr);
    nodes.setAttribute("download", exportName + ".json");
    document.body.appendChild(nodes);
    nodes.click();
    nodes.remove();
}

function addValuesMatrix(array) {
    var rowsName = [""];
    var colsName = [
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z",
    ];
    var resultArray = [];
    for (var i = 1; i <= array[0].length; i++) {
        rowsName.push(i.toString());
    }
    resultArray.push(rowsName);

    for (var i = 0; i < array.length; i++) {
        var arr = [colsName[i]];
        for (var j = 0; j < array[i].length; j++) {
            arr.push(array[i][j]);
        }
        resultArray.push(arr);
    }
    return resultArray;
}

function transporte(matrix, demand, supply) {
    var matrix1 = matrix.map((arr) => arr.slice());
    var demand1 = [...demand];
    var supply1 = [...supply];
    var matrix2 = matrix.map((arr) => arr.slice());
    var demand2 = [...demand];
    var supply2 = [...supply];

    var max = northWest(matrix1, demand1, supply1);
    var min = leastCost(matrix2, demand2, supply2);

    var costMax = getCost(matrix, max);
    var costMin = getCost(matrix, min);

    return {
        max: max,
        costMax: costMax,
        min: min,
        costMin: costMin,
    };
}

function northWest(matrix, demand, supply) {
    var x = 0;
    var y = 0;
    var res = zeros([supply.length, demand.length]);
    while (verifyZero(demand) && verifyZero(supply)) {
        if (demand[y] > supply[x]) {
            let surplus = demand[y] - supply[x];
            res[x][y] = supply[x];
            demand[y] = surplus;
            supply[x] = 0;
            x++;
        } else {
            let surplus = supply[x] - demand[y];
            res[x][y] = demand[y];
            demand[y] = 0;
            supply[x] = surplus;
            y++;
        }
    }
    return res;
}

function leastCost(matrix, demand, supply) {
    var x = findMin(matrix).x;
    var y = findMin(matrix).y;
    var res = zeros([supply.length, demand.length]);
    while (verifyZero(demand) && verifyZero(supply)) {
        if (demand[y] > supply[x]) {
            let surplus = demand[y] - supply[x];
            res[x][y] = supply[x];
            demand[y] = surplus;
            supply[x] = 0;
            matrix = deleteRow(matrix, x);
            x = findMin(matrix).x;
            y = findMin(matrix).y;
        } else {
            let surplus = supply[x] - demand[y];
            res[x][y] = demand[y];
            demand[y] = 0;
            supply[x] = surplus;
            matrix = deleteColumn(matrix, y);
            y = findMin(matrix).y;
            x = findMin(matrix).x;
        }
    }
    return res;
}

function zeros(dimensions) {
    var array = [];

    for (var i = 0; i < dimensions[0]; ++i) {
        array.push(dimensions.length == 1 ? 0 : zeros(dimensions.slice(1)));
    }

    return array;
}

function verifyZero(array) {
    for (let x of array) {
        if (x > 0) {
            return true;
        }
    }
    return false;
}

function findMin(matrix) {
    var x = 0;
    var y = 0;
    var min = matrix[x][y];
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j] < min) {
                x = i;
                y = j;
                min = matrix[i][j];
            }
        }
    }
    return {
        x: x,
        y: y,
    };
}

function deleteRow(matrix, x) {
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (i == x) {
                matrix[i][j] = Infinity;
            }
        }
    }
    return matrix;
}

function deleteColumn(matrix, y) {
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (j == y) {
                matrix[i][j] = Infinity;
            }
        }
    }
    return matrix;
}

function getCost(matrix, costs) {
    var cost = 0;
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            cost += matrix[i][j] * costs[i][j];
        }
    }
    return cost;
}

function clone2D(a) {
    return a.map((o) => [...o]);
}

function tabelajzingCramer(a, txt, cost, tableName, titleName) {
    var table = document.getElementById(tableName);
    table.innerHTML = "";

    var tr = "";
    for (var i = 0; i < a.length; i++) {
        var arr = a[i];
        tr += "<tr>";
        for (var c = 0; c < arr.length; c++) {
            tr += "<td>" + arr[c] + "</td>";
        }
        tr += "</tr>";
    }
    table.innerHTML += tr;
    document.getElementById(titleName).innerHTML = txt + "(Attr: " + cost + ")";
}

function tabelajzingMatrix(a, tableName, titleName) {
    var table = document.getElementById(tableName);
    table.innerHTML = "";

    var tr = "";
    for (var i = 0; i < a.length; i++) {
        var arr = a[i];
        tr += "<tr>";
        for (var c = 0; c < arr.length; c++) {
            tr += "<td>" + arr[c] + "</td>";
        }
        tr += "</tr>";
    }
    table.innerHTML += tr;
    document.getElementById(titleName).innerHTML = "Matrix";
}
// Verify if the string is Empty.
function valueIsEmpty(label) {
    return label && label !== "";
}
