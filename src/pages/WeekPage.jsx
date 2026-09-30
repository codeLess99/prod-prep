import { useState } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { useApp, currentWeek } from '../lib/AppContext.jsx'
import { WEEKS, trackerKey } from '../content/weeks.js'
import { QUESTIONS } from '../content/questions.js'
import { CASE_TYPES } from '../content/caseTypes.js'
import { WEEK_TIPS } from '../content/reference.js'
import LogButton, { Meter } from '../components/LogButton.jsx'
import EntryList from '../components/EntryList.jsx'
import { G } from '../components/Glossary.jsx'

const TIME_TRACKER = { id: 'time', label: 'Study time', kind: 'hours', min: 0 }

export default function WeekPage() {
  const { n } = useParams()
  const week = WEEKS[Number(n) - 1]
  const { profile, progress, entries, toggleCheck } = useApp()
  const [tab, setTab] = useState(null)
  if (!week) return <Navigate to="/plan" replace />

  const wp = progress.weeks[week.n - 1]
  const cw = currentWeek(profile.start_date)
  const activeTab = tab && week.trackers.some((t) => t.id === tab) ? tab : week.trackers[0].id
  const tracker = wp.trackers.find((t) => t.id === activeTab)
  const trackerEntries = entries.filter((e) => e.tracker === trackerKey(week.n, activeTab))
  const timeEntries = entries.filter((e) => e.tracker === trackerKey(week.n, 'time'))

  return (
    <div className="page week" style={{ '--c': week.color }}>
      <header className="page-head week-head">
        <p className="week-no">Week {week.n}{week.n === cw ? ' (this week)' : ''}</p>
        <h1>{week.title}</h1>
        <p className="lede">{week.summary}</p>
        <div className="week-stats">
          <div className="meter big" role="progressbar" aria-label="Week progress" aria-valuenow={Math.round(wp.pct * 100)} aria-valuemin={0} aria-valuemax={100}>
            <span style={{ width: wp.pct * 100 + '%', background: week.color }} />
          </div>
          <span>{Math.round(wp.pct * 100)}% done</span>
          <span>{Math.round(wp.hours * 10) / 10} of about {week.hours} hours</span>
          <LogButton week={week.n} tracker={TIME_TRACKER} className="btn small ghost">Log study time</LogButton>
        </div>
      </header>

      <section className="panel">
        <h2>Your log</h2>
        <div className="tabs" role="tablist">
          {wp.trackers.map((t) => (
            <button key={t.id} role="tab" aria-selected={t.id === activeTab} onClick={() => setTab(t.id)}>
              {t.label} <span className="tab-count">{t.count}</span>
            </button>
          ))}
          {timeEntries.length > 0 && (
            <button role="tab" aria-selected={activeTab === 'time'} onClick={() => setTab('time')}>
              Study time <span className="tab-count">{timeEntries.length}</span>
            </button>
          )}
        </div>
        {activeTab === 'time' ? (
          <EntryList items={timeEntries} empty="" />
        ) : (
          <>
            <div className="tracker-bar">
              <Meter count={tracker.count} min={tracker.min} max={tracker.max} color={week.color} />
              <LogButton week={week.n} tracker={tracker} className="btn primary small">Add {tracker.bank ? 'to bank' : 'entry'}</LogButton>
            </div>
            <EntryList items={trackerEntries} empty={tracker.bank ? 'Your bank is empty. Add the first item.' : 'No entries yet. Pick a question below or add your own.'} />
          </>
        )}
      </section>

      <div className="grid-2">
        <section className="panel">
          <h2>What to do</h2>
          <ul className="checklist">
            {week.todo.map((t, i) => {
              const key = `w${week.n}.todo.${i}`
              const done = !!profile.checklist?.[key]
              return (
                <li key={key}>
                  <label>
                    <input type="checkbox" checked={done} onChange={() => toggleCheck(key)} />
                    <span>{t}</span>
                  </label>
                </li>
              )
            })}
          </ul>
        </section>
        <section className="panel">
          <h2>What this means</h2>
          <ul className="plain">{week.means.map((m) => <li key={m}>{m}</li>)}</ul>
          <h3>By the end of the week</h3>
          <ul className="plain">{week.outputs.map((m) => <li key={m}>{m}</li>)}</ul>
        </section>
      </div>

      {week.approach && (
        <section className="panel">
          <h2>How to approach a case</h2>
          <ol className="steps">
            {week.approach.map(([t, d]) => <li key={t}><strong>{t}</strong><span>{d}</span></li>)}
          </ol>
        </section>
      )}

      {week.n === 1 && <WeekOneGuide week={week} />}

      <section className="panel">
        <div className="panel-head"><h2>Practise this week</h2><Link className="btn small ghost" to={`/practice?type=${week.practice[0]}`}>Open the question bank</Link></div>
        <div className="q-groups">
          {week.practice.map((t) => {
            const done = new Set(entries.map((e) => e.data?.q).filter(Boolean))
            const qs = QUESTIONS.filter((x) => x.t === t)
            const picks = [...qs.filter((x) => !done.has(x.q)), ...qs.filter((x) => done.has(x.q))].slice(0, 4)
            return (
              <div key={t}>
                <h3>{CASE_TYPES[t].label} <span className="muted count">{qs.length}</span></h3>
                <ul className="questions">
                  {picks.map((x) => (
                    <li key={x.q} className={done.has(x.q) ? 'done' : ''}>
                      <span>{x.q}</span>
                      {done.has(x.q) ? <span className="tick">Done</span>
                        : <Link className="btn small ghost" to={`/practice/session?q=${encodeURIComponent(x.q)}`}>Practise</Link>}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </section>

      <section className="panel tips">
        <h2>Tips for this week</h2>
        <ul className="tip-list">{WEEK_TIPS[week.n].map((t) => <li key={t}><G>{t}</G></li>)}</ul>
      </section>

      {week.companyFocus && (
        <section className="panel">
          <h2>Prepare company-wise</h2>
          <ul className="questions">
            {week.companyFocus.map(([c, focus]) => {
              const t = wp.trackers.find((x) => x.id === 'companies')
              const done = entries.some((e) => e.tracker === trackerKey(6, 'companies') && e.title === c)
              return (
                <li key={c} className={done ? 'done' : ''}>
                  <span><strong>{c}</strong>: {focus}</span>
                  {done ? <span className="tick">Prepared</span>
                    : <LogButton week={6} tracker={t} prefill={{ title: c }} className="btn small ghost">Start notes</LogButton>}
                </li>
              )
            })}
          </ul>
        </section>
      )}

      <nav className="week-nav" aria-label="Weeks">
        {week.n > 1 ? <Link to={`/plan/${week.n - 1}`}>Week {week.n - 1}: {WEEKS[week.n - 2].title}</Link> : <span />}
        {week.n < 6 && <Link to={`/plan/${week.n + 1}`}>Week {week.n + 1}: {WEEKS[week.n].title}</Link>}
      </nav>
    </div>
  )
}

function WeekOneGuide({ week }) {
  return (
    <>
      <section className="panel">
        <h2>Suggested products</h2>
        <table className="table">
          <thead><tr><th scope="col">Industry</th><th scope="col">Products</th></tr></thead>
          <tbody>{week.suggested.map(([i, p]) => <tr key={i}><td>{i}</td><td>{p}</td></tr>)}</tbody>
        </table>
      </section>
      <section className="panel">
        <h2>{week.example.title}</h2>
        <p className="muted">At every step, ask:</p>
        <ol className="lens">{week.lens.map((l) => <li key={l}>{l}</li>)}</ol>
        <ol className="flow">
          {week.example.steps.map(([name, what, ask]) => (
            <li key={name}>
              <strong>{name}</strong>
              <span className="flow-what">{what}</span>
              <span className="flow-ask">{ask}</span>
            </li>
          ))}
        </ol>
        <p className="muted">{week.outcome}</p>
      </section>
    </>
  )
}
