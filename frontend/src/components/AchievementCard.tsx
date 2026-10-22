import { Link } from 'react-router-dom'
import type { Achievement } from '../api/client'

const FALLBACK = 'data:image/svg+xml;utf8,' + encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="420"><rect width="640" height="420" fill="#151515"/><text x="320" y="200" fill="#ff6b35" font-family="Arial" font-size="72" font-weight="bold" text-anchor="middle">🏆</text><text x="320" y="280" fill="#888" font-family="Arial" font-size="20" text-anchor="middle">Photo coming soon</text></svg>`,
)

export default function AchievementCard({ a }: { a: Achievement }) {
  return (
    <Link to={`/achievements/${a.id}`} className="card">
      <div className="card__imgwrap">
        <img src={a.coverImageUrl ?? FALLBACK} alt={`${a.tournamentName ?? a.title} — ${a.position ?? ''}`} loading="lazy" />
        {a.position && <span className="card__position">{a.position}</span>}
      </div>
      <div className="card__body">
        <p className="card__year">{a.year}</p>
        <h3 className="card__title">{a.tournamentName ?? a.title}</h3>
        {a.description && <p className="card__desc">{a.description.slice(0, 110)}…</p>}
        <span className="card__cta">View Achievement →</span>
      </div>
    </Link>
  )
}
