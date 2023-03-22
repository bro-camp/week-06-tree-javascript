const fs = require('fs/promises');
const path = require('path');
const { spawnSync } = require('child_process');

class Tree {
  _nodes;

  _parents;

  _childrenList;

  constructor() {
    this._nodes = [];
    this._parents = [];
    this._childrenList = [];
  }

  data(nodeIndex) {
    return this._nodes[nodeIndex];
  }

  addRoot(data) {
    if (this._nodes.length > 0) {
      throw new Error('Tree already has root node');
    }

    this._nodes.push(data);
    this._parents.push(null);
    this._childrenList.push([]);
  }

  addNode(data, parent) {
    if (parent >= this._nodes.length) {
      throw new Error(`Parent node ${parent} does not exist`);
    }
    this._nodes.push(data);
    this._parents.push(parent);
    this._childrenList.push([]);
    this._childrenList[parent].push(this._nodes.length - 1);
  }

  // TODO hasEdge(fromNode, toNode)

  nodeCount() {
    return this._nodes.length;
  }

  // TODO edgeCount()

  edgeList() {
    const edges = this._childrenList.flatMap(
      (x, idx) => x.map((y) => [idx, y]),
    );

    return edges;
  }

  toDotString() {
    const edges = this.edgeList();

    let nodeDotStr = '';
    for (let i = 0; i < this._nodes.length; i += 1) {
      nodeDotStr = `${nodeDotStr}  ${i} [label="${this._nodes[i]}"];\n`;
    }

    let edgeDotStr = '';
    for (let i = 0; i < edges.length; i += 1) {
      const edge = edges[i];
      const node1 = `${edge[0]}`;
      const node2 = `${edge[1]}`;
      edgeDotStr = `${edgeDotStr}  ${node1} -- ${node2};\n`;
    }

    const dotStr = `graph G {\n  node [shape=circle]\n\n${nodeDotStr}\n${edgeDotStr}}`;

    return dotStr;
  }

  async createGraph() {
    const fileBasename = '02-tree-graph';

    const imgFileName = `${fileBasename}.png`;
    const imgFileDir = path.resolve(__dirname, '../img');
    const imgFilePath = path.join(imgFileDir, imgFileName);

    const dotFileName = `${fileBasename}.dot`;
    const dotFileDir = path.resolve(__dirname, '../dot');
    const dotFilePath = path.join(dotFileDir, dotFileName);

    const dotFileData = this.toDotString();

    let dotFileHandler;
    try {
      dotFileHandler = await fs.open(dotFilePath, 'w');
      await dotFileHandler.writeFile(dotFileData, 'ascii');
      spawnSync('dot', ['-Tpng', dotFilePath, '-o', imgFilePath]);
    } catch (err) {
      console.error(err);
    } finally {
      dotFileHandler?.close();
    }
  }
}

async function testTree() {
  const g = new Tree();
  g.addRoot(1234);
  //
  g.addNode(1, 0);
  g.addNode(2, 0);
  g.addNode(3, 0);
  g.addNode(4, 0);
  //
  g.addNode(11, 1);
  g.addNode(12, 1);
  g.addNode(13, 1);
  g.addNode(14, 1);
  //
  g.addNode(21, 2);
  g.addNode(22, 2);
  g.addNode(23, 2);
  g.addNode(24, 2);
  //
  g.addNode(31, 3);
  g.addNode(32, 3);
  g.addNode(33, 3);
  g.addNode(34, 3);
  //
  g.addNode(41, 4);
  g.addNode(42, 4);
  g.addNode(43, 4);
  g.addNode(44, 4);

  console.log(g.data(5));

  await g.createGraph();
}

testTree();
