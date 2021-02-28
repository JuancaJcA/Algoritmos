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

//variables

var nodes = [];
var arrows = [];
var currentTool = "add";
var mod1 = -1;
var mod2 = -1;
var pos = 1;

//menu

$("#add").click(function () {
  currentTool = "add";
  $("#add").addClass("selected");
  $("#delete").removeClass();
  $("#rename").removeClass();
  $("#move").removeClass();
});

$("#delete").click(function () {
  currentTool = "delete";
  $("#delete").addClass("selected");
  $("#add").removeClass();
  $("#rename").removeClass();
  $("#move").removeClass();
});

$("#rename").click(function () {
  currentTool = "rename";
  $("#rename").addClass("selected");
  $("#delete").removeClass();
  $("#add").removeClass();
  $("#move").removeClass();
});

$("#move").click(function () {
  currentTool = "move";
  $("#move").addClass("selected");
  $("#delete").removeClass();
  $("#add").removeClass();
  $("#rename").removeClass();
});

$("#johnson").click(function () {
  var ruta = johnsonAlgorithm(arrows, nodes);
  console.log(ruta);
  changeColor(ruta);
});

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
  RowsArray[0] = null;
  ColsArray[0] = null;
  matrix.push(ColsArray);

  for (var i = 0; i < matrix.length; i++) {
    matrix[i].push(RowsArray[i]);
  }

  $("#metaConfigTable").empty();
  $("#metaConfigTable").append(tabelajzing(matrix));
});

//Main Function
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
  console.log(nodes);
  //console.log(arrows);
}

//deleteNodo
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
    if (nodes[pos].nom === arrows[i].init || nodes[pos].nom === arrows[i].end) {
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
  myCircle.fillColor = "grey";
  //obtención nombre
  var texto = prompt("Ingrese el nombre del nodo: ");
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
      var newText = prompt("Ingrese el nuevo nombre");
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
        nodes[mod1].circle.fillColor = "black";
      } else if (mod1 >= 0 && mod2 < 0) {
        mod2 = getNodo(event.point);
        generarFlecha(mod1, mod2);
        nodes[mod1].circle.fillColor = "grey";
        mod1 = -1;
        mod2 = -1;
      }
    }
  };
  //create Object
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

//additional functions

function textItem(event, texto) {
  var text = new PointText(new Point(event.point.x, event.point.y - 45));
  text.justification = "center";
  text.fillColor = "white";
  text.fontSize = 25;
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

//arrow code

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
  var vector = path.getPointAt(path.length) - path.getPointAt(path.length - 25);
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

  //generar atributo
  var attr = prompt("Ingrese el valor atributo:");
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
      var newText = prompt("Ingrese el nuevo atributo");
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

//punto medio
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
  // takes (key, value) pairs from and array and returns
  // corresponding html, i.e. [ [1,2], [3,4], [5,6] ]
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

//change color for Johnson Algorithm

function changeColor(route) {
  //radio = 70
  for (var i = 0; i < nodes.length; i++) {
    for (var j = 0; j < route.length; j++) {
      if (route[j].nom == nodes[i].nom) {
        tot = eval(route[j].izq) - eval(route[j].der);
        if (tot == 0) {
          nodes[i].circle.fillColor = "blue;";
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
