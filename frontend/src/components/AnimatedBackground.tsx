import { useMemo } from 'react';

interface AnimatedBackgroundProps {
  particleCount?: number;
  orbOpacity?: number;
  showGrid?: boolean;
}

export default function AnimatedBackground({
  particleCount = 18,
  orbOpacity = 0.35,
  showGrid = true,
}: AnimatedBackgroundProps) {
  // ─── BUG FIX #5 ─────────────────────────────────────────────────────────────
  // Math.random() was called directly inside JSX render, causing particles to
  // get new random positions/sizes on every re-render, resulting in visible
  // flickering and jumping. Fix: pre-compute particle data once using useMemo.
  const particles = useMemo(
    () =>
      Array.from({ length: particleCount }, () => ({
        width: Math.random() * 4 + 2,
        height: Math.random() * 4 + 2,
        left: Math.random() * 100,
        top: Math.random() * 100,
        duration: Math.random() * 10 + 10,
        delay: Math.random() * 5,
      })),
    [particleCount]
  );

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {/* Animated radial gradient orbs */}
      <div style={{ position: 'absolute', inset: 0, opacity: orbOpacity }}>
        <div
          style={{
            position: 'absolute',
            top: '15%',
            left: '5%',
            width: '550px',
            height: '550px',
            background:
              'radial-gradient(circle, rgba(59,130,246,0.6) 0%, rgba(59,130,246,0.2) 40%, transparent 70%)',
            filter: 'blur(100px)',
            animation: 'float 12s ease-in-out infinite',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '15%',
            right: '5%',
            width: '500px',
            height: '500px',
            background:
              'radial-gradient(circle, rgba(249,115,22,0.6) 0%, rgba(249,115,22,0.2) 40%, transparent 70%)',
            filter: 'blur(100px)',
            animation: 'float 15s ease-in-out infinite reverse',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '600px',
            height: '600px',
            background:
              'radial-gradient(circle, rgba(96,165,250,0.4) 0%, transparent 60%)',
            filter: 'blur(120px)',
            animation: 'pulse 10s ease-in-out infinite',
          }}
        />
      </div>

      {/* Floating particles with stable values */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        {particles.map((p, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: `${p.width}px`,
              height: `${p.height}px`,
              background: 'rgba(59,130,246,0.7)',
              borderRadius: '50%',
              left: `${p.left}%`,
              top: `${p.top}%`,
              animation: `floatParticle ${p.duration}s ease-in-out infinite`,
              animationDelay: `${p.delay}s`,
              boxShadow: '0 0 12px rgba(59,130,246,0.9)',
            }}
          />
        ))}
      </div>

      {/* Grid overlay */}
      {showGrid && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(59,130,246,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.03) 1px, transparent 1px)',
            backgroundSize: '100px 100px',
            opacity: 0.25,
          }}
        />
      )}
    </div>
  );
}
