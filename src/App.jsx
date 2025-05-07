import React from "react";
import "./App.css";

function App() {
  return (
    <div className="min-h-screen bg-black text-white p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Wild Card Beat Battle</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* ROUND 1 */}
        <div className="bg-gray-900 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Round 1</h2>
          {[...Array(12)].map((_, i) => (
            <p key={i}>Producer {String.fromCharCode(65 + i)} vs Producer {String.fromCharCode(77 + i)}</p>
          ))}
        </div>

        {/* WILD CARD ROUND 1 */}
        <div className="bg-gray-900 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Wild Card Round 1</h2>
          {[...Array(6)].map((_, i) => (
            <p key={i}>WC Battle {i + 1}: TBD</p>
          ))}
        </div>

        {/* ROUND 2 */}
        <div className="bg-gray-900 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Round 2</h2>
          {[...Array(9)].map((_, i) => (
            <p key={i}>Match {i + 1}: TBD</p>
          ))}
        </div>

        {/* MINI BATTLE ROUND */}
        <div className="bg-gray-900 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Mini Battle Round</h2>
          {[1, 2, 3].map((round) => (
            <p key={round}>Mini Battle {round}: 1v1v1</p>
          ))}
        </div>

        {/* WILD CARD DRAW */}
        <div className="bg-gray-900 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Wild Card Draw</h2>
          <p>4 Producers Brought Back by Crowd Vote</p>
        </div>

        {/* ROUND 3 */}
        <div className="bg-gray-900 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Round 3</h2>
          {[...Array(8)].map((_, i) => (
            <p key={i}>Match {i + 1}: TBD</p>
          ))}
        </div>

        {/* FINAL MINI BATTLES */}
        <div className="bg-gray-900 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Final Mini Battles</h2>
          {[1, 2, 3].map((round) => (
            <p key={round}>Final Mini Battle {round}: 1v1v1</p>
          ))}
        </div>

        {/* FINAL ROUND */}
        <div className="bg-yellow-700 p-4 rounded">
          <h2 className="text-2xl font-bold mb-2">🔥 Final Round 🔥</h2>
          <p>1v1v1 - Grand Champion Crowned</p>
        </div>
      </div>
    </div>
  );
}

export default App;
