import { useState } from 'react'
import { GUESS_DATA, NSM_EXAMPLES, COUNTER_METRICS } from '../content/reference.js'

const IMPACT = [[3, 'Massive'], [2, 'High'], [1, 'Medium'], [0.5, 'Low'], [0.25, 'Minimal']]
const CONF = [[100, 'High'], [80, 'Medium'], [50, 'Low']]
const blank = (n) => ({ id: Date.now() + n, name: '', reach: '', impact: 1, conf: 80, effort: '', i: 5, c: 5, e: 5 })

export default function Tools() {
  const [mode, setMode] = useState('rice')
  const [rows, setRows] = useState(() => [
    { ...blank(1), name: 'One-click checkout', reach: 50000, impact: 2, conf: 80, effort: 3, i: 8, c: 8, e: 4 },
    { ...blank(2), name: 'Gift wrapping option', reach: 10000, impact: 1, conf: 100, effort: 1, i: 4, c: 9, e: 9 },
  ])
  const set = (id, k, v) => setRows(rows.map((r) => (r.id === id ? { ...r, [k]: v } : r)))
  const score = (r) => mode === 'rice'
    ? (Number(r.effort) > 0 ? (Number(r.reach) * r.impact * (r.conf / 100)) / Number(r.effort) : 0)
    : Number(r.i) * Number(r.c) * Number(r.e)
  const ranked = [...rows].sort((a, b) => score(b) - score(a))
  const top = ranked[0]?.id

  return (
    <div className="page">
      <header className="page-head">
        <h1>Tools</h1>
        <p className="lede">A prioritisation calculator and the reference numbers you'll want during practice.</p>
      </header>

      <section className="panel">
        <div className="panel-head">
          <h2>Prioritisation calculator</h2>
          <div className="seg-toggle" role="tablist">
            <button role="tab" aria-selected={mode === 'rice'} onClick={() => setMode('rice')}>RICE</button>
            <button role="tab" aria-selected={mode === 'ice'} onClick={() => setMode('ice')}>ICE</button>
          </div>
        </div>
        <p className="muted">{mode === 'rice'
          ? 'Score = Reach × Impact × Confidence ÷ Effort. Reach is users per period; effort is person-months.'
          : 'Score = Impact × Confidence × Ease, each from 1 to 10. Quicker, but leaves out reach.'}</p>
        <div className="calc">
          {ranked.map((r) => (
            <div key={r.id} className={'calc-row' + (r.id === top && score(r) > 0 ? ' top' : '')}>
              <input className="calc-name" aria-label="Idea" placeholder="Idea or feature" value={r.name} onChange={(e) => set(r.id, 'name', e.target.value)} />
              {mode === 'rice' ? (
                <>
                  <label><span>Reach</span><input type="number" min="0" value={r.reach} onChange={(e) => set(r.id, 'reach', e.target.value)} /></label>
                  <label><span>Impact</span><select value={r.impact} onChange={(e) => set(r.id, 'impact', Number(e.target.value))}>{IMPACT.map(([v, l]) => <option key={v} value={v}>{l} ({v})</option>)}</select></label>
                  <label><span>Confidence</span><select value={r.conf} onChange={(e) => set(r.id, 'conf', Number(e.target.value))}>{CONF.map(([v, l]) => <option key={v} value={v}>{l} ({v}%)</option>)}</select></label>
                  <label><span>Effort</span><input type="number" min="0" step="0.5" value={r.effort} onChange={(e) => set(r.id, 'effort', e.target.value)} /></label>
                </>
              ) : (
                <>
                  {[['i', 'Impact'], ['c', 'Confidence'], ['e', 'Ease']].map(([k, l]) => (
                    <label key={k}><span>{l}</span><input type="number" min="1" max="10" value={r[k]} onChange={(e) => set(r.id, k, e.target.value)} /></label>
                  ))}
                </>
              )}
              <output className="calc-score" aria-label="Score">{Math.round(score(r)).toLocaleString()}</output>
              <button className="icon-btn" aria-label="Remove idea" onClick={() => setRows(rows.filter((x) => x.id !== r.id))}>×</button>
            </div>
          ))}
        </div>
        <div className="row-actions">
          <button className="btn small" onClick={() => setRows([...rows, blank(rows.length)])}>Add an idea</button>
        </div>
        <p className="muted small-note">RICE works best comparing ideas within the same product. Across very different bets, explain your judgement instead of hiding behind the score.</p>
      </section>

      <div className="grid-2">
        <section className="panel">
          <h2>North star examples</h2>
          <table className="table"><tbody>{NSM_EXAMPLES.map(([a, b]) => <tr key={a}><td>{a}</td><td>{b}</td></tr>)}</tbody></table>
        </section>
        <section className="panel">
          <h2>Counter metrics</h2>
          <p className="muted">If you push the left one, watch the right one.</p>
          <table className="table"><thead><tr><th scope="col">Primary</th><th scope="col">Watch</th></tr></thead>
            <tbody>{COUNTER_METRICS.map(([a, b]) => <tr key={a}><td>{a}</td><td>{b}</td></tr>)}</tbody></table>
        </section>
      </div>

      <section className="panel">
        <h2>Guesstimate numbers for India</h2>
        <p className="muted">Rounded to make mental maths easy. State them as assumptions.</p>
        <div className="ref-grid">
          {GUESS_DATA.map((g) => (
            <div key={g.group}>
              <h3>{g.group}</h3>
              <table className="table"><tbody>{g.rows.map(([k, v]) => <tr key={k}><td>{k}</td><td className="num">{v}</td></tr>)}</tbody></table>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
