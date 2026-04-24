"use client";

import dynamic from "next/dynamic";

const Tree = dynamic(() => import("react-d3-tree"), { 
  ssr: false,
  loading: () => <div className="empty-text">Loading interactive tree...</div>
});

function convertTreeToD3(nodeLabel, treeObj) {
  const childrenKeys = Object.keys(treeObj || {}).sort();
  return {
    name: nodeLabel,
    children: childrenKeys.map(key => convertTreeToD3(key, treeObj[key]))
  };
}

const renderCustomNode = ({ nodeDatum, toggleNode }) => (
  <g>
    <circle r="18" fill="#f97316" stroke="#111" strokeWidth="3" onClick={toggleNode} style={{ cursor: 'pointer' }} />
    <text 
      fill="#f5f5f5" 
      strokeWidth="0" 
      x="25" 
      dy="5" 
      fontSize="15px"
      fontFamily="'JetBrains Mono', 'Fira Code', monospace"
      fontWeight="600"
    >
      {nodeDatum.name}
    </text>
  </g>
);

export default function HierarchyTree({ root, tree }) {
  if (!tree || !tree[root] || Object.keys(tree[root]).length === 0) {
    return null;
  }

  return (
    <div style={{ width: '100%', height: '350px', backgroundColor: '#000', borderRadius: '4px', border: '1px solid #222' }}>
      <Tree 
        data={convertTreeToD3(root, tree[root])} 
        orientation="vertical"
        pathFunc="step"
        translate={{ x: 150, y: 50 }}
        renderCustomNodeElement={renderCustomNode}
        separation={{ siblings: 1.5, nonSiblings: 2 }}
      />
    </div>
  );
}
