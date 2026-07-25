import { useEffect, useState } from 'react';
import { ArtifactFrame } from './ArtifactFrame';

/**
 * Use-case orbit: a central hub with category icons rotating around it,
 * connected by spokes that pulse with data flow. Unique to the Use Cases page.
 */
export function UseCaseOrbit() {
  const [reduced, setReduced] = useState(false);
  const [angle, setAngle] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const update = () => setReduced(mq.matches);
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    let start = 0;
    const tick = (now: number) => {
      if (!start) start = now;
      setAngle(((now - start) / 1000) * 15);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  const cx = 200, cy = 110;
  const R = 80;
  const nodes = [
    { label: 'ENG', color: 'var(--color-accent-primary)' },
    { label: 'OPS', color: 'var(--color-accent-tertiary)' },
    { label: 'FIN', color: 'var(--color-accent-secondary)' },
    { label: 'MKT', color: 'var(--color-highlight)' },
    { label: 'SEC', color: 'var(--color-accent-primary)' },
    { label: 'SPT', color: 'var(--color-accent-tertiary)' },
  ];

  return (
    <ArtifactFrame label="USE-01" sublabel="Use case orbit">
      <svg viewBox="0 0 400 220" className="w-full h-auto" role="img" aria-label="Use case categories orbiting a central hub">
        {/* guide circle */}
        <circle cx={cx} cy={cy} r={R} fill="none" stroke="rgba(46,42,36,0.06)" strokeWidth="1" strokeDasharray="2 4" />

        {/* rotating spokes + nodes */}
        <g style={reduced ? {} : { transformOrigin: `${cx}px ${cy}px`, transform: `rotate(${angle}deg)` }}>
          {nodes.map((node, i) => {
            const a = (i / nodes.length) * Math.PI * 2;
            const x = cx + R * Math.cos(a);
            const y = cy + R * Math.sin(a);
            return (
              <g key={node.label}>
                {/* spoke */}
                <line
                  x1={cx}
                  y1={cy}
                  x2={x}
                  y2={y}
                  stroke={node.color}
                  strokeWidth="1.5"
                  opacity="0.3"
                  strokeDasharray="3 3"
                />
                {/* node */}
                <circle cx={x} cy={y} r="16" fill="var(--color-bg-raised)" stroke={node.color} strokeWidth="2" />
                <text
                  x={x}
                  y={y + 3}
                  textAnchor="middle"
                  fontSize="8"
                  fontFamily="'Space Mono', monospace"
                  fontWeight="700"
                  fill={node.color}
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </g>

        {/* central hub */}
        <circle cx={cx} cy={cy} r="22" fill="var(--color-ink)" opacity="0.08" className="glow-breathe" style={{ transformOrigin: `${cx}px ${cy}px`, animation: 'glow-breathe 3s ease-in-out infinite' }} />
        <circle cx={cx} cy={cy} r="14" fill="var(--color-ink)" />
        <circle cx={cx} cy={cy} r="6" fill="var(--color-highlight)" className="signal-pulse" />
        <text x={cx} y={cy + 2} textAnchor="middle" fontSize="7" fontFamily="'Space Mono', monospace" fontWeight="700" fill="var(--color-bg)">MACH</text>
      </svg>
    </ArtifactFrame>
  );
}
