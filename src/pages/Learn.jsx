import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useApp } from '../lib/AppContext.jsx'
import { CONCEPTS, CONCEPT_GROUPS } from '../content/concepts.js'
import { SECTORS } from '../content/sectors.js'
import Icon from '../components/Icon.jsx'

const TABS = [['concepts', 'Concepts'], ['cards', 'Flashcards'], ['sectors', 'Sectors']]

export default function Learn() {
  const [params, setParams] = useSearchParams()
  const tab = params.get('tab') || 'concepts'
  return (
    <div className="page">
      <header className="page-head">
        <h1>Learn</h1>
        <p className="lede">Frameworks, AI and tech basics, and sector primers. Read one concept a day, then test yourself with flashcards.</p>
      </header>
      <div className="tabs big" role="tablist">
        {TABS.map(([k, l]) => (
          <button key={k} role="tab" aria-selected={tab === k} onClick={() => setParams(k === 'concepts' ? {} : { tab: k }, { replace: true })}>{l}</button>
        ))}
      </div>
      {tab === 'concepts' && <Concepts />}
      {tab === 'cards' && <Flashcards />}
      {tab === 'sectors' && <Sectors />}
    </div>
  )
}

function Concepts() {
  const [group, setGroup] = useState('all')
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(null)
  const needle = q.trim().toLowerCase()
  const list = CONCEPTS.filter((c) => (group === 'all' || c.group === group) &&
    (!needle || (c.title + ' ' + c.summary + ' ' + c.points.join(' ')).toLowerCase().includes(needle)))
  return (
    <>
      <div className="filters-row">
        <label className="search">
          <Icon name="search" size={18} />
          <span className="sr-only">Search concepts</span>
          <input type="search" placeholder="Search, e.g. RICE, north star, RAG" value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
      </div>
      <div className="type-chips">
        <button className="chip" aria-pressed={group === 'all'} onClick={() => setGroup('all')}>All</button>
        {CONCEPT_GROUPS.map((g) => <button key={g.id} className="chip" aria-pressed={group === g.id} onClick={() => setGroup(g.id)}>{g.label}</button>)}
      </div>
      {!list.length && <p className="empty">Nothing matches that search.</p>}
      <div className="concept-grid">
        {list.map((c) => {
          const isOpen = open === c.id
          return (
            <article key={c.id} className={'concept' + (isOpen ? ' open' : '')}>
              <button className="concept-head" onClick={() => setOpen(isOpen ? null : c.id)} aria-expanded={isOpen}>
                <span className="concept-group">{CONCEPT_GROUPS.find((g) => g.id === c.group).label}</span>
                <span className="concept-title">{c.title}</span>
                <span className="concept-sum">{c.summary}</span>
              </button>
              {isOpen && (
                <div className="concept-body">
                  <ul>{c.points.map((p) => <li key={p}>{p}</li>)}</ul>
                  {c.example && <p className="example"><strong>Example.</strong> {c.example}</p>}
                </div>
              )}
            </article>
          )
        })}
      </div>
    </>
  )
}

function Flashcards() {
  const { profile, saveProfile } = useApp()
  const [group, setGroup] = useState('all')
  const [hideKnown, setHideKnown] = useState(true)
  const [idx, setIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const known = profile.checklist || {}

  const deck = useMemo(() => CONCEPTS.filter((c) => group === 'all' || c.group === group)
    .flatMap((c) => c.cards.map((card, i) => ({ id: `fc.${c.id}.${i}`, q: card[0], a: card[1], topic: c.title }))), [group])
  const cards = hideKnown ? deck.filter((c) => !known[c.id]) : deck
  const card = cards[idx % Math.max(1, cards.length)]
  const knownCount = deck.filter((c) => known[c.id]).length

  const mark = async (isKnown) => {
    if (!card) return
    setFlipped(false)
    if (isKnown !== !!known[card.id]) {
      const checklist = { ...known }
      if (isKnown) checklist[card.id] = true; else delete checklist[card.id]
      saveProfile({ checklist })
      if (!(hideKnown && isKnown)) setIdx(idx + 1)
    } else setIdx(idx + 1)
  }

  return (
    <>
      <div className="type-chips">
        <button className="chip" aria-pressed={group === 'all'} onClick={() => { setGroup('all'); setIdx(0) }}>All</button>
        {CONCEPT_GROUPS.map((g) => <button key={g.id} className="chip" aria-pressed={group === g.id} onClick={() => { setGroup(g.id); setIdx(0) }}>{g.label}</button>)}
      </div>
      <div className="fc-meta">
        <span>{knownCount} of {deck.length} known</span>
        <label className="toggle"><input type="checkbox" checked={hideKnown} onChange={(e) => { setHideKnown(e.target.checked); setIdx(0) }} /><span>Hide cards I know</span></label>
      </div>
      {!card ? (
        <div className="panel center-text">
          <h2>You know every card here</h2>
          <p className="muted">Untick "Hide cards I know" to review them again.</p>
        </div>
      ) : (
        <>
          <button className={'flashcard' + (flipped ? ' flipped' : '')} onClick={() => setFlipped(!flipped)} aria-live="polite">
            <span className="fc-topic">{card.topic}</span>
            <span className="fc-text">{flipped ? card.a : card.q}</span>
            <span className="fc-hint">{flipped ? 'Answer' : 'Tap to see the answer'}</span>
          </button>
          <div className="fc-actions">
            <button className="btn" onClick={() => mark(false)}>Still learning</button>
            <button className="btn primary" onClick={() => mark(true)}><Icon name="check" size={16} /> I know this</button>
          </div>
          <p className="muted center-text small-note">Card {(idx % cards.length) + 1} of {cards.length}</p>
        </>
      )}
    </>
  )
}

function Sectors() {
  const [open, setOpen] = useState(null)
  return (
    <div className="sector-grid">
      {SECTORS.map((s) => {
        const isOpen = open === s.id
        return (
          <article key={s.id} className={'sector' + (isOpen ? ' open' : '')}>
            <button className="concept-head" onClick={() => setOpen(isOpen ? null : s.id)} aria-expanded={isOpen}>
              <span className="concept-title">{s.name}</span>
              <span className="concept-sum">{s.players}</span>
            </button>
            {isOpen && (
              <div className="concept-body sector-body">
                <h3>How it works</h3><p>{s.model}</p>
                <h3>Metrics PMs watch</h3><ul>{s.metrics.map((m) => <li key={m}>{m}</li>)}</ul>
                <h3>Common pitfalls</h3><ul>{s.pitfalls.map((m) => <li key={m}>{m}</li>)}</ul>
                <h3>Interview angles</h3><ul>{s.angles.map((m) => <li key={m}>{m}</li>)}</ul>
              </div>
            )}
          </article>
        )
      })}
    </div>
  )
}
