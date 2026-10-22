import { useEffect, useState } from 'react'
import { getAchievements, type AchievementPhoto } from '../api/client'
import Lightbox from '../components/Lightbox'

export default function Gallery() {
  const [items, setItems] = useState<AchievementPhoto[]>([])
  const [lightbox, setLightbox] = useState<number | null>(null)

  useEffect(() => {
    getAchievements().then((res) => {
      const all: AchievementPhoto[] = res.data.flatMap((a) => a.photos ?? [])
      setItems(all.sort((x, y) => x.displayOrder - y.displayOrder))
    }).catch(() => setItems([]))
  }, [])

  return (
    <div className="page">
      <section className="section">
        <div className="section__head"><h2>PHOTO GALLERY</h2><p className="section__more">{items.length} photos</p></div>
        {items.length > 0 ? (
          <div className="grid grid--photos">
            {items.map((p, i) => (
              <button key={p.id} className="photo" onClick={() => setLightbox(i)}>
                <img src={p.imageUrl} alt={p.caption ?? 'Gallery photo'} loading="lazy" />
                {p.caption && <span className="photo__caption">{p.caption}</span>}
              </button>
            ))}
          </div>
        ) : (
          <p className="empty">No photos yet — upload them via the admin dashboard.</p>
        )}
      </section>
      {lightbox !== null && (
        <Lightbox photos={items} index={lightbox} onIndex={setLightbox} onClose={() => setLightbox(null)} />
      )}
    </div>
  )
}
