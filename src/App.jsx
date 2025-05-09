
import React, { useState } from "react";

export default function App() {
  const [competitors, setCompetitors] = useState(Array(8).fill(""));
  const [bracketStarted, setBracketStarted] = useState(false);
  const [round1Winners, setRound1Winners] = useState([]);
  const [wildCardPicks, setWildCardPicks] = useState([]);

  const handleNameChange = (index, value) => {
    const copy = [...competitors];
    copy[index] = value;
    setCompetitors(copy);
  };

  const startBracket = () => {
    const filled = competitors.filter(name => name.trim() !== "");
    if (filled.length % 2 !== 0 || filled.length < 2) {
      alert("Please enter an even number of competitors (min 2)");
      return;
    }
    setCompetitors(filled);
    setBracketStarted(true);
  };

  const handleWinnerClick = (name) => {
    if (!round1Winners.includes(name) && round1Winners.length < competitors.length / 2) {
      setRound1Winners([...round1Winners, name]);
    }
  };

  const handleWildCardClick = (name) => {
    if (!wildCardPicks.includes(name)) {
      setWildCardPicks([...wildCardPicks, name]);
    }
  };

  const eliminated = competitors.filter(p => !round1Winners.includes(p));
  const semifinalists = [...round1Winners, ...wildCardPicks];

  return (
    <div style={{ background: "#0d0d0d", color: "#fff", minHeight: "100vh", padding: "2rem", fontFamily: "sans-serif" }}>
      <h1 style={{ textAlign: "center", color: "#00ffc8" }}>♠️ Wild Card Beat Battle</h1>

      {!bracketStarted ? (
        <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
          <h3>Enter Competitor Names (2–24, even number)</h3>
          {competitors.map((name, i) => (
            <input
              key={i}
              value={name}
              placeholder={`Producer ${i + 1}`}
              onChange={e => handleNameChange(i, e.target.value)}
              style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem", background: "#222", color: "#fff", border: "1px solid #555" }}
            />
          ))}
          {competitors.length < 24 && (
            <button onClick={() => setCompetitors([...competitors, ""])} style={{ marginTop: "1rem", padding: "0.5rem 1.5rem" }}>
              + Add Competitor
            </button>
          )}
          <br />
          <button onClick={startBracket} style={{ marginTop: "1rem", padding: "0.75rem 2rem", background: "#00ffc8", color: "#000", border: "none", cursor: "pointer" }}>
            Start Bracket
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", marginTop: "2rem" }}>
          <div>
            <h3>Round 1</h3>
            {Array(competitors.length / 2).fill().map((_, i) => (
              <div key={i} style={{ marginBottom: "1rem" }}>
                <div
                  onClick={() => handleWinnerClick(competitors[i * 2])}
                  style={{
                    padding: "0.5rem 1rem",
                    background: round1Winners.includes(competitors[i * 2]) ? "#00ffc8" : "#1e1e1e",
                    marginBottom: "0.5rem",
                    cursor: "pointer",
                    borderRadius: "6px"
                  }}
                >
                  {competitors[i * 2]}
                </div>
                <div
                  onClick={() => handleWinnerClick(competitors[i * 2 + 1])}
                  style={{
                    padding: "0.5rem 1rem",
                    background: round1Winners.includes(competitors[i * 2 + 1]) ? "#00ffc8" : "#1e1e1e",
                    cursor: "pointer",
                    borderRadius: "6px"
                  }}
                >
                  {competitors[i * 2 + 1]}
                </div>
              </div>
            ))}
          </div>

          {round1Winners.length === competitors.length / 2 && (
            <div style={{ marginTop: "2rem" }}>
              <h3>Wild Card Round</h3>
              {eliminated.map((name, i) => (
                <div
                  key={i}
                  onClick={() => handleWildCardClick(name)}
                  style={{
                    cursor: "pointer",
                    background: wildCardPicks.includes(name) ? "#ff00cc" : "#1a1a1a",
                    padding: "0.5rem 1rem",
                    margin: "0.25rem",
                    borderRadius: "6px"
                  }}
                >
                  {name}
                </div>
              ))}
            </div>
          )}

          <div>
            <h3>Semifinals</h3>
            {semifinalists.map((name, i) => (
              <div key={i} style={{
                background: wildCardPicks.includes(name) ? "#ff00cc" : "#222",
                padding: "0.5rem 1rem",
                marginBottom: "0.5rem",
                borderRadius: "6px"
              }}>
                {name}
                {wildCardPicks.includes(name) && <span style={{ marginLeft: 10 }}>♠️ WILD CARD COMEBACK!</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
