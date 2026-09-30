import { useState } from 'react'
import { BrowserRouter, NavLink, Route, Routes, Navigate, useLocation } from 'react-router-dom'
import { AppProvider, useApp } from './lib/AppContext.jsx'
import * as store from './lib/store.js'
import Logo from './components/Logo.jsx'
import Icon from './components/Icon.jsx'
import { GlossaryProvider } from './components/Glossary.jsx'
import AuthPage from './pages/AuthPage.jsx'
import Today from './pages/Today.jsx'
import Plan from './pages/Plan.jsx'
import WeekPage from './pages/WeekPage.jsx'
import Practice from './pages/Practice.jsx'
import PracticeSession from './pages/PracticeSession.jsx'
import Learn from './pages/Learn.jsx'
import { Companies, CompanyPage } from './pages/Companies.jsx'
import Library from './pages/Library.jsx'
import Tools from './pages/Tools.jsx'
import Settings from './pages/Settings.jsx'
import ResetPassword from './pages/ResetPassword.jsx'

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <GlossaryProvider>
          <Gate />
        </GlossaryProvider>
      </BrowserRouter>
    </AppProvider>
  )
}

function Gate() {
  const { session, profile, loadError } = useApp()
  if (session === undefined) return <p className="loading">Loading…</p>
  if (!session) return <AuthPage />
  if (loadError) return (
    <main className="auth"><section className="auth-card">
      <h2>Could not load your progress</h2><p className="form-error">{loadError}</p>
      <p className="muted">If you just set up the database, check that schema.sql ran without errors.</p>
      <button className="btn" onClick={store.signOut}>Sign out</button>
    </section></main>
  )
  if (!profile) return <p className="loading">Loading your progress…</p>
  return <Shell />
}

const MAIN = [
  ['/', 'Today', 'today'],
  ['/plan', 'Plan', 'plan'],
  ['/practice', 'Practice', 'pencil'],
  ['/learn', 'Learn', 'learn'],
]
const MORE = [
  ['/companies', 'Companies', 'companies'],
  ['/banks', 'Your banks', 'banks'],
  ['/tools', 'Tools', 'tools'],
  ['/settings', 'Settings', 'settings'],
]

function Shell() {
  const { today, toast } = useApp()
  const loc = useLocation()
  const [sheet, setSheet] = useState(false)
  const [prevPath, setPrevPath] = useState(loc.pathname)
  if (prevPath !== loc.pathname) { setPrevPath(loc.pathname); setSheet(false) }
  const moreActive = MORE.some(([p]) => loc.pathname.startsWith(p))

  return (
    <div className="shell">
      <a href="#main" className="skip">Skip to content</a>
      <nav className="side" aria-label="Main">
        <div className="side-logo"><Logo /></div>
        {[...MAIN, ...MORE].map(([to, label, icon]) => (
          <NavLink key={to} to={to} end={to === '/'}>
            <Icon name={icon} size={19} />
            <span>{label}</span>
            {to === '/' && today && <span className="side-pct">{Math.round(today.pct * 100)}%</span>}
          </NavLink>
        ))}
        {store.isLocalMode && <p className="side-note">Preview mode: saved in this browser only.</p>}
      </nav>

      <header className="topbar"><Logo /></header>

      <main className="main" id="main">
        <Routes>
          <Route path="/" element={<Today />} />
          <Route path="/plan" element={<Plan />} />
          <Route path="/plan/:n" element={<WeekPage />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/practice/session" element={<PracticeSession key={loc.search} />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/companies/:id" element={<CompanyPage />} />
          <Route path="/banks" element={<Library />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/reset" element={<ResetPassword />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <nav className="tabbar" aria-label="Main">
        {MAIN.map(([to, label, icon]) => (
          <NavLink key={to} to={to} end={to === '/'}><Icon name={icon} size={22} /><span>{label}</span></NavLink>
        ))}
        <button className={moreActive || sheet ? 'active' : ''} aria-expanded={sheet} aria-controls="more-sheet" onClick={() => setSheet(!sheet)}>
          <Icon name="more" size={22} /><span>More</span>
        </button>
      </nav>
      {sheet && (
        <>
          <div className="sheet-backdrop" onClick={() => setSheet(false)} />
          <div className="sheet" id="more-sheet" role="dialog" aria-label="More">
            {MORE.map(([to, label, icon]) => (
              <NavLink key={to} to={to}><Icon name={icon} size={20} /><span>{label}</span></NavLink>
            ))}
          </div>
        </>
      )}

      <div className="toast-wrap" aria-live="polite">
        {toast && <div className="toast" key={toast.id}><Icon name="check" size={16} /> {toast.text}</div>}
      </div>
    </div>
  )
}
