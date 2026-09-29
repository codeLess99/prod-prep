import { useState } from 'react'
import * as store from '../lib/store.js'
import Logo from '../components/Logo.jsx'

export default function AuthPage() {
  const [mode, setMode] = useState('signin') // signin | signup | reset
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [msg, setMsg] = useState({ type: '', text: '' })
  const [busy, setBusy] = useState(false)
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  async function submit(e) {
    e.preventDefault()
    setBusy(true); setMsg({})
    let r
    if (mode === 'signup') {
      if (form.password.length < 8) { setBusy(false); return setMsg({ type: 'error', text: 'Use at least 8 characters for your password.' }) }
      r = await store.signUp(form)
      if (r.needsConfirm) r = { info: `We sent a confirmation link to ${form.email}. Open it, then sign in here.` }
    } else if (mode === 'signin') {
      r = await store.signIn(form)
    } else {
      r = await store.sendReset(form.email)
      if (!r.error) r = { info: `If an account exists for ${form.email}, a reset link is on its way.` }
    }
    setBusy(false)
    if (r.error) setMsg({ type: 'error', text: r.error })
    else if (r.info) setMsg({ type: 'info', text: r.info })
  }

  return (
    <main className="auth">
      <section className="auth-intro">
        <Logo />
        <h1>Six weeks from product curious to interview ready.</h1>
        <p>A week-by-week plan for product management placements. Log every case, build your feature, metric and story banks, and see exactly where you stand.</p>
        <ol className="auth-weeks">
          <li>Product sense</li><li>Product design</li><li>RCA and metrics</li>
          <li>GTM and prioritisation</li><li>Guesstimates and behavioural</li><li>Mocks and company prep</li>
        </ol>
      </section>

      <section className="auth-card">
        <h2>{mode === 'signup' ? 'Create your account' : mode === 'signin' ? 'Sign in' : 'Reset your password'}</h2>
        {store.isLocalMode && (
          <p className="notice">Preview mode: progress is saved in this browser only until the database is connected.</p>
        )}

        {store.googleEnabled && mode !== 'reset' && (
          <>
            <button className="btn google" onClick={async () => { const r = await store.signInWithGoogle(); if (r.error) setMsg({ type: 'error', text: r.error }) }}>
              Continue with Google
            </button>
            <div className="or"><span>or use email</span></div>
          </>
        )}

        <form onSubmit={submit}>
          {mode === 'signup' && (
            <div className="field"><label htmlFor="name">Your name</label>
              <input id="name" autoComplete="name" value={form.name} onChange={set('name')} required /></div>
          )}
          <div className="field"><label htmlFor="email">Email</label>
            <input id="email" type="email" autoComplete="email" value={form.email} onChange={set('email')} required
              placeholder={store.allowedDomain ? `you@${store.allowedDomain}` : ''} /></div>
          {mode !== 'reset' && (
            <div className="field"><label htmlFor="pw">Password</label>
              <input id="pw" type="password" autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                value={form.password} onChange={set('password')} required minLength={mode === 'signup' ? 8 : undefined} /></div>
          )}
          {msg.text && <p className={msg.type === 'error' ? 'form-error' : 'notice'} role="status">{msg.text}</p>}
          <button className="btn primary wide" disabled={busy}>
            {busy ? 'Please wait…' : mode === 'signup' ? 'Create account' : mode === 'signin' ? 'Sign in' : 'Send reset link'}
          </button>
        </form>

        <div className="auth-switch">
          {mode === 'signin' && <>
            <button className="link" onClick={() => { setMode('signup'); setMsg({}) }}>New here? Create an account</button>
            {!store.isLocalMode && <button className="link" onClick={() => { setMode('reset'); setMsg({}) }}>Forgot password?</button>}
          </>}
          {mode !== 'signin' && <button className="link" onClick={() => { setMode('signin'); setMsg({}) }}>Back to sign in</button>}
        </div>
      </section>
    </main>
  )
}
