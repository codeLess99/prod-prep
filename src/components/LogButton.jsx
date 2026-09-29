import { useState } from 'react'
import { useApp } from '../lib/AppContext.jsx'
import { trackerKey } from '../content/weeks.js'
import EntryForm from './EntryForm.jsx'

// Button that opens the log form for one tracker. prefill sets initial field values.
export default function LogButton({ week, tracker, prefill, className = 'btn small', children }) {
  const { addEntry } = useApp()
  const [open, setOpen] = useState(false)
  return (
    <>
      <button className={className} onClick={() => setOpen(true)}>{children || 'Log'}</button>
      {open && (
        <EntryForm
          kind={tracker.kind}
          heading={`${tracker.label}: new entry`}
          initial={prefill || {}}
          onClose={() => setOpen(false)}
          onSave={(v) => addEntry({ ...v, week, tracker: trackerKey(week, tracker.id), kind: tracker.kind })}
        />
      )}
    </>
  )
}

export function Meter({ count, min, max, color }) {
  const pct = min ? Math.min(100, (count / min) * 100) : 0
  const label = min ? `${count} of ${max ? `${min}–${max}` : `${min}+`}` : `${count} logged`
  return (
    <div className="meter-wrap">
      {min > 0 && (
        <div className="meter" role="progressbar" aria-valuemin={0} aria-valuemax={min} aria-valuenow={Math.min(count, min)}>
          <span style={{ width: pct + '%', background: color }} />
        </div>
      )}
      <span className="meter-label">{label}</span>
    </div>
  )
}
