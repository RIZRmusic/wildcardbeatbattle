import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase'; // adjust path if needed
import { doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import WildCardSelectionModal from './WildCardSelectionModal.jsx';

function TournamentBracket({ producers, tournamentStarted, onTournamentStart }) {
  const bracketRef = useRef(null)
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
      final: []
    },
    eliminatedProducers: new Set(),
    wildcardProducers: new Set(),
    roundLosers: {},
    placements: {
      first: null,
      second: null,
      third: null
    },
    isComplete: false,
    finalPlacementStep: 0
  })
const tournamentDocRef = doc(db, 'tournaments', 'main')

useEffect(() => {
  const unsubscribe = onSnapshot(tournamentDocRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data()
      data.eliminatedProducers = new Set(data.eliminatedProducers || [])
      data.wildcardProducers = new Set(data.wildcardProducers || [])
      setTournamentState(data)
    }
  })
  return () => unsubscribe()
}, [])

const updateTournamentState = async (updates) => {
  const newState = {
    ...tournamentState,
    ...updates,
    eliminatedProducers: Array.from(
      updates.eliminatedProducers || tournamentState.eliminatedProducers
    ),
    wildcardProducers: Array.from(
      updates.wildcardProducers || tournamentState.wildcardProducers
    ),
  }
  await setDoc(tournamentDocRef, newState)
}
  const [showWildCardModal, setShowWildCardModal] = useState(false)
  const [selectedWildCards, setSelectedWildCards] = useState([])


  const roundLabels = {
    round1: '🎮 Round 1 (24 Producers)',
    wildCard1: '♠️ Wild Card Round 1',
    round2: '🎮 Round 2 (18 Producers)',
    wildCard2: '♠️ Wild Card Round 2 (Mini Battles)',
    round3: '🎮 Round 3 (12 Producers)',
    wildCard3: '♠️ Wild Card Round 3',
    round4: '🎮 Round 4 (9 Producers)',
    final: '🏆 Final Round'
  }

  useEffect(() => {
    if (tournamentStarted && tournamentState.rounds.round1.length === 0) {
      startTournament();
    }
  }, [tournamentStarted]);

  useEffect(() => {
  const unsub = onSnapshot(doc(db, 'tournaments', 'main'), (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      setTournamentState({
        ...data,
        eliminatedProducers: new Set(data.eliminatedProducers || []),
        wildcardProducers: new Set(data.wildcardProducers || []),
      });
    }
  });

  return () => unsub(); // cleanup listener on unmount
}, []);

  useEffect(() => {
  if (!tournamentState.isStarted) return;

  const tournamentRef = doc(db, 'tournaments', 'main');

  const unsubscribe = onSnapshot(tournamentRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data) {
        setTournamentState({
          ...data,
          eliminatedProducers: new Set(data.eliminatedProducers || []),
          wildcardProducers: new Set(data.wildcardProducers || []),
        });
      }
    }
  });

  return () => unsubscribe();
}, [tournamentState.isStarted]);


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

  const isWildCard = (producer, roundName) => {
    if (!producer) return false;

    if (roundName === tournamentState.currentRound && roundName.includes('wildCard')) {
      return tournamentState.wildcardProducers.has(producer.id);
    }

    return false;
  };


  const isLoserInRound = (producer, roundName) => {
    if (!producer) return false;
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

  const startTournament = () => {
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

    setTournamentState((prev) => ({
      ...prev,
      isStarted: true,
      rounds: { ...prev.rounds, round1: firstRoundMatches },
    }));
    onTournamentStart();
  };

const handleWinnerSelect = async (matchId, winner, losers, roundName) => {
  setTournamentState((prev) => {
    let newState = { ...prev };

    if (roundName === 'final') {
      let updatedPlacements = { ...prev.placements };
      if (prev.finalPlacementStep === 0) updatedPlacements.first = winner;
      else if (prev.finalPlacementStep === 1) updatedPlacements.second = winner;
      else if (prev.finalPlacementStep === 2) {
        const remaining = [prev.rounds.final[0].producer1, prev.rounds.final[0].producer2, prev.rounds.final[0].producer3].find(
          (p) => p.id !== prev.placements.first.id && p.id !== prev.placements.second.id
        );
        updatedPlacements.third = remaining;
      }

      newState = {
        ...newState,
        placements: updatedPlacements,
        finalPlacementStep: prev.finalPlacementStep + 1,
        isComplete: prev.finalPlacementStep === 2,
      };
    } else {
      const updatedRounds = {
        ...prev.rounds,
        [roundName]: prev.rounds[roundName].map((match) => match.id === matchId ? { ...match, winner } : match),
      };

      const updatedEliminated = new Set(prev.eliminatedProducers);
      const roundLosers = {
        ...prev.roundLosers,
        [roundName]: [
          ...(prev.roundLosers[roundName] || []),
          ...(Array.isArray(losers) ? losers.map((l) => l?.id) : [losers?.id]),
        ].filter(Boolean),
      };

      if (Array.isArray(losers)) {
        losers.forEach((l) => l && updatedEliminated.add(l.id));
      } else if (losers) {
        updatedEliminated.add(losers.id);
      }

      const allMatchesComplete = updatedRounds[roundName].every((match) => match.winner);

      if (allMatchesComplete) {
        const currentWinners = updatedRounds[roundName].map((m) => m.winner).filter(Boolean);
        const nextRound = getNextRound(roundName);
        let nextRoundMatches;

        switch (roundName) {
          case 'round1':
            nextRoundMatches = createPairMatches(
              Array.from(updatedEliminated).map((id) => producers.find((p) => p.id === id)).filter(Boolean),
              nextRound
            );
            break;
          case 'wildCard1':
            nextRoundMatches = createPairMatches(
              [...prev.rounds.round1.map((m) => m.winner).filter(Boolean), ...currentWinners],
              nextRound
            );
            break;
          case 'round2':
            nextRoundMatches = createTripleMatches(
              Array.from(updatedEliminated)
                .map((id) => producers.find((p) => p.id === id))
                .filter((p) => roundLosers['round2']?.includes(p.id)),
              nextRound
            );
            break;
          case 'wildCard2':
            nextRoundMatches = createPairMatches(
              [...prev.rounds.round2.map((m) => m.winner).filter(Boolean), ...currentWinners],
              nextRound
            );
            break;
          case 'round3':
            nextRoundMatches = createPairMatches(
              Array.from(updatedEliminated)
                .map((id) => producers.find((p) => p.id === id))
                .filter((p) => roundLosers['round3']?.includes(p.id)),
              nextRound
            );
            break;
          case 'wildCard3':
            nextRoundMatches = createTripleMatches(
              [...prev.rounds.round3.map((m) => m.winner).filter(Boolean), ...currentWinners],
              nextRound
            );
            break;
          case 'round4':
            nextRoundMatches = [{
              id: 'final-match',
              producer1: currentWinners[0],
              producer2: currentWinners[1],
              producer3: currentWinners[2],
              winner: null,
              roundName: nextRound,
            }];
            break;
        }

        newState = {
          ...newState,
          currentRound: nextRound,
          rounds: { ...updatedRounds, [nextRound]: nextRoundMatches },
          eliminatedProducers: updatedEliminated,
          roundLosers,
          wildcardProducers: roundName.includes('wildCard')
            ? new Set([...prev.wildcardProducers, ...currentWinners.map((w) => w.id)])
            : prev.wildcardProducers,
        };
      } else {
        newState = {
          ...newState,
          rounds: updatedRounds,
          eliminatedProducers: updatedEliminated,
          roundLosers,
        };
      }
    }

    // Save to Firestore
    const serializableState = {
      ...newState,
      eliminatedProducers: Array.from(newState.eliminatedProducers),
      wildcardProducers: Array.from(newState.wildcardProducers),
    };

    updateDoc(doc(db, 'tournaments', 'main'), serializableState).catch((err) =>
      console.error('Firestore update error:', err)
    );

    return newState;
  });

    const updatedDoc = {
    ...tournamentState,
    eliminatedProducers: Array.from(tournamentState.eliminatedProducers),
    wildcardProducers: Array.from(tournamentState.wildcardProducers),
  };

  try {
    await updateDoc(doc(db, 'tournaments', 'main'), updatedDoc);
  } catch (err) {
    console.error('Error updating Firestore:', err);
  }
};

  const getNextRound = (currentRound) => {
    const roundOrder = {
      round1: 'wildCard1',
      wildCard1: 'round2',
      round2: 'wildCard2',
      wildCard2: 'round3',
      round3: 'wildCard3',
      wildCard3: 'round4',
      round4: 'final',
    };
    return roundOrder[currentRound];
  };

  const createPairMatches = (producers, roundName) => {
    const matches = []
    const shuffledProducers = [...producers].sort(() => Math.random() - 0.5)
    
    for (let i = 0; i < shuffledProducers.length; i += 2) {
      matches.push({
        id: `${roundName}-M${i/2}`,
        producer1: shuffledProducers[i],
        producer2: shuffledProducers[i + 1] || null,
        winner: null,
        roundName
      })
    }
    return matches
  }

  const createTripleMatches = (producers, roundName) => {
    const matches = []
    const shuffledProducers = [...producers].sort(() => Math.random() - 0.5)
    
    for (let i = 0; i < shuffledProducers.length; i += 3) {
      matches.push({
        id: `${roundName}-M${i/3}`,
        producer1: shuffledProducers[i],
        producer2: shuffledProducers[i + 1] || null,
        producer3: shuffledProducers[i + 2] || null,
        winner: null,
        roundName
      })
    }
    return matches
  }

  const handleWildCardSelectionComplete = (selectedProducers) => {
    setShowWildCardModal(false)
    setTournamentState(prev => {
      const round2Winners = prev.rounds.round2
        .map(match => match.winner)
        .filter(Boolean)
      const wildCard2Winners = prev.rounds.wildCard2
        .map(match => match.winner)
        .filter(Boolean)
      
      const round3Matches = createPairMatches(
        [...round2Winners, ...wildCard2Winners, ...selectedProducers],
        'round3'
      )

      return {
        ...prev,
        currentRound: 'round3',
        rounds: {
          ...prev.rounds,
          round3: round3Matches
        },
        wildcardProducers: new Set([
          ...prev.wildcardProducers,
          ...selectedProducers.map(p => p.id)
        ])
      }
    })
  }

  const renderMatch = (match) => {
    if (!match) return null;

    const handleClick = (producer, opponent, isThirdProducer = false) => {
      if (!isClickable(producer, match)) return;

      handleWinnerSelect(
        match.id,
        producer,
        isThirdProducer ? [match.producer1, match.producer2].filter(p => p && p.id !== producer.id) : opponent,
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
      <div key={match.id} className="match-container">
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
                onClick={() => handleClick(producer, match.producer2, index > 1)}
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

  return (
    <div className="tournament-bracket" ref={bracketRef}>
      {!tournamentState.isStarted ? (
        <button className="start-tournament-btn" onClick={startTournament}>
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
