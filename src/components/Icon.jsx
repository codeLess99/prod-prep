// Small stroke icon set. Decorative by default (aria-hidden).
const P = {
  today: 'M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M3 12h2M19 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4M12 8a4 4 0 100 8 4 4 0 000-8z',
  plan: 'M4 5h16M4 12h16M4 19h10',
  practice: 'M12 3a4 4 0 00-4 4v4a4 4 0 008 0V7a4 4 0 00-4-4zM5 11a7 7 0 0014 0M12 18v3M9 21h6',
  learn: 'M4 5.5A2.5 2.5 0 016.5 3H20v15H6.5A2.5 2.5 0 004 20.5v-15zM4 20.5A2.5 2.5 0 016.5 18H20v3H6.5',
  companies: 'M4 21V7l8-4 8 4v14M9 21v-5h6v5M8 9h.01M12 9h.01M16 9h.01M8 13h.01M12 13h.01M16 13h.01',
  banks: 'M4 7h16M4 12h16M4 17h10M18 15l2 2-2 2',
  tools: 'M14.7 6.3a4 4 0 00-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 005.4-5.4l-2.5 2.5-2.4-.6-.6-2.4 2.5-2.5z',
  settings: 'M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z',
  more: 'M5 12h.01M12 12h.01M19 12h.01',
  flame: 'M12 3s5 4.5 5 9.5A5 5 0 017 12.5C7 10 9 8 9 8s.5 2.5 2.5 3C11 7 12 3 12 3z',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  play: 'M7 5l12 7-12 7V5z',
  pause: 'M8 5v14M16 5v14',
  mic: 'M12 3a3 3 0 00-3 3v6a3 3 0 006 0V6a3 3 0 00-3-3zM5 11a7 7 0 0014 0M12 18v3',
  micOff: 'M3 3l18 18M9 9v3a3 3 0 005 2.2M15 9.5V6a3 3 0 00-5.7-1.3M5 11a7 7 0 0011.4 5.4M19 11a7 7 0 01-.6 2.8M12 18v3',
  speaker: 'M4 9v6h4l5 4V5L8 9H4zM16 9a4 4 0 010 6M18.5 6.5a8 8 0 010 11',
  speakerOff: 'M4 9v6h4l5 4V5L8 9H4zM17 9l5 6M22 9l-5 6',
  send: 'M4 12l16-8-6 16-2.5-6.5L4 12z',
  shuffle: 'M4 7h3l10 10h3M4 17h3l3-3M14 10l3-3h3M18 5l2 2-2 2M18 15l2 2-2 2',
  chat: 'M4 5h16v11H9l-5 4V5z',
  pencil: 'M4 20l4-1 11-11-3-3L5 16l-1 4z',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  back: 'M19 12H5M11 6l-6 6 6 6',
  x: 'M6 6l12 12M18 6L6 18',
  clock: 'M12 7v5l3 2M12 21a9 9 0 100-18 9 9 0 000 18z',
  cards: 'M7 4h11a1 1 0 011 1v12M4 8h11a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V9a1 1 0 011-1z',
  search: 'M11 18a7 7 0 100-14 7 7 0 000 14zM20 20l-4-4',
  plus: 'M12 5v14M5 12h14',
  up: 'M12 19V6M6 11l6-6 6 6',
  flag: 'M5 21V4h11l-2 4 2 4H5',
  eyeOff: 'M3 3l18 18M10.6 6.1A9.8 9.8 0 0112 6c5 0 9 6 9 6a15.6 15.6 0 01-3 3.4M6.6 6.6C4.2 8.2 3 12 3 12s4 6 9 6a9.3 9.3 0 004.2-1M9.9 9.9a3 3 0 004.2 4.2',
  eye: 'M3 12s4-6 9-6 9 6 9 6-4 6-9 6-9-6-9-6zM12 15a3 3 0 100-6 3 3 0 000 6z',
  trash: 'M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3',
}

export default function Icon({ name, size = 20, className = '', label }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" className={'icon ' + className}
      aria-hidden={label ? undefined : true} role={label ? 'img' : undefined} aria-label={label}>
      <path d={P[name] || ''} />
    </svg>
  )
}
