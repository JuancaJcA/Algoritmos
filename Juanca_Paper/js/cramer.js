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

$("columns").change(function(){
    console.log($(this).val())
});