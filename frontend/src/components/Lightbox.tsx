import { useEffect } from 'react'
import type { AchievementPhoto } from '../api/client'

interface Props {
  photos: AchievementPhoto[]
  index: number
  onIndex: (i: number) => void
  onClose: () => void
}

export default function Lightbox({ photos, index, onIndex, onClose }: Props) {
  const photo = photos[index]

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onIndex((index + 1) % photos.length)
      if (e.key === 'ArrowLeft') onIndex((index - 1 + photos.length) % photos.length)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [index, photos.length, onIndex, onClose])

  if (!photo) return null

  return (
    <div className="lightbox" onClick={onClose}>
      <button className="lightbox__close" onClick={onClose} aria-label="Close">×</button>
      <button className="lightbox__nav lightbox__nav--prev" onClick={(e) => { e.stopPropagation(); onIndex((index - 1 + photos.length) % photos.length) }} aria-label="Previous">‹</button>
      <figure onClick={(e) => e.stopPropagation()}>
        <img src={photo.imageUrl} alt={photo.caption ?? 'Achievement photo'} />
        {photo.caption && <figcaption>{photo.caption}</figcaption>}
      </figure>
      <button className="lightbox__nav lightbox__nav--next" onClick={(e) => { e.stopPropagation(); onIndex((index + 1) % photos.length) }} aria-label="Next">›</button>
      <div className="lightbox__counter" onClick={(e) => e.stopPropagation()}>{index + 1} / {photos.length}</div>
    </div>
  )
}
