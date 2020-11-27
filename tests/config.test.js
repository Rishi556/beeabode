let Config = require("../config.js");

test("blank constructor to have default specs", () => {
    let c = new Config();
    expect(c.currentNode).toStrictEqual("https://api.hive.blog");
    expect(c.nodeErrorSwitch).toStrictEqual(3);
    expect(c.errorCount).toStrictEqual(0);
    expect(c.nodes).toStrictEqual(["https://api.hive.blog"]);
})

test("custom constructor to have custom specs", () => {
    let c = new Config(["https://api.deathwing.me", "https://api.hive.blog"], 2);
    expect(c.currentNode).toStrictEqual("https://api.deathwing.me");
    expect(c.nodeErrorSwitch).toStrictEqual(2);
    expect(c.errorCount).toStrictEqual(0);
    expect(c.nodes).toStrictEqual(["https://api.hive.blog", "https://api.deathwing.me"]);
})

test("nodeError() should increment node error and switch on proper amount of errors", () => {
    let c = new Config(["https://api.deathwing.me", "https://api.hive.blog"], 2);
    expect(c.nodeErrorSwitch).toStrictEqual(2);
    expect(c.errorCount).toStrictEqual(0);
    expect(c.currentNode).toStrictEqual("https://api.deathwing.me");
    expect(c.nodes).toStrictEqual(["https://api.hive.blog", "https://api.deathwing.me"]);
    c.nodeError();
    expect(c.nodeErrorSwitch).toStrictEqual(2);
    expect(c.errorCount).toStrictEqual(1);
    expect(c.currentNode).toStrictEqual("https://api.deathwing.me");
    expect(c.nodes).toStrictEqual(["https://api.hive.blog", "https://api.deathwing.me"]);
    c.nodeError();
    expect(c.nodeErrorSwitch).toStrictEqual(2);
    expect(c.errorCount).toStrictEqual(0);
    expect(c.currentNode).toStrictEqual("https://api.hive.blog");
    expect(c.nodes).toStrictEqual(["https://api.deathwing.me", "https://api.hive.blog"]);
})

test("switchNode() should force switch to the next node and clear node error count", () => {
    let c = new Config(["https://api.deathwing.me", "https://api.hive.blog"], 4);
    expect(c.nodeErrorSwitch).toStrictEqual(4);
    expect(c.errorCount).toStrictEqual(0);
    expect(c.currentNode).toStrictEqual("https://api.deathwing.me");
    expect(c.nodes).toStrictEqual(["https://api.hive.blog", "https://api.deathwing.me"]);
    c.nodeError();
    expect(c.nodeErrorSwitch).toStrictEqual(4);
    expect(c.errorCount).toStrictEqual(1);
    expect(c.currentNode).toStrictEqual("https://api.deathwing.me");
    expect(c.nodes).toStrictEqual(["https://api.hive.blog", "https://api.deathwing.me"]);
    c.switchNode();
    expect(c.nodeErrorSwitch).toStrictEqual(4);
    expect(c.errorCount).toStrictEqual(0);
    expect(c.currentNode).toStrictEqual("https://api.hive.blog");
    expect(c.nodes).toStrictEqual(["https://api.deathwing.me", "https://api.hive.blog"]);
})

test("addNode() to add a valid node to the end of array", () => {
    let c = new Config(["https://api.deathwing.me", "https://api.hive.blog"], 4);
    expect(c.currentNode).toStrictEqual("https://api.deathwing.me");
    expect(c.nodes).toStrictEqual(["https://api.hive.blog", "https://api.deathwing.me"]);
    c.addNode("https://hived.privex.io");
    expect(c.currentNode).toStrictEqual("https://api.deathwing.me");
    expect(c.nodes).toStrictEqual(["https://api.hive.blog", "https://api.deathwing.me", "https://hived.privex.io"]);
})

test("removeNode() should remove node and switch node", () => {
    let c = new Config(["https://api.deathwing.me", "https://api.hive.blog"], 4);
    expect(c.currentNode).toStrictEqual("https://api.deathwing.me");
    expect(c.nodes).toStrictEqual(["https://api.hive.blog", "https://api.deathwing.me"]);
    c.removeNode("https://api.deathwing.me");
    expect(c.currentNode).toStrictEqual("https://api.hive.blog");
    expect(c.nodes).toStrictEqual(["https://api.hive.blog"]);
})

test("empty set nodes should throw", () => {
    let c = new Config(["https://api.deathwing.me", "https://api.hive.blog"], 4);
    expect(() => {
        c.nodes = [];
    }).toThrow();
})

test("adding non url should throw", () => {
    let c = new Config(["https://api.deathwing.me", "https://api.hive.blog"], 4);
    expect(() => {
       c.addNode("hi");
    }).toThrow();
})

test("adding duplicate node should throw", () => {
    let c = new Config(["https://api.deathwing.me", "https://api.hive.blog"], 4);
    expect(() => {
        c.addNode("https://api.hive.blog");
    }).toThrow();
})

test("removing nonexistant node should throw", () => {
    let c = new Config(["https://api.deathwing.me", "https://api.hive.blog"], 4);
    expect(() => {
        c.removeNode("https://hived.privex.io");
    }).toThrow();
})

test("removing last node should throw", () => {
    let c = new Config(["https://api.deathwing.me"], 4);
    expect(() => {
        c.removeNode("https://api.deathwing.me");
    }).toThrow();
})