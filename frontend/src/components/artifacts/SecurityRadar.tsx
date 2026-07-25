import { useEffect, useState } from 'react';
import { ArtifactFrame } from './ArtifactFrame';

/**
 * Security radar: a sweeping scanline reveals shield nodes on a circular
 * grid. Represents the security and compliance monitoring layer.
 */
export function SecurityRadar() {
  const [reduced, setReduced] = useState(false);
  const [sweepAngle, setSweepAngle] = useState(0);

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
    const animate = (t: number) => {
      if (!start) start = t;
      const elapsed = (t - start) / 1000;
      setSweepAngle((elapsed * 72) % 360);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  const cx = 200, cy = 110, R = 80;
  const rings = [25, 50, 75];
  const blips = [
    { angle: 35, dist: 55, label: 'SSO' },
    { angle: 120, dist: 40, label: 'RBAC' },
    { angle: 200, dist: 65, label: 'AUDIT' },
    { angle: 290, dist: 35, label: 'ENC' },
  ];

  const blipOpacity = (blipAngle: number) => {
    if (reduced) return 1;
    const diff = Math.abs(sweepAngle - blipAngle);
    const norm = Math.min(diff, 360 - diff);
    return Math.max(0.15, 1 - norm / 60);
  };

  return (
    <ArtifactFrame label="SEC-01" sublabel="Threat radar">
      <svg viewBox="0 0 400 220" className="w-full h-auto" role="img" aria-label="Security radar sweep monitoring compliance status">
        {/* rings */}
        {rings.map((r) => (
          <circle key={r} cx={cx} cy={cy} r={r} fill="none" stroke="rgba(46,42,36,0.1)" strokeWidth="1" />
        ))}
        {/* crosshair */}
        <line x1={cx - R} y1={cy} x2={cx + R} y2={cy} stroke="rgba(46,42,36,0.08)" strokeWidth="1" />
        <line x1={cx} y1={cy - R} x2={cx} y2={cy + R} stroke="rgba(46,42,36,0.08)" strokeWidth="1" />

        {/* sweep wedge */}
        {!reduced && (
          <g style={{ transformOrigin: `${cx}px ${cy}px`, transform: `rotate(${sweepAngle}deg)` }}>
            <defs>
              <linearGradient id="sweep-grad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="var(--color-accent-tertiary)" stopOpacity="0.25" />
                <stop offset="100%" stopColor="var(--color-accent-tertiary)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d={`M ${cx} ${cy} L ${cx + R} ${cy} A ${R} ${R} 0 0 0 ${cx + R * Math.cos(-Math.PI / 3)} ${cy + R * Math.sin(-Math.PI / 3)} Z`}
              fill="url(#sweep-grad)"
            />
            <line
              x1={cx}
              y1={cy}
              x2={cx + R}
              y2={cy}
              stroke="var(--color-accent-tertiary)"
              strokeWidth="2"
              opacity="0.6"
            />
          </g>
        )}

        {/* blips */}
        {blips.map((blip) => {
          const rad = (blip.angle * Math.PI) / 180;
          const bx = cx + blip.dist * Math.cos(rad);
          const by = cy + blip.dist * Math.sin(rad);
          const op = blipOpacity(blip.angle);
          return (
            <g key={blip.label}>
              <circle cx={bx} cy={by} r="5" fill="var(--color-accent-secondary)" opacity={op} />
              <circle cx={bx} cy={by} r="9" fill="none" stroke="var(--color-accent-secondary)" strokeWidth="1" opacity={op * 0.4} />
              <text x={bx + 10} y={by + 3} fontSize="7" fontFamily="'Space Mono', monospace" fill="var(--color-ink-muted)" opacity={op}>
                {blip.label}
              </text>
            </g>
          );
        })}

        {/* center */}
        <circle cx={cx} cy={cy} r="6" fill="var(--color-ink)" />
        <circle cx={cx} cy={cy} r="2.5" fill="var(--color-highlight)" className="signal-pulse" />
      </svg>
    </ArtifactFrame>
  );
}
