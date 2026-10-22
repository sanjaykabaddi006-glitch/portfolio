import { Routes, Route } from 'react-router-dom'
import SiteBackground from './components/SiteBackground'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Achievements from './pages/Achievements'
import AchievementDetail from './pages/AchievementDetail'
import Gallery from './pages/Gallery'
import Sketchbook from './pages/Sketchbook'
import AdminLogin from './admin/AdminLogin'
import AdminDashboard from './admin/AdminDashboard'
import AchievementForm from './admin/AchievementForm'
import ManagePhotos from './admin/ManagePhotos'

export default function App() {
  return (
    <Routes>
      {/* The ThreeUI sketchbook and Admin Dashboard render outside
          the dark navbar/footer shell to provide full theme immersion */}
      <Route path="/sketchbook" element={<Sketchbook />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/achievements/new" element={<AchievementForm />} />
      <Route path="/admin/achievements/:id/edit" element={<AchievementForm />} />
      <Route path="/admin/achievements/:id/photos" element={<ManagePhotos />} />

      {/* Public site routes inside 3D Liquid Form & Medallion shell */}
      <Route
        path="*"
        element={
          <div className="app-shell">
            <SiteBackground />
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/achievements" element={<Achievements />} />
                <Route path="/achievements/:id" element={<AchievementDetail />} />
                <Route path="/gallery" element={<Gallery />} />
              </Routes>
            </main>
            <Footer />
          </div>
        }
      />
    </Routes>
  )
}

