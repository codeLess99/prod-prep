import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useApp } from '../lib/AppContext.jsx'
import { QUESTIONS } from '../content/questions.js'
import { CASE_TYPES, TYPE_ORDER } from '../content/caseTypes.js'
import { WEEKS, trackerKey } from '../content/weeks.js'
import { GUESS_DATA } from '../content/reference.js'
import Icon from '../components/Icon.jsx'

const fmt = (s) => `${Math.floor(Math.abs(s) / 60)}:${String(Math.abs(s) % 60).padStart(2, '0')}`

function useTimer() {
  const [elapsed, setElapsed] = useState(0)
  const [running, setRunning] = useState(false)
  useEffect(() => {
    if (!running) return
    const id = setInterval(() => setElapsed((e) => e + 1), 1000)
    return () => clearInterval(id)
  }, [running])
  return { elapsed, running, setRunning }
}

export default function PracticeSession() {
  const [params] = useSearchParams()
  const nav = useNavigate()
  const { addEntry, notify } = useApp()
  const found = QUESTIONS.find((x) => x.q === params.get('q'))
  const custom = !found

  const [question, setQuestion] = useState(found?.q || '')
  const [type, setType] = useState(found?.t || 'design')
  const ct = CASE_TYPES[type]
  const [minutes, setMinutes] = useState(ct.minutes)
  const [stage, setStage] = useState('ready') // ready | running | review | saved
  const [stepIdx, setStepIdx] = useState(0)
  const [notes, setNotes] = useState({})
  const [hint, setHint] = useState({})
  const [checks, setChecks] = useState({})
  const [rating, setRating] = useState(0)
  const [reflection, setReflection] = useState('')
  const [busy, setBusy] = useState(false)
  const timer = useTimer()
  const stepRefs = useRef([])

  const remaining = minutes * 60 - timer.elapsed
  const over = remaining < 0

  useEffect(() => { if (stage === 'running') stepRefs.current[stepIdx]?.querySelector('textarea')?.focus() }, [stepIdx, stage])

  // Warn before leaving mid-case.
  useEffect(() => {
    if (stage !== 'running') return
    const h = (e) => { e.preventDefault(); e.returnValue = '' }
    window.addEventListener('beforeunload', h)
    return () => window.removeEventListener('beforeunload', h)
  }, [stage])

  const begin = () => { setStage('running'); timer.setRunning(true) }
  const finish = () => { timer.setRunning(false); setStage('review'); window.scrollTo({ top: 0, behavior: 'smooth' }) }

  async function save() {
    setBusy(true)
    const [wk, tid] = ct.tracker
    const tracker = WEEKS[wk - 1].trackers.find((t) => t.id === tid)
    const stepNotes = Object.fromEntries(ct.steps.map((s, i) => [s.t, notes[i] || '']).filter(([, v]) => v.trim()))
    try {
      await addEntry({
        week: wk,
        tracker: trackerKey(wk, tid),
        kind: tracker.kind,
        title: question.trim(),
        minutes: Math.max(1, Math.round(timer.elapsed / 60)),
        data: {
          q: question.trim(), type, steps: stepNotes, rating: rating || undefined,
          checks: ct.rubric.filter((_, i) => checks[i]), missed: ct.rubric.filter((_, i) => !checks[i]),
          notes: reflection.trim() || undefined,
        },
      })
      notify(`Saved to ${tracker.label}`)
      setStage('saved')
    } catch (e) {
      notify(e.message || 'Could not save. Try again.')
    } finally { setBusy(false) }
  }

  const next = useMemo(() => {
    const pool = QUESTIONS.filter((x) => x.t === type && x.q !== question)
    return pool[Math.floor(Math.random() * pool.length)]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, question, stage === 'saved'])

  const metCount = Object.values(checks).filter(Boolean).length

  return (
    <div className="page session">
      <Link to="/practice" className="back-link"><Icon name="back" size={16} /> All questions</Link>

      <header className="session-head">
        <span className="tag" data-type={type}>{ct.label}</span>
        {stage === 'ready' && custom ? (
          <div className="field custom-q">
            <label htmlFor="cq">Your question</label>
            <textarea id="cq" rows={2} value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Type the case prompt you want to practise" />
            <label htmlFor="ctype">Case type</label>
            <select id="ctype" value={type} onChange={(e) => { setType(e.target.value); setMinutes(CASE_TYPES[e.target.value].minutes) }}>
              {TYPE_ORDER.map((t) => <option key={t} value={t}>{CASE_TYPES[t].label}</option>)}
            </select>
          </div>
        ) : (
          <h1 className="session-q">{question}</h1>
        )}
        {(found?.l || found?.c) && <p className="muted">{[found.l, found.c && `Asked at ${found.c}`].filter(Boolean).join('. ')}</p>}
      </header>

      {stage === 'ready' && (
        <section className="panel ready">
          <p>{ct.intro}</p>
          <div className="ready-row">
            <label className="mins">
              <span>Time limit</span>
              <select value={minutes} onChange={(e) => setMinutes(Number(e.target.value))}>
                {[3, 5, 8, 10, 12, 15, 20].map((m) => <option key={m} value={m}>{m} minutes</option>)}
              </select>
            </label>
            <button className="btn primary big" onClick={begin} disabled={!question.trim()}><Icon name="play" size={18} /> Start the clock</button>
          </div>
          <p className="muted small-note">Say your answer out loud as you go, like in the room. Jot short notes under each step. You can finish early or run over.</p>
        </section>
      )}

      {stage === 'running' && (
        <>
          <div className={'timer-bar' + (over ? ' over' : remaining < 60 ? ' warn' : '')} role="timer" aria-live="off">
            <Icon name="clock" size={18} />
            <strong>{over ? '+' : ''}{fmt(remaining)}</strong>
            <span className="muted">{over ? 'over time' : 'left'}</span>
            <div className="timer-track"><span style={{ width: Math.min(100, (timer.elapsed / (minutes * 60)) * 100) + '%' }} /></div>
            <button className="icon-btn" onClick={() => timer.setRunning(!timer.running)} aria-label={timer.running ? 'Pause timer' : 'Resume timer'}>
              <Icon name={timer.running ? 'pause' : 'play'} size={16} />
            </button>
            <button className="btn small primary" onClick={finish}>I'm done</button>
          </div>

          <ol className="stepper">
            {ct.steps.map((s, i) => {
              const state = i === stepIdx ? 'current' : notes[i]?.trim() ? 'filled' : i < stepIdx ? 'passed' : ''
              return (
                <li key={s.t} className={state} ref={(el) => { stepRefs.current[i] = el }}>
                  <button className="step-head" onClick={() => setStepIdx(i)} aria-expanded={i === stepIdx}>
                    <span className="step-dot">{state === 'filled' ? <Icon name="check" size={14} /> : i + 1}</span>
                    <span className="step-title">{s.t}</span>
                    {i !== stepIdx && notes[i]?.trim() && <span className="step-peek">{notes[i].trim().slice(0, 70)}</span>}
                  </button>
                  {i === stepIdx && (
                    <div className="step-body">
                      <p className="step-prompt">{s.p}</p>
                      <textarea rows={4} value={notes[i] || ''} placeholder="Short notes on what you said"
                        onChange={(e) => setNotes({ ...notes, [i]: e.target.value })}
                        onKeyDown={(e) => { if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') { e.preventDefault(); if (i < ct.steps.length - 1) setStepIdx(i + 1); else finish() } }} />
                      <div className="step-foot">
                        <button className="link" onClick={() => setHint({ ...hint, [i]: !hint[i] })} aria-expanded={!!hint[i]}>{hint[i] ? 'Hide tip' : 'Show a tip'}</button>
                        {i < ct.steps.length - 1
                          ? <button className="btn small" onClick={() => setStepIdx(i + 1)}>Next step <Icon name="arrow" size={14} /></button>
                          : <button className="btn small primary" onClick={finish}>Finish and review</button>}
                      </div>
                      {hint[i] && <p className="tip">{s.h}</p>}
                    </div>
                  )}
                </li>
              )
            })}
          </ol>

          {type === 'guesstimate' && (
            <details className="panel refsheet">
              <summary>Handy numbers for India</summary>
              {GUESS_DATA.map((g) => (
                <div key={g.group}>
                  <h3>{g.group}</h3>
                  <dl>{g.rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
                </div>
              ))}
            </details>
          )}
        </>
      )}

      {stage === 'review' && (
        <section className="panel review">
          <h2>How did it go?</h2>
          <p className="muted">You took {fmt(timer.elapsed)} {timer.elapsed > minutes * 60 ? `(${fmt(timer.elapsed - minutes * 60)} over)` : `of ${minutes} minutes`}. Be honest: this is what interviewers look for.</p>
          <ul className="rubric">
            {ct.rubric.map((r, i) => (
              <li key={r}>
                <label>
                  <input type="checkbox" checked={!!checks[i]} onChange={() => setChecks({ ...checks, [i]: !checks[i] })} />
                  <span>{r}</span>
                </label>
              </li>
            ))}
          </ul>
          <p className="rubric-score">{metCount} of {ct.rubric.length}</p>
          <fieldset className="field">
            <legend>Overall</legend>
            <div className="rating">
              {[1, 2, 3, 4, 5].map((n) => (
                <button type="button" key={n} aria-pressed={rating === n} onClick={() => setRating(rating === n ? 0 : n)}>{n}</button>
              ))}
              <span className="hint">1 = rough, 5 = interview-ready</span>
            </div>
          </fieldset>
          <div className="field">
            <label htmlFor="refl">What will you do better next time?</label>
            <textarea id="refl" rows={3} value={reflection} onChange={(e) => setReflection(e.target.value)} />
          </div>
          <div className="row-actions">
            <button className="btn primary" onClick={save} disabled={busy}>{busy ? 'Saving…' : 'Save to my log'}</button>
            <button className="btn ghost" onClick={() => { setStage('running'); timer.setRunning(true) }}>Back to the case</button>
          </div>
        </section>
      )}

      {stage === 'saved' && (
        <section className="panel saved">
          <div className="saved-mark"><Icon name="check" size={28} /></div>
          <h2>Saved</h2>
          <p className="muted">It counts towards your plan and today's goals.</p>
          <div className="row-actions center">
            {next && <button className="btn primary" onClick={() => nav(`/practice/session?q=${encodeURIComponent(next.q)}`, { replace: true })}>Next {ct.short.toLowerCase()} case</button>}
            <Link className="btn" to="/">Back to today</Link>
          </div>
          {next && <p className="muted small-note">Up next: {next.q}</p>}
        </section>
      )}
    </div>
  )
}
