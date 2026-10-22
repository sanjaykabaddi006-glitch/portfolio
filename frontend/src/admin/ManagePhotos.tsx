import { useEffect, useRef, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  getAchievement,
  uploadPhotos,
  deletePhoto,
  updatePhoto,
  type AchievementPhoto,
} from '../api/client'
import AdminNav from './AdminNav'
import DashboardBackground from './DashboardBackground'
import '../styles/sketchbook-theme.css'

export default function ManagePhotos() {
  const { id } = useParams()
  const nav = useNavigate()
  type AchievementDetailType = Awaited<ReturnType<typeof getAchievement>>['data']
  const [a, setA] = useState<NonNullable<AchievementDetailType> | null>(null)
  const [selected, setSelected] = useState<File[]>([])
  const [caption, setCaption] = useState('')
  const [msg, setMsg] = useState('')
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!localStorage.getItem('sahara_token')) {
      nav('/admin/login')
      return
    }
  }, [nav])

  const reload = () => {
    if (id) {
      getAchievement(id)
        .then((res) => setA(res.data))
        .catch(() => {})
    }
  }

  useEffect(() => {
    reload()
  }, [id])

  const pick = (files: FileList | null) => {
    if (!files) return
    const ok: File[] = []
    for (const f of Array.from(files)) {
      const valid = ['image/jpeg', 'image/png', 'image/webp'].includes(f.type)
      const maxBytes = 10 * 1024 * 1024
      if (valid && f.size <= maxBytes) ok.push(f)
    }
    setSelected(ok)
  }

  const upload = async () => {
    if (selected.length === 0) return
    setUploading(true)
    setMsg('')
    try {
      const res = await uploadPhotos(Number(id), selected, caption || undefined)
      setMsg(res.data.message ?? 'Photographs added to archive.')
      setSelected([])
      setCaption('')
      if (fileRef.current) fileRef.current.value = ''
      reload()
    } catch {
      setMsg('Upload failed — verify file type (JPG/PNG/WEBP) and size (under 10MB).')
    } finally {
      setUploading(false)
    }
  }

  const remove = async (photoId: number) => {
    if (!confirm('Remove this photograph from the achievement plate?')) return
    await deletePhoto(photoId)
    reload()
  }

  const move = async (p: AchievementPhoto, dir: -1 | 1) => {
    const photos = a?.photos ?? []
    const i = photos.findIndex((x) => x.id === p.id)
    const j = i + dir
    if (j < 0 || j >= photos.length) return
    await updatePhoto(p.id, { displayOrder: photos[j].displayOrder })
    await updatePhoto(photos[j].id, { displayOrder: p.displayOrder })
    reload()
  }

  if (!a) {
    return (
      <div className="sketchbook-theme" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <p style={{ fontStyle: 'italic', fontSize: '20px', color: 'var(--sb-ink-soft)' }}>
          Retrieving plate records…
        </p>
      </div>
    )
  }

  return (
    <div className="sketchbook-theme dashboard-theme">
      <DashboardBackground showLock={true} isLocked={true} />

      <AdminNav activeTab="photos" />

      <main className="sb-container">
        <div className="sb-head">
          <div>
            <span className="sb-head__pretitle">Archival Photo Mount</span>
            <h1 className="sb-head__title">{a.title || a.tournamentName}</h1>
            <p className="sb-head__desc">
              {a.year} · {a.position} · {a.photos?.length ?? 0} photos mounted in this plate.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link to="/admin" className="sb-btn sb-btn--ghost">
              ← Dashboard
            </Link>
          </div>
        </div>

        {/* Upload Mount Board */}
        <div className="sb-mount-zone">
          <div className="sb-mount-zone__icon">📷</div>
          <p className="sb-mount-zone__text">
            <strong>Mount New Photographs</strong> into this collection plate.
          </p>
          <p style={{ fontSize: '13px', color: 'var(--sb-ink-faint)', fontStyle: 'italic', marginBottom: '16px' }}>
            Supports JPG, PNG, and WEBP formats up to 10MB each.
          </p>

          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={(e) => pick(e.target.files)}
            style={{ display: 'none' }}
            id="photo-file-input"
          />
          <label htmlFor="photo-file-input" className="sb-btn sb-btn--ghost" style={{ cursor: 'pointer' }}>
            {selected.length > 0 ? `Select More (${selected.length} Selected)` : 'Choose Photographs from Disk'}
          </label>

          {selected.length > 0 && (
            <div style={{ marginTop: '24px', maxWidth: '520px', margin: '24px auto 0' }}>
              <div className="sb-previews-grid">
                {selected.map((f, i) => (
                  <div key={i} className="sb-preview-tile">
                    <img src={URL.createObjectURL(f)} alt={f.name} />
                    <span>{f.name}</span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '16px', textAlign: 'left' }}>
                <label className="sb-form__label">Caption / Description (Optional)</label>
                <input
                  className="sb-form__input"
                  style={{ width: '100%', marginTop: '6px' }}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="e.g. Team receiving rolling trophy with dignitaries"
                />
              </div>

              <button
                className="sb-btn sb-btn--primary"
                style={{ marginTop: '16px' }}
                onClick={upload}
                disabled={uploading}
              >
                {uploading ? 'Mounting Photos…' : `Mount ${selected.length} Photo${selected.length > 1 ? 's' : ''}`}
              </button>
            </div>
          )}

          {msg && (
            <p
              style={{
                marginTop: '16px',
                fontSize: '14px',
                fontWeight: 600,
                color: msg.includes('failed') ? 'var(--sb-danger)' : 'var(--sb-earth)',
              }}
            >
              {msg}
            </p>
          )}
        </div>

        {/* Mounted Photos Grid */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '1px solid var(--sb-hairline)', paddingBottom: '12px', marginBottom: '20px' }}>
            <h2 style={{ fontFamily: 'var(--sb-display)', fontSize: '28px', fontWeight: 400, color: 'var(--sb-ink)', margin: 0 }}>
              Mounted Photographs ({a.photos?.length ?? 0})
            </h2>
            <span style={{ fontSize: '12px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--sb-ink-faint)' }}>
              Use arrows to reorder display sequence
            </span>
          </div>

          <div className="sb-photos-grid">
            {(a.photos ?? []).map((p, idx) => (
              <div key={p.id} className="sb-photo-card">
                <div className="sb-photo-card__imgwrap">
                  <img src={p.imageUrl} alt={p.caption ?? 'Mounted photo'} loading="lazy" />
                  <div className="sb-photo-card__ctrls">
                    <button
                      onClick={() => move(p, -1)}
                      disabled={idx === 0}
                      title="Move photo earlier"
                    >
                      ←
                    </button>
                    <button
                      onClick={() => move(p, 1)}
                      disabled={idx === (a.photos?.length ?? 0) - 1}
                      title="Move photo later"
                    >
                      →
                    </button>
                    <button
                      className="danger"
                      onClick={() => remove(p.id)}
                      title="Remove from plate"
                    >
                      ×
                    </button>
                  </div>
                </div>
                {p.caption && (
                  <span className="sb-photo-card__caption">{p.caption}</span>
                )}
              </div>
            ))}
          </div>

          {(a.photos?.length ?? 0) === 0 && (
            <div className="sb-form-card" style={{ textAlign: 'center', padding: '48px 20px', marginTop: '20px' }}>
              <p style={{ fontStyle: 'italic', fontSize: '17px', color: 'var(--sb-ink-soft)' }}>
                No photographs mounted on this plate yet. Select photographs above to add them to the team archive.
              </p>
            </div>
          )}
        </div>

        <div className="sb-divider" aria-hidden="true" />
      </main>
    </div>
  )
}
