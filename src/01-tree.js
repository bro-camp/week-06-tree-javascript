const fs = require('fs/promises');
const path = require('path');
const { spawnSync } = require('child_process');

class Node {
  _data;

  _parent;

  _children;

  constructor(data, parent = null) {
    this._data = data;
    this._parent = parent;
    this._children = [];
  }

  data() {
    return this._data;
  }

  parent() {
    return this._parent;
  }

  children() {
    return this._children;
  }

  addChild(node) {
    this._children.push(node);
  }

  addChildren(...nodes) {
    this._children.push(...nodes);
  }
}

class Tree {
  _root;

  constructor(root = null) {
    this._root = root;
  }

  toDotString() {
    let nodeDotStr = '';
    let edgeDotStr = '';
    const node = this._root;
    while(node)
    const dotStr = 'graph G {\n  A;\n  B;\n}';
    return dotStr;
  }

  async createGraph() {
    const fileBaseName = '01-tree';

    const imgFileName = `${fileBaseName}.png`;
    const imgFileDir = path.resolve(__dirname, '../img');
    const imgFilePath = path.join(imgFileDir, imgFileName);

    const dotFileName = `${fileBaseName}.dot`;
    const dotFileDir = path.resolve(__dirname, '../dot');
    const dotFilePath = path.join(dotFileDir, dotFileName);

    const dotFileData = this.toDotString();

    let dotFileHandler;
    try {
      dotFileHandler = await fs.open(dotFilePath, 'w');
      await dotFileHandler.writeFile(dotFileData, 'ascii');
      spawnSync('dot', ['-Tpng', dotFilePath, '-o', imgFilePath]);
    } catch (err) {
      console.log(err);
    } finally {
      dotFileHandler?.close();
    }
  }
}

async function testTree() {
  const a = new Node(1234);
  const b = new Node(12);
  const c = new Node(34);
  a.addChildren(b, c);
  console.log(a.children());
  const t = new Tree(a);
  console.log(t);
  await t.createGraph();
}

testTree();

// function testNode() {
//   const b = new Node(5);
//   const c = new Node(40);
//   const r = new Node(1);
//   const a = new Node(45, r);
//   a.addChildren(b, c);
//   // a.addChild(b);
//   // a.addChild(c);
//   // console.log(a._children[1]);
//   console.log(a.data());
//   console.log(a.parent());
//   console.log(a.children());
// //   console.log(b);
// //   console.log(c);
// }

// testNode();
