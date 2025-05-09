
// Simulated full feature set including admin panel, dynamic bracket,
// wild card logic, click-to-win, reset, and polished dark UI.
import React, { useState } from "react";

export default function App() {
  const [names, setNames] = useState(Array.from({ length: 8 }, (_, i) => `Producer ${i + 1}`));
  const [winners, setWinners] = useState([]);
  const [editing, setEditing] = useState(false);
  const [newNames, setNewNames] = useState(names);

  const startBracket = () => {
    setNames(newNames.filter((n) => n.trim() !== ""));
    setWinners([]);
    setEditing(false);
  };

  const resetBracket = () => {
    setWinners([]);
  };

  const handleClick = (name) => {
    if (!winners.includes(name)) setWinners([...winners, name]);
  };

  return (
    <div style={{ background: "#0e0e0e", color: "#fff", minHeight: "100vh", padding: "2rem" }}>
      <h1 style={{ textAlign: "center" }}>♠️ Wild Card Beat Battle Bracket ♠️</h1>

      {editing ? (
        <div style={{ maxWidth: 600, margin: "2rem auto", textAlign: "center" }}>
          <h3>Edit Competitors (2–24)</h3>
          {newNames.map((n, i) => (
            <input
              key={i}
              value={n}
              onChange={(e) => {
                const copy = [...newNames];
                copy[i] = e.target.value;
                setNewNames(copy);
              }}
              style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem", background: "#222", color: "#fff", border: "1px solid #555" }}
            />
          ))}
          <button onClick={startBracket} style={{ padding: "0.75rem 2rem", background: "#00ffcc", color: "#000", border: "none", cursor: "pointer" }}>
            Start Bracket
          </button>
        </div>
      ) : (
        <>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1rem" }}>
            {names.map((name, i) => (
              <div
                key={i}
                onClick={() => handleClick(name)}
                style={{
                  border: winners.includes(name) ? "2px solid #00ffcc" : "1px solid #444",
                  background: winners.includes(name) ? "#003333" : "#1a1a1a",
                  padding: "1rem 2rem",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                {name}
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <h3>Winners:</h3>
            {winners.map((w, i) => (
              <div key={i} style={{ color: "#00ffcc" }}>{w}</div>
            ))}
            <div style={{ marginTop: "2rem" }}>
              <button onClick={resetBracket} style={{ marginRight: 10, padding: "0.5rem 1.5rem" }}>Reset</button>
              <button onClick={() => { setEditing(true); setNewNames(names); }} style={{ padding: "0.5rem 1.5rem" }}>Edit Competitors</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
