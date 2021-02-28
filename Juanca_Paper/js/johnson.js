var nodosCompletos = [];
var flechas = [];
var nodos = [];

function nodo(nom) {
    this.nom = nom;
    this.izq;
    this.der;
}

function johnsonAlgorithm(arrows,nodes){
    nodosCompletos = []
    nodos = nodes;
    flechas = arrows;
    var first = searchFirst(flechas,nodos);
    nodito = new nodo(nodes[first].nom);
    nodito.izq = 0;
    nodito.der = 0;
    nodosCompletos.push(nodito);
    initializeNodes(nodes,first);
    nextArrowsForward(arrows,first,nodito.izq);
    var last = searchLast(flechas,nodos);
    var posNodo = getPosNodo(last);
    nodosCompletos[posNodo].der = nodosCompletos[posNodo].izq;
    nextArrowsBackwards(arrows,last,nodosCompletos[posNodo].izq);

    //console.log(nodosCompletos);
    
    return nodosCompletos;
}


function initializeNodes(nodes,first){
    for(var i = 0; i < nodes.length;i++){
        if (i != first){
            nodi = new nodo(nodes[i].nom)
            nodi.izq = -100000000;
            nodi.der = 10000000;
            nodosCompletos.push(nodi);
        }
    }
}

function searchFirst(arrows,nodes){
    for(var i = 0; i < nodes.length;i++){
        var flag = isContained(nodes[i],arrows);
        if(!flag){
            return i;
        }
    }
}
function searchLast(arrows,nodes){
    for(var i = 0; i < nodes.length;i++){
        var flag = isContainedLast(nodes[i],arrows);
        if(!flag){
            return i;
        }
    }
}

function isContainedLast(node,arrows){
    var flag = false;
    for(var j = 0; j < arrows.length;j++){
        if(node.nom === arrows[j].init){
            flag = true;
        }
    }
    return flag;
}

function isContained(node,arrows){
    var flag = false;
    for(var j = 0; j < arrows.length;j++){
        if(node.nom === arrows[j].end){
            flag = true;
        }
    }
    return flag;
}

function nextArrowsBackwards(arrows,pos,val){
    let conexiones = searchArrowsLast(arrows,nodos[pos]);
    let sumas = [];
    for(var i = 0; i < conexiones.length; i++){
        var posNodo = getPosNodo(conexiones[i]);
        var attr = getAttribute(conexiones[i],pos);
        var sum = eval(val) - eval(attr);
        //console.log(pos +"," + conexiones[i])
        sumas.push(sum);
        //console.log(sum);
        if(sum < nodosCompletos[posNodo].der){
            nodosCompletos[posNodo].der = sum;
        }
    }
    //console.log(sumas);
    conexiones.forEach(function(i,j){
        //console.log(arrows);
        //console.log(i);
        //console.log(sumas[j]);
        nextArrowsBackwards(arrows,i,sumas[j]);
    })
        
    
}

function nextArrowsForward(arrows,pos,val){
    let conexiones = searchArrows(arrows,nodos[pos]);
    let sumas = [];
    for(var i = 0; i < conexiones.length; i++){
        var posNodo = getPosNodo(conexiones[i]);
        var attr = getAttribute(pos,conexiones[i]);
        var sum = eval(val) + eval(attr);
        //console.log(pos +"," + conexiones[i])
        //console.log(val + " " + attr);
        sumas.push(sum);
        if(sum > nodosCompletos[posNodo].izq){
            nodosCompletos[posNodo].izq = sum;
        }
    }
    //console.log(sumas);
    conexiones.forEach(function(i,j){
        //console.log(arrows);
        //console.log(i);
        //console.log(sumas[j]);
        nextArrowsForward(arrows,i,sumas[j]);
    })
        
    
}

function getPosNodo(posMain){
    for(var i = 0; i < nodosCompletos.length;i++){
        if(nodosCompletos[i].nom == nodos[posMain].nom){
            return i;
        }
    }
}

function getAttribute(init,end){
    for(var i = 0; i < flechas.length;i++){
        if(nodos[init].nom == flechas[i].init && nodos[end].nom == flechas[i].end){
            return flechas[i].attr;
        }
    }
}

function searchArrows(arrows, node){
    var connection = [];
    for(var i = 0; i < arrows.length; i++){
        //console.log()
        if(arrows[i].init == node.nom){
            connection.push(getPosition(arrows[i].end));
        }
    }
    return connection;
}

function searchArrowsLast(arrows, node){
    var connection = [];
    for(var i = 0; i < arrows.length; i++){
        if(arrows[i].end == node.nom){
            connection.push(getPosition(arrows[i].init));
        }
    }
    return connection;
}

function getPosition(node){
    for(var i = 0; i < nodos.length; i++){
        if(nodos[i].nom == node){
            return i;
        }
    }
}
