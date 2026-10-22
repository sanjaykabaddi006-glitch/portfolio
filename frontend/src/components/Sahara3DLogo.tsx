import { useState, useEffect, useRef } from 'react'

export interface Sahara3DLogoProps {
  size?: number
  showLock?: boolean
  isLocked?: boolean
  variant?: 'badge' | 'lock' | 'background' | 'hero'
  className?: string
  interactive?: boolean
  glowColor?: string
  title?: string
}

export default function Sahara3DLogo({
  size = 140,
  showLock = false,
  isLocked = true,
  variant = 'badge',
  className = '',
  interactive = true,
  glowColor = 'rgba(212, 168, 83, 0.45)',
  title = 'Sahara Sports Club Ammapalayam',
}: Sahara3DLogoProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [gleamPos, setGleamPos] = useState({ x: 50, y: 50 })
  const [isHovered, setIsHovered] = useState(false)

  // Smooth pointer tracking for 3D tilt
  useEffect(() => {
    if (!interactive) return

    const handlePointerMove = (e: MouseEvent | PointerEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      // Calculate distance from center of medallion
      const dx = (e.clientX - centerX) / (window.innerWidth / 2)
      const dy = (e.clientY - centerY) / (window.innerHeight / 2)

      // Clamp max tilt angles
      const maxTilt = variant === 'background' ? 14 : variant === 'hero' ? 26 : 22
      const targetRotX = -Math.max(-maxTilt, Math.min(maxTilt, dy * maxTilt))
      const targetRotY = Math.max(-maxTilt, Math.min(maxTilt, dx * maxTilt))

      setRotation({ x: targetRotX, y: targetRotY })

      // Specular sheen light source angle
      const gleamX = 50 + dx * 40
      const gleamY = 50 + dy * 40
      setGleamPos({ x: gleamX, y: gleamY })
    }

    const handlePointerLeave = () => {
      setIsHovered(false)
      if (variant !== 'background') {
        setRotation({ x: 0, y: 0 })
        setGleamPos({ x: 50, y: 50 })
      }
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    document.addEventListener('pointerleave', handlePointerLeave)
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      document.removeEventListener('pointerleave', handlePointerLeave)
    }
  }, [interactive, variant])

  const isBg = variant === 'background'
  const isHero = variant === 'hero'
  const finalSize = size
  const shackleHeight = Math.round(finalSize * 0.42)
  const shackleWidth = Math.round(finalSize * 0.52)

  return (
    <div
      ref={containerRef}
      className={`sahara-3d-logo-root sahara-3d-logo--${variant} ${isBg ? 'sahara-3d-logo--bg' : ''} ${
        isHero ? 'sahara-3d-logo--hero' : ''
      } ${className}`}
      style={{
        width: `${finalSize}px`,
        height: `${finalSize + (showLock ? shackleHeight * 0.65 : 0)}px`,
        perspective: isHero ? '1500px' : '1200px',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title={title}
    >
      <div
        className="sahara-3d-logo__stage"
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) ${
            isHovered && !isBg ? 'scale3d(1.06, 1.06, 1.06)' : 'scale3d(1, 1, 1)'
          }`,
          transformStyle: 'preserve-3d',
          transition: isHovered
            ? 'transform 0.12s cubic-bezier(0.2, 0.8, 0.4, 1)'
            : 'transform 0.6s cubic-bezier(0.2, 0.8, 0.4, 1)',
        }}
      >
        {/* Layer 0: Deep 3D Cast Shadow */}
        <div
          className="sahara-3d-logo__shadow"
          style={{
            transform: `translateZ(-40px) translate(${rotation.y * -1.2}px, ${rotation.x * 1.5 + 16}px) scale(${
              isHovered ? 1.08 : 0.95
            })`,
            boxShadow: `0 24px 60px rgba(0, 0, 0, 0.65), 0 8px 24px ${glowColor}`,
          }}
        />

        {/* Optional 3D Metallic Lock Shackle */}
        {showLock && (
          <div
            className={`sahara-3d-shackle ${isLocked ? 'is-locked' : 'is-unlocked'}`}
            style={{
              width: `${shackleWidth}px`,
              height: `${shackleHeight}px`,
              transform: `translateX(-50%) translateZ(${isLocked ? '24px' : '45px'}) ${
                isLocked ? 'translateY(0)' : 'translateY(-14px) rotateZ(-14deg)'
              }`,
            }}
          >
            <div className="sahara-3d-shackle__arch" />
            <div className="sahara-3d-shackle__leg sahara-3d-shackle__leg--left" />
            <div className="sahara-3d-shackle__leg sahara-3d-shackle__leg--right" />
            <div className="sahara-3d-shackle__keyway" />
          </div>
        )}

        {/* Layer 1: Outer 3D Gold Orbit / Beveled Rim */}
        <div
          className="sahara-3d-logo__rim"
          style={{
            width: `${finalSize}px`,
            height: `${finalSize}px`,
            transform: 'translateZ(10px)',
          }}
        >
          {/* Engraved rim knurling & compass ticks */}
          <div className="sahara-3d-logo__ticks" />
        </div>

        {/* Layer 2: Main Medallion Body with Sahara Tiger Face */}
        <div
          className="sahara-3d-logo__body"
          style={{
            width: `${finalSize - 8}px`,
            height: `${finalSize - 8}px`,
            transform: 'translateZ(24px)',
          }}
        >
          <img
            src="/images/sahara-logo.png"
            alt={title}
            className="sahara-3d-logo__img"
            draggable={false}
          />

          {/* Layer 3: Dynamic Specular Reflection / Chrome Gleam */}
          <div
            className="sahara-3d-logo__gleam"
            style={{
              background: `radial-gradient(circle at ${gleamPos.x}% ${gleamPos.y}%, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.15) 30%, transparent 70%)`,
              transform: 'translateZ(34px)',
            }}
          />

          {/* Layer 4: Glass Bevel Highlight Ring */}
          <div
            className="sahara-3d-logo__lens"
            style={{
              transform: 'translateZ(38px)',
            }}
          />
        </div>

        {/* Lock Keyhole Accent (if showLock is on and size permits) */}
        {showLock && finalSize >= 100 && (
          <div
            className="sahara-3d-lock-badge"
            style={{
              transform: 'translateZ(46px) translateY(42px)',
            }}
          >
            <div className="sahara-3d-lock-badge__icon">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor">
                <path
                  d="M12 15v3m-4-7V8a4 4 0 018 0v3m-10 0h12a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6a2 2 0 012-2z"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="sahara-3d-lock-badge__label">SECURE REGISTRY</span>
          </div>
        )}

        {/* Background Variant Aura Rings */}
        {isBg && (
          <div
            className="sahara-3d-logo__aura"
            style={{
              width: `${finalSize * 1.3}px`,
              height: `${finalSize * 1.3}px`,
              transform: 'translateZ(-20px)',
            }}
          />
        )}
      </div>
    </div>
  )
}
