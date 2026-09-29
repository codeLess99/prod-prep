import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import * as store from './store.js'
import { WEEKS, trackerKey } from '../content/weeks.js'
import { dailyGoals, computeStreak, localDate, planState } from './goals.js'

const Ctx = createContext(null)
export const useApp = () => useContext(Ctx)

export function AppProvider({ children }) {
  const [session, setSession] = useState(undefined) // undefined = still checking
  const [profile, setProfile] = useState(null)
  const [entries, setEntries] = useState([])
  const [loadError, setLoadError] = useState('')
  const [toast, setToast] = useState(null)
  const toastTimer = useRef(null)

  useEffect(() => {
    store.getSession().then(setSession)
    return store.onAuthChange(setSession)
  }, [])

  const userId = session?.user?.id
  useEffect(() => {
    if (!userId) { setProfile(null); setEntries([]); return }
    let live = true
    Promise.all([store.loadProfile(session), store.listEntries()])
      .then(([p, e]) => { if (live) { setProfile({ daily: {}, checklist: {}, ...p }); setEntries(e); setLoadError('') } })
      .catch((err) => live && setLoadError(err.message || 'Could not load your progress.'))
    return () => { live = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  const notify = useCallback((text) => {
    clearTimeout(toastTimer.current)
    setToast({ text, id: Date.now() })
    toastTimer.current = setTimeout(() => setToast(null), 3200)
  }, [])

  const saveProfile = useCallback(async (patch) => {
    setProfile((p) => ({ ...p, ...patch }))
    const saved = await store.saveProfile(session, patch)
    setProfile((p) => ({ ...p, ...saved }))
  }, [session])

  const toggleCheck = useCallback((key) => {
    const checklist = { ...(profile?.checklist || {}) }
    if (checklist[key]) delete checklist[key]; else checklist[key] = true
    return saveProfile({ checklist })
  }, [profile, saveProfile])

  const toggleHabit = useCallback(() => {
    const today = localDate()
    const daily = { ...(profile?.daily || {}) }
    const cur = daily[today] || {}
    daily[today] = { ...cur, habit: !cur.habit }
    return saveProfile({ daily })
  }, [profile, saveProfile])

  const addEntry = useCallback(async (e) => {
    const made = await store.addEntry(e)
    setEntries((all) => [made, ...all])
    return made
  }, [])
  const updateEntry = useCallback(async (id, patch) => {
    const made = await store.updateEntry(id, patch)
    setEntries((all) => all.map((e) => (e.id === id ? made : e)))
  }, [])
  const deleteEntry = useCallback(async (id) => {
    await store.deleteEntry(id)
    setEntries((all) => all.filter((e) => e.id !== id))
  }, [])

  const progress = useMemo(() => computeProgress(entries, profile), [entries, profile])
  const today = useMemo(() => (profile ? dailyGoals(profile, entries) : null), [profile, entries])
  const streak = useMemo(() => computeStreak(entries, profile?.daily), [entries, profile])

  const value = { session, profile, entries, loadError, progress, today, streak, toast, notify, saveProfile, toggleCheck, toggleHabit, addEntry, updateEntry, deleteEntry }
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function currentWeek(startDate) {
  return planState(startDate).week
}

function computeProgress(entries, profile) {
  const counts = {}
  const minutes = {}
  for (const e of entries) {
    counts[e.tracker] = (counts[e.tracker] || 0) + 1
    minutes[e.week] = (minutes[e.week] || 0) + (Number(e.minutes) || 0)
  }
  const checklist = profile?.checklist || {}
  const weeks = WEEKS.map((w) => {
    const trackers = w.trackers.map((t) => {
      const count = counts[trackerKey(w.n, t.id)] || 0
      return { ...t, count, pct: t.min ? Math.min(1, count / t.min) : null }
    })
    const scored = trackers.filter((t) => t.pct !== null)
    const todoDone = w.todo.filter((_, i) => checklist[`w${w.n}.todo.${i}`]).length
    // Week progress: logged work counts for 80%, the checklist for 20%.
    const trackPct = scored.length ? scored.reduce((s, t) => s + t.pct, 0) / scored.length : 0
    const pct = trackPct * 0.8 + (todoDone / w.todo.length) * 0.2
    return { n: w.n, trackers, todoDone, pct, hours: (minutes[w.n] || 0) / 60 }
  })
  const totalHours = weeks.reduce((s, w) => s + w.hours, 0)
  const overall = weeks.reduce((s, w) => s + w.pct * WEEKS[w.n - 1].hours, 0) / WEEKS.reduce((s, w) => s + w.hours, 0)
  return { weeks, totalHours, overall }
}
