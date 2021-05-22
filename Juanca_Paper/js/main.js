//create Classes
function nodo(nom, text, circle) {
    this.nom = nom;
    this.text = text;
    this.circle = circle;
    out = [];
    inp = [];
}

function flecha(attr, text, path, path2, init, end) {
    this.attr = attr;
    this.text = text;
    this.path = path;
    this.path2 = path2;
    this.init = init;
    this.end = end;
}

// Variables.
var nodes = [];
var arrows = [];
var currentTool = "add";
var mod1 = -1;
var mod2 = -1;
var pos = 1;

// Menu.

// Add.
$("#add").click(function () {
    currentTool = "add";
    $("#add").addClass("selected");
    $("#delete").removeClass();
    $("#rename").removeClass();
    $("#move").removeClass();
});

// Delete.
$("#delete").click(function () {
    currentTool = "delete";
    $("#delete").addClass("selected");
    $("#add").removeClass();
    $("#rename").removeClass();
    $("#move").removeClass();
});

// Rename.
$("#rename").click(function () {
    currentTool = "rename";
    $("#rename").addClass("selected");
    $("#delete").removeClass();
    $("#add").removeClass();
    $("#move").removeClass();
});

// Move.
$("#move").click(function () {
    currentTool = "move";
    $("#move").addClass("selected");
    $("#delete").removeClass();
    $("#add").removeClass();
    $("#rename").removeClass();
});

// Johnnson.
$("#johnson").click(function () {
    var ruta = johnsonAlgorithm(arrows, nodes);
    changeColor(ruta);
});

// Save Json
$("#save").click(function () {
    var json = {
        nodes: nodes,
        arrows: arrows,
    };

    var name;
    while (!valueIsEmpty(name)) {
        name = prompt("File name:");
    }
    downloadJson(JSON.stringify(json), name);
});

function downloadJson(exportObj, exportName) {
    var dataStr = "data:text/json;charset=utf-8," + exportObj;
    var nodes = document.createElement("a");
    nodes.setAttribute("href", dataStr);
    nodes.setAttribute("download", exportName + ".json");
    document.body.appendChild(nodes); // Required for Firefox
    nodes.click();
    nodes.remove();
}

// Import Json
$("#import").change(function (event) {
    var reader = new FileReader();
    var importedNodes;
    var importedArrows;
    nodes = [];
    arrows = [];
    paper.project.clear();

    reader.onload = function (event) {
        var jsonObj = JSON.parse(event.target.result);
        importedNodes = jsonObj["nodes"];
        importedArrows = jsonObj["arrows"];

        for (var i = 0; i < importedNodes.length; i++) {
            var myNom = importedNodes[i].nom;
            /*var myCircle = paper.project.activeLayer.importJSON(
        importedNodes[i].circle
      );*/
            var myCircle = new Path.Circle(importedNodes[i].circle[1]);
            myCircle.fillColor = "#333333";
            var textIt = paper.project.activeLayer.importJSON(
                importedNodes[i].text
            );

            myCircle.onMouseDrag = function (event1) {
                var pos = getNodo(event1.point);
                if (currentTool === "move") {
                    nodes[pos].circle.position = event1.point;
                    nodes[pos].text.position = new Point(
                        event1.point.x,
                        event1.point.y - 45
                    );
                }
            };
            //rename node
            myCircle.onMouseDown = function (event1) {
                if (currentTool === "rename") {
                    // Rename Node
                    var newText;
                    while (!valueIsEmpty(newText)) {
                        newText = prompt("Rename node:");
                    }
                    var pos = getNodo(event1.point);
                    nodes[pos].text.content = newText;
                    var oldText = nodes[pos].nom;
                    nodes[pos].nom = newText;
                    reorganizeArrows(newText, oldText);
                }
            };

            myCircle.onDoubleClick = function (event1) {
                if (currentTool === "add") {
                    if (mod1 < 0 && mod2 < 0) {
                        mod1 = getNodo(event1.point);
                        nodes[mod1].circle.fillColor = "#585858";
                    } else if (mod1 >= 0 && mod2 < 0) {
                        mod2 = getNodo(event1.point);
                        generarFlecha(mod1, mod2);
                        nodes[mod1].circle.fillColor = "#333333";
                        mod1 = -1;
                        mod2 = -1;
                    }
                }
            };
            // Create Node Object
            var nodeOb = new nodo(myNom, textIt, myCircle);
            nodes.push(nodeOb);
        }

        for (var i = 0; i < importedArrows.length; i++) {
            var myAttr = importedArrows[i].attr;
            var myPath = paper.project.activeLayer.importJSON(
                importedArrows[i].path
            );
            var myPath2 = paper.project.activeLayer.importJSON(
                importedArrows[i].path2
            );
            var myText = paper.project.activeLayer.importJSON(
                importedArrows[i].text
            );
            var myInit = importedArrows[i].init;
            var myEnd = importedArrows[i].end;

            myPath.onMouseDown = function (event1) {
                if (currentTool === "delete") {
                    deleteArrow(event1);
                }
            };

            myText.onMouseDown = function (event1) {
                if (currentTool === "rename") {
                    // Edge New Attribute
                    var newText;
                    while (!valueIsEmpty(newText)) {
                        newText = prompt("Enter the new value:");
                    }
                    var pos = getFlecha(event1.point);
                    arrows[pos].text.content = newText;
                    arrows[pos].attr = newText;
                } else if (currentTool === "delete") {
                    deleteArrow(event1);
                }
            };

            // Create Arrow Object
            var arrowObj = new flecha(
                myAttr,
                myText,
                myPath,
                myPath2,
                myInit,
                myEnd
            );
            arrows.push(arrowObj);
        }
    };
    reader.readAsText(event.target.files[0]);
    paper.project.view.update();
});

// Matrix.
$("#matrix").click(function () {
    var longitud = nodes.length;
    var matrix = [];
    var filcol = [null];
    var RowsArray = [];
    var ColsArray = [];

    // Construct first row.
    for (var i = 0; i < nodes.length; i++) {
        filcol.push(nodes[i].nom);
    }

    // Construct matrix.
    matrix.push(filcol);
    for (var i = 0; i < longitud; i++) {
        var fila = [];
        for (var j = 0; j < longitud + 1; j++) {
            if (j === 0) {
                fila.push(nodes[i].nom);
            } else {
                fila.push("0");
            }
        }
        matrix.push(fila);
    }

    for (var i = 0; i < arrows.length; i++) {
        var ini = arrows[i].init;
        var fin = arrows[i].end;
        var lon = nodes.length;

        for (var j = 1; j < lon + 1; j++) {
            if (matrix[0][j] == fin) {
                for (var k = 1; k < lon + 1; k++) {
                    if (matrix[k][0] == ini) {
                        matrix[k][j] = arrows[i].attr;
                    }
                }
            }
        }
    }

    // Sum Columns and Rows of Matrix.
    for (var i = 0; i < matrix.length; i++) {
        var pattern = /^\d+$/;
        var rSum = 0;
        var cSum = 0;
        for (var j = 0; j < matrix.length; j++) {
            if (pattern.test(matrix[i][j]) && i != 0 && j != 0) {
                rSum += parseFloat(matrix[i][j]);
            }

            if (pattern.test(matrix[j][i]) && i != 0 && j != 0) {
                cSum += parseFloat(matrix[j][i]);
            }
        }
        RowsArray.push(rSum);
        ColsArray.push(cSum);
    }

    // Add to matrix sum of rows and columns.
    RowsArray[0] = "Sum Row";
    ColsArray[0] = "Sum Col";
    matrix.push(ColsArray);

    for (var i = 0; i < matrix.length; i++) {
        matrix[i].push(RowsArray[i]);
    }

    $("#metaConfigTable").empty();
    $("#metaConfigTable").append(tabelajzing(matrix));
});

// Assignment.
$("#assignmentMin").click(function () {
    var longitud = nodes.length;
    var matrix = [];
    var filcol = [""];
    for (var i = 0; i < nodes.length; i++) {
        filcol.push(nodes[i].nom);
    }
    matrix.push(filcol);
    for (var i = 0; i < longitud; i++) {
        var fila = [];
        for (var j = 0; j < longitud + 1; j++) {
            if (j === 0) {
                fila.push(nodes[i].nom);
            } else {
                fila.push("0");
            }
        }
        matrix.push(fila);
    }

    for (var i = 0; i < arrows.length; i++) {
        var ini = arrows[i].init;
        var fin = arrows[i].end;
        var lon = nodes.length;
        for (var j = 1; j < lon + 1; j++) {
            if (matrix[0][j] == fin) {
                for (var k = 1; k < lon + 1; k++) {
                    if (matrix[k][0] == ini) {
                        matrix[k][j] = arrows[i].attr;
                    }
                }
            }
        }
    }

    // Create new Matrix
    var newMatrix = [];
    for (var i = 0; i < matrix.length; i++) {
        if (i != 0) {
            fil = [];
            for (j = 0; j < matrix[i].length; j++) {
                if (j != 0) {
                    fil.push(parseInt(matrix[i][j]));
                }
            }
            newMatrix.push(fil);
        }
    }

    // Sum Rows and Columns
    var RowsArray = [];
    var ColsArray = [];
    var RowsArray1 = [1];
    var ColsArray1 = [1];
    for (var i = 0; i < newMatrix.length; i++) {
        var pattern = /^\d+$/;
        var rSum = 0;
        var cSum = 0;
        for (var j = 0; j < newMatrix.length; j++) {
            if (pattern.test(newMatrix[i][j])) {
                rSum += parseFloat(newMatrix[i][j]);
            }

            if (pattern.test(newMatrix[j][i])) {
                cSum += parseFloat(newMatrix[j][i]);
            }
        }
        RowsArray.push(rSum);
        ColsArray.push(cSum);
        RowsArray1.push(rSum);
        ColsArray1.push(cSum);
    }

    // Delete all 0 from matrix (Strings)
    console.log(matrix);
    var noCeroRow1 = [];
    for (var i = 0; i < RowsArray1.length; i++) {
        var arr = [];
        if (RowsArray1[i] != 0) {
            for (var j = 0; j < RowsArray1.length; j++) {
                arr.push(matrix[i][j]);
            }
        }
        if (arr.length != 0) {
            noCeroRow1.push(arr);
        }
    }

    var noCeroMatrix1 = [];
    for (var i = 0; i < noCeroRow1.length; i++) {
        var arr = [];
        for (var j = 0; j < ColsArray1.length; j++) {
            if (ColsArray1[j] != 0) {
                arr.push(noCeroRow1[i][j]);
            }
        }
        if (arr.length != 0) {
            noCeroMatrix1.push(arr);
        }
    }

    // Delete all 0 from matrix (Values)
    var noCeroRow = [];
    for (var i = 0; i < RowsArray.length; i++) {
        var arr = [];
        if (RowsArray[i] != 0) {
            for (var j = 0; j < RowsArray.length; j++) {
                arr.push(newMatrix[i][j]);
            }
        }
        if (arr.length != 0) {
            noCeroRow.push(arr);
        }
    }

    var noCeroMatrix = [];
    for (var i = 0; i < noCeroRow.length; i++) {
        var arr = [];
        for (var j = 0; j < ColsArray.length; j++) {
            if (ColsArray[j] != 0) {
                arr.push(noCeroRow[i][j]);
            }
        }
        if (arr.length != 0) {
            noCeroMatrix.push(arr);
        }
    }

    solution = lap(noCeroMatrix.length, noCeroMatrix);
    console.log(solution);
    tabelajzingAssignment(noCeroMatrix1, solution.col);
});

// Assignment.
$("#assignmentMax").click(function () {
    var longitud = nodes.length;
    var matrix = [];
    var filcol = [""];
    for (var i = 0; i < nodes.length; i++) {
        filcol.push(nodes[i].nom);
    }
    matrix.push(filcol);
    for (var i = 0; i < longitud; i++) {
        var fila = [];
        for (var j = 0; j < longitud + 1; j++) {
            if (j === 0) {
                fila.push(nodes[i].nom);
            } else {
                fila.push("0");
            }
        }
        matrix.push(fila);
    }

    for (var i = 0; i < arrows.length; i++) {
        var ini = arrows[i].init;
        var fin = arrows[i].end;
        var lon = nodes.length;
        for (var j = 1; j < lon + 1; j++) {
            if (matrix[0][j] == fin) {
                for (var k = 1; k < lon + 1; k++) {
                    if (matrix[k][0] == ini) {
                        matrix[k][j] = arrows[i].attr;
                    }
                }
            }
        }
    }

    // Create new Matrix
    var newMatrix = [];
    for (var i = 0; i < matrix.length; i++) {
        if (i != 0) {
            fil = [];
            for (j = 0; j < matrix[i].length; j++) {
                if (j != 0) {
                    fil.push(parseInt(matrix[i][j]));
                }
            }
            newMatrix.push(fil);
        }
    }

    // Sum Rows and Columns
    var RowsArray = [];
    var ColsArray = [];
    var RowsArray1 = [1];
    var ColsArray1 = [1];
    for (var i = 0; i < newMatrix.length; i++) {
        var pattern = /^\d+$/;
        var rSum = 0;
        var cSum = 0;
        for (var j = 0; j < newMatrix.length; j++) {
            if (pattern.test(newMatrix[i][j])) {
                rSum += parseFloat(newMatrix[i][j]);
            }

            if (pattern.test(newMatrix[j][i])) {
                cSum += parseFloat(newMatrix[j][i]);
            }
        }
        RowsArray.push(rSum);
        ColsArray.push(cSum);
        RowsArray1.push(rSum);
        ColsArray1.push(cSum);
    }

    // Delete all 0 from matrix (Strings)
    console.log(matrix);
    var noCeroRow1 = [];
    for (var i = 0; i < RowsArray1.length; i++) {
        var arr = [];
        if (RowsArray1[i] != 0) {
            for (var j = 0; j < RowsArray1.length; j++) {
                arr.push(matrix[i][j]);
            }
        }
        if (arr.length != 0) {
            noCeroRow1.push(arr);
        }
    }

    var noCeroMatrix1 = [];
    for (var i = 0; i < noCeroRow1.length; i++) {
        var arr = [];
        for (var j = 0; j < ColsArray1.length; j++) {
            if (ColsArray1[j] != 0) {
                arr.push(noCeroRow1[i][j]);
            }
        }
        if (arr.length != 0) {
            noCeroMatrix1.push(arr);
        }
    }

    // Delete all 0 from matrix (Values)
    var noCeroRow = [];
    for (var i = 0; i < RowsArray.length; i++) {
        var arr = [];
        if (RowsArray[i] != 0) {
            for (var j = 0; j < RowsArray.length; j++) {
                arr.push(newMatrix[i][j]);
            }
        }
        if (arr.length != 0) {
            noCeroRow.push(arr);
        }
    }

    var noCeroMatrix = [];
    for (var i = 0; i < noCeroRow.length; i++) {
        var arr = [];
        for (var j = 0; j < ColsArray.length; j++) {
            if (ColsArray[j] != 0) {
                arr.push(noCeroRow[i][j]);
            }
        }
        if (arr.length != 0) {
            noCeroMatrix.push(arr);
        }
    }

    solution = lapMax(noCeroMatrix.length, noCeroMatrix);
    tabelajzingAssignmentMax(noCeroMatrix1, solution);
});

// Main Function.
function onMouseUp(event) {
    var myCircle = createCircle(event);
    if (collides(myCircle) === false) {
        if (currentTool === "add") {
            crearNodo(event, myCircle);
        }
    } else {
        if (currentTool === "delete") {
            deleteNode(event);
        }
    }
    //console.log(nodes);
}

// Delete Node.
function deleteNode(event) {
    var del = isContained(event.point);
    var pos = nodes.indexOf(del);
    var elim = arrowsContained(pos);
    for (var i = 0; i < elim.length; i++) {
        var pos1 = arrows.indexOf(elim[i]);
        arrows[pos1].path.remove();
        arrows[pos1].path2.remove();
        arrows[pos1].text.remove();
        arrows.splice(pos1, 1);
    }
    del.circle.remove();
    del.text.remove();
    nodes.splice(pos, 1);
}

function arrowsContained(pos) {
    var arrow = [];
    for (var i = 0; i < arrows.length; i++) {
        if (
            nodes[pos].nom === arrows[i].init ||
            nodes[pos].nom === arrows[i].end
        ) {
            arrow.push(arrows[i]);
        }
    }
    return arrow;
}

function deleteArrow(event) {
    var pos = isContainedArrow(event.point);
    arrows[pos].path.remove();
    arrows[pos].path2.remove();
    arrows[pos].text.remove();
    arrows.splice(pos, 1);
}

//addNodo
function crearNodo(event, myCircle) {
    myCircle.fillColor = "#333333";
    // Node Attribute
    var texto;
    while (!valueIsEmpty(texto)) {
        texto = prompt("Node name:");
    }

    //get text file
    var textIt = textItem(event, texto);

    //move parameter
    myCircle.onMouseDrag = function (event) {
        if (currentTool === "move") {
            myCircle.position = event.point;
            textIt.position = new Point(event.point.x, event.point.y - 45);
        }
    };
    //rename node
    myCircle.onMouseDown = function (event) {
        if (currentTool === "rename") {
            // Rename Node
            var newText;
            while (!valueIsEmpty(newText)) {
                newText = prompt("Rename node:");
            }
            textIt.content = newText;
            var pos = getNodo(event.point);
            var oldText = nodes[pos].nom;
            nodes[pos].nom = newText;
            reorganizeArrows(newText, oldText);
        }
    };

    myCircle.onDoubleClick = function (event) {
        if (currentTool === "add") {
            if (mod1 < 0 && mod2 < 0) {
                mod1 = getNodo(event.point);
                nodes[mod1].circle.fillColor = "#585858";
            } else if (mod1 >= 0 && mod2 < 0) {
                mod2 = getNodo(event.point);
                generarFlecha(mod1, mod2);
                nodes[mod1].circle.fillColor = "#333333";
                mod1 = -1;
                mod2 = -1;
            }
        }
    };
    // Create Object
    nodeObj = new nodo(texto, textIt, myCircle);
    nodes.push(nodeObj);
}

function reorganizeArrows(text, oldText) {
    for (var i = 0; i < arrows.length; i++) {
        if (arrows[i].init == oldText) {
            arrows[i].init = text;
        } else if (arrows[i].end == oldText) {
            arrows[i].end = text;
        }
    }
}

//Generate Arrow
function generarFlecha(mod1, mod2) {
    var puntoIni = nodes[mod1].circle.position;
    var puntoFini = nodes[mod2].circle.position;
    a = drawArrow(puntoIni, puntoFini);
    var arrow = new flecha(
        a[3],
        a[2],
        a[0],
        a[1],
        nodes[mod1].nom,
        nodes[mod2].nom
    );
    arrows.push(arrow);
}

// additional functions

function textItem(event, texto) {
    var text = new PointText(new Point(event.point.x, event.point.y - 45));
    text.justification = "center";
    text.fillColor = "white";
    text.fontSize = 20;
    text.content = texto;
    return text;
}

function createCircle(event) {
    var myCircle = new Path.Circle({
        center: event.point,
        radius: 70,
    });
    return myCircle;
}

function collides(nodo) {
    for (var i = 0; i < nodes.length; i++) {
        var myCircle = nodes[i].circle;
        var collision = nodo.getIntersections(myCircle);
        if (collision.length !== 0) {
            return true;
        }
    }
    return false;
}

function isContained(point) {
    for (var i = 0; i < nodes.length; i++) {
        var myCircle = nodes[i].circle;
        var isContain = myCircle.contains(point);
        if (isContain) {
            return nodes[i];
        }
    }
}

function isContainedArrow(point) {
    var arrowDel = [];
    for (var i = 0; i < arrows.length; i++) {
        var arrowP = arrows[i].path;
        var text = arrows[i].text;
        var isContain = arrowP.contains(point);
        var isContainText = text.contains(point);
        if (isContain || isContainText) {
            return i;
        }
    }
}

function getNodo(point) {
    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].circle.contains(point)) {
            return i;
        }
    }
}

// Arrow code.
function drawArrow(begin, end) {
    if (begin == end) {
        end = end + new Size(50, 50);
    }
    var pathL = new Path.Line(begin, end);
    var offset = (5 / 10) * pathL.length;
    var point = pathL.getPointAt(offset);
    var mult = 125 * pos;
    var normal = pathL.getNormalAt(offset) * 125;
    pos = pos * -1;
    var middlePoin = point + normal;
    var path = new Path.Arc(begin, middlePoin, end);
    path.strokeColor = "red";

    //var line = new Path.Line(point, point + (normal*1.1));
    //line.strokeColor = "black";

    var colorcito = Color.random();
    path.strokeColor = colorcito;
    path.strokeWidth = 3;
    var vector =
        path.getPointAt(path.length) - path.getPointAt(path.length - 25);
    var arrowVector = vector.normalize(18);
    var path2 = new Path({
        segments: [
            path.getPointAt(path.length) + arrowVector.rotate(145),
            path.getPointAt(path.length),
            path.getPointAt(path.length) + arrowVector.rotate(-145),
        ],
        fillColor: colorcito,
        strokeWidth: 6,
    });

    // Edge Attribute
    var attr;
    while (!valueIsEmpty(attr)) {
        attr = prompt("Enter the value:");
    }
    var text = new PointText(point + normal * 1.2);
    text.justification = "center";
    text.fillColor = colorcito;
    text.fontSize = 25;
    text.content = attr;

    path.onMouseDown = function (event) {
        if (currentTool === "delete") {
            deleteArrow(event);
        }
    };

    text.onMouseDown = function (event) {
        if (currentTool === "rename") {
            // Edge New Attribute
            var newText;
            while (!valueIsEmpty(newText)) {
                newText = prompt("Enter the new value:");
            }
            text.content = newText;
            var pos = getFlecha(event.point);
            arrows[pos].attr = newText;
        } else if (currentTool === "delete") {
            deleteArrow(event);
        }
    };

    var paths = [path, path2, text, attr];
    return paths;
}

// Midpoint
function puntoMedio(pos1, pos2) {
    return new Point((pos1.x + pos2.x + 100) / 2, (pos1.y + pos2.y) / 2);
}

function getFlecha(point) {
    for (var i = 0; i < arrows.length; i++) {
        if (arrows[i].text.contains(point)) {
            return i;
        }
    }
}

function tabelajzing(a) {
    // takes (key, value) pairs from and array and returns corresponding html, i.e. [ [1,2], [3,4], [5,6] ]
    return [
        "<tr>\n<td>",
        a
            .map(function (e, i) {
                return e.join("</td>\n<td>");
            })
            .join("</td></tr>\n<tr>\n<td>"),
        "</td>\n</tr>\n",
    ].join("");
}

function tabelajzingAssignment(a, b) {
    var table = document.getElementById("metaConfigTable2");
    table.innerHTML = "";

    var tr = "";
    var f = 0;
    var cost = 0;
    for (var i = 0; i < a.length; i++) {
        var arr = a[i];
        tr += "<tr>";
        for (var c = 0; c < arr.length; c++) {
            if (f === 0) {
                tr += "<td>" + arr[c] + "</td>";
            } else {
                if (c === 0) {
                    tr += "<td>" + arr[c] + "</td>";
                } else {
                    // console.log("arr: " + arr[c]);
                    // console.log("f: " + (f - 1));
                    // console.log("b[c-1]: " + b[c - 1]);
                    if (c - 1 == b[f - 1]) {
                        // console.log("c: " + (c - 1));
                        // console.log("b[f-1]: " + b[f - 1]);
                        // console.log("color");
                        tr += "<td bgcolor=#eeeeee>(" + arr[c] + ")</td>";
                        cost += parseInt(arr[c]);
                    } else {
                        tr += "<td>" + arr[c] + "</td>";
                    }
                }
            }
        }
        tr += "</tr>";
        f += 1;
    }
    table.innerHTML += tr;
    document.getElementById("assignmentCost").innerHTML =
        "Assignment Matrix (Cost: " + cost + ")";
}

function tabelajzingAssignmentMax(a, b) {
    var table = document.getElementById("metaConfigTable3");
    table.innerHTML = "";

    var tr = "";
    var f = 0;
    var cost = 0;
    for (var i = 0; i < a.length; i++) {
        var arr = a[i];
        tr += "<tr>";
        for (var c = 0; c < arr.length; c++) {
            if (f === 0) {
                tr += "<td>" + arr[c] + "</td>";
            } else {
                if (c === 0) {
                    tr += "<td>" + arr[c] + "</td>";
                } else {
                    // console.log("arr: " + arr[c]);
                    // console.log("f: " + (f - 1));
                    // console.log("b[c-1]: " + b[c - 1]);
                    if (c - 1 == b[f - 1]) {
                        // console.log("c: " + (c - 1));
                        // console.log("b[f-1]: " + b[f - 1]);
                        // console.log("color");
                        tr += "<td bgcolor=#eeeeee>(" + arr[c] + ")</td>";
                        cost += parseInt(arr[c]);
                    } else {
                        tr += "<td>" + arr[c] + "</td>";
                    }
                }
            }
        }
        tr += "</tr>";
        f += 1;
    }
    table.innerHTML += tr;
    document.getElementById("assignmentCost3").innerHTML =
        "Assignment Matrix (Cost: " + cost + ")";
}

// Change color for Johnson Algorithm
function changeColor(route) {
    //radio = 70
    for (var i = 0; i < nodes.length; i++) {
        for (var j = 0; j < route.length; j++) {
            if (route[j].nom == nodes[i].nom) {
                tot = eval(route[j].izq) - eval(route[j].der);
                if (tot == 0) {
                    nodes[i].circle.fillColor = "#6d6d6d";
                }
                pos = nodes[i].circle.position;
                var path = new Path.Line(
                    new Point(pos.x - 70, pos.y),
                    new Point(pos.x + 70, pos.y)
                );
                var path2 = new Path.Line(
                    new Point(pos.x, pos.y),
                    new Point(pos.x, pos.y + 70)
                );
                path.strokeColor = "white";
                path2.strokeColor = "white";

                var text = new PointText(new Point(pos.x - 35, pos.y + 35));
                text.justification = "center";
                text.fillColor = "white";
                text.fontSize = 18;
                text.content = route[j].izq;

                var text1 = new PointText(new Point(pos.x + 35, pos.y + 35));
                text1.justification = "center";
                text1.fillColor = "white";
                text1.fontSize = 18;
                text1.content = route[j].der;
            }
        }
    }
}

// Verify if the string is Empty.
function valueIsEmpty(label) {
    return label && label !== "";
}
