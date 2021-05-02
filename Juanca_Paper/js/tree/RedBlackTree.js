// creates an empty red-black tree
// svg is a reference to a d3 SVG object
function RedBlackTree() {
    this.root = new RedBlackNode(null, null, 0);
    this.root.setColor("black");

    this.getBlackHeight = function () {};

    this.insert = function (key) {
        this.root.insert(key);
    };

    this.delete = function () {};

    this.search = function () {};

    this.drawTree = function (svg) {
        this.root.draw(svg);
    };
}

function RedBlackNode(key, parent, depth) {
    this.getColor = function () {
        return this.color;
    };

    this.setColor = function (color) {
        this.color = color;
    };

    this.insert = function (value) {
        if (this.key == null) {
            this.key = value;
            this.left = new RedBlackNode(null, this);
            this.right = new RedBlackNode(null, this);
            this.left.setColor("black");
            this.right.setColor("black");
        } else if (this.key > value) {
            this.left.insert(value);
        } else if (this.key < value) {
            this.right.insert(value);
        }
    };

    this.isLeaf = function () {
        if (this.left.getValue == null && this.right.getValue == null) {
            return true;
        } else {
            return false;
        }
    };

    this.isRoot = function () {
        if (this.parent == null) {
            return true;
        } else {
            return false;
        }
    };

    this.draw = function (svg) {};

    // default construction
    this.key = key;
    this.parent = parent;
    this.left;
    this.right;
    this.color = "red";

    if (this.key != null) {
        this.left = new RedBlackNode(null, this);
        this.right = new RedBlackNode(null, this);
    }
}
