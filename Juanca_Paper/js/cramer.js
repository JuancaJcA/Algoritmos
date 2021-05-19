function transporte(matrix,demand,supply){
    console.log(matrix);
    console.log(demand);
    console.log(supply);
    //northWest(matrix,demand,supply);
    leastCost(matrix,demand,supply);
    console.log(demand);
    console.log(supply);
}

function northWest(matrix,demand,supply){
    var x = 0;
    var y = 0;
    var res = zeros([supply.length,demand.length]);
    while(verifyZero(demand) && verifyZero(supply)){
        if(demand[y] > supply[x]){
           let surplus  = demand[y] - supply[x];
           res[x][y] = supply[x];
           demand[y] = surplus;
           supply[x] = 0;
           x++;
           console.log(x);
        }
        else{
           let surplus  = supply[x] - demand[y];
           res[x][y] = demand[y];
           demand[y] = 0;
           supply[x] = surplus;
           y++;
           console.log(y);
        }
    }
    return res;    
}

function leastCost(matrix,demand,supply){

}

function zeros(dimensions) {
    var array = [];

    for (var i = 0; i < dimensions[0]; ++i) {
        array.push(dimensions.length == 1 ? 0 : zeros(dimensions.slice(1)));
    }

    return array;
}

function verifyZero(array){
    for(let x of array){
        if(x > 0){
            return true; 
        }
    }

    return false;
}