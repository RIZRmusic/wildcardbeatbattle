
import React, { useState } from "react";

const defaultNames = Array.from({ length: 8 }, (_, i) => `Producer ${i + 1}`);

export default function App() {
  const [names, setNames] = useState(defaultNames);
  const [winners, setWinners] = useState([]);

  const handleClick = (name) => {
    if (!winners.includes(name)) {
      setWinners([...winners, name]);
    }
  };

  return (
    <div style={{ background: "#0e0e0e", color: "#fff", minHeight: "100vh", padding: "2rem" }}>
      <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>🎶 Wild Card Bracket 🎶</h1>
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
      <div style={{ marginTop: "3rem", textAlign: "center" }}>
        <h2>Winners:</h2>
        {winners.map((name, i) => (
          <div key={i} style={{ color: "#00ffcc" }}>{name}</div>
        ))}
      </div>
    </div>
  );
}
