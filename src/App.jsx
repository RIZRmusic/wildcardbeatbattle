
import React, { useState } from "react";

export default function App() {
  const [players, setPlayers] = useState([
    "Producer A", "Producer B", "Producer C", "Producer D",
    "Producer E", "Producer F", "Producer G", "Producer H"
  ]);
  const [round1Winners, setRound1Winners] = useState([]);

  const handleWinnerClick = (producer) => {
    if (!round1Winners.includes(producer) && round1Winners.length < 4) {
      setRound1Winners([...round1Winners, producer]);
    }
  };

  return (
    <div style={{ background: '#0d0d0d', color: '#fff', minHeight: '100vh', padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#00ffc8' }}>♠️ Wild Card Beat Battle</h1>
      <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '3rem', flexWrap: 'wrap' }}>
        <div>
          <h3>Round 1</h3>
          {Array(4).fill().map((_, i) => (
            <div key={i} style={{ marginBottom: '1rem' }}>
              <div
                onClick={() => handleWinnerClick(players[i * 2])}
                style={{
                  padding: '0.5rem 1rem',
                  background: round1Winners.includes(players[i * 2]) ? '#00ffc8' : '#1e1e1e',
                  marginBottom: '0.5rem',
                  cursor: 'pointer',
                  borderRadius: '6px'
                }}
              >
                {players[i * 2]}
              </div>
              <div
                onClick={() => handleWinnerClick(players[i * 2 + 1])}
                style={{
                  padding: '0.5rem 1rem',
                  background: round1Winners.includes(players[i * 2 + 1]) ? '#00ffc8' : '#1e1e1e',
                  cursor: 'pointer',
                  borderRadius: '6px'
                }}
              >
                {players[i * 2 + 1]}
              </div>
            </div>
          ))}
        </div>

        <div>
          <h3>Semifinals</h3>
          {round1Winners.map((winner, i) => (
            <div key={i} style={{
              background: '#222',
              padding: '0.5rem 1rem',
              marginBottom: '0.5rem',
              borderRadius: '6px'
            }}>
              {winner}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
