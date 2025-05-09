
import React, { useState } from "react";

export default function App() {
  const [players, setPlayers] = useState([
    "Producer A", "Producer B", "Producer C", "Producer D",
    "Producer E", "Producer F", "Producer G", "Producer H"
  ]);
  const [round1Winners, setRound1Winners] = useState([]);
  const [wildCardPicks, setWildCardPicks] = useState([]);
  const [showWildCardOptions, setShowWildCardOptions] = useState(false);

  const handleWinnerClick = (producer) => {
    if (!round1Winners.includes(producer) && round1Winners.length < 4) {
      setRound1Winners([...round1Winners, producer]);
    }
  };

  const toggleWildCardOptions = () => {
    setShowWildCardOptions(true);
  };

  const handleWildCardClick = (producer) => {
    if (!wildCardPicks.includes(producer)) {
      setWildCardPicks([...wildCardPicks, producer]);
    }
  };

  const drawRandomWildCard = () => {
    const eliminated = players.filter(p => !round1Winners.includes(p));
    const unpicked = eliminated.filter(p => !wildCardPicks.includes(p));
    if (unpicked.length > 0) {
      const chosen = unpicked[Math.floor(Math.random() * unpicked.length)];
      setWildCardPicks([...wildCardPicks, chosen]);
    }
  };

  const totalSemifinalists = [...round1Winners, ...wildCardPicks];

  const eliminatedPlayers = players.filter(p => !round1Winners.includes(p));

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
          {round1Winners.length === 4 && !showWildCardOptions && (
            <button onClick={toggleWildCardOptions} style={{ marginTop: '1rem', padding: '0.5rem 1.5rem' }}>
              Open Wild Card Options ♠️
            </button>
          )}
        </div>

        <div>
          <h3>Semifinals</h3>
          {totalSemifinalists.map((winner, i) => (
            <div key={i} style={{
              background: wildCardPicks.includes(winner) ? '#ff00cc' : '#222',
              padding: '0.5rem 1rem',
              marginBottom: '0.5rem',
              borderRadius: '6px'
            }}>
              {winner}
              {wildCardPicks.includes(winner) && <span style={{ marginLeft: 10 }}>♠️ WILD CARD COMEBACK!</span>}
            </div>
          ))}
        </div>

        {showWildCardOptions && (
          <div style={{ marginTop: '2rem' }}>
            <h3>Pick Wild Card</h3>
            {eliminatedPlayers.map((p, i) => (
              <div
                key={i}
                onClick={() => handleWildCardClick(p)}
                style={{
                  cursor: 'pointer',
                  background: wildCardPicks.includes(p) ? '#ff00cc' : '#1a1a1a',
                  padding: '0.5rem 1rem',
                  margin: '0.25rem',
                  borderRadius: '6px'
                }}
              >
                {p}
              </div>
            ))}
            <button onClick={drawRandomWildCard} style={{ marginTop: '1rem', padding: '0.5rem 1.5rem' }}>
              Draw Random Wild Card
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
