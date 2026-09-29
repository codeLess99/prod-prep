import { useState } from 'react'
import { useApp } from '../lib/AppContext.jsx'
import EntryList from '../components/EntryList.jsx'
import { FIELD_SETS } from '../content/weeks.js'

const GROUPS = [
  ['all', 'Everything'],
  ['feature', 'Feature bank'],
  ['journey', 'Journey bank'],
  ['metric', 'Metric bank'],
  ['story', 'Story bank'],
  ['deepdive', 'Deep dives'],
  ['company', 'Companies'],
  ['case', 'Cases'],
  ['mock', 'Mocks'],
  ['product', 'Products analysed'],
]

export default function Library() {
  const { entries } = useApp()
  const [kind, setKind] = useState('all')
  const [q, setQ] = useState('')
  const needle = q.trim().toLowerCase()
  const items = entries.filter((e) => e.kind !== 'hours' && (kind === 'all' || e.kind === kind))
    .filter((e) => !needle || (e.title + ' ' + JSON.stringify(e.data || {})).toLowerCase().includes(needle))

  return (
    <div className="page">
      <header className="page-head">
        <h1>Your banks</h1>
        <p className="lede">Everything you have logged, in one place. Skim this the night before an interview.</p>
      </header>
      <section className="panel">
        <div className="filters">
          <label className="sr-only" htmlFor="search">Search entries</label>
          <input id="search" type="search" placeholder="Search titles and notes" value={q} onChange={(e) => setQ(e.target.value)} />
          <div className="chips">
            {GROUPS.map(([k, label]) => {
              const n = k === 'all' ? entries.filter((e) => e.kind !== 'hours').length : entries.filter((e) => e.kind === k).length
              return <button key={k} className="chip" aria-pressed={kind === k} onClick={() => setKind(k)}>{label} <span className="tab-count">{n}</span></button>
            })}
          </div>
        </div>
        {kind === 'story' && <StoryCoverage entries={entries} />}
        <EntryList items={items} showWeek empty={needle ? 'Nothing matches that search.' : 'Nothing here yet. Add entries from any week page.'} />
      </section>
    </div>
  )
}

// Which behavioural themes already have at least one story.
function StoryCoverage({ entries }) {
  const themes = FIELD_SETS.story.find((f) => f.name === 'themes').options
  const covered = new Set(entries.filter((e) => e.kind === 'story').flatMap((e) => e.data?.themes || []))
  return (
    <div className="coverage">
      <p className="muted">Themes covered by your stories ({covered.size} of {themes.length}). Aim to have at least one story for each.</p>
      <div className="chips">{themes.map((t) => <span key={t} className={'chip static' + (covered.has(t) ? ' on' : '')}>{t}</span>)}</div>
    </div>
  )
}
