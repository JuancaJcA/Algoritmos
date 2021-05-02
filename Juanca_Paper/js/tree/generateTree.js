function nodo(nom) {
    this.nom = nom;
    this.izq;
    this.der;
}

var x,
    y = 0;
var arbolito;

$("#some-number").after(
    '<span class="error-message">Only numbers separated by commas!</span>'
);

var nodos;
var grafo = new sigma("container");

$("#preorden").click(function () {
    try {
        var str = preOrder(arbolito);
        $("#pre").empty();
        $("#pre").append(str);
        var result = str.substring(1);
        document.getElementById("result").innerHTML = result;
    } catch (error) {console.log("error");}
});

$("#inorden").click(function () {
    try {
        var str = inOrder(arbolito);
        $("#in").empty();
        $("#in").append(str);
        var result = str.substring(1);
        document.getElementById("result").innerHTML = result;
    } catch (error) {console.log("error");}
});

$("#postorden").click(function () {
    try {
        var str = postOrder(arbolito);
        $("#post").empty();
        $("#post").append(str);
        var result = str.substring(1);
        document.getElementById("result").innerHTML = result;
    } catch (error) {console.log("error");}
});

$("#some-number").on("input", function (evt) {
    var value = evt.target.value;

    if (value.length === 0) {
        grafo.graph.clear();
        evt.target.className = "";
        return;
    }

    if ($.isNumeric(value) || value.includes(",")) {
        d3.select("svg").remove();
        evt.target.className = "valid";
        var array = value.split(",");

        arbolito = array.reduce(
            (t, v) => (t ? insertNode(t, v) : new nodo(v)),
            null
        );
        // create a svg element and assign a d3 handle to it
        var svg = d3
            .select("body")
            .append("svg")
            .attr("height", height + margin.top + margin.bottom)
            .attr("width", width + margin.left + margin.right)
            .append("g")
            .attr("width", width)
            .attr("height", height)
            .attr(
                "transform",
                "translate(" + margin.left + "," + margin.top + ")"
            );

        // instantiate a d3 tree layout
        var tree = d3.layout
            .tree()
            .sort(null)
            .size([width, height])
            // this specifies how the children of each node is accessed
            .children(function (d) {
                return d.left == null && d.right == null
                    ? null
                    : [d.left, d.right];
            });

        // Edges between nodes as a <path class="link" />
        var link = d3.svg.diagonal().projection(function (d) {
            return [d.x, d.y];
        });

        /** function to draw the tree */
        function drawTree(searchTree) {
            var nodes = tree.nodes(searchTree.getNodes());
            var links = tree.links(nodes);

            var node = svg.selectAll(".node").data(nodes, function (d) {
                return d.id;
            });

            var nodeUpdate = node;

            nodeUpdate
                .select("path")
                .attr("class", function (d) {
                    if (d.key === null) return "node-null";
                    else return "node-key";
                })
                .attr(
                    "d",
                    d3.svg
                        .symbol()
                        .size(function (d) {
                            if (d.key === null) return nodeSize / 2;
                            else return nodeSize;
                        })
                        .type(function (d) {
                            if (d.key === null) {
                                return "square";
                            } else {
                                return "circle";
                            }
                        })
                );

            nodeUpdate
                .select("text")
                .attr("class", function (d) {
                    if (d.key === null) return "node-null";
                    else return "node-key";
                })
                .attr("fill", "white")
                .attr("text-anchor", "middle")
                .attr("dominant-baseline", "central")
                .text(function (d) {
                    return d.key === null ? "n" : d.key;
                });

            nodeUpdate
                .transition()
                .duration(duration)
                .attr("transform", function (d) {
                    return "translate(" + d.x + ", " + d.y + ")";
                });

            var nodeEnter = node
                .enter()
                .append("g")
                .attr("class", "node")
                .attr("transform", function (d) {
                    if (d.depth > 0 && d.parent.x0 != null) {
                        // not root node
                        return (
                            "translate(" + d.parent.x0 + "," + d.parent.y0 + ")"
                        );
                    } else {
                        return "translate(" + width / 2 + ", " + 0 + ")";
                    }
                });

            nodeEnter
                .transition()
                .duration(duration)
                .attr("transform", function (d) {
                    return "translate(" + d.x + ", " + d.y + ")";
                });

            nodeEnter
                .append("path")
                .attr("class", function (d) {
                    if (d.key === null) return "node-null";
                    else return "node-key";
                })
                .attr(
                    "d",
                    d3.svg
                        .symbol()
                        .size(function (d) {
                            if (d.key === null) return nodeSize / 2;
                            else return nodeSize;
                        })
                        .type(function (d) {
                            if (d.key === null) {
                                return "square";
                            } else {
                                return "circle";
                            }
                        })
                );

            nodeEnter
                .append("text")
                .attr("class", function (d) {
                    if (d.key === null) return "node-null";
                    else return "node-key";
                })
                .attr("fill", "white")
                .attr("text-anchor", "middle")
                .attr("dominant-baseline", "central")
                .text(function (d) {
                    return d.key === null ? "n" : d.key;
                });
            var nodeExit = node
                .exit()
                .transition()
                .duration(duration)
                .attr("r", 0)
                .remove();

            var edges = svg.selectAll(".edge").data(links, function (d) {
                return d.target.id;
            });

            edges
                .enter()
                .insert("path", "g")
                .attr("class", "edge")
                .attr("fill", "none")
                .attr("stroke", "black")
                .attr("d", function (d) {
                    if (d.source.x0 != null)
                        var o = { x: d.source.x0, y: d.source.y0 };
                    else var o = { x: d.source.x, y: d.source.y };
                    return link({ source: o, target: o });
                });

            edges.transition().duration(duration).attr("d", link);

            // store the old position of the node so that transitions happen properly
            nodes.forEach(function (d) {
                d.x0 = d.x;
                d.y0 = d.y;
            });
        }

        //create a new tree
        var bst = new BinarySearchTree();
        clear(bst);
        var counter = 0;
        for (var i = 0; i < array.length; i++) {
            bst.insert(parseInt(array[i]));
            drawTree(bst);
        }

        //d3.select("#status").text("Inserting " + num);

        function clear(gen) {
            clearInterval(gen);
            d3.select("#status").text("Finished Inserting");
        }

        //generator();
    } else {
        evt.target.className = "invalid";
    }
});

function insertNode(tree, value) {
    var node = tree,
        key;
    while (parseInt(node.nom) !== value) {
        key = value < parseInt(node.nom) ? "izq" : "der";
        if (!node[key]) {
            node[key] = new nodo(value);
            break;
        }
        node = node[key];
    }
    return tree;
}

function navegar(tree) {
    grafo.graph.addNode({
        id: tree.nom.toString(),
        label: tree.nom.toString(),
        x: x,
        y: y,
        size: 5,
        color: "#f00",
    });
}
