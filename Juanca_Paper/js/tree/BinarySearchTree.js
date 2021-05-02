BinarySearchTree = function () {
    // Methods //
    this.insert = function (key, node) {
        if (node == null) node = this.root;

        // landed on one of the null nodes, so promote the null node
        // to a full-blown bst node and give it null node children
        if (node.key == null) {
            node.key = key;
            node.left = this.createNullNode();
            node.right = this.createNullNode();
        } else if (key < node.key) {
            this.insert(key, node.left);
        } else if (key > node.key) {
            this.insert(key, node.right);
        }
    };

    this.findMin = function (node) {
        if (node.left == null || this.getKey(node.left) == null) {
            return node.key;
        } else {
            return this.findMin(node.left);
        }
    };

    this.findMax = function (node) {
        if (node.right == null || this.getKey(node.right) == null) {
            return node.key;
        } else {
            return this.findMax(node.right);
        }
    };

    this.remove = function (key, node) {
        if (node == null) node = this.root;

        if (node.key == null) return node;

        if (key < node.key) node.left = this.remove(key, node.left);
        else if (key > node.key) node.right = this.remove(key, node.right);
        else if (node.left.key != null && node.right.key != null) {
            node.key = this.findMin(node.right);
            node.right = this.remove(node.key, node.right);
        } else node = node.left.key != null ? node.left : node.right;

        return node;
    };

    this.getKey = function (node) {
        return node.key;
    };

    // all nodes are born as null nodes
    this.createNullNode = function () {
        var node = {
            key: null,
            left: null,
            right: null,
            id: this.nodeCounter,
        };
        this.nodeCounter++;
        return node;
    };

    this.getNodes = function () {
        return this.root;
    };

    // Member Variables //

    // create an empty tree with one null node
    this.root = this.createNullNode();

    // identifier for nodes -- increment each time a new node is created
    this.nodeCounter = 0;
};
