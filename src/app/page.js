"use client";

import { useState } from "react";
import HierarchyTree from "@/components/HierarchyTree";

export default function Home() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      setResult(null);

      const inputArray = input
        .split(/\r?\n|,/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const response = await fetch("/bfhl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: inputArray }),
      });

      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Node Hierarchy Processor</h1>
        <p>Analyze graph relationships, detect cycles, and visualize trees interactively.</p>
      </header>

      <section className="input-section card">
        <div className="card-title">Input Relationships</div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={"A->B\nA->C\nC->D"}
        />
        <div className="hint">Enter one edge per line (e.g. A-&gt;B).</div>
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? <div className="spinner" /> : "Process Data"}
        </button>
      </section>

      {error && <div className="error-banner">⚠ {error}</div>}

      {result && (
        <div className="results fade-in">
          <div className="grid grid-2" style={{ marginBottom: "1.5rem" }}>
            <div className="card" style={{ marginBottom: 0 }}>
              <div className="card-title">Identity Details</div>
              <div className="identity-row">
                <div className="identity-item">
                  <span className="identity-label">User ID</span>
                  <span className="identity-val">{result.user_id}</span>
                </div>
                <div className="identity-item">
                  <span className="identity-label">Email</span>
                  <span className="identity-val">{result.email_id}</span>
                </div>
                <div className="identity-item">
                  <span className="identity-label">Roll Number</span>
                  <span className="identity-val">{result.college_roll_number}</span>
                </div>
              </div>
            </div>

            <div className="card" style={{ marginBottom: 0 }}>
              <div className="card-title">Summary</div>
              <div className="grid grid-2" style={{ gap: "1rem" }}>
                <div className="stat-box">
                  <div className="stat-label">Total Trees</div>
                  <div className="stat-value">{result.summary?.total_trees || 0}</div>
                </div>
                <div className="stat-box">
                  <div className="stat-label">Total Cycles</div>
                  <div className="stat-value">{result.summary?.total_cycles || 0}</div>
                </div>
              </div>
              <div className="stat-box" style={{ marginTop: "1rem", borderLeftColor: "var(--primary-color)", background: "rgba(249, 115, 22, 0.05)" }}>
                <div className="stat-label">Largest Tree Root</div>
                <div className="stat-value" style={{ color: "var(--primary-color)" }}>
                  {result.summary?.largest_tree_root || "None"}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-2" style={{ marginBottom: "1.5rem" }}>
            <div className="card box-error" style={{ marginBottom: 0 }}>
              <div className="card-title" style={{ color: "var(--accent-error)" }}>
                Invalid Entries
              </div>
              {result.invalid_entries?.length > 0 ? (
                <div className="tag-list">
                  {result.invalid_entries.map((entry, i) => (
                    <span key={i} className="tag">{entry}</span>
                  ))}
                </div>
              ) : (
                <div className="empty-text">None</div>
              )}
            </div>

            <div className="card box-warning" style={{ marginBottom: 0 }}>
              <div className="card-title" style={{ color: "var(--accent-warning)" }}>
                Duplicate Edges
              </div>
              {result.duplicate_edges?.length > 0 ? (
                <div className="tag-list">
                  {result.duplicate_edges.map((entry, i) => (
                    <span key={i} className="tag">{entry}</span>
                  ))}
                </div>
              ) : (
                <div className="empty-text">None</div>
              )}
            </div>
          </div>

          <div className="card">
            <div className="card-title">Hierarchies</div>
            {result.hierarchies?.length > 0 ? (
              <div className="grid grid-2">
                {result.hierarchies.map((h, i) => (
                  <div key={i} className="tree-wrapper" style={{ padding: '1rem', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                      <div className="node-label root-label">{h.root}</div>
                      {h.has_cycle ? (
                        <div className="badge cycle">⚠ Cycle Detected</div>
                      ) : (
                        <div className="badge depth">Depth: {h.depth}</div>
                      )}
                    </div>
                    {!h.has_cycle && h.tree && (
                      <HierarchyTree root={h.root} tree={h.tree} />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-text">No hierarchies generated.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
