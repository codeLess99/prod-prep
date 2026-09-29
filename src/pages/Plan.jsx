import { Link } from 'react-router-dom'
import { useApp } from '../lib/AppContext.jsx'
import { planState } from '../lib/goals.js'
import { WEEKS, TOTAL_HOURS } from '../content/weeks.js'
import WeekTrack from '../components/WeekTrack.jsx'
import Icon from '../components/Icon.jsx'

export default function Plan() {
  const { profile, progress, entries } = useApp()
  const st = planState(profile.start_date)
  const end = new Date(new Date(profile.start_date + 'T00:00:00').getTime() + 41 * 86400000)
  return (
    <div className="page">
      <header className="page-head">
        <h1>Your six weeks</h1>
        <p className="lede">
          {st.phase === 'before' ? `Starts in ${st.daysToStart} days` : st.phase === 'after' ? 'Plan complete' : `Week ${st.week} of 6, ${st.daysLeftInPlan} days left`}
          , ending {end.toLocaleDateString(undefined, { day: 'numeric', month: 'long' })}. <Link to="/settings">Change dates</Link>
        </p>
      </header>

      <WeekTrack progress={progress} current={st.phase === 'during' ? st.week : 0} startDate={profile.start_date} />

      <p className="summary-line">
        <strong>{Math.round(progress.overall * 100)}%</strong> of the plan done.{' '}
        <strong>{Math.round(progress.totalHours)}</strong> of {TOTAL_HOURS} planned hours logged.{' '}
        <strong>{entries.length}</strong> entries so far.
      </p>

      <ol className="week-cards">
        {WEEKS.map((w) => {
          const p = progress.weeks[w.n - 1]
          const scored = p.trackers.filter((t) => t.min)
          return (
            <li key={w.n} style={{ '--c': w.color }} className={st.phase === 'during' && st.week === w.n ? 'now' : ''}>
              <Link to={`/plan/${w.n}`}>
                <span className="wc-num">{w.n}</span>
                <span className="wc-main">
                  <span className="wc-title">{w.title}{st.phase === 'during' && st.week === w.n && <em>This week</em>}</span>
                  <span className="wc-sub">{w.summary}</span>
                  <span className="wc-meta">
                    {scored.map((t) => <span key={t.id}>{t.label}: {t.count}/{t.min}{t.max ? `–${t.max}` : '+'}</span>)}
                    <span>{Math.round(p.hours * 10) / 10} of ~{w.hours} h</span>
                  </span>
                </span>
                <span className="wc-pct">{Math.round(p.pct * 100)}%</span>
                <Icon name="arrow" size={18} className="wc-go" />
              </Link>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
