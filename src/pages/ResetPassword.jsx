import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as store from '../lib/store.js'

export default function ResetPassword() {
  const [pw, setPw] = useState('')
  const [msg, setMsg] = useState('')
  const nav = useNavigate()
  async function submit(e) {
    e.preventDefault()
    if (pw.length < 8) return setMsg('Use at least 8 characters.')
    const r = await store.updatePassword(pw)
    if (r.error) setMsg(r.error); else nav('/')
  }
  return (
    <div className="page narrow">
      <header className="page-head"><h1>Choose a new password</h1></header>
      <section className="panel">
        <form onSubmit={submit}>
          <div className="field"><label htmlFor="np">New password</label>
            <input id="np" type="password" autoComplete="new-password" value={pw} onChange={(e) => setPw(e.target.value)} /></div>
          {msg && <p className="form-error">{msg}</p>}
          <button className="btn primary">Save password</button>
        </form>
      </section>
    </div>
  )
}
