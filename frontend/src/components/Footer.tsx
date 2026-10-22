import { Link } from 'react-router-dom'
import Sahara3DLogo from './Sahara3DLogo'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="rule" aria-hidden="true" style={{ margin: '0 auto 24px', opacity: 0.35 }} />
      <div className="footer__inner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Sahara3DLogo
            size={48}
            showLock={false}
            variant="badge"
            interactive={true}
            title="Sahara Sports Club Ammapalayam"
          />
          <div>
            <h3>SAHARA SPORTS CLUB · AMMAPALAYAM</h3>
            <p>Built to raid. Trained to win. Official kabaddi tournament archive.</p>
          </div>
        </div>
        <div className="footer__meta">
          <p>© {new Date().getFullYear()} Sahara Sports Club, Perambalur District</p>
          <p style={{ marginTop: '6px' }}>
            <Link to="/sketchbook" style={{ marginRight: '16px' }}>3D Sketchbook</Link>
            <Link to="/admin">Admin Dashboard</Link>
          </p>
        </div>
      </div>
    </footer>
  )
}