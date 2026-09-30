import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useApp } from '../lib/AppContext.jsx'
import * as F from '../lib/forum.js'
import { QUESTIONS } from '../content/questions.js'
import { CASE_TYPES } from '../content/caseTypes.js'
import Icon from '../components/Icon.jsx'

const SORTS = [['active', 'Active'], ['new', 'New'], ['top', 'Top'], ['unanswered', 'Unanswered']]
const TITLE_MAX = 200, BODY_MAX = 5000

function useAdmin(userId) {
  const [admin, setAdmin] = useState(false)
  useEffect(() => { let live = true; F.isAdmin(userId).then((a) => live && setAdmin(a)).catch(() => {}); return () => { live = false } }, [userId])
  return admin
}

// ================= Forum home =================
export function Forum() {
  const { session, notify } = useApp()
  const me = session.user.id
  const admin = useAdmin(me)
  const [params, setParams] = useSearchParams()
  const sort = params.get('sort') || 'active'
  const tag = params.get('tag') || ''
  const mine = params.get('mine') === '1'
  const [search, setSearch] = useState('')
  const [needle, setNeedle] = useState('')
  const [posts, setPosts] = useState(null)
  const [more, setMore] = useState(false)
  const [error, setError] = useState('')
  const [asking, setAsking] = useState(params.get('ask') === '1')

  useEffect(() => { const t = setTimeout(() => setNeedle(search.trim()), 300); return () => clearTimeout(t) }, [search])
  useEffect(() => { F.markSeen() }, [])

  const load = useCallback(async (offset = 0) => {
    try {
      const rows = await F.listPosts({ sort, tag, mine: mine ? me : null, search: needle, offset })
      setPosts((cur) => (offset ? [...(cur || []), ...rows] : rows))
      setMore(rows.length === F.PAGE); setError('')
    } catch (e) { setError(e.message) }
  }, [sort, tag, mine, me, needle])
  useEffect(() => { load(0) }, [load])

  const setParam = (k, v) => { const p = new URLSearchParams(params); if (v) p.set(k, v); else p.delete(k); setParams(p, { replace: true }) }

  return (
    <div className="page forum-page">
      <header className="page-head forum-head">
        <div>
          <h1>Forum</h1>
          <p className="lede">Ask anything about PM prep and answer others. Explaining an answer is one of the fastest ways to learn it.</p>
        </div>
        {!asking && <button className="btn primary" onClick={() => setAsking(true)}><Icon name="plus" size={16} /> Ask a question</button>}
      </header>

      {asking && <AskForm onCancel={() => setAsking(false)} onDone={() => { setAsking(false); notify('Question posted') }} />}

      <DailyCard />

      {admin && <ReportsPanel />}

      <div className="forum-controls">
        <label className="search">
          <Icon name="search" size={18} />
          <span className="sr-only">Search questions</span>
          <input type="search" placeholder="Search questions" value={search} onChange={(e) => setSearch(e.target.value)} />
        </label>
        <div className="seg-toggle sort-toggle" role="tablist" aria-label="Sort">
          {SORTS.map(([k, l]) => <button key={k} role="tab" aria-selected={sort === k} onClick={() => setParam('sort', k === 'active' ? '' : k)}>{l}</button>)}
        </div>
        <div className="forum-filters">
          <select value={tag} onChange={(e) => setParam('tag', e.target.value)} aria-label="Filter by topic">
            <option value="">All topics</option>
            {F.FORUM_TAGS.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
          </select>
          <button className="chip" aria-pressed={mine} onClick={() => setParam('mine', mine ? '' : '1')}>My questions</button>
        </div>
      </div>

      {error && <p className="form-error">{error}</p>}
      {posts === null && !error && <p className="muted">Loading…</p>}
      {posts?.length === 0 && (
        <div className="panel center-text forum-empty">
          <h2>{needle || tag || mine || sort === 'unanswered' ? 'Nothing here yet' : 'No questions yet'}</h2>
          <p className="muted">{needle || tag || mine || sort === 'unanswered' ? 'Try another filter, or ask it yourself.' : 'Be the first: ask something you got stuck on this week.'}</p>
        </div>
      )}
      {posts?.length > 0 && (
        <ul className="post-list">
          {posts.map((p) => <PostRow key={p.id} p={p} me={me} />)}
        </ul>
      )}
      {more && <div className="center-text"><button className="btn" onClick={() => load(posts.length)}>Load more</button></div>}
    </div>
  )
}

function PostRow({ p, me }) {
  return (
    <li className={'post-row' + (p.hidden ? ' is-hidden' : '')}>
      <Link to={`/forum/${p.id}`} className="post-link">
        <span className="post-title">{p.title}</span>
        <span className="post-meta">
          <span className="tag-chip">{F.tagLabel(p.tag)}</span>
          <span>{p.user_id === me && !p.qkey ? 'You' : p.author_name}</span>
          <span aria-hidden="true">·</span>
          <span>{F.timeAgo(p.last_activity)}</span>
          {p.hidden && <span className="hidden-flag">Hidden</span>}
        </span>
      </Link>
      <span className="post-stats">
        <span className={'stat' + (p.accepted_answer ? ' solved' : p.answer_count ? ' has' : '')} title="Answers">
          {p.accepted_answer ? <Icon name="check" size={14} /> : <Icon name="chat" size={14} />} {p.answer_count}
        </span>
        <span className="stat" title="Upvotes"><Icon name="up" size={14} /> {p.score}</span>
      </span>
    </li>
  )
}

function AskForm({ onCancel, onDone }) {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [tag, setTag] = useState('general')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const submit = async (e) => {
    e.preventDefault()
    if (title.trim().length < 8) { setErr('Make the question a little longer so people know what you\'re asking.'); return }
    setBusy(true); setErr('')
    try { const p = await F.createPost({ title, body, tag }); onDone(); navigate(`/forum/${p.id}`) } catch (x) { setErr(x.message); setBusy(false) }
  }
  return (
    <form className="panel ask-form" onSubmit={submit}>
      <h2>Ask a question</h2>
      <div className="field">
        <label htmlFor="ask-title">Your question</label>
        <input id="ask-title" value={title} maxLength={TITLE_MAX} onChange={(e) => setTitle(e.target.value)} autoFocus
          placeholder="e.g. How do I pick a north star for a B2B product?" />
        <span className="count">{title.length}/{TITLE_MAX}</span>
      </div>
      <div className="field">
        <label htmlFor="ask-body">Details <span className="req">(optional)</span></label>
        <textarea id="ask-body" rows={5} value={body} maxLength={BODY_MAX} onChange={(e) => setBody(e.target.value)}
          placeholder="What have you tried? Where did you get stuck?" />
      </div>
      <div className="field">
        <label htmlFor="ask-tag">Topic</label>
        <select id="ask-tag" value={tag} onChange={(e) => setTag(e.target.value)}>
          {F.FORUM_TAGS.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
        </select>
      </div>
      <p className="muted small-note">Your name is shown with your post. Please don't name colleges or interviewers, or share confidential interview material.</p>
      {err && <p className="form-error">{err}</p>}
      <div className="row-actions">
        <button className="btn primary" disabled={busy}>{busy ? 'Posting…' : 'Post question'}</button>
        <button type="button" className="btn ghost" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  )
}

function DailyCard() {
  const d = useMemo(() => F.dailyQuestion(), [])
  const [thread, setThread] = useState(undefined)
  useEffect(() => { let live = true; F.findBankThread(d.key).then((t) => live && setThread(t)).catch(() => live && setThread(null)); return () => { live = false } }, [d.key])
  const n = thread?.answer_count || 0
  return (
    <section className="panel daily-card">
      <p className="kicker">Question of the day</p>
      <h2 className="daily-q">{d.q}</h2>
      <p className="muted">
        {CASE_TYPES[d.t]?.label}{d.c ? `. Asked at ${d.c}` : ''}.{' '}
        {thread === undefined ? '' : n ? `${n} ${n === 1 ? 'person has' : 'people have'} answered.` : 'No answers yet: be the first.'}
      </p>
      <div className="row-actions">
        <Link className="btn primary" to={`/forum/discuss?q=${encodeURIComponent(d.q)}`}><Icon name="chat" size={16} /> {n ? 'Join the discussion' : 'Answer it'}</Link>
        <Link className="btn ghost" to={`/practice/session?q=${encodeURIComponent(d.q)}`}><Icon name="play" size={16} /> Practise it first</Link>
      </div>
    </section>
  )
}

function ReportsPanel() {
  const { notify } = useApp()
  const [items, setItems] = useState([])
  const load = () => F.listReports().then(setItems).catch(() => {})
  useEffect(() => { load() }, [])
  if (!items.length) return null
  return (
    <section className="panel reports">
      <h2>Reports to review <span className="tab-count">{items.length}</span></h2>
      <ul className="report-list">
        {items.map((r) => (
          <li key={r.id}>
            <div>
              <Link to={`/forum/${r.post_id}`}>{r.forum_posts?.title || 'Question'}</Link>
              <span className="muted"> · {r.target_type === 'post' ? 'the question' : 'an answer'} · {F.timeAgo(r.created_at)}</span>
              {r.reason && <p className="report-reason">“{r.reason}”</p>}
            </div>
            <span className="row-actions">
              <button className="btn small" onClick={async () => { await F.setHidden(r.target_type, r.target_id, true).catch((e) => notify(e.message)); await F.resolveReport(r.id); notify('Hidden'); load() }}>Hide it</button>
              <button className="btn small ghost" onClick={async () => { await F.resolveReport(r.id); notify('Dismissed'); load() }}>Dismiss</button>
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}

// ================= Practice-bank thread: find or start, then redirect =================
export function ForumDiscuss() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const text = params.get('q') || ''
  const q = QUESTIONS.find((x) => x.q === text)
  const [err, setErr] = useState(q ? '' : 'That question is not in the practice bank.')
  useEffect(() => {
    if (!q) return
    let live = true
    F.openBankThread(q).then((p) => live && navigate(`/forum/${p.id}`, { replace: true })).catch((e) => live && setErr(e.message))
    return () => { live = false }
  }, [q, navigate])
  return (
    <div className="page">
      {err ? <div className="panel"><p className="form-error">{err}</p><Link className="btn" to="/forum">Back to the forum</Link></div> : <p className="muted">Opening the discussion…</p>}
    </div>
  )
}

// ================= Thread =================
export function ForumThread() {
  const { id } = useParams()
  const { session, notify } = useApp()
  const me = session.user.id
  const admin = useAdmin(me)
  const navigate = useNavigate()
  const [data, setData] = useState(undefined)
  const [error, setError] = useState('')

  const load = useCallback(() => F.getThread(id, me).then((d) => { setData(d); setError('') }).catch((e) => setError(e.message)), [id, me])
  useEffect(() => { load() }, [load])

  if (error) return <div className="page"><p className="form-error">{error}</p><Link className="btn" to="/forum">Back to the forum</Link></div>
  if (data === undefined) return <div className="page"><p className="muted">Loading…</p></div>
  if (data === null) return <div className="page"><div className="panel"><h2>This question isn't available</h2><p className="muted">It may have been deleted or hidden by a moderator.</p><Link className="btn" to="/forum">Back to the forum</Link></div></div>

  const { post, answers, votes } = data
  const isOwner = post.user_id === me && !post.qkey
  const bankQ = post.qkey ? QUESTIONS.find((x) => F.qkeyFor(x.q) === post.qkey) : null
  const sorted = [...answers].sort((a, b) =>
    (b.id === post.accepted_answer) - (a.id === post.accepted_answer) || b.score - a.score || Date.parse(a.created_at) - Date.parse(b.created_at))
  const act = (fn, msg) => async (...args) => { try { await fn(...args); if (msg) notify(msg); await load() } catch (e) { notify(e.message) } }

  return (
    <div className="page thread-page">
      <Link className="back-link" to="/forum"><Icon name="back" size={16} /> All questions</Link>

      <article className={'panel thread-post' + (post.hidden ? ' is-hidden' : '')}>
        {post.hidden && <p className="notice">Hidden by a moderator. Only you{admin ? ' and other moderators' : ''} can see it.</p>}
        <PostBody
          kind="post" item={post} me={me} admin={admin} canEdit={isOwner} voted={votes.has('post:' + post.id)}
          title={post.title} isBank={!!post.qkey}
          onVote={act((on) => F.setVote('post', post.id, on))}
          onSave={act(async (patch) => F.updatePost(post.id, patch), 'Saved')}
          onDelete={async () => { try { await F.deletePost(post.id); notify('Question deleted'); navigate('/forum') } catch (e) { notify(e.message) } }}
          onReport={act((reason) => F.report('post', post.id, post.id, reason), 'Reported. A moderator will take a look.')}
          onHide={act((h) => F.setHidden('post', post.id, h), post.hidden ? 'Visible again' : 'Hidden')}
        />
        {bankQ && (
          <p className="bank-note">
            From the practice bank{bankQ.c ? `, asked at ${bankQ.c}` : ''}. <Link to={`/practice/session?q=${encodeURIComponent(bankQ.q)}`}>Practise it with the timer</Link>, then share how you approached it.
          </p>
        )}
      </article>

      <h2 className="answers-head">{answers.length ? `${answers.filter((a) => !a.hidden).length} ${answers.filter((a) => !a.hidden).length === 1 ? 'answer' : 'answers'}` : 'No answers yet'}</h2>
      <ul className="answer-list">
        {sorted.map((a) => (
          <li key={a.id} className={'panel answer' + (a.id === post.accepted_answer ? ' accepted' : '') + (a.hidden ? ' is-hidden' : '')}>
            {a.id === post.accepted_answer && <p className="accepted-flag"><Icon name="check" size={14} /> Helped the person who asked</p>}
            {a.hidden && <p className="notice">Hidden by a moderator.</p>}
            <PostBody
              kind="answer" item={a} me={me} admin={admin} canEdit={a.user_id === me} voted={votes.has('answer:' + a.id)}
              onVote={act((on) => F.setVote('answer', a.id, on))}
              onSave={act(async ({ body }) => F.updateAnswer(a.id, body), 'Saved')}
              onDelete={act(() => F.deleteAnswer(a.id, post.id), 'Answer deleted')}
              onReport={act((reason) => F.report('answer', a.id, post.id, reason), 'Reported. A moderator will take a look.')}
              onHide={act((h) => F.setHidden('answer', a.id, h), a.hidden ? 'Visible again' : 'Hidden')}
              extra={isOwner && a.user_id !== me && (
                <button className="link" onClick={act(() => F.acceptAnswer(post.id, a.id === post.accepted_answer ? null : a.id), a.id === post.accepted_answer ? 'Unmarked' : 'Marked as helpful')}>
                  {a.id === post.accepted_answer ? 'Unmark' : 'This helped me'}
                </button>
              )}
            />
          </li>
        ))}
      </ul>

      {!post.hidden && <AnswerForm postId={post.id} bank={!!post.qkey} onDone={act(() => {}, 'Answer posted')} />}
    </div>
  )
}

function PostBody({ kind, item, me, admin, canEdit, voted, title, isBank, onVote, onSave, onDelete, onReport, onHide, extra }) {
  const [editing, setEditing] = useState(false)
  const [t, setT] = useState(title || '')
  const [b, setB] = useState(item.body || '')
  const [confirmDel, setConfirmDel] = useState(false)
  const [reporting, setReporting] = useState(false)
  const [reason, setReason] = useState('')
  const mine = item.user_id === me
  const edited = Date.parse(item.updated_at) - Date.parse(item.created_at) > 60000

  if (editing) {
    return (
      <form className="edit-form" onSubmit={async (e) => { e.preventDefault(); await onSave(kind === 'post' ? { title: t.trim(), body: b.trim() } : { body: b }); setEditing(false) }}>
        {kind === 'post' && <input value={t} maxLength={TITLE_MAX} minLength={8} onChange={(e) => setT(e.target.value)} aria-label="Question" required />}
        <textarea rows={kind === 'post' ? 4 : 6} value={b} maxLength={BODY_MAX} onChange={(e) => setB(e.target.value)} aria-label={kind === 'post' ? 'Details' : 'Answer'} required={kind === 'answer'} />
        <div className="row-actions">
          <button className="btn small primary">Save</button>
          <button type="button" className="btn small ghost" onClick={() => { setEditing(false); setT(title || ''); setB(item.body || '') }}>Cancel</button>
        </div>
      </form>
    )
  }

  return (
    <>
      {kind === 'post' && (
        <>
          <span className="tag-chip">{F.tagLabel(item.tag)}</span>
          <h1 className="thread-title">{title}</h1>
        </>
      )}
      <p className="byline">
        <strong>{isBank ? 'Practice question' : mine ? 'You' : item.author_name}</strong>
        <span className="muted"> · {F.timeAgo(item.created_at)}{edited ? ' · edited' : ''}</span>
      </p>
      {item.body && <div className="post-text">{item.body}</div>}
      <div className="post-actions">
        <button className={'vote' + (voted ? ' on' : '')} aria-pressed={voted} disabled={mine && !isBank}
          title={mine && !isBank ? 'You can\'t upvote your own post' : voted ? 'Remove upvote' : 'Upvote'} onClick={() => onVote(!voted)}>
          <Icon name="up" size={16} /> <span>{item.score}</span><span className="sr-only"> upvotes</span>
        </button>
        {extra}
        {canEdit && !confirmDel && <button className="link" onClick={() => setEditing(true)}>Edit</button>}
        {canEdit && !confirmDel && <button className="link" onClick={() => setConfirmDel(true)}>Delete</button>}
        {confirmDel && (
          <span className="confirm">Delete this {kind === 'post' ? 'question' : 'answer'}?
            <button className="link danger" onClick={() => { setConfirmDel(false); onDelete() }}>Yes, delete</button>
            <button className="link" onClick={() => setConfirmDel(false)}>Keep it</button>
          </span>
        )}
        {!mine && !reporting && !isBank && <button className="link subtle" onClick={() => setReporting(true)}><Icon name="flag" size={14} /> Report</button>}
        {admin && <button className="link subtle" onClick={() => onHide(!item.hidden)}><Icon name={item.hidden ? 'eye' : 'eyeOff'} size={14} /> {item.hidden ? 'Unhide' : 'Hide'}</button>}
      </div>
      {reporting && (
        <form className="report-form" onSubmit={async (e) => { e.preventDefault(); await onReport(reason); setReporting(false); setReason('') }}>
          <label htmlFor={'rep-' + item.id}>What's wrong with it?</label>
          <select id={'rep-' + item.id} value={reason} onChange={(e) => setReason(e.target.value)} required>
            <option value="">Choose a reason</option>
            <option>Spam or advertising</option>
            <option>Rude or offensive</option>
            <option>Names a college, interviewer or private person</option>
            <option>Shares confidential interview material</option>
            <option>Something else</option>
          </select>
          <div className="row-actions">
            <button className="btn small">Send report</button>
            <button type="button" className="btn small ghost" onClick={() => setReporting(false)}>Cancel</button>
          </div>
        </form>
      )}
    </>
  )
}

function AnswerForm({ postId, bank, onDone }) {
  const [body, setBody] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  return (
    <form className="panel answer-form" onSubmit={async (e) => {
      e.preventDefault()
      if (body.trim().length < 2) return
      setBusy(true); setErr('')
      try { await F.addAnswer(postId, body); setBody(''); await onDone() } catch (x) { setErr(x.message) }
      setBusy(false)
    }}>
      <label htmlFor="answer" className="answer-label">Your answer</label>
      <textarea id="answer" rows={6} value={body} maxLength={BODY_MAX} onChange={(e) => setBody(e.target.value)}
        placeholder={bank ? 'How would you approach it? Who is the user, what is the problem, and what would you build or check first?' : 'Share what worked for you, or how you would think about it.'} />
      <div className="answer-foot">
        <span className="muted small-note">Your name is shown. Be specific and kind.</span>
        <button className="btn primary" disabled={busy || body.trim().length < 2}>{busy ? 'Posting…' : 'Post answer'}</button>
      </div>
      {err && <p className="form-error">{err}</p>}
    </form>
  )
}
