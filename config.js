class Config {
    #errorCount = 0;
    #currentNode;
    #nodes = [];
    #nodeErrorSwitch;

    constructor(nodes = ["https://api.hive.blog"], nodeErrorSwitch = 3) {
        this.nodes = nodes;
        this.nodeErrorSwitch = nodeErrorSwitch;
        this.switchNode();
    }

    get errorCount() {
        return this.#errorCount;
    }

    get currentNode() {
        return this.#currentNode;
    }

    set currentNode(currentNode) {
        this.#currentNode = currentNode;
    }

    get nodes() {
        return this.#nodes;
    }

    set nodes(nodes) {
        if (nodes.length === 0) {
            throw new Error("Nodes can't be empty.");
        }
        for (let i = 0; i < nodes.length; i++) {
            this.addNode(nodes[i]);
        }
    }

    get nodeErrorSwitch() {
        return this.#nodeErrorSwitch;
    }

    set nodeErrorSwitch(nodeErrorSwitch) {
        this.#nodeErrorSwitch = nodeErrorSwitch;
    }

    nodeError() {
        this.#errorCount++;
        if (this.errorCount >= this.nodeErrorSwitch) {
            this.switchNode();
        }
    }

    switchNode() {
        this.#errorCount = 0;
        this.currentNode = this.nodes.shift();
        this.nodes.push(this.currentNode);
        return this.currentNode;
    }

    addNode(url) {
        if (!/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~?&//=]*)/.test(url)) {
            throw new Error("Please ensure the url is in a valid format.");
        }
        let index = this.nodes.indexOf(url);
        if (index !== -1) {
            throw new Error("Url is already in list of nodes");
        }
        this.nodes.push(url);
    }

    removeNode(url) {
        let index = this.nodes.indexOf(url);
        if (index === -1) {
            throw new Error("Url isn't in the list");
        }
        if (this.nodes.length === 1){
            throw new Error("Can't remove last node");
        }
        this.nodes.splice(index, 1);
        if (this.#currentNode === url) {
            this.switchNode();
        }
    }
}

module.exports = Config;