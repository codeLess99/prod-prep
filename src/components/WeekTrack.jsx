import { Link } from 'react-router-dom'
import { WEEKS, TOTAL_HOURS } from '../content/weeks.js'

// The six-week track: each segment is as wide as that week's planned hours,
// filled to the week's progress, with a marker for where today falls.
export default function WeekTrack({ progress, current, startDate }) {
  const start = new Date(startDate + 'T00:00:00').getTime()
  const dayIndex = (Date.now() - start) / 86400000
  return (
    <div className="track">
      <div className="track-bar">
        {WEEKS.map((w) => {
          const p = progress.weeks[w.n - 1]
          const isNow = w.n === current && dayIndex >= 0 && dayIndex < 42
          const within = isNow ? (dayIndex - (w.n - 1) * 7) / 7 : null
          return (
            <Link key={w.n} to={`/plan/${w.n}`} className={'seg' + (isNow ? ' now' : '')}
              style={{ flexGrow: w.hours, '--c': w.color }}
              aria-label={`Week ${w.n}, ${w.title}, ${Math.round(p.pct * 100)}% done`}>
              <span className="seg-fill" style={{ width: p.pct * 100 + '%' }} />
              {within !== null && <span className="today" style={{ left: within * 100 + '%' }} title="Today" />}
              <span className="seg-label">
                <strong>{w.n}</strong>
                <span className="seg-name">{w.short}</span>
                <span className="seg-pct">{Math.round(p.pct * 100)}%</span>
              </span>
            </Link>
          )
        })}
      </div>
      <p className="track-note">Segment width shows each week’s planned hours ({TOTAL_HOURS} in total).</p>
    </div>
  )
}
