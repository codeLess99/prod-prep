import { useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useApp } from '../lib/AppContext.jsx'
import { QUESTIONS } from '../content/questions.js'
import { CASE_TYPES, TYPE_ORDER } from '../content/caseTypes.js'
import Icon from '../components/Icon.jsx'

const LEVELS = ['Easy', 'Medium', 'Hard']
const PAGE = 30

export default function Practice() {
  const { entries } = useApp()
  const [params, setParams] = useSearchParams()
  const nav = useNavigate()
  const type = params.get('type') || 'all'
  const [level, setLevel] = useState('all')
  const [q, setQ] = useState('')
  const [fresh, setFresh] = useState(false)
  const [shown, setShown] = useState(PAGE)

  const attempts = useMemo(() => {
    const m = {}
    entries.forEach((e) => { const k = e.data?.q; if (k) m[k] = (m[k] || 0) + 1 })
    return m
  }, [entries])

  const needle = q.trim().toLowerCase()
  const list = QUESTIONS.filter((x) =>
    (type === 'all' || x.t === type) &&
    (level === 'all' || x.l === level) &&
    (!fresh || !attempts[x.q]) &&
    (!needle || (x.q + ' ' + (x.c || '')).toLowerCase().includes(needle)))

  const setType = (t) => { setShown(PAGE); setParams(t === 'all' ? {} : { type: t }, { replace: true }) }
  const surprise = () => {
    const pool = list.filter((x) => !attempts[x.q])
    const pick = (pool.length ? pool : list)[Math.floor(Math.random() * (pool.length || list.length))]
    if (pick) nav(`/practice/session?q=${encodeURIComponent(pick.q)}`)
  }
  const doneCount = QUESTIONS.filter((x) => attempts[x.q]).length

  return (
    <div className="page">
      <header className="page-head split">
        <div>
          <h1>Practice</h1>
          <p className="lede">Pick a case, start the timer and work through it step by step, then check yourself against what interviewers look for. {doneCount} of {QUESTIONS.length} tried so far.</p>
        </div>
        <button className="btn primary" onClick={surprise} disabled={!list.length}><Icon name="shuffle" size={18} /> Surprise me</button>
      </header>

      <div className="type-chips" role="tablist" aria-label="Case type">
        <button role="tab" aria-selected={type === 'all'} className="chip" onClick={() => setType('all')}>All</button>
        {TYPE_ORDER.map((t) => (
          <button role="tab" key={t} aria-selected={type === t} className="chip" onClick={() => setType(t)}>{CASE_TYPES[t].short}</button>
        ))}
      </div>

      {type !== 'all' && <p className="type-intro">{CASE_TYPES[type].intro} <span className="muted">About {CASE_TYPES[type].minutes} minutes.</span></p>}

      <div className="filters-row">
        <label className="search">
          <Icon name="search" size={18} />
          <span className="sr-only">Search questions</span>
          <input type="search" placeholder="Search questions or companies" value={q} onChange={(e) => { setQ(e.target.value); setShown(PAGE) }} />
        </label>
        <select aria-label="Difficulty" value={level} onChange={(e) => setLevel(e.target.value)}>
          <option value="all">Any difficulty</option>
          {LEVELS.map((l) => <option key={l}>{l}</option>)}
        </select>
        <label className="toggle">
          <input type="checkbox" checked={fresh} onChange={(e) => setFresh(e.target.checked)} />
          <span>Not tried yet</span>
        </label>
      </div>

      {list.length === 0 ? (
        <p className="empty">No questions match. Clear a filter to see more.</p>
      ) : (
        <ul className="qbank">
          {list.slice(0, shown).map((x) => (
            <li key={x.t + x.q}>
              <div className="qb-main">
                <span className="qb-q">{x.q}</span>
                <span className="qb-tags">
                  <span className="tag" data-type={x.t}>{CASE_TYPES[x.t].short}</span>
                  {x.l && <span className="tag plain">{x.l}</span>}
                  {x.c && <span className="tag plain">{x.c}</span>}
                  {attempts[x.q] && <span className="tag done"><Icon name="check" size={12} /> Tried {attempts[x.q] > 1 ? `${attempts[x.q]}×` : ''}</span>}
                </span>
              </div>
              <div className="qb-actions">
                <Link className="btn small" to={`/practice/session?q=${encodeURIComponent(x.q)}`} aria-label={`Practise: ${x.q}`}><Icon name="play" size={14} /> Practise</Link>
              </div>
            </li>
          ))}
        </ul>
      )}
      {shown < list.length && (
        <button className="btn wide more" onClick={() => setShown(shown + PAGE)}>Show more ({list.length - shown} left)</button>
      )}
      <p className="muted small-note">Got a question from a friend or a senior? <Link to="/practice/session?custom=1">Practise your own question</Link>.</p>
    </div>
  )
}
