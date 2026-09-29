import { Link, useParams, Navigate } from 'react-router-dom'
import { useApp } from '../lib/AppContext.jsx'
import { COMPANIES, COMPANY_ALIASES, COMPANY_MATCH } from '../content/companies.js'
import { QUESTIONS } from '../content/questions.js'
import { CASE_TYPES } from '../content/caseTypes.js'
import { WEEKS, trackerKey } from '../content/weeks.js'
import LogButton from '../components/LogButton.jsx'
import EntryList from '../components/EntryList.jsx'
import Icon from '../components/Icon.jsx'

const companyTracker = WEEKS[5].trackers.find((t) => t.id === 'companies')

function questionsFor(co) {
  const words = COMPANY_MATCH[co.id] || []
  return QUESTIONS.filter((q) => COMPANY_ALIASES[q.c] === co.id || words.some((w) => new RegExp(`\\b${w.replace('.', '\\.')}\\b`).test(q.q)))
}

export function Companies() {
  const { entries } = useApp()
  const prepared = new Set(entries.filter((e) => e.tracker === trackerKey(6, 'companies')).map((e) => e.title.toLowerCase()))
  return (
    <div className="page">
      <header className="page-head">
        <h1>Companies</h1>
        <p className="lede">What each company builds, how it makes money, what its PMs measure, and questions reported from past interviews. Revise the night before.</p>
      </header>
      <div className="company-grid">
        {COMPANIES.map((c) => {
          const n = questionsFor(c).length
          const done = prepared.has(c.name.toLowerCase())
          return (
            <Link key={c.id} to={`/companies/${c.id}`} className="company-card">
              <span className="cc-name">{c.name}{done && <span className="tag done"><Icon name="check" size={12} /> Notes</span>}</span>
              <span className="cc-sector">{c.sector}</span>
              <span className="cc-line">{c.line}</span>
              <span className="cc-count">{c.products ? 'Full primer' : 'Quick facts'}{n ? ` · ${n} questions` : ''}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export function CompanyPage() {
  const { id } = useParams()
  const { entries } = useApp()
  const co = COMPANIES.find((c) => c.id === id)
  if (!co) return <Navigate to="/companies" replace />
  const qs = questionsFor(co)
  const notes = entries.filter((e) => e.tracker === trackerKey(6, 'companies') && e.title.toLowerCase() === co.name.toLowerCase())

  return (
    <div className="page">
      <Link to="/companies" className="back-link"><Icon name="back" size={16} /> All companies</Link>
      <header className="page-head">
        <p className="kicker">{co.sector}</p>
        <h1>{co.name}</h1>
        <p className="lede">{co.line}</p>
      </header>

      {co.products && (
        <div className="grid-2">
          <section className="panel">
            <h2>Products</h2>
            <ul className="plain">{co.products.map((p) => <li key={p}>{p}</li>)}</ul>
            {co.ai && <><h3>What they're doing with AI</h3><p>{co.ai}</p></>}
          </section>
          <section className="panel">
            {co.model && <><h2>How it makes money</h2><p>{co.model}</p></>}
            {co.metrics && <><h3>Metrics that matter</h3><ul className="plain">{co.metrics.map((p) => <li key={p}>{p}</li>)}</ul></>}
            {co.competitors && <><h3>Competition</h3><p>{co.competitors}</p></>}
          </section>
        </div>
      )}

      {co.know && (
        <section className="panel">
          <h2>Good to know</h2>
          <ul className="plain">{co.know.map((p) => <li key={p}>{p}</li>)}</ul>
        </section>
      )}

      <section className="panel">
        <div className="panel-head">
          <h2>Your notes</h2>
          <LogButton week={6} tracker={companyTracker} prefill={{ title: co.name }} className="btn small primary">{notes.length ? 'Add more notes' : 'Start notes'}</LogButton>
        </div>
        <EntryList items={notes} empty="Write down the strategy, recent launches, key metrics and your 'why this company' answer." />
      </section>

      <section className="panel">
        <h2>Questions to practise</h2>
        {!qs.length ? <p className="empty">No questions tagged for this company yet. Practise its sector in the question bank.</p> : (
          <ul className="questions">
            {qs.map((q) => (
              <li key={q.q}>
                <span>{q.q} <span className="tag" data-type={q.t}>{CASE_TYPES[q.t].short}</span></span>
                <Link className="btn small ghost" to={`/practice/session?q=${encodeURIComponent(q.q)}`}>Practise</Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
