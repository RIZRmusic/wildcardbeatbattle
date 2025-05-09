
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
  const [count, setCount] = useState("");
  const [inputs, setInputs] = useState([]);
  const [stage, setStage] = useState("setup");
  const [pairs, setPairs] = useState([]);
  const [winners, setWinners] = useState([]);
  const [wildcardEligible, setWildcardEligible] = useState([]);
  const [wildcardWinners, setWildcardWinners] = useState([]);
  const [nextRound, setNextRound] = useState([]);

  const generateInputs = () => {
    const c = parseInt(count);
    if (isNaN(c) || c < 2 || c > 24 || c % 2 !== 0) {
      alert("Enter an even number between 2 and 24");
      return;
    }
    setInputs(Array(c).fill(""));
    setStage("input");
  };

  const handleInputChange = (i, val) => {
    const copy = [...inputs];
    copy[i] = val;
    setInputs(copy);
  };

  const startBracket = () => {
    if (inputs.some(i => !i.trim())) {
      alert("Fill in all names");
      return;
    }
    const shuffled = shuffle(inputs);
    const p = [];
    for (let i = 0; i < shuffled.length; i += 2) {
      p.push([shuffled[i], shuffled[i + 1]]);
    }
    setPairs(p);
    setStage("round1");
  };

  const selectWinner = (name) => {
    if (!winners.includes(name)) {
      setWinners([...winners, name]);
    }
  };

  const launchWildcard = () => {
    const eliminated = pairs.flat().filter(p => !winners.includes(p));
    setWildcardEligible(shuffle(eliminated));
    setStage("wildcard");
  };

  const pickWildcard = (name) => {
    if (!wildcardWinners.includes(name) && wildcardWinners.length < 2) {
      setWildcardWinners([...wildcardWinners, name]);
    }
  };

  const proceedNext = () => {
    const combined = shuffle([...winners, ...wildcardWinners]);
    setNextRound(combined);
    setStage("next");
  };

  return (
    <div style={{ background: "#0d0d0d", color: "#fff", minHeight: "100vh", padding: "2rem" }}>
      <h1 style={{ textAlign: "center", color: "#00ffc8" }}>♠️ Wild Card Beat Battle</h1>

      {stage === "setup" && (
        <div style={{ textAlign: "center" }}>
          <h3>Enter number of producers (2–24)</h3>
          <input type="number" min="2" max="24" step="2" value={count}
            onChange={e => setCount(e.target.value)}
            style={{ padding: "0.5rem", width: "100px", background: "#222", color: "#fff" }} />
          <br />
          <button onClick={generateInputs} style={{ marginTop: "1rem", padding: "0.5rem 2rem" }}>
            Generate
          </button>
        </div>
      )}

      {stage === "input" && (
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <h3>Enter Competitor Names</h3>
          {inputs.map((val, i) => (
            <input key={i} value={val} placeholder={`Producer ${i + 1}`}
              onChange={e => handleInputChange(i, e.target.value)}
              style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem", background: "#222", color: "#fff" }} />
          ))}
          <button onClick={startBracket} style={{ padding: "0.5rem 2rem", background: "#00ffc8", color: "#000" }}>
            Start Bracket
          </button>
        </div>
      )}

      {stage === "round1" && (
        <div>
          <h2>Round 1</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
            {pairs.map(([a, b], i) => (
              <div key={i} style={{ background: "#1a1a1a", padding: "1rem", borderRadius: "8px", textAlign: "center" }}>
                <div onClick={() => selectWinner(a)} style={{
                  padding: "0.5rem", marginBottom: "0.5rem",
                  background: winners.includes(a) ? "#00ffc8" : "#333",
                  borderRadius: "6px", cursor: "pointer"
                }}>{a}</div>
                <div onClick={() => selectWinner(b)} style={{
                  padding: "0.5rem",
                  background: winners.includes(b) ? "#00ffc8" : "#333",
                  borderRadius: "6px", cursor: "pointer"
                }}>{b}</div>
              </div>
            ))}
          </div>
          {winners.length === pairs.length && (
            <div style={{ textAlign: "center", marginTop: "2rem" }}>
              <button onClick={launchWildcard} style={{ padding: "0.5rem 2rem" }}>Launch Wild Card ♠️</button>
            </div>
          )}
        </div>
      )}

      {stage === "wildcard" && (
        <div style={{ textAlign: "center" }}>
          <h3>Pick 2 Wild Cards</h3>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1rem" }}>
            {wildcardEligible.map((name, i) => (
              <div key={i} onClick={() => pickWildcard(name)} style={{
                padding: "0.5rem 1rem",
                background: wildcardWinners.includes(name) ? "#ff00cc" : "#222",
                borderRadius: "6px", cursor: "pointer"
              }}>{name} {wildcardWinners.includes(name) && "♠️"}</div>
            ))}
          </div>
          {wildcardWinners.length === 2 && (
            <button onClick={proceedNext} style={{ marginTop: "2rem", padding: "0.5rem 2rem" }}>
              Proceed ➡️
            </button>
          )}
        </div>
      )}

      {stage === "next" && (
        <div style={{ marginTop: "2rem" }}>
          <h2>Next Round Competitors</h2>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {nextRound.map((p, i) => (
              <li key={i} style={{ padding: "0.5rem 0", borderBottom: "1px solid #333" }}>{p}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
