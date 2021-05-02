function nodo(nom) {
  this.nom = nom;
  this.izq;
  this.der;
}
var res = "";

var prueba = {
  nom: 10,
  izq: {
    nom: 7,
    izq: {
      nom: 6,
      izq: {
        nom: 1,
      },
    },
    der: {
      nom: 8,
      der: {
        nom: 9,
      },
    },
  },
  der: {
    nom: 11,
    der: {
      nom: 20,
      izq: {
        nom: 14,
      },
      der: {
        nom: 22,
      },
    },
  },
};

function preOrder(cab) {
  res = "";
  preOrderExec(cab);
  return res;
}

function preOrderExec(nodo) {
  if (nodo !== undefined && nodo !== null) {
    res += ", " + nodo.nom.toString();
    preOrderExec(nodo.izq);
    preOrderExec(nodo.der);
  }
  if (nodo === undefined || nodo === null) {
    return;
  }
}
function inOrder(cab) {
    res = "";
    inOrderExec(cab);
    return res;
  }
  
  function inOrderExec(nodo) {
    if (nodo !== undefined && nodo !== null) {
      inOrderExec(nodo.izq);
      res += ", " + nodo.nom.toString();
      inOrderExec(nodo.der);
    }
    if (nodo === undefined || nodo === null) {
      return;
    }
  }
  function postOrder(cab) {
    res = "";
    postOrderExec(cab);
    return res;
  }
  
  function postOrderExec(nodo) {
    if (nodo !== undefined && nodo !== null) {
      postOrderExec(nodo.izq);
      postOrderExec(nodo.der);
      res += ", " + nodo.nom.toString();
    }
    if (nodo === undefined || nodo === null) {
      return;
    }
  }
  