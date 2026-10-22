import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getAchievements, deleteAchievement, type Achievement } from '../api/client'
import AdminNav from './AdminNav'
import DashboardBackground from './DashboardBackground'
import Sahara3DLogo from '../components/Sahara3DLogo'
import '../styles/sketchbook-theme.css'

export default function AdminDashboard() {
  const [items, setItems] = useState<Achievement[]>([])
  const [confirm, setConfirm] = useState<number | null>(null)
  const nav = useNavigate()

  useEffect(() => {
    if (!localStorage.getItem('sahara_token')) {
      nav('/admin/login')
      return
    }
    getAchievements().then((res) => setItems(res.data)).catch(() => {})
  }, [nav])

  const remove = async (id: number) => {
    await deleteAchievement(id)
    setItems((xs) => xs.filter((x) => x.id !== id))
    setConfirm(null)
  }

  const totalPhotos = items.reduce((n, a) => n + (a.photos?.length ?? 0), 0)
  const champCount = items.filter((a) =>
    ['1st Place', '1st Place Champions', 'Champions'].includes(a.position ?? '')
  ).length

  return (
    <div className="sketchbook-theme dashboard-theme">
      <DashboardBackground showLock={true} isLocked={true} />

      <AdminNav activeTab="dashboard" />

      <main className="sb-container">
        <div className="sb-head">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <Sahara3DLogo size={34} showLock={true} isLocked={true} variant="badge" interactive={true} />
              <span className="sb-head__pretitle" style={{ margin: 0 }}>Archival Registry · Ammapalayam · Authenticated</span>
            </div>
            <h1 className="sb-head__title">Sahara Team Dashboard</h1>
            <p className="sb-head__desc">
              Manage championships, rolling trophies, player tributes, and archival photographs.
            </p>
          </div>
          <div>
            <Link to="/admin/achievements/new" className="sb-btn sb-btn--primary">
              + Record Achievement
            </Link>
          </div>
        </div>

        {/* Archival Metrics */}
        <div className="sb-stats">
          <div className="sb-stat-plate">
            <div className="sb-stat-plate__label">Total Achievements</div>
            <div className="sb-stat-plate__val">{items.length}</div>
            <div className="sb-stat-plate__sub">Documented tournament entries</div>
          </div>
          <div className="sb-stat-plate">
            <div className="sb-stat-plate__label">Archival Photos</div>
            <div className="sb-stat-plate__val">{totalPhotos}</div>
            <div className="sb-stat-plate__sub">High-resolution victory plates</div>
          </div>
          <div className="sb-stat-plate">
            <div className="sb-stat-plate__label">Championships Won</div>
            <div className="sb-stat-plate__val">{champCount}</div>
            <div className="sb-stat-plate__sub">1st place titles & trophies</div>
          </div>
        </div>

        {/* Championship Plates List */}
        <div className="sb-plates-list">
          {items.map((a, idx) => (
            <div key={a.id} className="sb-plate-card">
              <div className="sb-plate-card__thumb">
                {a.coverImageUrl ? (
                  <img src={a.coverImageUrl} alt={a.title} loading="lazy" />
                ) : (
                  <div className="sb-plate-card__thumb-placeholder">🏆</div>
                )}
              </div>

              <div className="sb-plate-card__info">
                <div className="sb-plate-card__meta">
                  <span className="sb-plate-card__num">PLATE {String(idx + 1).padStart(2, '0')}</span>
                  <span className="sb-plate-card__dot" />
                  <span className="sb-plate-card__year">{a.year}</span>
                  {a.position && (
                    <>
                      <span className="sb-plate-card__dot" />
                      <span className="sb-plate-card__badge">{a.position}</span>
                    </>
                  )}
                  <span className="sb-plate-card__dot" />
                  <span className="sb-plate-card__year">
                    📷 {a.photos?.length ?? (a.coverImageUrl ? 1 : 0)} photos
                  </span>
                </div>

                <h3 className="sb-plate-card__title">
                  {a.title || a.tournamentName}
                </h3>

                {a.description && (
                  <p className="sb-plate-card__desc">{a.description}</p>
                )}
              </div>

              <div className="sb-plate-card__actions">
                <Link
                  to={`/admin/achievements/${a.id}/photos`}
                  className="sb-btn sb-btn--sm sb-btn--earth"
                >
                  Manage Photos ({a.photos?.length ?? 0})
                </Link>
                <Link
                  to={`/admin/achievements/${a.id}/edit`}
                  className="sb-btn sb-btn--sm sb-btn--ghost"
                >
                  Edit Plate
                </Link>
                {confirm === a.id ? (
                  <>
                    <button
                      className="sb-btn sb-btn--sm sb-btn--danger"
                      onClick={() => remove(a.id)}
                    >
                      Confirm Delete
                    </button>
                    <button
                      className="sb-btn sb-btn--sm sb-btn--ghost"
                      onClick={() => setConfirm(null)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    className="sb-btn sb-btn--sm sb-btn--danger"
                    onClick={() => setConfirm(a.id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}

          {items.length === 0 && (
            <div className="sb-form-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
              <p style={{ fontSize: '20px', fontStyle: 'italic', color: 'var(--sb-ink-soft)' }}>
                No achievement plates recorded yet. Click "+ Record Achievement" to begin the collection.
              </p>
            </div>
          )}
        </div>

        <div className="sb-divider" aria-hidden="true" />
      </main>
    </div>
  )
}
