import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../api/client'
import DashboardBackground from './DashboardBackground'
import Sahara3DLogo from '../components/Sahara3DLogo'
import '../styles/sketchbook-theme.css'

export default function AdminLogin() {
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await login(username, password)
      localStorage.setItem('sahara_token', res.data.token)
      nav('/admin')
    } catch {
      setError('Invalid username or password — please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="sketchbook-theme dashboard-theme" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '24px' }}>
      <DashboardBackground showLock={true} isLocked={!loading} />

      <div className="sb-container sb-container--narrow" style={{ width: '100%', margin: '0' }}>
        <div className="sb-form-card" style={{ maxWidth: '480px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '18px' }}>
              <Sahara3DLogo
                size={110}
                showLock={true}
                isLocked={!loading}
                variant="lock"
                interactive={true}
                title="Sahara Sports Club Admin Registry Vault"
              />
            </div>
            <span
              style={{
                fontSize: '11px',
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                color: 'var(--sb-earth)',
                display: 'block',
                marginBottom: '4px',
              }}
            >
              Ammapalayam · Sahara Kabaddi Club
            </span>
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
              Archive Sign In
            </h1>
            <p
              style={{
                fontSize: '14.5px',
                color: 'var(--sb-ink-soft)',
                fontStyle: 'italic',
                marginTop: '8px',
              }}
            >
              Authorized access to tournament trophies and achievement records.
            </p>
          </div>

          <form onSubmit={submit} className="sb-form">
            <div className="sb-form__group">
              <label className="sb-form__label">Username</label>
              <input
                className="sb-form__input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                required
                autoComplete="username"
              />
            </div>

            <div className="sb-form__group">
              <label className="sb-form__label">Password</label>
              <input
                type="password"
                className="sb-form__input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>

            {error && <div className="sb-form__error">{error}</div>}

            <div
              style={{
                background: 'rgba(154, 106, 62, 0.08)',
                border: '1px solid rgba(154, 106, 62, 0.18)',
                borderRadius: '10px',
                padding: '10px 14px',
                fontSize: '12.5px',
                color: 'var(--sb-ink-soft)',
              }}
            >
              Default seeded credentials: <strong style={{ color: 'var(--sb-earth)' }}>admin</strong> /{' '}
              <strong style={{ color: 'var(--sb-earth)' }}>admin123</strong>
            </div>

            <button
              type="submit"
              className="sb-btn sb-btn--primary"
              disabled={loading}
              style={{ width: '100%', padding: '12px' }}
            >
              {loading ? 'Authenticating…' : 'Access Archive Dashboard'}
            </button>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '13px' }}>
              <Link to="/" style={{ color: 'var(--sb-ink-soft)', textDecoration: 'underline' }}>
                ← Return to Home
              </Link>
              <Link to="/sketchbook" style={{ color: 'var(--sb-earth)', textDecoration: 'underline' }}>
                View 3D Sketchbook ↗
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
