import { useState } from 'react'
import { useApp } from '../lib/AppContext.jsx'
import * as store from '../lib/store.js'

export default function Settings() {
  const { profile, session, entries, saveProfile } = useApp()
  const [name, setName] = useState(profile.display_name || '')
  const [start, setStart] = useState(profile.start_date)
  const [saved, setSaved] = useState('')

  async function save(e) {
    e.preventDefault()
    try { await saveProfile({ display_name: name.trim(), start_date: start }); setSaved('Settings saved.') }
    catch (err) { setSaved(err.message) }
  }

  function exportData() {
    const blob = new Blob([JSON.stringify({ profile, entries }, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'pm-prep-progress.json'
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const end = new Date(new Date(start + 'T00:00:00').getTime() + 41 * 86400000)

  return (
    <div className="page narrow">
      <header className="page-head"><h1>Settings</h1><p className="lede">Signed in as {session.user.email}</p></header>
      <section className="panel">
        <form onSubmit={save}>
          <div className="field"><label htmlFor="n">Your name</label><input id="n" value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div className="field">
            <label htmlFor="s">Plan start date</label>
            <input id="s" type="date" value={start} onChange={(e) => setStart(e.target.value)} required />
            <p className="hint">Your six weeks run until {end.toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}. Set this to six weeks before placements begin.</p>
          </div>
          {saved && <p className="notice" role="status">{saved}</p>}
          <button className="btn primary">Save settings</button>
        </form>
      </section>
      <section className="panel">
        <h2>Your data</h2>
        <p className="muted">Download everything you have logged as a file.</p>
        <div className="row-actions">
          <button className="btn" onClick={exportData}>Download my data</button>
          <button className="btn ghost" onClick={store.signOut}>Sign out</button>
        </div>
      </section>
    </div>
  )
}
