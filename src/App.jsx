
import React, { useState } from "react";

function shuffle(array) {
  let a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function App() {
  const [inputCount, setInputCount] = useState("");
  const [inputFields, setInputFields] = useState([]);
  const [players, setPlayers] = useState([]);
  const [round1Pairs, setRound1Pairs] = useState([]);
  const [round1Winners, setRound1Winners] = useState([]);
  const [wildCardEligible, setWildCardEligible] = useState([]);
  const [wildCardWinners, setWildCardWinners] = useState([]);
  const [stage, setStage] = useState("setup");

  const handleGenerate = () => {
    const count = parseInt(inputCount);
    if (isNaN(count) || count < 2 || count > 24 || count % 2 !== 0) {
      alert("Enter an even number between 2 and 24");
      return;
    }
    setInputFields(Array(count).fill(""));
    setStage("input");
  };

  const handleInputChange = (i, value) => {
    const copy = [...inputFields];
    copy[i] = value;
    setInputFields(copy);
  };

  const startBracket = () => {
    const names = inputFields.map(n => n.trim()).filter(n => n);
    if (names.length !== inputFields.length) {
      alert("Please fill in all competitor names.");
      return;
    }
    const shuffled = shuffle(names);
    const pairs = [];
    for (let i = 0; i < shuffled.length; i += 2) {
      pairs.push([shuffled[i], shuffled[i + 1]]);
    }
    setPlayers(shuffled);
    setRound1Pairs(pairs);
    setStage("round1");
  };

  const selectRound1Winner = (winner) => {
    if (!round1Winners.includes(winner)) {
      setRound1Winners([...round1Winners, winner]);
    }
  };

  const launchWildCard = () => {
    const eliminated = round1Pairs.flat().filter(p => !round1Winners.includes(p));
    setWildCardEligible(shuffle(eliminated));
    setStage("wildcard");
  };

  const selectWildCardWinner = (winner) => {
    if (!wildCardWinners.includes(winner) && wildCardWinners.length < 2) {
      setWildCardWinners([...wildCardWinners, winner]);
    }
  };

  const proceedToNextRound = () => {
    const nextRoundPlayers = shuffle([...round1Winners, ...wildCardWinners]);
    alert("Next round will include:\n" + nextRoundPlayers.join(", "));
  };

  return (
    <div style={{ background: "#0d0d0d", color: "#fff", padding: "2rem", fontFamily: "sans-serif", minHeight: "100vh" }}>
      <h1 style={{ textAlign: "center", color: "#00ffc8" }}>♠️ Wild Card Beat Battle</h1>

      {stage === "setup" && (
        <div style={{ textAlign: "center" }}>
          <h3>How many producers are entering? (2–24 even)</h3>
          <input
            type="number"
            min="2"
            max="24"
            step="2"
            value={inputCount}
            onChange={e => setInputCount(e.target.value)}
            style={{ padding: "0.5rem", width: "100px", background: "#222", color: "#fff" }}
          />
          <br />
          <button onClick={handleGenerate} style={{ marginTop: "1rem", padding: "0.5rem 2rem" }}>
            Generate Inputs
          </button>
        </div>
      )}

      {stage === "input" && (
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <h3>Enter Competitor Names</h3>
          {inputFields.map((val, i) => (
            <input
              key={i}
              value={val}
              placeholder={`Producer ${i + 1}`}
              onChange={e => handleInputChange(i, e.target.value)}
              style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem", background: "#222", color: "#fff" }}
            />
          ))}
          <button onClick={startBracket} style={{ marginTop: "1rem", padding: "0.5rem 2rem", background: "#00ffc8", color: "#000" }}>
            Start Bracket
          </button>
        </div>
      )}

      {stage === "round1" && (
        <div style={{ marginTop: "2rem" }}>
          <h3>Round 1: Click Winners</h3>
          {round1Pairs.map(([a, b], i) => (
            <div key={i} style={{ marginBottom: "1rem", display: "flex", justifyContent: "center", gap: "1rem" }}>
              <div onClick={() => selectRound1Winner(a)} style={{
                padding: "0.5rem 1rem",
                background: round1Winners.includes(a) ? "#00ffc8" : "#333",
                cursor: "pointer",
                borderRadius: "6px"
              }}>{a}</div>
              <div onClick={() => selectRound1Winner(b)} style={{
                padding: "0.5rem 1rem",
                background: round1Winners.includes(b) ? "#00ffc8" : "#333",
                cursor: "pointer",
                borderRadius: "6px"
              }}>{b}</div>
            </div>
          ))}
          {round1Winners.length === round1Pairs.length && (
            <div style={{ textAlign: "center", marginTop: "2rem" }}>
              <button onClick={launchWildCard} style={{ padding: "0.5rem 2rem" }}>Launch Wild Card ♠️</button>
            </div>
          )}
        </div>
      )}

      {stage === "wildcard" && (
        <div style={{ marginTop: "2rem", textAlign: "center" }}>
          <h3>Wild Card Battle: Pick 2 Comebacks</h3>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1rem" }}>
            {wildCardEligible.map((p, i) => (
              <div key={i} onClick={() => selectWildCardWinner(p)} style={{
                padding: "0.5rem 1rem",
                background: wildCardWinners.includes(p) ? "#ff00cc" : "#222",
                borderRadius: "6px",
                cursor: "pointer"
              }}>
                {p} {wildCardWinners.includes(p) && "♠️ WILD CARD COMEBACK!"}
              </div>
            ))}
          </div>
          {wildCardWinners.length === 2 && (
            <div style={{ marginTop: "2rem" }}>
              <button onClick={proceedToNextRound} style={{ padding: "0.5rem 2rem" }}>
                ➡️ Proceed to Next Round
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
