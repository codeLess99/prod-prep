import { useEffect, useRef, useState } from 'react'
import { FIELD_SETS } from '../content/weeks.js'

// Modal form for logging or editing one entry.
export default function EntryForm({ kind, heading, initial = {}, onSave, onClose }) {
  const fields = FIELD_SETS[kind]
  const [values, setValues] = useState(() => ({ ...(initial.data || {}), title: initial.title || '', minutes: initial.minutes ?? '' }))
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const dialog = useRef(null)

  useEffect(() => {
    const d = dialog.current
    d.showModal()
    const first = d.querySelector('input, textarea, select')
    first?.focus()
  }, [])

  const set = (name, v) => setValues((s) => ({ ...s, [name]: v }))

  async function submit(ev) {
    ev.preventDefault()
    const missing = fields.find((f) => f.required && !String(values[f.name] ?? '').trim())
    if (missing) { setError(`Add ${missing.label.toLowerCase()} to save.`); return }
    const { title, minutes, ...data } = values
    setBusy(true)
    try {
      await onSave({ title: title.trim(), minutes: minutes === '' ? null : Number(minutes), data })
      dialog.current.close()
      onClose()
    } catch (err) {
      setError(err.message || 'Could not save. Check your connection and try again.')
      setBusy(false)
    }
  }

  return (
    <dialog ref={dialog} className="modal" onClose={onClose} onCancel={onClose}>
      <form onSubmit={submit}>
        <header className="modal-head">
          <h2>{heading}</h2>
          <button type="button" className="icon-btn" aria-label="Close" onClick={() => { dialog.current.close(); onClose() }}>×</button>
        </header>
        <div className="modal-body">
          {fields.map((f) => (
            <Field key={f.name} f={f} value={values[f.name]} onChange={(v) => set(f.name, v)} />
          ))}
          {error && <p className="form-error" role="alert">{error}</p>}
        </div>
        <footer className="modal-foot">
          <button type="button" className="btn ghost" onClick={() => { dialog.current.close(); onClose() }}>Cancel</button>
          <button className="btn primary" disabled={busy}>{busy ? 'Saving…' : initial.id ? 'Save changes' : 'Save entry'}</button>
        </footer>
      </form>
    </dialog>
  )
}

function Field({ f, value, onChange }) {
  const id = 'f-' + f.name
  if (f.type === 'rating') {
    return (
      <fieldset className="field">
        <legend>{f.label}</legend>
        <div className="rating">
          {[1, 2, 3, 4, 5].map((n) => (
            <button type="button" key={n} aria-pressed={Number(value) === n} onClick={() => onChange(Number(value) === n ? '' : n)}>
              {n}
            </button>
          ))}
          <span className="hint">1 = rough, 5 = interview-ready</span>
        </div>
      </fieldset>
    )
  }
  if (f.type === 'tags') {
    const list = Array.isArray(value) ? value : []
    return (
      <fieldset className="field">
        <legend>{f.label}</legend>
        <div className="chips">
          {f.options.map((o) => (
            <button type="button" key={o} className="chip" aria-pressed={list.includes(o)}
              onClick={() => onChange(list.includes(o) ? list.filter((x) => x !== o) : [...list, o])}>{o}</button>
          ))}
        </div>
      </fieldset>
    )
  }
  return (
    <div className="field">
      <label htmlFor={id}>{f.label}{f.required && <span className="req"> (required)</span>}</label>
      {f.type === 'textarea' ? (
        <textarea id={id} rows={3} value={value || ''} placeholder={f.placeholder} onChange={(e) => onChange(e.target.value)} />
      ) : f.type === 'select' ? (
        <select id={id} value={value || ''} onChange={(e) => onChange(e.target.value)}>
          <option value="">Choose…</option>
          {f.options.map((o) => <option key={o}>{o}</option>)}
        </select>
      ) : (
        <input id={id} type={f.type === 'number' ? 'number' : 'text'} min={f.type === 'number' ? 0 : undefined}
          value={value ?? ''} placeholder={f.placeholder} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  )
}
