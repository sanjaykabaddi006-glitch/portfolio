import { LiquidFormBackground } from '../shaders/liquid-form/LiquidFormBackground'
import Sahara3DLogo from '../components/Sahara3DLogo'
import '../shaders/threeui.css'

interface DashboardBackgroundProps {
  showLock?: boolean
  isLocked?: boolean
}

export default function DashboardBackground({ showLock = true, isLocked = true }: DashboardBackgroundProps) {
  return (
    <div className="dashboard-liquid-bg" aria-hidden="true">
      {/* 3D Liquid Form WebGL Animation */}
      <div className="dashboard-liquid-bg__shader">
        <LiquidFormBackground
          speed={1.0}
          morph={1.0}
          noiseScale={1.0}
          mouseAmount={0.15}
          metal={1.0}
          camera={5.5}
          tintHue={220}
          tintAmount={0.0}
        />
      </div>

      {/* Theme Wash & Lighting Overlay */}
      <div className="dashboard-liquid-bg__overlay" />

      {/* 3D Animated Sahara Tiger Logo & Lock Medallion */}
      <div className="dashboard-liquid-bg__emblem-wrap">
        <Sahara3DLogo
          size={440}
          variant="background"
          showLock={showLock}
          isLocked={isLocked}
          interactive={true}
          title="Sahara Sports Club Ammapalayam"
        />
      </div>

      {/* Botanical corner accents */}
      <img
        className="sb-botany sb-botany--left"
        src="/landing-pages/meng-to-sketchbook/botany-left.png"
        alt=""
      />
      <img
        className="sb-botany sb-botany--right"
        src="/landing-pages/meng-to-sketchbook/botany-right.png"
        alt=""
      />
    </div>
  )
}

