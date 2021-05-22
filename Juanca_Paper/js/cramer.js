var rows = 0;
var columns = 0;

function buildMatrix() {
    if (rows != 0 && columns != 0) {
        $("#matrix").empty();
        var s = "";
        for (let i = 0; i < rows; i++) {
            s += "<div class='pure-g' style='padding-bottom:10px;'>";
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
            "<legend>Demanda</legend><div class='pure-g' style='padding-bottom:10px;'>";
        for (let i = 0; i < columns; i++) {
            d +=
                "<div class='pure-u-2-24'><input type='number' style='width:80px;' id='" +
                i +
                "'></div>";
        }
        d += "</div>";
        $("#demand").append(d);

        $("#supply").empty();
        var m = "";
        for (let i = 0; i < rows; i++) {
            m +=
                "<div class='pure-g' style='padding-bottom:10px;'><input type='number' style='width:80px;' id='" +
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
        var matriz = []
        for(let i = 0;i < rows; i++){
            let rowHTML = $(matrixHTML[i]).find("input");
            let rowArray = [];
            for(let j = 0;j < columns;j++){
                if ($(rowHTML[j]).val() === "") {
                    rowArray.push(0);
                } else {
                    rowArray.push(parseInt($(rowHTML[j]).val()));
                }
            }
            matriz.push(rowArray);
        }
        console.log(matriz);
        console.log(demanda);
        console.log(oferta);

        var cramer = transporte(matriz,demanda,oferta);
        console.log(cramer);
        
    }
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
        solve();
    });
});

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
