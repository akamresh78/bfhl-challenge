"use client";

import dynamic from "next/dynamic";
import { useCallback, useState } from "react";

const Tree = dynamic(() => import("react-d3-tree"), { 
  ssr: false,
  loading: () => <div className="empty-text" style={{ padding: '2rem', textAlign: 'center' }}>Loading interactive tree...</div>
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
    <circle r="20" fill="#f97316" stroke="#111" strokeWidth="3" onClick={toggleNode} style={{ cursor: 'pointer' }} />
    <text 
      fill="#f5f5f5" 
      strokeWidth="0" 
      x="-5" 
      dy="5" 
      fontSize="16px"
      fontFamily="'JetBrains Mono', 'Fira Code', monospace"
      fontWeight="700"
      pointerEvents="none"
    >
      {nodeDatum.name}
    </text>
  </g>
);

export default function HierarchyTree({ root, tree }) {
  const [translate, setTranslate] = useState({ x: 200, y: 60 });
  const [dimensions, setDimensions] = useState(null);

  const containerRef = useCallback((containerElem) => {
    if (containerElem !== null) {
      const { width, height } = containerElem.getBoundingClientRect();
      setDimensions({ width, height });
      setTranslate({
        x: width / 2,
        y: 60
      });
    }
  }, []);

  if (!tree || !tree[root] || Object.keys(tree[root]).length === 0) {
    return null;
  }

  return (
    <div ref={containerRef} style={{ width: '100%', height: '350px', backgroundColor: '#050505', borderRadius: '6px', border: '1px solid #262626', overflow: 'hidden' }}>
      {dimensions && (
        <Tree 
          data={convertTreeToD3(root, tree[root])} 
          orientation="vertical"
          pathFunc="diagonal"
          translate={translate}
          renderCustomNodeElement={renderCustomNode}
          separation={{ siblings: 1.5, nonSiblings: 2 }}
          zoom={0.85}
          scaleExtent={{ min: 0.2, max: 2 }}
          draggable={true}
          collapsible={true}
        />
      )}
    </div>
  );
}
