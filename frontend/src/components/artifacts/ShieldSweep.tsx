import { useEffect, useState } from 'react';
import { ArtifactFrame } from './ArtifactFrame';

/**
 * Shield sweep: a vertical scanline sweeps across a shield outline,
 * revealing checkmarks and lock icons as it passes. Represents
 * continuous security scanning. Unique to the Security & Compliance page.
 */
export function ShieldSweep() {
  const [reduced, setReduced] = useState(false);
  const [scanX, setScanX] = useState(60);

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
      const elapsed = (now - start) / 1000;
      const cycle = (elapsed % 4) / 4;
      setScanX(60 + cycle * 280);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  const cx = 200, cy = 110;
  const items = [
    { x: 130, y: 80, label: 'SOC2' },
    { x: 200, y: 70, label: 'GDPR' },
    { x: 270, y: 80, label: 'HIPAA' },
    { x: 150, y: 140, label: 'ISO' },
    { x: 250, y: 140, label: 'CCPA' },
  ];

  return (
    <ArtifactFrame label="SEC-02" sublabel="Compliance scan">
      <svg viewBox="0 0 400 220" className="w-full h-auto" role="img" aria-label="Security shield with a scanning sweep revealing compliance badges">
        <defs>
          <linearGradient id="scan-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-accent-tertiary)" stopOpacity="0" />
            <stop offset="50%" stopColor="var(--color-accent-tertiary)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--color-accent-tertiary)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* shield outline */}
        <path
          d="M 200 30 L 310 60 L 310 130 Q 310 170 200 200 Q 90 170 90 130 L 90 60 Z"
          fill="none"
          stroke="rgba(46,42,36,0.15)"
          strokeWidth="2"
        />
        <path
          d="M 200 30 L 310 60 L 310 130 Q 310 170 200 200 Q 90 170 90 130 L 90 60 Z"
          fill="rgba(47,111,107,0.04)"
        />

        {/* compliance items — revealed by scan */}
        {items.map((item) => {
          const revealed = reduced || scanX >= item.x;
          return (
            <g key={item.label} opacity={revealed ? 1 : 0.2} style={{ transition: 'opacity 0.3s ease' }}>
              <circle cx={item.x} cy={item.y} r="12" fill="var(--color-bg-raised)" stroke={revealed ? 'var(--color-accent-secondary)' : 'rgba(46,42,36,0.15)'} strokeWidth="1.5" />
              <text
                x={item.x}
                y={item.y + 3}
                textAnchor="middle"
                fontSize="6"
                fontFamily="'Space Mono', monospace"
                fontWeight="700"
                fill={revealed ? 'var(--color-accent-secondary)' : 'var(--color-ink-muted)'}
              >
                {item.label}
              </text>
              {revealed && (
                <circle cx={item.x + 9} cy={item.y - 9} r="3" fill="var(--color-highlight)" className="signal-pulse" />
              )}
            </g>
          );
        })}

        {/* scanline */}
        {!reduced && (
          <rect x={scanX - 2} y="30" width="4" height="170" fill="url(#scan-grad)" opacity="0.6" />
        )}

        {/* center lock */}
        <rect x={cx - 10} y={cy - 6} width="20" height="16" rx="2" fill="var(--color-ink)" opacity="0.15" />
        <rect x={cx - 8} y={cy - 4} width="16" height="12" rx="1.5" fill="var(--color-ink)" />
        <path d={`M ${cx - 5} ${cy - 4} L ${cx - 5} ${cy - 10} Q ${cx - 5} ${cy - 14} ${cx} ${cy - 14} Q ${cx + 5} ${cy - 14} ${cx + 5} ${cy - 10} L ${cx + 5} ${cy - 4}`} fill="none" stroke="var(--color-ink)" strokeWidth="2" />
        <circle cx={cx} cy={cy + 2} r="2" fill="var(--color-highlight)" className="signal-pulse" />
      </svg>
    </ArtifactFrame>
  );
}
