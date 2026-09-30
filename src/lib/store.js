import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isLocalMode = !url || !key
export const googleEnabled = import.meta.env.VITE_ENABLE_GOOGLE === 'true'
export const allowedDomain = (import.meta.env.VITE_ALLOWED_EMAIL_DOMAIN || '').trim().toLowerCase()

export const supabase = isLocalMode ? null : createClient(url, key)

// ---------- Local mode (no backend configured): everything lives in this browser ----------
const LS = 'pmprep.local.'
const read = (k, d) => {
  try { const v = localStorage.getItem(LS + k); return v ? JSON.parse(v) : d } catch { return d }
}
const write = (k, v) => { try { localStorage.setItem(LS + k, JSON.stringify(v)) } catch { /* storage unavailable */ } }
const listeners = new Set()
const emit = (s) => listeners.forEach((fn) => fn(s))
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()))

function checkDomain(email) {
  if (!allowedDomain) return null
  return email.toLowerCase().endsWith('@' + allowedDomain) ? null : `Use your @${allowedDomain} email address.`
}

// ---------- Auth ----------
export async function getSession() {
  if (isLocalMode) return read('session', null)
  const { data } = await supabase.auth.getSession()
  return data.session
}

export function onAuthChange(fn) {
  if (isLocalMode) { listeners.add(fn); return () => listeners.delete(fn) }
  const { data } = supabase.auth.onAuthStateChange((_e, s) => fn(s))
  return () => data.subscription.unsubscribe()
}

export async function signUp({ email, password, name }) {
  const bad = checkDomain(email); if (bad) return { error: bad }
  if (isLocalMode) {
    const s = { user: { id: 'local', email } }
    write('session', s); write('profile', { ...read('profile', {}), display_name: name }); emit(s)
    return { session: s }
  }
  const { data, error } = await supabase.auth.signUp({
    email, password,
    options: { data: { display_name: name }, emailRedirectTo: window.location.origin },
  })
  if (error) return { error: error.message }
  return { session: data.session, needsConfirm: !data.session }
}

export async function signIn({ email, password }) {
  const bad = checkDomain(email); if (bad) return { error: bad }
  if (isLocalMode) {
    const s = { user: { id: 'local', email } }
    write('session', s); emit(s); return { session: s }
  }
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: error.message === 'Invalid login credentials' ? 'That email and password do not match.' : error.message }
  return { session: data.session }
}

export async function signInWithGoogle() {
  if (isLocalMode) return { error: 'Google sign-in needs the backend to be connected.' }
  const options = { redirectTo: window.location.origin }
  if (allowedDomain) options.queryParams = { hd: allowedDomain }
  const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options })
  return error ? { error: error.message } : {}
}

export async function sendReset(email) {
  if (isLocalMode) return { error: 'Password reset needs the backend to be connected.' }
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + '/reset' })
  return error ? { error: error.message } : {}
}

export async function updatePassword(password) {
  const { error } = await supabase.auth.updateUser({ password })
  return error ? { error: error.message } : {}
}

export async function signOut() {
  if (isLocalMode) { write('session', null); emit(null); return }
  await supabase.auth.signOut()
}

// ---------- Profile ----------
const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}` }

export async function loadProfile(session) {
  if (isLocalMode) {
    const p = { start_date: today(), checklist: {}, daily: {}, ...read('profile', {}) }
    write('profile', p); return p
  }
  const id = session.user.id
  const { data, error } = await supabase.from('profiles').select('*').eq('id', id).maybeSingle()
  if (error) throw error
  if (data) return data
  const fresh = { id, display_name: session.user.user_metadata?.display_name || session.user.user_metadata?.full_name || '', start_date: today(), checklist: {} }
  const { data: made, error: e2 } = await supabase.from('profiles').insert(fresh).select().single()
  if (e2) throw e2
  return made
}

export async function saveProfile(session, patch) {
  if (isLocalMode) { const p = { ...read('profile', {}), ...patch }; write('profile', p); return p }
  const { data, error } = await supabase.from('profiles')
    .update({ ...patch, updated_at: new Date().toISOString() }).eq('id', session.user.id).select().single()
  if (error) throw error
  return data
}

// ---------- Entries ----------
export async function listEntries() {
  if (isLocalMode) return read('entries', [])
  const { data, error } = await supabase.from('entries').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function addEntry(entry) {
  if (isLocalMode) {
    const e = { id: uid(), created_at: new Date().toISOString(), ...entry }
    write('entries', [e, ...read('entries', [])]); return e
  }
  const { data, error } = await supabase.from('entries').insert(entry).select().single()
  if (error) throw error
  return data
}

export async function updateEntry(id, patch) {
  if (isLocalMode) {
    const all = read('entries', []).map((e) => (e.id === id ? { ...e, ...patch } : e))
    write('entries', all); return all.find((e) => e.id === id)
  }
  const { data, error } = await supabase.from('entries').update(patch).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteEntry(id) {
  if (isLocalMode) { write('entries', read('entries', []).filter((e) => e.id !== id)); return }
  const { error } = await supabase.from('entries').delete().eq('id', id)
  if (error) throw error
}
