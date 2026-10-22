import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { getAchievement, createAchievement, updateAchievement } from '../api/client'
import AdminNav from './AdminNav'
import DashboardBackground from './DashboardBackground'
import '../styles/sketchbook-theme.css'

export default function AchievementForm() {
  const { id } = useParams()
  const nav = useNavigate()
  const [form, setForm] = useState({
    title: '',
    description: '',
    tournamentName: '',
    year: new Date().getFullYear(),
    position: '1st Place Champions',
    achievementDate: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem('sahara_token')) {
      nav('/admin/login')
      return
    }
    if (id) {
      getAchievement(id)
        .then((res) => {
          const a = res.data
          setForm({
            title: a.title,
            description: a.description ?? '',
            tournamentName: a.tournamentName ?? '',
            year: a.year ?? new Date().getFullYear(),
            position: a.position ?? '1st Place Champions',
            achievementDate: a.achievementDate ?? '',
          })
        })
        .catch(() => {})
    }
  }, [id, nav])

  const set = (k: string, v: string | number) => setForm((f) => ({ ...f, [k]: v }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const payload = {
        title: form.title,
        description: form.description,
        tournamentName: form.tournamentName || form.title,
        year: Number(form.year),
        position: form.position,
        achievementDate: form.achievementDate || null,
      }
      if (id) await updateAchievement(Number(id), payload)
      else await createAchievement(payload)
      nav('/admin')
    } catch {
      setError('Failed to record plate — please check that title and year are provided.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="sketchbook-theme dashboard-theme">
      <DashboardBackground showLock={true} isLocked={true} />

      <AdminNav activeTab="form" />

      <main className="sb-container sb-container--narrow">
        <div className="sb-form-card">
          <div style={{ marginBottom: '28px' }}>
            <span className="sb-head__pretitle">Archival Entry</span>
            <h1
              style={{
                fontFamily: 'var(--sb-display)',
                fontSize: '36px',
                fontWeight: 400,
                color: 'var(--sb-ink)',
                lineHeight: 1.1,
                margin: 0,
              }}
            >
              {id ? 'Edit Achievement Plate' : 'Record New Plate'}
            </h1>
            <p
              style={{
                fontSize: '15px',
                color: 'var(--sb-ink-soft)',
                fontStyle: 'italic',
                marginTop: '6px',
              }}
            >
              Enter tournament victory details to preserve in the team collection.
            </p>
          </div>

          <form onSubmit={submit} className="sb-form">
            <div className="sb-form__group">
              <label className="sb-form__label">Achievement Title *</label>
              <input
                className="sb-form__input"
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
                placeholder="e.g. 1st Place Champions — AP Sports Club"
                required
              />
            </div>

            <div className="sb-form__group">
              <label className="sb-form__label">Tournament / Club Name</label>
              <input
                className="sb-form__input"
                value={form.tournamentName}
                onChange={(e) => set('tournamentName', e.target.value)}
                placeholder="e.g. AP Sports Club Ayyanarpalayam 3rd Year Tournament"
              />
              <span className="sb-form__hint">Defaults to title if left blank.</span>
            </div>

            <div className="sb-form__row">
              <div className="sb-form__group">
                <label className="sb-form__label">Year *</label>
                <input
                  type="number"
                  className="sb-form__input"
                  value={form.year}
                  onChange={(e) => set('year', Number(e.target.value))}
                  required
                />
              </div>

              <div className="sb-form__group">
                <label className="sb-form__label">Position / Honor</label>
                <select
                  className="sb-form__select"
                  value={form.position}
                  onChange={(e) => set('position', e.target.value)}
                >
                  {[
                    '1st Place Champions',
                    '1st Place',
                    'Runner-up (2nd Prize)',
                    '3rd Place (Bronze Trophy)',
                    '3rd Prize',
                    'Best Team',
                    'Best Raider',
                    'Club Icon / Legend',
                    'Other',
                  ].map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="sb-form__group">
              <label className="sb-form__label">Tournament Date</label>
              <input
                type="date"
                className="sb-form__input"
                value={form.achievementDate}
                onChange={(e) => set('achievementDate', e.target.value)}
              />
            </div>

            <div className="sb-form__group">
              <label className="sb-form__label">Victory Description / Notes</label>
              <textarea
                className="sb-form__textarea"
                rows={5}
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                placeholder="Describe match scores, cash prize, awards presented, player highlights…"
              />
            </div>

            {error && <div className="sb-form__error">{error}</div>}

            <div style={{ display: 'flex', gap: '14px', marginTop: '12px' }}>
              <button
                type="submit"
                className="sb-btn sb-btn--primary"
                disabled={loading}
              >
                {loading ? 'Preserving Plate…' : id ? 'Save Changes' : 'Record Plate'}
              </button>
              <Link to="/admin" className="sb-btn sb-btn--ghost">
                Cancel
              </Link>
            </div>
          </form>
        </div>

        <div className="sb-divider" aria-hidden="true" />
      </main>
    </div>
  )
}
