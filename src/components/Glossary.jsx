import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { tokenize } from '../content/glossary.js'
import { CONCEPTS } from '../content/concepts.js'

const Ctx = createContext(null)

export function GlossaryProvider({ children }) {
  const [open, setOpen] = useState(null) // { g, anchor }
  const show = useCallback((g, anchor) => setOpen((cur) => (cur && cur.g.id === g.id ? null : { g, anchor })), [])
  const close = useCallback(() => setOpen(null), [])
  return (
    <Ctx.Provider value={show}>
      {children}
      {open && <TermPopover g={open.g} anchor={open.anchor} onClose={close} />}
    </Ctx.Provider>
  )
}

// One tappable term.
export function Term({ g, children }) {
  const show = useContext(Ctx)
  if (!show) return children
  return (
    <button type="button" className="term" aria-haspopup="dialog"
      onClick={(e) => { e.stopPropagation(); e.preventDefault(); show(g, e.currentTarget) }}>
      {children}
    </button>
  )
}

// Turn a plain string into text with tappable glossary terms.
// Pass the same `seen` Set to several calls so a term is linked only once per block.
export function linkify(text, seen, skip) {
  return tokenize(text, seen, skip).map((part, i) =>
    typeof part === 'string' ? part : <Term key={i} g={part.g}>{part.text}</Term>)
}

// Convenience component for one-off strings.
export function G({ children, skip }) {
  return <>{linkify(String(children ?? ''), new Set(), skip)}</>
}

function TermPopover({ g, anchor, onClose }) {
  const ref = useRef(null)
  const [pos, setPos] = useState(null)
  const concept = g.c && CONCEPTS.find((c) => c.id === g.c)

  useLayoutEffect(() => {
    const place = () => {
      const el = ref.current
      if (!el || !anchor?.isConnected) return
      if (window.innerWidth < 640) { setPos({ sheet: true }); return }
      const r = anchor.getBoundingClientRect()
      const w = el.offsetWidth, h = el.offsetHeight, gap = 8, pad = 12
      let left = Math.min(Math.max(pad, r.left + r.width / 2 - w / 2), window.innerWidth - w - pad)
      let top = r.bottom + gap
      if (top + h > window.innerHeight - pad) top = Math.max(pad, r.top - h - gap)
      setPos({ left, top })
    }
    place()
    window.addEventListener('resize', place)
    window.addEventListener('scroll', place, true)
    return () => { window.removeEventListener('resize', place); window.removeEventListener('scroll', place, true) }
  }, [anchor, g])

  useEffect(() => {
    ref.current?.focus()
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    const onDown = (e) => {
      if (ref.current?.contains(e.target) || anchor?.contains(e.target)) return
      onClose()
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onDown)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onDown)
      if (anchor?.isConnected) anchor.focus({ preventScroll: true })
    }
  }, [anchor, onClose])

  const style = !pos ? { visibility: 'hidden', left: 0, top: 0 } : pos.sheet ? {} : { left: pos.left, top: pos.top }
  return (
    <>
      {pos?.sheet && <div className="term-backdrop" onClick={onClose} />}
      <div ref={ref} role="dialog" aria-label={g.t} tabIndex={-1}
        className={'term-pop' + (pos?.sheet ? ' sheet-mode' : '')} style={style}>
        <div className="term-pop-head">
          <div>
            <strong>{g.t}</strong>
            {g.full && <span className="term-full">{g.full}</span>}
          </div>
          <button className="term-close" onClick={onClose} aria-label="Close">×</button>
        </div>
        <p>{g.d}</p>
        {concept && (
          <Link className="term-more" to={`/learn?c=${concept.id}`} onClick={onClose}>
            Read more: {concept.title} →
          </Link>
        )}
      </div>
    </>
  )
}
