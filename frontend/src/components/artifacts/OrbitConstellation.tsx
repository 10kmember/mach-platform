import { useEffect, useRef, useState } from 'react';
import { ArtifactFrame } from './ArtifactFrame';

/**
 * Orbiting constellation: a central core with satellites revolving on
 * elliptical paths at different speeds and radii. Each satellite leaves
 * a faint trailing dot. Unique to the Product page.
 */
export function OrbitConstellation() {
  const [reduced, setReduced] = useState(false);
  const [t, setT] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const update = () => setReduced(mq.matches);
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (reduced) return;
    let start = 0;
    const tick = (now: number) => {
      if (!start) start = now;
      setT((now - start) / 1000);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [reduced]);

  const cx = 200, cy = 110;
  const sats = [
    { rx: 70, ry: 38, speed: 0.6, phase: 0, color: 'var(--color-accent-tertiary)', size: 5 },
    { rx: 110, ry: 60, speed: 0.35, phase: 1.5, color: 'var(--color-accent-secondary)', size: 4 },
    { rx: 150, ry: 82, speed: 0.22, phase: 3.0, color: 'var(--color-highlight)', size: 6 },
    { rx: 90, ry: 50, speed: 0.45, phase: 4.2, color: 'var(--color-accent-primary)', size: 3.5 },
  ];

  return (
    <ArtifactFrame label="ORB-01" sublabel="Core constellation">
      <svg viewBox="0 0 400 220" className="w-full h-auto" role="img" aria-label="Orbiting constellation of satellites around a central core">
        {/* orbit paths */}
        {sats.map((s, i) => (
          <ellipse
            key={`orbit-${i}`}
            cx={cx}
            cy={cy}
            rx={s.rx}
            ry={s.ry}
            fill="none"
            stroke="rgba(46,42,36,0.08)"
            strokeWidth="1"
            strokeDasharray="2 4"
          />
        ))}

        {/* trailing dots */}
        {!reduced && sats.map((s, i) => {
          const trailCount = 6;
          return Array.from({ length: trailCount }).map((_, j) => {
            const dt = t - j * 0.05;
            const angle = dt * s.speed + s.phase;
            const x = cx + s.rx * Math.cos(angle);
            const y = cy + s.ry * Math.sin(angle);
            return (
              <circle
                key={`trail-${i}-${j}`}
                cx={x}
                cy={y}
                r={s.size * 0.4}
                fill={s.color}
                opacity={(1 - j / trailCount) * 0.3}
              />
            );
          });
        })}

        {/* satellites */}
        {sats.map((s, i) => {
          const angle = reduced ? s.phase : t * s.speed + s.phase;
          const x = cx + s.rx * Math.cos(angle);
          const y = cy + s.ry * Math.sin(angle);
          return (
            <g key={`sat-${i}`}>
              <circle cx={x} cy={y} r={s.size + 3} fill={s.color} opacity={0.15} />
              <circle cx={x} cy={y} r={s.size} fill={s.color} />
            </g>
          );
        })}

        {/* core */}
        <circle cx={cx} cy={cy} r="20" fill="var(--color-ink)" opacity="0.08" className="glow-breathe" style={{ transformOrigin: `${cx}px ${cy}px`, animation: 'glow-breathe 3s ease-in-out infinite' }} />
        <circle cx={cx} cy={cy} r="12" fill="var(--color-ink)" />
        <circle cx={cx} cy={cy} r="5" fill="var(--color-highlight)" className="signal-pulse" />
      </svg>
    </ArtifactFrame>
  );
}
