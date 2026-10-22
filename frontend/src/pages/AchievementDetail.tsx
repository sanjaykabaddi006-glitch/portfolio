import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getAchievement, type AchievementPhoto } from '../api/client'
import Lightbox from '../components/Lightbox'

const FALLBACK = 'data:image/svg+xml;utf8,' + encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="700"><rect width="1200" height="700" fill="#151515"/><text x="600" y="330" fill="#ff6b35" font-family="Arial" font-size="110" font-weight="bold" text-anchor="middle">🏆</text><text x="600" y="470" fill="#888" font-family="Arial" font-size="26" text-anchor="middle">Photos coming soon</text></svg>`,
)

export default function AchievementDetail() {
  const { id } = useParams()
  const [a, setA] = useState<AchievementDetailType | null>(null)
  const [lightbox, setLightbox] = useState<number | null>(null)

  type AchievementDetailType = Awaited<ReturnType<typeof getAchievement>>['data']

  useEffect(() => {
    getAchievement(id!).then((res) => setA(res.data)).catch(() => {})
  }, [id])

  if (!a) return <div className="page"><p className="empty">Loading…</p></div>

  const photos: AchievementPhoto[] = a.photos ?? []
  const featured = a.coverImageUrl ?? photos[0]?.imageUrl ?? FALLBACK

  return (
    <div className="page">
      <section className="section">
        <Link to="/achievements" className="back">← Back to Achievements</Link>
        <div className="detail">
          <div className="detail__cover">
            <img src={featured} alt={`${a.tournamentName ?? a.title} cover`} />
          </div>
          <div className="detail__info">
            <p className="detail__year">{a.year} {a.position ? `— ${a.position}` : ''}</p>
            <h2>{a.tournamentName ?? a.title}</h2>
            {a.achievementDate && <p className="detail__date">{new Date(a.achievementDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>}
            <p className="detail__desc">{a.description}</p>
          </div>
        </div>

        {photos.length > 0 && (
          <>
            <h3 className="gallery__head">ACHIEVEMENT PHOTOS</h3>
            <div className="grid grid--photos">
              {photos.map((p, i) => (
                <button key={p.id} className="photo" onClick={() => setLightbox(i)}>
                  <img src={p.imageUrl} alt={p.caption ?? 'Achievement photo'} loading="lazy" />
                  {p.caption && <span className="photo__caption">{p.caption}</span>}
                </button>
              ))}
            </div>
          </>
        )}
        {photos.length === 0 && (
          <div className="grid grid--photos"><div className="detail__cover"><img src={FALLBACK} alt="No photos" /></div></div>
        )}
      </section>
      {lightbox !== null && (
        <Lightbox photos={photos} index={lightbox} onIndex={setLightbox} onClose={() => setLightbox(null)} />
      )}
    </div>
  )
}
