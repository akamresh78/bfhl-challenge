import { NextResponse } from 'next/server';

const USER_ID = "Amreshkant_05062005";
const EMAIL_ID = "ak5318@srmist.edu.in";
const ROLL_NUMBER = "RA2311033010078";

function setCorsHeaders(res) {
  res.headers.set('Access-Control-Allow-Origin', '*');
  res.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return res;
}

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  return setCorsHeaders(response);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const data = body.data;

    if (!Array.isArray(data)) {
      const response = NextResponse.json({
        user_id: USER_ID,
        email_id: EMAIL_ID,
        college_roll_number: ROLL_NUMBER,
        hierarchies: [],
        invalid_entries: [],
        duplicate_edges: [],
        summary: { total_trees: 0, total_cycles: 0, largest_tree_root: null }
      });
      return setCorsHeaders(response);
    }

    const invalid_entries = [];
    const valid_entries = [];

    // Step 1: Validate
    const regex = /^[A-Z]->[A-Z]$/;
    for (const item of data) {
      if (typeof item !== 'string') continue;
      const trimmed = item.trim();
      if (!regex.test(trimmed) || trimmed[0] === trimmed[3]) {
        invalid_entries.push(item);
      } else {
        valid_entries.push(trimmed);
      }
    }

    // Step 2: Deduplicate
    const duplicate_edges = [];
    const seenEdges = new Set();
    const reportedDuplicates = new Set();
    const deduplicated_entries = [];

    for (const edge of valid_entries) {
      if (seenEdges.has(edge)) {
        if (!reportedDuplicates.has(edge)) {
          duplicate_edges.push(edge);
          reportedDuplicates.add(edge);
        }
      } else {
        seenEdges.add(edge);
        deduplicated_entries.push(edge);
      }
    }

    // Step 3: Build adjacency & parent tracking
    const childrenMap = {}; // parent -> [children]
    const parentMap = {}; // child -> parent
    const allNodes = new Set();

    for (const edge of deduplicated_entries) {
      const u = edge[0];
      const v = edge[3];
      allNodes.add(u);
      allNodes.add(v);

      if (parentMap[v] !== undefined) {
        // Silently discard second parent
        continue;
      }
      
      parentMap[v] = u;
      if (!childrenMap[u]) childrenMap[u] = [];
      childrenMap[u].push(v);
    }

    // Step 4: Find roots
    const childrenSet = new Set(Object.keys(parentMap));
    const roots = [...allNodes].filter(node => !childrenSet.has(node));

    // Step 5 & 6 & 7 & 8: Groups and cycles
    const visited = new Set();
    const hierarchies = [];
    
    let total_trees = 0;
    let total_cycles = 0;
    let largest_tree_root = null;
    let max_depth = 0;

    function buildTreeAndCheckCycle(rootNode) {
      const currentPath = new Set();
      let hasCycle = false;
      const tree = {};

      function dfs(node, currentTree) {
        visited.add(node);
        currentPath.add(node);

        const children = childrenMap[node] || [];
        let maxDepthFromHere = 1;

        for (const child of children) {
          if (currentPath.has(child)) {
            hasCycle = true;
          } else if (!visited.has(child)) {
            currentTree[child] = {};
            const childDepth = dfs(child, currentTree[child]);
            if (childDepth + 1 > maxDepthFromHere) {
              maxDepthFromHere = childDepth + 1;
            }
          }
        }

        currentPath.delete(node);
        return maxDepthFromHere;
      }
      
      tree[rootNode] = {};
      const depth = dfs(rootNode, tree[rootNode]);
      
      return { tree, hasCycle, depth };
    }

    // Process natural roots
    for (const root of roots) {
      if (!visited.has(root)) {
        const { tree, hasCycle, depth } = buildTreeAndCheckCycle(root);
        if (hasCycle) {
          hierarchies.push({ root, tree: {}, has_cycle: true });
          total_cycles++;
        } else {
          hierarchies.push({ root, tree, depth });
          total_trees++;
          
          if (depth > max_depth || (depth === max_depth && largest_tree_root && root < largest_tree_root)) {
             max_depth = depth;
             largest_tree_root = root;
          } else if (!largest_tree_root) {
             max_depth = depth;
             largest_tree_root = root;
          }
        }
      }
    }

    // Process pure cycles
    const unvisited = [...allNodes].filter(n => !visited.has(n));
    while (unvisited.length > 0) {
      const queue = [unvisited[0]];
      const componentNodes = [];
      const compVisited = new Set([unvisited[0]]);
      
      while (queue.length > 0) {
        const curr = queue.shift();
        componentNodes.push(curr);
        
        const children = childrenMap[curr] || [];
        const parent = parentMap[curr];
        
        for (const child of children) {
          if (!compVisited.has(child)) {
            compVisited.add(child);
            queue.push(child);
          }
        }
        if (parent && !compVisited.has(parent)) {
          compVisited.add(parent);
          queue.push(parent);
        }
      }
      
      componentNodes.sort(); // Lexicographically smallest first
      const minNode = componentNodes[0];
      
      buildTreeAndCheckCycle(minNode);
      hierarchies.push({ root: minNode, tree: {}, has_cycle: true });
      total_cycles++;
      
      for (const node of componentNodes) {
         const idx = unvisited.indexOf(node);
         if (idx !== -1) unvisited.splice(idx, 1);
      }
    }

    const summary = {
      total_trees,
      total_cycles,
      largest_tree_root
    };

    const response = NextResponse.json({
      user_id: USER_ID,
      email_id: EMAIL_ID,
      college_roll_number: ROLL_NUMBER,
      hierarchies,
      invalid_entries,
      duplicate_edges,
      summary
    });
    
    return setCorsHeaders(response);

  } catch (err) {
    const response = NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    return setCorsHeaders(response);
  }
}
