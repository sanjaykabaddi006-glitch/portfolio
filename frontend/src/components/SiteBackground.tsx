import { LiquidFormBackground } from '../shaders/liquid-form/LiquidFormBackground'
import Sahara3DLogo from './Sahara3DLogo'

interface SiteBackgroundProps {
  showEmblem?: boolean
}

export default function SiteBackground({ showEmblem = true }: SiteBackgroundProps) {
  return (
    <div className="site-liquid-bg" aria-hidden="true">
      {/* 3D Liquid Form WebGL Fluid Animation */}
      <div className="site-liquid-bg__shader">
        <LiquidFormBackground
          speed={0.85}
          morph={1.0}
          noiseScale={1.1}
          mouseAmount={0.18}
          metal={1.0}
          camera={5.2}
          tintHue={36}
          tintAmount={0.28}
        />
      </div>

      {/* Warm Vignette and Lighting Wash Overlay */}
      <div className="site-liquid-bg__overlay" />

      {/* Floating 3D Animated Sahara Tiger Medallion */}
      {showEmblem && (
        <div className="site-liquid-bg__emblem-wrap">
          <Sahara3DLogo
            size={420}
            variant="background"
            showLock={false}
            interactive={true}
            title="Sahara Sports Club Ammapalayam"
          />
        </div>
      )}

      {/* Archival Botanical Corner Accents */}
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
