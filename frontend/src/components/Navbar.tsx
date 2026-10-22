import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Sahara3DLogo from './Sahara3DLogo'

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/achievements', label: 'Achievements' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/sketchbook', label: '3D Sketchbook', isSketchbook: true },
  { to: '/admin', label: 'Dashboard →', isDashboard: true },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const loc = useLocation()

  useEffect(() => setOpen(false), [loc.pathname])
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <Link to="/" className="navbar__brand" title="Sahara Sports Club Ammapalayam">
        <Sahara3DLogo
          size={42}
          showLock={false}
          variant="badge"
          interactive={true}
          title="Sahara Sports Club Ammapalayam"
        />
        <div className="navbar__name">
          SAHARA SPORTS CLUB<br />
          <small>Ammapalayam · Tamil Nadu</small>
        </div>
      </Link>
      <button
        className="navbar__burger"
        onClick={() => setOpen(!open)}
        aria-label="Toggle navigation menu"
        aria-expanded={open}
      >
        <span /><span /><span />
      </button>
      <ul className={`navbar__links ${open ? 'navbar__links--open' : ''}`}>
        {LINKS.map((l) => {
          const isActive = loc.pathname === l.to
          const extraClass = l.isDashboard
            ? 'nav-highlight'
            : l.isSketchbook
            ? 'nav-sketchbook'
            : ''
          return (
            <li key={l.to}>
              <Link
                to={l.to}
                className={`${isActive ? 'active' : ''} ${extraClass}`}
              >
                {l.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
