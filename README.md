# Hierarchical Node Graph Processor 🌳

A full-stack web application engineered for advanced graph data analysis. Built with **Next.js**, this application processes string-based node relationships (e.g., `A->B`), constructs visual hierarchical trees, and employs Depth First Search (DFS) algorithms to accurately detect cycles and calculate maximum root-to-leaf depth.

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Framework](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)
![Styling](https://img.shields.io/badge/Styling-Vanilla_CSS-orange)

---

## 🚀 Features

- **Robust REST API**: High-performance `POST /bfhl` endpoint capable of parsing nodes, sanitizing data, tracking relationships, and handling edge cases (e.g., multi-parenting, duplicate edge deduplication).
- **Cycle Detection**: Automatically flags cyclic dependencies using Weak Connectivity and Depth-First Search algorithms.
- **Interactive Visualization**: Leverages `react-d3-tree` and D3.js to render complex hierarchical architectures via an interactive, zoomable UI.
- **Premium Aesthetics**: A highly polished, custom dark-mode design system built from the ground up using pure Vanilla CSS.

---

## 📐 API Specification

### Endpoint: `POST /bfhl`
Accepts a JSON payload containing an array of node relationship strings and returns a structured analysis of the parsed graph.

**Request Payload:**
```json
{
  "data": ["A->B", "A->C", "B->D", "C->E", "Z->X", "X->Z"]
}
```

**Response Format:**
```json
{
  "user_id": "fullname_ddmmyyyy",
  "email_id": "student@college.edu",
  "college_roll_number": "XXXXXXXX",
  "hierarchies": [
    {
      "root": "A",
      "tree": { "A": { "B": { "D": {} }, "C": { "E": {} } } },
      "depth": 3
    },
    {
      "root": "X",
      "tree": {},
      "has_cycle": true
    }
  ],
  "invalid_entries": [],
  "duplicate_edges": [],
  "summary": {
    "total_trees": 1,
    "total_cycles": 1,
    "largest_tree_root": "A"
  }
}
```

---

## 💻 Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: JavaScript (ES6+)
- **Frontend**: React.js, `react-d3-tree`
- **Styling**: Vanilla CSS (Custom Design System)

---

## 🛠 Setup & Installation

Follow these instructions to run the project locally on your machine.

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (Node Package Manager)

### 1. Clone the Repository
```bash
git clone https://github.com/akamresh78/bfhl-challenge.git
cd bfhl-challenge
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Development Server
```bash
npm run dev
```

### 4. Open the Application
Navigate your web browser to:
[http://localhost:3000](http://localhost:3000)

---

## 🧪 Usage & Testing

You can interact with the API directly using the beautifully crafted Frontend UI. Alternatively, you can test the REST endpoint using `cURL` or Postman:

```bash
curl -s -X POST http://localhost:3000/bfhl \
  -H "Content-Type: application/json" \
  -d '{"data": ["A->B", "A->C", "B->D"]}'
```

---

## 👨‍💻 Developer Notes
This project was developed as a solution for the SRM Full Stack Engineering Challenge. It successfully maps acyclic directed graphs, enforces strict validation regex definitions (`/^[A-Z]->[A-Z]$/`), and automatically calculates graph depths within milliseconds.
