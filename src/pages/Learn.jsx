import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useApp } from '../lib/AppContext.jsx'
import { CONCEPTS, CONCEPT_GROUPS } from '../content/concepts.js'
import { SECTORS } from '../content/sectors.js'
import Icon from '../components/Icon.jsx'
import { GLOSSARY, tokenize } from '../content/glossary.js'
import { Term, linkify } from '../components/Glossary.jsx'
import { PREREQS } from '../content/prereqs.js'

const TABS = [['concepts', 'Concepts'], ['cards', 'Flashcards'], ['sectors', 'Sectors'], ['glossary', 'Glossary']]

export default function Learn() {
  const [params, setParams] = useSearchParams()
  const tab = params.get('tab') || 'concepts'
  return (
    <div className="page">
      <header className="page-head">
        <h1>Learn</h1>
        <p className="lede">Frameworks, AI and tech basics, and sector primers. Read one concept a day, then test yourself with flashcards. Tap any <span className="term demo">underlined term</span> for a quick explanation.</p>
      </header>
      <div className="tabs big" role="tablist">
        {TABS.map(([k, l]) => (
          <button key={k} role="tab" aria-selected={tab === k} onClick={() => setParams(k === 'concepts' ? {} : { tab: k }, { replace: true })}>{l}</button>
        ))}
      </div>
      {tab === 'concepts' && <Concepts />}
      {tab === 'cards' && <Flashcards />}
      {tab === 'sectors' && <Sectors />}
      {tab === 'glossary' && <Glossary />}
    </div>
  )
}

function Concepts() {
  const [params] = useSearchParams()
  const target = params.get('c')
  const [group, setGroup] = useState('all')
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(target)
  const refs = useRef({})
  const [prevTarget, setPrevTarget] = useState(target)
  if (prevTarget !== target) { setPrevTarget(target); if (target) { setOpen(target); setGroup('all'); setQ('') } }
  useEffect(() => {
    if (target) refs.current[target]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [target])

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
          const seen = new Set()
          const toggle = () => setOpen(isOpen ? null : c.id)
          return (
            <article key={c.id} ref={(el) => { refs.current[c.id] = el }} className={'concept' + (isOpen ? ' open' : '')}>
              <div className="concept-head" onClick={toggle}>
                <span className="concept-group">{CONCEPT_GROUPS.find((g) => g.id === c.group).label}</span>
                <button className="concept-title" onClick={(e) => { e.stopPropagation(); toggle() }} aria-expanded={isOpen}>{c.title}</button>
                <span className="concept-sum">{linkify(c.summary, seen, c.title)}</span>
              </div>
              {isOpen && (
                <div className="concept-body">
                  <ConceptPath id={c.id} />
                  <ul>{c.points.map((p) => <li key={p}>{linkify(p, seen, c.title)}</li>)}</ul>
                  {c.example && <p className="example"><strong>Example.</strong> {linkify(c.example, seen, c.title)}</p>}
                </div>
              )}
            </article>
          )
        })}
      </div>
    </>
  )
}

// "Learn first" and "Leads to" links for an open concept.
function ConceptPath({ id }) {
  const byId = (x) => CONCEPTS.find((c) => c.id === x)
  const before = (PREREQS[id] || []).map(byId).filter(Boolean)
  const after = CONCEPTS.filter((c) => (PREREQS[c.id] || []).includes(id))
  if (!before.length && !after.length) return null
  const row = (label, list) => list.length > 0 && (
    <p className="path-row">
      <span className="path-label">{label}</span>
      {list.map((c) => <Link key={c.id} className="path-chip" to={`/learn?c=${c.id}`}>{c.title}</Link>)}
    </p>
  )
  return (
    <div className="concept-path">
      {row('Learn first', before)}
      {row('Leads to', after)}
    </div>
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
          <CardTerms text={card.q + ' ' + (flipped ? card.a : '')} />
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
        const seen = new Set()
        return (
          <article key={s.id} className={'sector' + (isOpen ? ' open' : '')}>
            <button className="concept-head" onClick={() => setOpen(isOpen ? null : s.id)} aria-expanded={isOpen}>
              <span className="concept-title">{s.name}</span>
              <span className="concept-sum">{s.players}</span>
            </button>
            {isOpen && (
              <div className="concept-body sector-body">
                <h3>How it works</h3><p>{linkify(s.model, seen)}</p>
                <h3>Metrics PMs watch</h3><ul>{s.metrics.map((m) => <li key={m}>{linkify(m, seen)}</li>)}</ul>
                <h3>Common pitfalls</h3><ul>{s.pitfalls.map((m) => <li key={m}>{linkify(m, seen)}</li>)}</ul>
                <h3>Interview angles</h3><ul>{s.angles.map((m) => <li key={m}>{linkify(m, seen)}</li>)}</ul>
              </div>
            )}
          </article>
        )
      })}
    </div>
  )
}

function CardTerms({ text }) {
  const terms = tokenize(text).filter((p) => typeof p !== 'string')
  if (!terms.length) return null
  return (
    <p className="card-terms">
      <span>Terms on this card:</span>
      {terms.map((p) => <Term key={p.g.id} g={p.g}>{p.g.t}</Term>)}
    </p>
  )
}

function Glossary() {
  const [q, setQ] = useState('')
  const needle = q.trim().toLowerCase()
  const list = useMemo(() => [...GLOSSARY].sort((a, b) => a.t.localeCompare(b.t)), [])
  const shown = list.filter((g) => !needle || (g.t + ' ' + (g.full || '') + ' ' + g.m.join(' ') + ' ' + g.d).toLowerCase().includes(needle))
  const byLetter = {}
  shown.forEach((g) => { const L = /[a-z]/i.test(g.t[0]) ? g.t[0].toUpperCase() : '#'; (byLetter[L] = byLetter[L] || []).push(g) })
  return (
    <>
      <div className="filters-row">
        <label className="search">
          <Icon name="search" size={18} />
          <span className="sr-only">Search the glossary</span>
          <input type="search" placeholder={`Search ${GLOSSARY.length} terms, e.g. CAC, churn, GMV`} value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
      </div>
      {!shown.length && <p className="empty">No term matches that. Try a shorter search.</p>}
      {Object.keys(byLetter).sort().map((L) => (
        <section key={L} className="gloss-group">
          <h2 className="gloss-letter">{L}</h2>
          <dl className="gloss-list">
            {byLetter[L].map((g) => (
              <div key={g.id} className="gloss-item">
                <dt>{g.t}{g.full && <span className="term-full">{g.full}</span>}</dt>
                <dd>{g.d}{g.c && <> <Link className="term-more" to={`/learn?c=${g.c}`}>Read more →</Link></>}</dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </>
  )
}
