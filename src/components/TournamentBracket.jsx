// TournamentBracket.jsx
import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import WildCardSelectionModal from './WildCardSelectionModal.jsx';

const carryOverMap = {
  wildCard1: [],
  wildCard2: [],
  wildCard3: [],
};

function TournamentBracket({ producers, tournamentStarted, onTournamentStart }) {
  const bracketRef = useRef(null);
  const [tournamentState, setTournamentState] = useState({
    isStarted: false,
    currentRound: 'round1',
    rounds: {
      round1: [],
      wildCard1: [],
      round2: [],
      wildCard2: [],
      round3: [],
      wildCard3: [],
      round4: [],
      final: [],
    },
    eliminatedProducers: new Set(),
    wildcardProducers: new Set(),
    roundLosers: {},
    placements: {
      first: null,
      second: null,
      third: null,
    },
    isComplete: false,
    finalPlacementStep: 0,
  });

  const tournamentDocRef = doc(db, 'tournaments', 'main');

  useEffect(() => {
    const unsubscribe = onSnapshot(tournamentDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        data.eliminatedProducers = new Set(data.eliminatedProducers || []);
        data.wildcardProducers = new Set(data.wildcardProducers || []);
        setTournamentState(data);
      }
    });
    return () => unsubscribe();
  }, []);

  const updateTournamentState = async (updates) => {
    const newState = {
      ...tournamentState,
      ...updates,
      eliminatedProducers: Array.from(updates.eliminatedProducers || tournamentState.eliminatedProducers),
      wildcardProducers: Array.from(updates.wildcardProducers || tournamentState.wildcardProducers),
    };
    await setDoc(tournamentDocRef, newState);
  };

  const [showWildCardModal, setShowWildCardModal] = useState(false);
  const [selectedWildCards, setSelectedWildCards] = useState([]);

  const roundLabels = {
    round1: '🎮 Round 1 (24 Producers)',
    wildCard1: '♠️ Wild Card Round 1',
    round2: '🎮 Round 2 (18 Producers)',
    wildCard2: '♠️ Wild Card Round 2 (Mini Battles)',
    round3: '🎮 Round 3 (12 Producers)',
    wildCard3: '♠️ Wild Card Round 3',
    round4: '🎮 Round 4 (9 Producers)',
    final: '🏆 Final Round',
  };

  const scrollToRound = (roundName) => {
    const roundElement = document.querySelector(`.round.${roundName}`);
    if (roundElement) {
      roundElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  useEffect(() => {
    if (tournamentState.currentRound) {
      scrollToRound(tournamentState.currentRound);
    }
  }, [tournamentState.currentRound]);

const isWildCard = (producerId) => {
  const wildcards = tournamentState.wildcardProducers;
  if (wildcards instanceof Set) return wildcards.has(producerId);
  if (Array.isArray(wildcards)) return wildcards.includes(producerId);
  return false;
};


const isLoserInRound = (producer, roundName) => {
  if (!producer || !tournamentState.roundLosers) return false;
  return tournamentState.roundLosers[roundName]?.includes(producer.id);
};


  const isClickable = (producer, match) => {
    if (!producer || match.winner) return false;
    if (match.roundName === 'final') {
      const { finalPlacementStep, placements } = tournamentState;
      if (finalPlacementStep === 0) return true;
      if (finalPlacementStep === 1) return !placements.first || producer.id !== placements.first.id;
      if (finalPlacementStep === 2) {
        return !placements.first && !placements.second || (producer.id !== placements.first?.id && producer.id !== placements.second?.id);
      }
      return false;
    }
    if (match.roundName !== tournamentState.currentRound) return false;
    if (match.roundName.includes('wildCard') && match.roundName === tournamentState.currentRound) return true;
    return !isLoserInRound(producer, match.roundName);
  };

const startTournament = async () => {
  const shuffledProducers = [...producers].sort(() => Math.random() - 0.5);
  const firstRoundMatches = [];

  for (let i = 0; i < shuffledProducers.length; i += 2) {
    firstRoundMatches.push({
      id: `R1-M${i / 2}`,
      producer1: shuffledProducers[i],
      producer2: shuffledProducers[i + 1] || null,
      winner: null,
      roundName: 'round1',
    });
  }

  const newTournamentState = {
    ...tournamentState,
    isStarted: true,
    currentRound: 'round1',
    rounds: {
      ...tournamentState.rounds,
      round1: firstRoundMatches,
    },
    roundLosers: {
      round1: [],
      wildCard1: [],
      round2: [],
      wildCard2: [],
      round3: [],
      wildCard3: [],
      round4: [],
      final: [],
    },
    eliminatedProducers: Array.from(tournamentState.eliminatedProducers),
    wildcardProducers: Array.from(tournamentState.wildcardProducers),
  };

  await setDoc(doc(db, 'tournaments', 'main'), newTournamentState);
  setTournamentState(newTournamentState);
  onTournamentStart();
};



const roundFlow = [
  'round1',
  'wildCard1',
  'round2',
  'wildCard2',
  'round3',
  'wildCard3',
  'round4',
  'final',
];

const getNextRound = (currentRound) => {
  const currentIndex = roundFlow.indexOf(currentRound);
  return roundFlow[currentIndex + 1] || null;
};



const createPairMatches = (producers, roundName) => {
  const matches = [];
  const shuffled = [...producers].sort(() => Math.random() - 0.5);
  for (let i = 0; i < shuffled.length; i += 2) {
    matches.push({
      id: `${roundName}-M${i / 2}`,
      producer1: shuffled[i],
      producer2: shuffled[i + 1] || null,
      winner: null,
      roundName,
    });
  }
  return matches;
};

const createTripleMatches = (producers, roundName) => {
  const matches = [];
  const shuffled = [...producers].sort(() => Math.random() - 0.5);
  for (let i = 0; i < shuffled.length; i += 3) {
    matches.push({
      id: `${roundName}-M${i / 3}`,
      producer1: shuffled[i],
      producer2: shuffled[i + 1] || null,
      producer3: shuffled[i + 2] || null,
      winner: null,
      roundName,
    });
  }
  return matches;
};

const handleWinnerSelect = async (match, winner) => {
  const roundName = match.roundName;

  // Handle final round 1st/2nd/3rd placement logic
  if (roundName === 'final') {
    const { finalPlacementStep, placements } = tournamentState;

    let updatedPlacements = { ...placements };
    let nextStep = finalPlacementStep;

    if (finalPlacementStep === 0) {
      updatedPlacements.first = winner;
      nextStep = 1;
    } else if (finalPlacementStep === 1) {
      updatedPlacements.second = winner;
      nextStep = 2;
    } else if (finalPlacementStep === 2) {
      updatedPlacements.third = winner;
      nextStep = 3;
    }

    const isComplete = nextStep >= 3;

    const updatedState = {
      ...tournamentState,
      placements: updatedPlacements,
      finalPlacementStep: nextStep,
      isComplete,
    };

    await setDoc(doc(db, 'tournaments', 'main'), {
      ...updatedState,
      eliminatedProducers: Array.from(tournamentState.eliminatedProducers),
      wildcardProducers: Array.from(tournamentState.wildcardProducers),
    });

    setTournamentState(updatedState);
    return;
  }

  // Standard match winner selection logic
  const updatedRound = tournamentState.rounds[roundName].map(m => {
    if (m.id === match.id) {
      return { ...m, winner };
    }
    return m;
  });

  // Determine all participants and filter out the winner
  const allParticipants = [
    ...(match?.producer1 ? [match.producer1] : []),
    ...(match?.producer2 ? [match.producer2] : []),
    ...(match?.producer3 ? [match.producer3] : []),
  ];

  const losers = [
    ...(tournamentState.roundLosers[roundName] || []),
    ...allParticipants.filter(p => p && p.id !== winner.id).map(p => p.id)
  ];

  const updatedEliminated = new Set([
    ...tournamentState.eliminatedProducers,
    ...losers
  ]);

  const allWinnersSelected = updatedRound.every(m => m.winner);

  let nextRound = tournamentState.currentRound;
  let nextRoundData = { ...tournamentState.rounds };
  let nextRoundLosers = { ...tournamentState.roundLosers };

  if (allWinnersSelected) {
    const next = getNextRound(roundName);
    const winners = updatedRound.map(m => m.winner);

    let newMatches = [];
    switch (next) {
      case 'wildCard1':
        carryOverMap.wildCard1 = winners;
        newMatches = createPairMatches(
          losers.map(id => producers.find(p => p.id === id)),
          next
        );
        break;

      case 'round2':
        newMatches = createPairMatches(
          [...carryOverMap.wildCard1, ...winners],
          next
        );
        break;

      case 'wildCard2':
        carryOverMap.wildCard2 = winners;
        newMatches = createTripleMatches(
          losers.map(id => producers.find(p => p.id === id)),
          next
        );
        break;

      case 'round3':
        newMatches = createPairMatches(
          [...carryOverMap.wildCard2, ...winners],
          next
        );
        break;

      case 'wildCard3':
        carryOverMap.wildCard3 = winners;
        newMatches = createPairMatches(
          losers.map(id => producers.find(p => p.id === id)),
          next
        );
        break;

      case 'round4':
        newMatches = createTripleMatches(
          [...carryOverMap.wildCard3, ...winners],
          next
        );
        break;

      case 'final':
        newMatches = [
          {
            id: 'final-M0',
            producer1: winners[0],
            producer2: winners[1],
            producer3: winners[2],
            winner: null,
            roundName: 'final'
          }
        ];
        break;

      default:
        break;
    }

    if (newMatches.length) {
      nextRound = next;
      nextRoundData[next] = newMatches;
      nextRoundLosers[next] = [];
    }
  }

  const updatedState = {
    ...tournamentState,
    currentRound: nextRound,
    rounds: {
      ...nextRoundData,
      [roundName]: updatedRound,
    },
    roundLosers: {
      ...nextRoundLosers,
      [roundName]: losers,
    },
    eliminatedProducers: updatedEliminated,
  };

  await setDoc(doc(db, 'tournaments', 'main'), {
    ...updatedState,
    eliminatedProducers: Array.from(updatedEliminated),
    wildcardProducers: Array.from(tournamentState.wildcardProducers),
  });

  setTournamentState(updatedState);
};



  const renderMatch = (match) => {
    if (!match) return null;
    const handleClick = (producer, opponent, isThirdProducer = false) => {
      if (!isClickable(producer, match)) return;
      handleWinnerSelect(
        match.id,
        producer,
        isThirdProducer ? [match.producer1, match.producer2].filter((p) => p && p.id !== producer.id) : opponent,
        match.roundName
      );
    };

    const getFinalPlacementText = (producer) => {
      if (match.roundName !== 'final') return '';
      if (producer.id === tournamentState.placements.first?.id) return '(1st Place)';
      if (producer.id === tournamentState.placements.second?.id) return '(2nd Place)';
      if (producer.id === tournamentState.placements.third?.id) return '(3rd Place)';
      return '';
    };

    return (
        <div key={match.id} className="match-container round-slide-in">
        <div className={`match ${match.roundName === 'final' ? 'final-match' : ''}`}>
          {[match.producer1, match.producer2, match.producer3].filter(Boolean).map((producer, index) => (
            <React.Fragment key={index}>
              {index > 0 && <div className="vs">VS</div>}
              <div
                className={`producer-card
                  ${match.winner?.id === producer?.id ? 'winner' : ''}
                  ${isWildCard(producer, match.roundName) ? 'wild-card' : ''}
                  ${isLoserInRound(producer, match.roundName) ? 'loser' : ''}
                  ${!isClickable(producer, match) ? 'disabled' : ''}
                  ${match.roundName === 'final' ? 'final-card' : ''}`}
                onClick={() => handleWinnerSelect(match, producer)}
              >
                <span>
                  {producer?.name || 'TBD'} {getFinalPlacementText(producer)}
                </span>
                {isLoserInRound(producer, match.roundName) && (
                  <div className="loser-overlay">
                    <div className="x-line-1"></div>
                    <div className="x-line-2"></div>
                  </div>
                )}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  const renderWinner = () => {
    const { first, second, third } = tournamentState.placements;
    return (
      <div className="winner-display">
        <h2 className="winner-title">🏆 Tournament Results 🏆</h2>
        <div className="winner-card first-place">
          <span className="placement">1st Place:</span> <span className="name">{first?.name}</span>
        </div>
        <div className="winner-card second-place">
          <span className="placement">2nd Place:</span> <span className="name">{second?.name}</span>
        </div>
        <div className="winner-card third-place">
          <span className="placement">3rd Place:</span> <span className="name">{third?.name}</span>
        </div>
      </div>
    );
  };
console.log('Current Round:', tournamentState.currentRound);
console.log('Round Data:', tournamentState.rounds[tournamentState.currentRound]);

  return (
    <div className="tournament-bracket" ref={bracketRef}>
      {!tournamentState.isStarted ? (
        <button
          className="start-tournament-btn"
          onClick={() => {
            startTournament(); // ← ensures bracket is initialized
            onTournamentStart(); // ← ensures parent state is updated
          }}
        >
          Start Tournament
        </button>
      ) : tournamentState.isComplete ? (
        renderWinner()
      ) : (
        <div className={`bracket-round ${showWildCardModal ? 'blur' : ''}`}>
          {Object.entries(roundLabels).map(([roundName, label]) =>
            tournamentState.currentRound === roundName && (
              <div
                key={roundName}
                className={`round ${roundName} ${roundName.includes('wildCard') ? 'wild-card' : ''} active`}
              >
                <h3>{label}</h3>
                <div className="matches">
                  {tournamentState.rounds[roundName].map((match) => renderMatch(match))}
                </div>
              </div>
            )
          )}
        </div>
      )}

      {showWildCardModal && (
        <WildCardSelectionModal
          eliminatedProducers={Array.from(tournamentState.eliminatedProducers)
            .map((id) => producers.find((p) => p.id === id))
            .filter(Boolean)
            .filter((p) => !tournamentState.wildcardProducers.has(p.id))}
          onComplete={(selectedProducers) => {
            handleWildCardSelectionComplete(selectedProducers);
            setShowWildCardModal(false);
          }}
          onCancel={() => setShowWildCardModal(false)}
          maxSelections={4}
        />
      )}
    </div>
  );
}

export default TournamentBracket;
