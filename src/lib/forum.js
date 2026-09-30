// Forum data layer. Uses Supabase when connected, otherwise keeps everything in this browser (preview mode).
import { supabase, isLocalMode } from './store.js'
import { QUESTIONS } from '../content/questions.js'
import { CASE_TYPES } from '../content/caseTypes.js'

export const PAGE = 30
export const FORUM_TAGS = [
  ...Object.entries(CASE_TYPES).map(([id, t]) => ({ id, label: t.short })),
  { id: 'company', label: 'Company prep' },
  { id: 'career', label: 'Career and process' },
  { id: 'general', label: 'General' },
]
export const tagLabel = (id) => FORUM_TAGS.find((t) => t.id === id)?.label || 'General'

// ---------- Practice-bank questions ----------
// A stable key for a bank question, so every link to it opens the same thread.
export function qkeyFor(text) {
  let h = 5381
  for (let i = 0; i < text.length; i++) h = ((h * 33) ^ text.charCodeAt(i)) >>> 0
  return 'q:' + h.toString(36)
}

// Question of the day: one product question a day, the same for everyone, no repeats until the pool runs out.
const DAILY_TYPES = ['design', 'improve', 'app', 'metrics', 'gtm', 'pricing', 'strategy']
const POOL = (() => {
  const pool = QUESTIONS.filter((q) => DAILY_TYPES.includes(q.t))
  let seed = 20260930
  const rand = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648 }
  for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]] }
  return pool
})()
export function indiaDate(d = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).format(d)
}
export function dailyQuestion(d = new Date()) {
  const date = indiaDate(d)
  const day = Math.round((Date.parse(date) - Date.parse('2026-01-01')) / 86400000)
  const q = POOL[((day % POOL.length) + POOL.length) % POOL.length]
  return { ...q, key: qkeyFor(q.q), date }
}

// ---------- Local preview storage ----------
const LS = 'pmprep.forum.'
const read = (k, d) => { try { const v = localStorage.getItem(LS + k); return v ? JSON.parse(v) : d } catch { return d } }
const write = (k, v) => { try { localStorage.setItem(LS + k, JSON.stringify(v)) } catch { /* storage unavailable */ } }
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()))
const localName = () => { try { return JSON.parse(localStorage.getItem('pmprep.local.profile'))?.display_name || 'You' } catch { return 'You' } }
const now = () => new Date().toISOString()
const L = {
  posts: () => read('posts', []), answers: () => read('answers', []), votes: () => read('votes', []),
  save: (k, v) => write(k, v),
}
function localRecount(postId) {
  const posts = L.posts(), answers = L.answers().filter((a) => a.post_id === postId && !a.hidden)
  write('posts', posts.map((p) => (p.id === postId ? { ...p, answer_count: answers.length } : p)))
}

const fail = (error) => { throw new Error(friendly(error)) }
function friendly(e) {
  const m = e?.message || String(e)
  if (/row-level security|permission denied/i.test(m)) return 'You do not have permission to do that.'
  if (/duplicate key/i.test(m)) return 'Already done.'
  if (/check constraint/i.test(m)) return 'That is too short or too long.'
  return m.replace(/^.*?ERROR:\s*/, '')
}

const POST_COLS = 'id,user_id,author_name,title,body,tag,qkey,accepted_answer,hidden,answer_count,score,created_at,updated_at,last_activity'

// ---------- Reads ----------
export async function isAdmin(userId) {
  if (isLocalMode) return true
  const { data } = await supabase.from('forum_admins').select('user_id').eq('user_id', userId).maybeSingle()
  return !!data
}

export async function listPosts({ sort = 'active', tag = '', mine = null, search = '', offset = 0 } = {}) {
  if (isLocalMode) {
    let list = L.posts()
    if (tag) list = list.filter((p) => p.tag === tag)
    if (mine) list = list.filter((p) => p.user_id === mine)
    if (search) list = list.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))
    if (sort === 'unanswered') list = list.filter((p) => !p.answer_count)
    const key = sort === 'top' ? (p) => p.score * 1e13 + Date.parse(p.last_activity) : sort === 'new' ? (p) => Date.parse(p.created_at) : (p) => Date.parse(p.last_activity)
    list = [...list].sort((a, b) => key(b) - key(a))
    return list.slice(offset, offset + PAGE)
  }
  let q = supabase.from('forum_posts').select(POST_COLS)
  if (tag) q = q.eq('tag', tag)
  if (mine) q = q.eq('user_id', mine)
  if (search) q = q.ilike('title', `%${search.replace(/[%_,()]/g, ' ')}%`)
  if (sort === 'unanswered') q = q.eq('answer_count', 0)
  if (sort === 'top') q = q.order('score', { ascending: false }).order('last_activity', { ascending: false })
  else if (sort === 'new') q = q.order('created_at', { ascending: false })
  else q = q.order('last_activity', { ascending: false })
  const { data, error } = await q.range(offset, offset + PAGE - 1)
  if (error) fail(error)
  return data
}

export async function getThread(id, me) {
  if (isLocalMode) {
    const post = L.posts().find((p) => p.id === id)
    if (!post) return null
    const answers = L.answers().filter((a) => a.post_id === id)
    const votes = new Set(L.votes().map((v) => v.target_type + ':' + v.target_id))
    return { post, answers, votes }
  }
  const { data: post, error } = await supabase.from('forum_posts').select(POST_COLS).eq('id', id).maybeSingle()
  if (error) fail(error)
  if (!post) return null
  const { data: answers, error: e2 } = await supabase.from('forum_answers').select('*').eq('post_id', id).order('created_at')
  if (e2) fail(e2)
  const ids = [id, ...answers.map((a) => a.id)]
  const { data: v } = await supabase.from('forum_votes').select('target_type,target_id').eq('user_id', me).in('target_id', ids)
  return { post, answers, votes: new Set((v || []).map((x) => x.target_type + ':' + x.target_id)) }
}

// Thread for a practice-bank question: returns the existing one, or null if nobody has started it.
export async function findBankThread(qkey) {
  if (isLocalMode) return L.posts().find((p) => p.qkey === qkey) || null
  const { data } = await supabase.from('forum_posts').select(POST_COLS).eq('qkey', qkey).maybeSingle()
  return data || null
}

export async function openBankThread(q) {
  const qkey = qkeyFor(q.q)
  const found = await findBankThread(qkey)
  if (found) return found
  const row = { title: q.q.slice(0, 200), body: '', tag: CASE_TYPES[q.t] ? q.t : 'general', qkey }
  if (isLocalMode) {
    const p = { id: uid(), user_id: 'local', author_name: 'Practice question', accepted_answer: null, hidden: false, answer_count: 0, score: 0, created_at: now(), updated_at: now(), last_activity: now(), ...row }
    L.save('posts', [p, ...L.posts()]); return p
  }
  const { data, error } = await supabase.from('forum_posts').insert(row).select(POST_COLS).single()
  if (!error) return data
  if (error.code !== '23505') fail(error)
  // Someone else opened it at the same moment, or a moderator has hidden it.
  const again = await findBankThread(qkey)
  if (again) return again
  throw new Error('A moderator has closed the discussion on this question.')
}

// Answers from other people on my questions since a time (for the "new" badge).
export async function newAnswerCount(me, since) {
  if (isLocalMode) return 0
  const { count, error } = await supabase.from('forum_answers')
    .select('id, forum_posts!inner(user_id)', { count: 'exact', head: true })
    .eq('forum_posts.user_id', me).neq('user_id', me).gt('created_at', since)
  return error ? 0 : count || 0
}

// ---------- Writes ----------
export async function createPost({ title, body, tag }) {
  const row = { title: title.trim(), body: body.trim(), tag }
  if (isLocalMode) {
    const p = { id: uid(), user_id: 'local', author_name: localName(), qkey: null, accepted_answer: null, hidden: false, answer_count: 0, score: 0, created_at: now(), updated_at: now(), last_activity: now(), ...row }
    L.save('posts', [p, ...L.posts()]); return p
  }
  const { data, error } = await supabase.from('forum_posts').insert(row).select(POST_COLS).single()
  if (error) fail(error)
  return data
}

export async function updatePost(id, patch) {
  if (isLocalMode) { L.save('posts', L.posts().map((p) => (p.id === id ? { ...p, ...patch, updated_at: now() } : p))); return }
  const { data, error } = await supabase.from('forum_posts').update(patch).eq('id', id).select('id')
  if (error) fail(error)
  if (!data?.length) throw new Error('You can no longer change this question.')
}

export async function deletePost(id) {
  if (isLocalMode) { L.save('posts', L.posts().filter((p) => p.id !== id)); L.save('answers', L.answers().filter((a) => a.post_id !== id)); return }
  const { data, error } = await supabase.from('forum_posts').delete().eq('id', id).select('id')
  if (error) fail(error)
  if (!data?.length) throw new Error('Questions can\'t be deleted once someone else has answered. Edit it instead.')
}

export async function addAnswer(postId, body) {
  const row = { post_id: postId, body: body.trim() }
  if (isLocalMode) {
    const a = { id: uid(), user_id: 'local', author_name: localName(), hidden: false, score: 0, created_at: now(), updated_at: now(), ...row }
    L.save('answers', [...L.answers(), a])
    L.save('posts', L.posts().map((p) => (p.id === postId ? { ...p, last_activity: now() } : p)))
    localRecount(postId); return a
  }
  const { data, error } = await supabase.from('forum_answers').insert(row).select('*').single()
  if (error) fail(error)
  return data
}

export async function updateAnswer(id, body) {
  if (isLocalMode) { L.save('answers', L.answers().map((a) => (a.id === id ? { ...a, body: body.trim(), updated_at: now() } : a))); return }
  const { error } = await supabase.from('forum_answers').update({ body: body.trim() }).eq('id', id)
  if (error) fail(error)
}

export async function deleteAnswer(id, postId) {
  if (isLocalMode) {
    L.save('answers', L.answers().filter((a) => a.id !== id))
    L.save('posts', L.posts().map((p) => (p.id === postId && p.accepted_answer === id ? { ...p, accepted_answer: null } : p)))
    localRecount(postId); return
  }
  const { error } = await supabase.from('forum_answers').delete().eq('id', id)
  if (error) fail(error)
}

export async function setVote(type, id, on) {
  if (isLocalMode) {
    const k = (v) => v.target_type === type && v.target_id === id
    L.save('votes', on ? [...L.votes().filter((v) => !k(v)), { target_type: type, target_id: id }] : L.votes().filter((v) => !k(v)))
    const table = type === 'post' ? 'posts' : 'answers'
    L.save(table, read(table, []).map((x) => (x.id === id ? { ...x, score: Math.max(0, x.score + (on ? 1 : -1)) } : x)))
    return
  }
  const { error } = on
    ? await supabase.from('forum_votes').insert({ target_type: type, target_id: id })
    : await supabase.from('forum_votes').delete().eq('target_type', type).eq('target_id', id)
  if (error && error.code !== '23505') fail(error)
}

export async function acceptAnswer(postId, answerId) {
  if (isLocalMode) { L.save('posts', L.posts().map((p) => (p.id === postId ? { ...p, accepted_answer: answerId } : p))); return }
  const { error } = await supabase.rpc('forum_accept', { p_post: postId, p_answer: answerId })
  if (error) fail(error)
}

export async function report(type, id, postId, reason) {
  if (isLocalMode) return
  const { error } = await supabase.from('forum_reports').insert({ target_type: type, target_id: id, post_id: postId, reason: reason.slice(0, 500) })
  if (error && error.code !== '23505') fail(error)
}

// ---------- Moderation ----------
export async function setHidden(type, id, hidden) {
  const table = type === 'post' ? 'forum_posts' : 'forum_answers'
  if (isLocalMode) { const k = type === 'post' ? 'posts' : 'answers'; L.save(k, read(k, []).map((x) => (x.id === id ? { ...x, hidden } : x))); return }
  const { error } = await supabase.from(table).update({ hidden }).eq('id', id)
  if (error) fail(error)
}

export async function listReports() {
  if (isLocalMode) return []
  const { data, error } = await supabase.from('forum_reports')
    .select('id,target_type,target_id,post_id,reason,created_at,forum_posts(title)')
    .eq('resolved', false).order('created_at', { ascending: false }).limit(50)
  if (error) fail(error)
  return data
}

export async function resolveReport(id) {
  if (isLocalMode) return
  const { error } = await supabase.from('forum_reports').update({ resolved: true }).eq('id', id)
  if (error) fail(error)
}

// ---------- Helpers ----------
export function timeAgo(iso) {
  const s = Math.max(1, Math.round((Date.now() - Date.parse(iso)) / 1000))
  if (s < 60) return 'just now'
  const m = Math.round(s / 60); if (m < 60) return `${m} min ago`
  const h = Math.round(m / 60); if (h < 24) return `${h} h ago`
  const d = Math.round(h / 24); if (d < 30) return `${d} ${d === 1 ? 'day' : 'days'} ago`
  return new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
}

const SEEN = 'pmprep.forum.seen'
export const getSeen = () => { try { return localStorage.getItem(SEEN) || new Date(Date.now() - 7 * 86400000).toISOString() } catch { return new Date().toISOString() } }
export const markSeen = () => { try { localStorage.setItem(SEEN, new Date().toISOString()) } catch { /* ignore */ } }
