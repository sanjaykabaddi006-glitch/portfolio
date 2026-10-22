import { Link, useNavigate } from 'react-router-dom'
import Sahara3DLogo from '../components/Sahara3DLogo'

interface AdminNavProps {
  activeTab?: 'dashboard' | 'form' | 'photos'
}

export default function AdminNav({ activeTab = 'dashboard' }: AdminNavProps) {
  const nav = useNavigate()

  const logout = () => {
    localStorage.removeItem('sahara_token')
    nav('/admin/login')
  }

  return (
    <header className="sb-header">
      <div className="sb-header__brand">
        <Sahara3DLogo size={40} showLock={true} isLocked={true} variant="badge" interactive={true} />
        <div className="sb-header__titles">
          <span className="sb-header__title">Sahara Kabaddi Archive</span>
          <span className="sb-header__subtitle">Ammapalayam · Admin Registry</span>
        </div>
      </div>
      <nav className="sb-header__nav">
        <Link
          to="/admin"
          className={`sb-header__link ${activeTab === 'dashboard' ? 'sb-header__link--active' : ''}`}
        >
          Dashboard
        </Link>
        <Link to="/sketchbook" className="sb-header__link">
          3D Sketchbook ↗
        </Link>
        <Link to="/" className="sb-header__link">
          Main Site ↗
        </Link>
        <button onClick={logout} className="sb-btn-logout" title="Sign out of registry">
          Logout
        </button>
      </nav>
    </header>
  )
}
