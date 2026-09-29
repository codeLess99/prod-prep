import { WEEKS, trackerKey } from '../content/weeks.js'
import { HABITS } from '../content/reference.js'

// Local calendar date as YYYY-MM-DD (not UTC, so "today" matches the user's clock).
export const localDate = (d = new Date()) => {
  const x = new Date(d)
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`
}
const dayMs = 86400000
const parse = (s) => new Date(s + 'T00:00:00')
export const dayNumber = (startDate, d = new Date()) => Math.floor((parse(localDate(d)) - parse(startDate)) / dayMs)

export function planState(startDate) {
  const day = dayNumber(startDate)
  if (day < 0) return { phase: 'before', day, week: 1, dayInWeek: 0, daysLeftInWeek: 7, daysToStart: -day }
  if (day >= 42) return { phase: 'after', day, week: 6, dayInWeek: 6, daysLeftInWeek: 1 }
  const week = Math.floor(day / 7) + 1
  const dayInWeek = day - (week - 1) * 7
  return { phase: 'during', day, week, dayInWeek, daysLeftInWeek: 7 - dayInWeek, daysLeftInPlan: 42 - day }
}

export function computeStreak(entries, daily) {
  const active = new Set(entries.map((e) => localDate(e.created_at)))
  Object.entries(daily || {}).forEach(([d, v]) => { if (v?.habit) active.add(d) })
  let n = 0
  const d = new Date()
  if (!active.has(localDate(d))) d.setDate(d.getDate() - 1)
  while (active.has(localDate(d))) { n++; d.setDate(d.getDate() - 1) }
  return { streak: n, activeToday: active.has(localDate()) }
}

// Spread what's left of this week's targets across the days left in the week.
export function dailyGoals(profile, entries) {
  const today = localDate()
  const st = planState(profile.start_date)
  const w = WEEKS[st.week - 1]
  const isToday = (e) => localDate(e.created_at) === today
  const goals = []

  for (const t of w.trackers) {
    if (!t.min) continue
    const key = trackerKey(w.n, t.id)
    const mine = entries.filter((e) => e.tracker === key)
    const before = mine.filter((e) => !isToday(e)).length
    const doneToday = mine.filter(isToday).length
    const remaining = Math.max(0, t.min - before)
    const target = st.phase === 'before' ? 0 : Math.ceil(remaining / st.daysLeftInWeek)
    if (target > 0) goals.push({ id: key, kind: 'tracker', week: w.n, tracker: t, label: t.label, target, done: Math.min(doneToday, target) })
  }

  // Study time: what's left of the week's hours, split over the days left, rounded to 15 minutes.
  const weekMinutesBefore = entries.filter((e) => e.week === w.n && !isToday(e)).reduce((s, e) => s + (Number(e.minutes) || 0), 0)
  const minutesToday = entries.filter(isToday).reduce((s, e) => s + (Number(e.minutes) || 0), 0)
  const remainingMin = Math.max(0, w.hours * 60 - weekMinutesBefore)
  const minutesTarget = st.phase === 'before' ? 0 : Math.max(15, Math.round(remainingMin / st.daysLeftInWeek / 15) * 15)

  const habitIndex = ((st.day % HABITS.length) + HABITS.length) % HABITS.length
  const habit = HABITS[habitIndex]
  const habitDone = !!profile.daily?.[today]?.habit

  const todoIndex = w.todo.findIndex((_, i) => !profile.checklist?.[`w${w.n}.todo.${i}`])

  const units = goals.reduce((s, g) => s + g.target, 0) + (minutesTarget ? 1 : 0) + 1
  const doneUnits = goals.reduce((s, g) => s + g.done, 0) + (minutesTarget && minutesToday >= minutesTarget ? 1 : 0) + (habitDone ? 1 : 0)

  return {
    today, st, week: w, goals,
    minutesTarget, minutesToday,
    habit, habitDone,
    todo: todoIndex >= 0 ? { key: `w${w.n}.todo.${todoIndex}`, text: w.todo[todoIndex] } : null,
    pct: units ? doneUnits / units : 0,
  }
}
