import { useEffect, useState } from 'react';
import { ArtifactFrame } from './ArtifactFrame';

/**
 * Expanding pulse rings radiating from a central heartbeat node —
 * concentric waves that scale outward and fade. Unique to the Resources page.
 */
export function PulseRings() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const update = () => setReduced(mq.matches);
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const cx = 200, cy = 110;
  const rings = [0, 1, 2, 3, 4];

  return (
    <ArtifactFrame label="PUL-01" sublabel="Knowledge pulse">
      <svg viewBox="0 0 400 220" className="w-full h-auto" role="img" aria-label="Expanding pulse rings radiating from a central heartbeat node">
        {/* concentric static guides */}
        {[30, 55, 80, 105].map((r) => (
          <circle key={r} cx={cx} cy={cy} r={r} fill="none" stroke="rgba(46,42,36,0.06)" strokeWidth="1" />
        ))}

        {/* expanding rings */}
        {!reduced && rings.map((i) => (
          <circle
            key={`pulse-${i}`}
            cx={cx}
            cy={cy}
            r="20"
            fill="none"
            stroke="var(--color-accent-tertiary)"
            strokeWidth="2"
            style={{
              transformOrigin: `${cx}px ${cy}px`,
              animation: `pulse-expand 3s ease-out ${i * 0.6}s infinite`,
            }}
          />
        ))}

        {/* heartbeat ECG line */}
        <path
          d="M 40 110 L 100 110 L 115 80 L 130 140 L 145 110 L 170 110 L 185 70 L 200 150 L 215 110 L 260 110 L 275 90 L 290 130 L 305 110 L 360 110"
          fill="none"
          stroke="var(--color-highlight)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.7"
          strokeDasharray="600"
          style={reduced ? {} : { animation: 'trace-dash 3s linear infinite' }}
        />

        {/* center node */}
        <circle cx={cx} cy={cy} r="14" fill="var(--color-ink)" opacity="0.1" />
        <circle cx={cx} cy={cy} r="8" fill="var(--color-ink)" />
        <circle cx={cx} cy={cy} r="3.5" fill="var(--color-highlight)" className="signal-pulse" />
      </svg>
    </ArtifactFrame>
  );
}
