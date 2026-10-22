import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAchievements, type Achievement } from '../api/client'
import AchievementCard from '../components/AchievementCard'
import Sahara3DLogo from '../components/Sahara3DLogo'

function useCountUp(target: number, active: boolean, duration = 1400) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!active) return
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      setValue(Math.round(target * (1 - Math.pow(1 - t, 3))))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, active, duration])
  return value
}

const STATS = [
  { target: 12, suffix: '+', label: 'TOURNAMENTS' },
  { target: 8, suffix: '', label: 'CHAMPIONSHIPS' },
  { target: 24, suffix: '+', label: 'VICTORIES' },
  { target: 2018, suffix: '', label: 'ESTABLISHED' },
]

function StatItem({ target, suffix, label, active }: { target: number; suffix: string; label: string; active: boolean }) {
  const value = useCountUp(target, active)
  return (
    <div className="stat">
      <div className="stat__value">{value}{suffix}</div>
      <div className="stat__label">{label}</div>
    </div>
  )
}

export default function Home() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [statsActive, setStatsActive] = useState(false)
  const statsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    getAchievements().then((res) => setAchievements(res.data.slice(0, 9))).catch(() => {})
  }, [])

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setStatsActive(true),
      { threshold: 0.3 },
    )
    if (statsRef.current) obs.observe(statsRef.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div className="home">
      <section className="hero">
        <div className="hero__container">
          <div className="hero__content">
            <div className="hero__badge-row">
              <Sahara3DLogo
                size={84}
                showLock={false}
                variant="hero"
                interactive={true}
                title="Sahara Sports Club Official 3D Medallion"
              />
              <div className="hero__badge-meta">
                <div className="hero__badge">
                  <span className="hero__badge-dot" />
                  <span>AMMAPALAYAM · TAMIL NADU</span>
                </div>
                <p className="hero__eyebrow">SAHARA SPORTS CLUB</p>
              </div>
            </div>
            <h1 className="hero__title">KABADDI</h1>
            <p className="hero__tagline">BUILT TO RAID. TRAINED TO WIN.</p>
            <p className="hero__desc">
              Home of champions. Relentless raiders, rock-solid defense, and an unbroken legacy of tournament victories across Tamil Nadu state and district championships.
            </p>
            <div className="hero__actions">
              <Link to="/sketchbook" className="btn btn--primary">📖 OPEN 3D BOOK</Link>
              <Link to="/achievements" className="btn btn--ghost">ALL ACHIEVEMENTS</Link>
              <Link to="/gallery" className="btn btn--ghost">PHOTO GALLERY</Link>
            </div>
          </div>

          <div className="hero__media">
            <div className="hero__photo-wrapper">
              <img
                src="/images/sahara-champion.jpg"
                alt="Sahara Kabaddi Team 1st Place Champions holding rolling trophy"
                className="hero__photo"
                loading="eager"
              />
              <div className="hero__photo-overlay" aria-hidden="true" />
              <div className="hero__photo-badge">
                <span className="hero__photo-badge-icon">🏆</span>
                <div className="hero__photo-badge-text">
                  <strong>1st Place Champions</strong>
                  <small>Sports Club Ayyanarpalayam Rolling Trophy</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="stats" ref={statsRef}>
        {STATS.map((s) => (
          <StatItem key={s.label} target={s.target} suffix={s.suffix} label={s.label} active={statsActive} />
        ))}
      </section>

      <section className="section">
        <div className="section__head">
          <h2>TOURNAMENT ACHIEVEMENTS</h2>
          <Link to="/achievements" className="section__more">View all entries →</Link>
        </div>
        <div className="grid grid--cards">
          {achievements.map((a) => <AchievementCard key={a.id} a={a} />)}
        </div>
        {achievements.length === 0 && (
          <p className="empty">No achievements yet — add them via the admin dashboard.</p>
        )}
      </section>
    </div>
  )
}
