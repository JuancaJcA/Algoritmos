// Default array with nodes.
var nodes = new vis.DataSet([
  { id: 1, label: "1", title: "Node 1" },
  { id: 2, label: "Node 2", title: "I have a popup!" },
  { id: 3, label: "Node 3", title: "I have a popup!" },
  { id: 4, label: "Node 4", title: "I have a popup!" },
  { id: 5, label: "Node 5", title: "I have a popup!" },
]);

// Default array with edges
var edges = new vis.DataSet([
  { from: 1, to: 3 },
  { from: 1, to: 2 },
  { from: 2, to: 4 },
  { from: 2, to: 5 },
]);

// Create the network
var container = document.getElementById("mynetwork");

var data = {
  nodes: nodes,
  edges: edges,
};

var options = {
  interaction: { hover: true },
  manipulation: {
    enabled: true,
    initiallyActive: false,
    addNode: function (nodeData, callback) {
      addNode(nodeData, callback);
    },
    addEdge: function (edgeData, callback) {
      addEdge(edgeData, callback);
    },
    editNode: true,
    editEdge: true,
    deleteNode: true,
    deleteEdge: true,
  },
  nodes: {
    color: "rgb(255,255,255)",
    fixed: false,
    size: 26,
    font: {
      color: "#333333",
      size: 12,
      face: "lato",
    },
    scaling: {
      label: false,
    },
    opacity: 0.97,
  },
  edges: {
    color: {
      color: "rgb(255,255,255)",
      highlight: "#848484",
      hover: "#848484",
      opacity: 0.9,
    },
    arrows: {
      to: {
        enabled: true,
        type: "triangle",
      },
    },
    font: {
      color: "rgb(255,255,255)",
      size: 10,
      face: "lato",
      align: "horizontal",
      background: "none",
      strokeWidth: 0, // px
      align: "top"
    },
  },
  /*
  edges: {
    arrows: {
      to: {
        scaleFactor: 5,
      },
    },
  },*/
};

function addNode(nodeData, callback) {
  var node = prompt("Nombre el Nodo:");
  nodeData.id = node;
  nodeData.label = node;
  nodeData.title = "Nodo " + node;
  callback(nodeData);
}

function addEdge(edgeData, callback) {
  edgeData.label = prompt("Ingrese el Valor:");
  if (edgeData.from === edgeData.to) {
    var r = confirm("¿Deseas que se conecte a sí mismo?");
    if (r === true) {
      callback(edgeData);
    }
  } else {
    callback(edgeData);
  }
}

// Enable the network.
var network = new vis.Network(container, data, options);

// On Click.
network.on("click", function (params) {
  params.event = "[original event]";
  document.getElementById("eventSpanHeading").innerText = "Click event:";
  document.getElementById("eventSpanContent").innerText = JSON.stringify(
    params,
    null,
    4
  );
  console.log(
    "click event, getNodeAt returns: " + this.getNodeAt(params.pointer.DOM)
  );
});

// On Double Click.
network.on("doubleClick", function (params) {
  params.event = "[original event]";
  document.getElementById("eventSpanHeading").innerText = "doubleClick event:";
  document.getElementById("eventSpanContent").innerText = JSON.stringify(
    params,
    null,
    4
  );
});

// On Drag Start.
network.on("dragStart", function (params) {
  params.event = "[original event]";
  console.log("dragStart Event:", params);
  console.log(
    "dragStart event, getNodeAt returns: " + this.getNodeAt(params.pointer.DOM)
  );
});

// Dragg Screen.
network.on("dragging", function (params) {
  params.event = "[original event]";
  document.getElementById("eventSpanHeading").innerText = "dragging event:";
  document.getElementById("eventSpanContent").innerText = JSON.stringify(
    params,
    null,
    4
  );
});

// End Dragg Screen.
network.on("dragEnd", function (params) {
  params.event = "[original event]";
  document.getElementById("eventSpanHeading").innerText = "dragEnd event:";
  document.getElementById("eventSpanContent").innerText = JSON.stringify(
    params,
    null,
    4
  );
  console.log("dragEnd Event:", params);
  console.log(
    "dragEnd event, getNodeAt returns: " + this.getNodeAt(params.pointer.DOM)
  );
});

// Dragg Node.
network.on("controlNodeDragging", function (params) {
  params.event = "[original event]";
  document.getElementById("eventSpanHeading").innerText =
    "control node dragging event:";
  document.getElementById("eventSpanContent").innerText = JSON.stringify(
    params,
    null,
    4
  );
});

// End Dragg Node.
network.on("controlNodeDragEnd", function (params) {
  params.event = "[original event]";
  document.getElementById("eventSpanHeading").innerText =
    "control node drag end event:";
  document.getElementById("eventSpanContent").innerText = JSON.stringify(
    params,
    null,
    4
  );
  console.log("controlNodeDragEnd Event:", params);
});

// Zoom.
network.on("zoom", function (params) {
  document.getElementById("zoomContent").innerText = params.scale.toFixed(2);
});

// Show PopUp
/*
network.on("showPopup", function (params) {
  document.getElementById("eventSpanHeading").innerText = "showPopup event: ";
  document.getElementById("eventSpanContent").innerText = JSON.stringify(
    params,
    null,
    4
  );
});*/

network.on("hidePopup", function () {
  console.log("hidePopup Event");
});
network.on("select", function (params) {
  console.log("select Event:", params);
});
network.on("selectNode", function (params) {
  console.log("selectNode Event:", params);
});
network.on("selectEdge", function (params) {
  console.log("selectEdge Event:", params);
});
network.on("deselectNode", function (params) {
  console.log("deselectNode Event:", params);
});
network.on("deselectEdge", function (params) {
  console.log("deselectEdge Event:", params);
});
network.on("hoverNode", function (params) {
  console.log("hoverNode Event:", params);
});
network.on("hoverEdge", function (params) {
  console.log("hoverEdge Event:", params);
});
network.on("blurNode", function (params) {
  console.log("blurNode Event:", params);
});
network.on("blurEdge", function (params) {
  console.log("blurEdge Event:", params);
});
