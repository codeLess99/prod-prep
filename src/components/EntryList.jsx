import { useState } from 'react'
import { FIELD_SETS } from '../content/weeks.js'
import { useApp } from '../lib/AppContext.jsx'
import EntryForm from './EntryForm.jsx'

const fmtDate = (s) => new Date(s).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })

export default function EntryList({ items, empty, showWeek = false }) {
  const { updateEntry, deleteEntry } = useApp()
  const [open, setOpen] = useState(null)
  const [editing, setEditing] = useState(null)

  if (!items.length) return <p className="empty">{empty}</p>

  return (
    <>
      <ul className="entries">
        {items.map((e) => {
          const fields = (FIELD_SETS[e.kind] || []).filter((f) => !['title', 'minutes'].includes(f.name))
          const isOpen = open === e.id
          const details = fields.filter((f) => {
            const v = e.data?.[f.name]
            return Array.isArray(v) ? v.length : v !== undefined && v !== ''
          })
          return (
            <li key={e.id} className={isOpen ? 'open' : ''}>
              <button className="entry-row" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : e.id)}>
                <span className="entry-title">{e.title}</span>
                <span className="entry-meta">
                  {showWeek && <span>Week {e.week}</span>}
                  {e.data?.rating ? <span className="score" title="Self-rating">{e.data.rating}/5</span> : null}
                  {e.minutes ? <span>{e.minutes} min</span> : null}
                  <span>{fmtDate(e.created_at)}</span>
                </span>
              </button>
              {isOpen && (
                <div className="entry-detail">
                  {details.length ? (
                    <dl>
                      {details.map((f) => (
                        <div key={f.name}>
                          <dt>{f.label}</dt>
                          <dd>{Array.isArray(e.data[f.name]) ? e.data[f.name].join(', ') : String(e.data[f.name])}</dd>
                        </div>
                      ))}
                    </dl>
                  ) : !e.data?.steps && <p className="hint">No notes yet. Edit to add some.</p>}
                  {e.data?.steps && Object.keys(e.data.steps).length > 0 && (
                    <dl className="step-notes">
                      {Object.entries(e.data.steps).map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
                    </dl>
                  )}
                  {(e.data?.checks || e.data?.missed) && (
                    <div className="check-summary">
                      <p><strong>Checklist: {e.data.checks?.length || 0} of {(e.data.checks?.length || 0) + (e.data.missed?.length || 0)}</strong></p>
                      {e.data.missed?.length > 0 && <p className="muted">Work on: {e.data.missed.join('; ')}</p>}
                    </div>
                  )}
                  <div className="row-actions">
                    <button className="btn small" onClick={() => setEditing(e)}>Edit</button>
                    <button className="btn small danger" onClick={() => { if (confirm(`Delete “${e.title}”? This cannot be undone.`)) deleteEntry(e.id) }}>Delete</button>
                  </div>
                </div>
              )}
            </li>
          )
        })}
      </ul>
      {editing && (
        <EntryForm kind={editing.kind} heading="Edit entry" initial={editing}
          onSave={(v) => updateEntry(editing.id, v)} onClose={() => setEditing(null)} />
      )}
    </>
  )
}
