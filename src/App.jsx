
import React, { useState } from "react";

function shuffle(array) {
  let arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function App() {
  const [input, setInput] = useState(Array(8).fill(""));
  const [bracketStarted, setBracketStarted] = useState(false);
  const [players, setPlayers] = useState([]);
  const [roundWinners, setRoundWinners] = useState([]);
  const [wildCardEligible, setWildCardEligible] = useState([]);
  const [wildCardWinners, setWildCardWinners] = useState([]);
  const [stage, setStage] = useState("input");

  const handleInputChange = (i, value) => {
    const copy = [...input];
    copy[i] = value;
    setInput(copy);
  };

  const addInput = () => {
    if (input.length < 24) setInput([...input, ""]);
  };

  const startBracket = () => {
    const clean = input.map(n => n.trim()).filter(n => n);
    if (clean.length % 2 !== 0 || clean.length < 2) {
      alert("Enter an even number of names (min 2)");
      return;
    }
    const shuffled = shuffle(clean);
    setPlayers(shuffled);
    setBracketStarted(true);
    setStage("round1");
  };

  const handleWinnerClick = (name) => {
    if (roundWinners.includes(name)) return;
    if (roundWinners.length < players.length / 2) {
      setRoundWinners([...roundWinners, name]);
    }
  };

  const launchWildCard = () => {
    const eliminated = players.filter(p => !roundWinners.includes(p));
    setWildCardEligible(shuffle(eliminated));
    setStage("wildcard");
  };

  const handleWildCardWin = (name) => {
    if (!wildCardWinners.includes(name) && wildCardWinners.length < 2) {
      setWildCardWinners([...wildCardWinners, name]);
    }
  };

  const proceedToNextRound = () => {
    const nextRound = shuffle([...roundWinners, ...wildCardWinners]);
    alert("Next round would begin now with:
" + nextRound.join(", "));
  };

  return (
    <div style={{ background: "#0d0d0d", color: "#fff", minHeight: "100vh", padding: "2rem", fontFamily: "sans-serif" }}>
      <h1 style={{ textAlign: "center", color: "#00ffc8" }}>♠️ Wild Card Beat Battle</h1>

      {stage === "input" && (
        <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
          <h3>Enter Competitors (2–24 even only)</h3>
          {input.map((val, i) => (
            <input
              key={i}
              value={val}
              placeholder={`Producer ${i + 1}`}
              onChange={e => handleInputChange(i, e.target.value)}
              style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem", background: "#222", color: "#fff" }}
            />
          ))}
          {input.length < 24 && (
            <button onClick={addInput} style={{ margin: "1rem" }}>+ Add Competitor</button>
          )}
          <br />
          <button onClick={startBracket} style={{ padding: "0.75rem 2rem", background: "#00ffc8", color: "#000" }}>
            Start Bracket
          </button>
        </div>
      )}

      {stage === "round1" && (
        <div>
          <h3 style={{ textAlign: "center" }}>Round 1 (Click winners)</h3>
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
            {Array(players.length / 2).fill().map((_, i) => (
              <div key={i} style={{ margin: "1rem", background: "#1e1e1e", padding: "1rem", borderRadius: "6px" }}>
                <div onClick={() => handleWinnerClick(players[i * 2])} style={{
                  padding: "0.5rem 1rem",
                  marginBottom: "0.5rem",
                  background: roundWinners.includes(players[i * 2]) ? "#00ffc8" : "#333",
                  cursor: "pointer"
                }}>{players[i * 2]}</div>
                <div onClick={() => handleWinnerClick(players[i * 2 + 1])} style={{
                  padding: "0.5rem 1rem",
                  background: roundWinners.includes(players[i * 2 + 1]) ? "#00ffc8" : "#333",
                  cursor: "pointer"
                }}>{players[i * 2 + 1]}</div>
              </div>
            ))}
          </div>
          {roundWinners.length === players.length / 2 && (
            <div style={{ textAlign: "center", marginTop: "2rem" }}>
              <button onClick={launchWildCard} style={{ padding: "0.5rem 2rem" }}>Start Wild Card ♠️</button>
            </div>
          )}
        </div>
      )}

      {stage === "wildcard" && (
        <div style={{ textAlign: "center" }}>
          <h3>Wild Card Battle — Pick 2 Comebacks</h3>
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
            {wildCardEligible.map((p, i) => (
              <div key={i} onClick={() => handleWildCardWin(p)} style={{
                margin: "0.5rem",
                padding: "0.5rem 1rem",
                background: wildCardWinners.includes(p) ? "#ff00cc" : "#222",
                cursor: "pointer",
                borderRadius: "6px"
              }}>
                {p} {wildCardWinners.includes(p) && "♠️ WILD CARD COMEBACK!"}
              </div>
            ))}
          </div>
          {wildCardWinners.length === 2 && (
            <button onClick={proceedToNextRound} style={{ marginTop: "2rem", padding: "0.5rem 2rem" }}>
              ➡️ Proceed to Next Round
            </button>
          )}
        </div>
      )}
    </div>
  );
}
