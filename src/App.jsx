import { useState } from 'react'
import './styles/styles.css'
import TournamentBracket from './components/TournamentBracket'

function App() {
  const [producers, setProducers] = useState([])
  const [producerName, setProducerName] = useState('')
  const [error, setError] = useState('')
  const [tournamentStarted, setTournamentStarted] = useState(false)
  const [isPanelExpanded, setIsPanelExpanded] = useState(false)

  const handleAddProducer = () => {
    if (!producerName.trim()) {
      setError('Please enter a producer name')
      return
    }

    if (producers.length >= 24) {
      setError('Maximum 24 producers allowed')
      return
    }

    const newProducer = {
      id: Date.now().toString(),
      name: producerName.trim(),
      isWildCard: false,
      isEliminated: false
    }

    setProducers([...producers, newProducer])
    setProducerName('')
    setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    handleAddProducer()
  }

  const resetTournament = () => {
    if (window.confirm('Are you sure you want to reset the tournament?')) {
      setProducers([])
      setTournamentStarted(false)
    }
  }

  const togglePanel = () => {
    setIsPanelExpanded(!isPanelExpanded)
  }

  return (
    <div className="app-container">
      <header className="tournament-header">
        <img src="/WILD-CARD-BEAT-BATTLE-LOGO-(TRANSPARENT).png" alt="Tournament Logo" className="logo" />
      </header>

      <div className="main-content">
        <div className={`left-panel ${isPanelExpanded ? 'expanded' : ''}`}>
          <div className="left-panel-tab" onClick={togglePanel}>
            ⋮
          </div>
          <div className="producer-input">
            <h2>Add Producers ({producers.length}/24)</h2>
            <form onSubmit={handleSubmit} className="input-group">
              <input
                type="text"
                value={producerName}
                onChange={(e) => setProducerName(e.target.value)}
                placeholder="Enter producer name"
                maxLength={30}
                autoFocus
              />
              <button type="submit">Add</button>
            </form>
            {error && <div className="error">{error}</div>}
          </div>

          <div className="producers-list">
            <div className="producers-header">
              <h2>Tournament Lineup</h2>
              {producers.length > 0 && (
                <button 
                  className="reset-button"
                  onClick={resetTournament}
                >
                  Reset
                </button>
              )}
            </div>
            {producers.map(producer => (
              <div key={producer.id} className="producer-item">
                <span>{producer.name}</span>
                <button 
                  onClick={() => {
                    setProducers(producers.filter(p => p.id !== producer.id))
                  }}
                  className="remove-button"
                >
                  ×
                </button>
              </div>
            ))}
            {producers.length === 0 && (
              <p className="empty-message">No producers added yet</p>
            )}
          </div>
        </div>

        {producers.length >= 2 ? (
          <TournamentBracket 
            producers={producers}
            onTournamentStart={() => setTournamentStarted(true)}
            tournamentStarted={tournamentStarted}
          />
        ) : (
          <div className="tournament-bracket">
            <h2>Add at least 2 producers to start the tournament</h2>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
