import { Link } from 'react-router-dom'
import { useApp } from '../lib/AppContext.jsx'
import { CASE_TYPES } from '../content/caseTypes.js'
import { QUESTIONS } from '../content/questions.js'
import { WEEKS } from '../content/weeks.js'
import Ring from '../components/Ring.jsx'
import Icon from '../components/Icon.jsx'
import LogButton from '../components/LogButton.jsx'
import { dailyQuestion } from '../lib/forum.js'

const TIME_TRACKER = { id: 'time', label: 'Study time', kind: 'hours', min: 0 }

function greeting() {
  const h = new Date().getHours()
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
}

// Pick a question for today: deterministic per day and week, and not yet attempted.
function todaysQuestion(week, entries, dateStr) {
  const tried = new Set(entries.map((e) => e.data?.q || e.title))
  const pool = QUESTIONS.filter((q) => week.practice.includes(q.t) && !tried.has(q.q))
  if (!pool.length) return null
  const seed = [...dateStr].reduce((s, ch) => s + ch.charCodeAt(0), 0)
  return pool[seed % pool.length]
}

export default function Today() {
  const { profile, today, streak, entries, toggleHabit, toggleCheck, progress } = useApp()
  const { st, week, goals, minutesTarget, minutesToday, habit, habitDone, todo, pct } = today
  const first = (profile.display_name || '').split(' ')[0]
  const suggestion = todaysQuestion(week, entries, today.today)
  const allDone = pct >= 1
  const dateLabel = new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })

  const status = st.phase === 'before'
    ? `Your plan starts in ${st.daysToStart} ${st.daysToStart === 1 ? 'day' : 'days'}. Warm up with the habit below.`
    : st.phase === 'after'
      ? 'Your six weeks are done. Keep revising and doing mocks until interviews.'
      : `Week ${st.week}, day ${st.dayInWeek + 1}: ${week.title.toLowerCase()}.`

  return (
    <div className="page today-page">
      <header className="today-head">
        <div>
          <p className="eyebrow-date">{dateLabel}</p>
          <h1>{greeting()}{first ? `, ${first}` : ''}</h1>
          <p className="lede">{status}</p>
        </div>
        <div className={'streak' + (streak.streak ? ' on' : '')} title="Days in a row with some prep logged">
          <Icon name="flame" size={22} />
          <span><strong>{streak.streak}</strong> day{streak.streak === 1 ? '' : 's'} in a row</span>
        </div>
      </header>

      <section className="today-grid">
        <div className="panel ring-panel" style={{ '--c': week.color }}>
          <Ring pct={pct} color={allDone ? 'var(--good)' : week.color}>
            <strong>{Math.round(pct * 100)}%</strong>
            <span>of today</span>
          </Ring>
          <div>
            <h2>{allDone ? 'Today\'s goals are done' : 'Today\'s goals'}</h2>
            <p className="muted">{allDone ? 'Good work. Anything extra today is a bonus.' : 'Split from what\'s left of this week, so a slow day evens out tomorrow.'}</p>
          </div>
        </div>

        <ul className="goal-list" aria-label="Today's goals">
          {goals.map((g) => {
            const done = g.done >= g.target
            const typeKey = Object.keys(CASE_TYPES).find((k) => CASE_TYPES[k].tracker[0] === g.week && CASE_TYPES[k].tracker[1] === g.tracker.id)
            return (
              <li key={g.id} className={done ? 'done' : ''}>
                <span className="goal-check" aria-hidden="true">{done && <Icon name="check" size={16} />}</span>
                <div className="goal-body">
                  <span className="goal-title">{g.label}</span>
                  <span className="goal-sub">{g.done} of {g.target} today</span>
                </div>
                {!done && typeKey && <Link className="btn small" to={`/practice?type=${typeKey}`}>Practise</Link>}
                {!done && g.tracker.kind !== 'case' && <LogButton week={g.week} tracker={g.tracker} className="btn small ghost">Log</LogButton>}
              </li>
            )
          })}
          {minutesTarget > 0 && (
            <li className={minutesToday >= minutesTarget ? 'done' : ''}>
              <span className="goal-check" aria-hidden="true">{minutesToday >= minutesTarget && <Icon name="check" size={16} />}</span>
              <div className="goal-body">
                <span className="goal-title">Study for {minutesTarget} minutes</span>
                <span className="goal-sub">{minutesToday} {minutesToday === 1 ? "minute" : "minutes"} logged today</span>
              </div>
              <LogButton week={week.n} tracker={TIME_TRACKER} className="btn small ghost">Log time</LogButton>
            </li>
          )}
          <li className={habitDone ? 'done' : ''}>
            <button className="goal-check as-btn" aria-pressed={habitDone} aria-label={habitDone ? 'Mark habit not done' : 'Mark habit done'} onClick={toggleHabit}>
              {habitDone && <Icon name="check" size={16} />}
            </button>
            <div className="goal-body">
              <span className="goal-title">Daily habit</span>
              <span className="goal-sub">{habit.t}</span>
            </div>
          </li>
        </ul>
      </section>

      <div className="grid-2">
        {suggestion && (
          <section className="panel suggest" style={{ '--c': week.color }}>
            <p className="kicker">Today’s practice pick</p>
            <h2 className="suggest-q">{suggestion.q}</h2>
            <p className="muted">{CASE_TYPES[suggestion.t].label}{suggestion.l ? `, ${suggestion.l.toLowerCase()}` : ''}{suggestion.c ? `. Asked at ${suggestion.c}` : ''}</p>
            <div className="row-actions">
              <Link className="btn primary" to={`/practice/session?q=${encodeURIComponent(suggestion.q)}`}><Icon name="play" size={16} /> Start this case</Link>
              <Link className="btn ghost" to="/practice">Pick another</Link>
            </div>
          </section>
        )}
        <section className="panel">
          <h2>This week</h2>
          <p className="muted">{week.title}: {Math.round(progress.weeks[week.n - 1].pct * 100)}% done, {Math.round(progress.weeks[week.n - 1].hours * 10) / 10} of about {week.hours} hours.</p>
          {todo && (
            <label className="todo-inline">
              <input type="checkbox" checked={false} onChange={() => toggleCheck(todo.key)} />
              <span>Next on the list: {todo.text}</span>
            </label>
          )}
          <div className="row-actions">
            <Link className="btn small" to={`/plan/${week.n}`}>Open week {week.n}</Link>
            <Link className="btn small ghost" to="/plan">See all six weeks</Link>
          </div>
          <div className="mini-weeks" aria-label="Six week progress">
            {WEEKS.map((w) => (
              <Link key={w.n} to={`/plan/${w.n}`} style={{ '--c': w.color }} className={w.n === week.n ? 'now' : ''}
                aria-label={`Week ${w.n}: ${Math.round(progress.weeks[w.n - 1].pct * 100)}%`}>
                <span style={{ height: Math.max(6, progress.weeks[w.n - 1].pct * 100) + '%' }} />
                <em>{w.n}</em>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <ForumNudge />
    </div>
  )
}

function ForumNudge() {
  const d = dailyQuestion()
  return (
    <Link className="panel forum-nudge" to={`/forum/discuss?q=${encodeURIComponent(d.q)}`}>
      <span className="forum-nudge-icon" aria-hidden="true"><Icon name="chat" size={20} /></span>
      <span>
        <span className="kicker">Forum question of the day</span>
        <span className="forum-nudge-q">{d.q}</span>
      </span>
      <Icon name="arrow" size={18} />
    </Link>
  )
}
