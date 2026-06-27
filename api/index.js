const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── Identity ─────────────────────────────────────────────────────────────────
const USER_ID = 'student_27061999';
const EMAIL_ID = 'student@chitkara.edu.in';
const COLLEGE_ROLL_NUMBER = '2300000';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function isValidEntry(raw) {
  const s = raw.trim();
  const re = /^([A-Z])->([A-Z])$/;
  const m = s.match(re);
  if (!m) return false;
  if (m[1] === m[2]) return false;
  return true;
}

function parseEdge(s) {
  const trimmed = s.trim();
  const [parent, child] = trimmed.split('->');
  return { parent, child };
}

function hasCycleInGroup(nodes, adjMap) {
  const WHITE = 0, GRAY = 1, BLACK = 2;
  const color = {};
  nodes.forEach(n => (color[n] = WHITE));

  function dfs(node) {
    color[node] = GRAY;
    for (const neighbor of (adjMap[node] || [])) {
      if (color[neighbor] === GRAY) return true;
      if (color[neighbor] === WHITE && dfs(neighbor)) return true;
    }
    color[node] = BLACK;
    return false;
  }

  for (const n of nodes) {
    if (color[n] === WHITE) {
      if (dfs(n)) return true;
    }
  }
  return false;
}

function computeDepth(tree) {
  function dfs(obj) {
    const keys = Object.keys(obj);
    if (keys.length === 0) return 1;
    let maxD = 0;
    for (const k of keys) maxD = Math.max(maxD, dfs(obj[k]));
    return 1 + maxD;
  }
  const roots = Object.keys(tree);
  if (roots.length === 0) return 0;
  return dfs(tree);
}

function buildNestedTree(root, childrenMap) {
  function dfs(node, visited) {
    if (visited.has(node)) return {};
    visited.add(node);
    const children = childrenMap[node] || [];
    const obj = {};
    for (const child of children) obj[child] = dfs(child, new Set(visited));
    return obj;
  }
  const result = {};
  result[root] = dfs(root, new Set());
  return result;
}

// ─── Core Processing ──────────────────────────────────────────────────────────
function processBFHL(data) {
  const invalidEntries = [];
  const duplicateEdges = [];
  const seenEdges = new Set();
  const validEdges = [];

  for (const raw of data) {
    const trimmed = (typeof raw === 'string') ? raw.trim() : String(raw).trim();
    if (!isValidEntry(trimmed)) { invalidEntries.push(trimmed); continue; }
    const edgeKey = trimmed;
    if (seenEdges.has(edgeKey)) {
      if (!duplicateEdges.includes(edgeKey)) duplicateEdges.push(edgeKey);
    } else {
      seenEdges.add(edgeKey);
      validEdges.push(parseEdge(trimmed));
    }
  }

  const childrenMap = {};
  const parentOf = {};
  const allNodes = new Set();

  for (const { parent, child } of validEdges) {
    allNodes.add(parent);
    allNodes.add(child);
    if (!childrenMap[parent]) childrenMap[parent] = [];
    if (parentOf[child] === undefined) {
      parentOf[child] = parent;
      childrenMap[parent].push(child);
    }
  }

  const uf = {};
  function find(x) {
    if (!uf[x]) uf[x] = x;
    if (uf[x] !== x) uf[x] = find(uf[x]);
    return uf[x];
  }
  function union(a, b) { uf[find(a)] = find(b); }

  for (const { parent, child } of validEdges) union(parent, child);

  const groups = {};
  for (const node of allNodes) {
    const rep = find(node);
    if (!groups[rep]) groups[rep] = [];
    groups[rep].push(node);
  }

  const adjForCycle = {};
  for (const node of allNodes) adjForCycle[node] = [];
  for (const [child, parent] of Object.entries(parentOf)) adjForCycle[parent].push(child);

  const hierarchies = [];
  for (const groupNodes of Object.values(groups)) {
    const cycle = hasCycleInGroup(groupNodes, adjForCycle);
    if (cycle) {
      const root = [...groupNodes].sort()[0];
      hierarchies.push({ root, tree: {}, has_cycle: true });
    } else {
      const groupSet = new Set(groupNodes);
      const roots = groupNodes.filter(n => !parentOf[n] || !groupSet.has(parentOf[n]));
      roots.sort();
      for (const root of roots) {
        const tree = buildNestedTree(root, childrenMap);
        const depth = computeDepth(tree);
        hierarchies.push({ root, tree, depth });
      }
    }
  }

  hierarchies.sort((a, b) => {
    if (a.has_cycle && !b.has_cycle) return 1;
    if (!a.has_cycle && b.has_cycle) return -1;
    return a.root.localeCompare(b.root);
  });

  const nonCyclic = hierarchies.filter(h => !h.has_cycle);
  const cyclic = hierarchies.filter(h => h.has_cycle);

  let largestTreeRoot = null, maxDepth = -1;
  for (const h of nonCyclic) {
    if (h.depth > maxDepth || (h.depth === maxDepth && h.root < largestTreeRoot)) {
      maxDepth = h.depth;
      largestTreeRoot = h.root;
    }
  }

  return {
    user_id: USER_ID,
    email_id: EMAIL_ID,
    college_roll_number: COLLEGE_ROLL_NUMBER,
    hierarchies,
    invalid_entries: invalidEntries,
    duplicate_edges: duplicateEdges,
    summary: { total_trees: nonCyclic.length, total_cycles: cyclic.length, largest_tree_root: largestTreeRoot },
  };
}

// ─── Routes ───────────────────────────────────────────────────────────────────
app.post('/bfhl', (req, res) => {
  try {
    const { data } = req.body;
    if (!Array.isArray(data)) return res.status(400).json({ error: 'Request body must have a "data" array.' });
    const result = processBFHL(data);
    return res.status(200).json(result);
  } catch (err) {
    console.error('Error processing /bfhl:', err);
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

app.get('/bfhl', (req, res) => {
  try {
    return res.status(200).json({ operation_code: 1 });
  } catch (err) {
    console.error('Error processing GET /bfhl:', err);
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

module.exports = app;

