import { useState, useCallback } from 'react'
import Header from './components/Header.jsx'
import InputPanel from './components/InputPanel.jsx'
import ErrorBanner from './components/ErrorBanner.jsx'
import ResultsPanel from './components/ResultsPanel.jsx'
import styles from './App.module.css'

const EXAMPLE = [
  'A->B', 'A->C', 'B->D', 'C->E', 'E->F',
  'X->Y', 'Y->Z', 'Z->X',
  'P->Q', 'Q->R',
  'G->H', 'G->I',
  'hello', '1->2', 'A->'
].join(', ')

export default function App() {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [results, setResults] = useState(null)

  const parseInput = (raw) =>
    raw.split(/[\n,]+/).map(s => s.trim()).filter(s => s.length > 0)

  const handleSubmit = useCallback(async () => {
    const data = parseInput(input)
    if (data.length === 0) { setError('Please enter at least one node edge.'); return }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/bfhl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || `HTTP ${res.status}`)
      }
      const json = await res.json()
      setResults(json)
    } catch (e) {
      setError('API Error: ' + e.message)
    } finally {
      setLoading(false)
    }
  }, [input])

  const handleLoadExample = () => setInput(EXAMPLE)
  const handleClear = () => { setInput(''); setResults(null); setError(null) }

  return (
    <div className={styles.container}>
      <Header />
      <InputPanel
        value={input}
        onChange={setInput}
        onSubmit={handleSubmit}
        onLoadExample={handleLoadExample}
        onClear={handleClear}
        loading={loading}
      />
      <ErrorBanner message={error} />
      {results && <ResultsPanel data={results} />}
    </div>
  )
}
