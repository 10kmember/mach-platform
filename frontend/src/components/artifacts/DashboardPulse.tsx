import { useEffect, useState } from 'react';
import { ArtifactFrame } from './ArtifactFrame';

/**
 * Dashboard pulse: a mini live-metrics panel with a sparkline that
 * scrolls, a counter that ticks up, and status indicators. Unique to
 * the Dashboard page.
 */
export function DashboardPulse() {
  const [reduced, setReduced] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const update = () => setReduced(mq.matches);
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const interval = setInterval(() => setTick((t) => t + 1), 800);
    return () => clearInterval(interval);
  }, [reduced]);

  const sparkCount = 24;
  const sparkData = Array.from({ length: sparkCount }, (_, i) => {
    const base = 50 + Math.sin((i + tick) * 0.5) * 20 + Math.sin((i + tick) * 0.13) * 10;
    return Math.max(10, Math.min(90, base));
  });

  const counter = 1240 + (reduced ? 0 : tick * 3);

  return (
    <ArtifactFrame label="DASH-01" sublabel="Live metrics">
      <svg viewBox="0 0 400 220" className="w-full h-auto" role="img" aria-label="Live dashboard metrics panel with sparkline and counters">
        {/* panel background */}
        <rect x="10" y="10" width="380" height="200" rx="8" fill="rgba(47,111,107,0.04)" />

        {/* top row: 3 stat tiles */}
        {[
          { label: 'AGENTS', value: '4', color: 'var(--color-accent-tertiary)' },
          { label: 'SKILLS', value: '6', color: 'var(--color-accent-secondary)' },
          { label: 'RUNS', value: String(counter), color: 'var(--color-highlight)' },
        ].map((stat, i) => (
          <g key={stat.label}>
            <rect x={20 + i * 125} y="22" width="115" height="50" rx="5" fill="var(--color-bg-raised)" stroke="rgba(46,42,36,0.1)" strokeWidth="1" />
            <text x={28 + i * 125} y="38" fontSize="7" fontFamily="'Space Mono', monospace" fontWeight="700" fill="var(--color-ink-muted)">
              {stat.label}
            </text>
            <text x={28 + i * 125} y="62" fontSize="18" fontFamily="'Fraunces', serif" fontWeight="700" fill={stat.color}>
              {stat.value}
            </text>
            <circle cx={122 + i * 125} cy="34" r="2.5" fill={stat.color} className="signal-pulse" />
          </g>
        ))}

        {/* sparkline */}
        <text x="20" y="92" fontSize="7" fontFamily="'Space Mono', monospace" fontWeight="700" fill="var(--color-ink-muted)">
          USAGE · LAST 24H
        </text>
        <polyline
          points={sparkData.map((v, i) => `${20 + (i / (sparkCount - 1)) * 360},${190 - v * 0.8}`).join(' ')}
          fill="none"
          stroke="var(--color-accent-tertiary)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* sparkline fill */}
        <polygon
          points={`20,190 ${sparkData.map((v, i) => `${20 + (i / (sparkCount - 1)) * 360},${190 - v * 0.8}`).join(' ')} 380,190`}
          fill="var(--color-accent-tertiary)"
          opacity="0.08"
        />
        {/* sparkline dots */}
        {sparkData.map((v, i) => i === sparkCount - 1 && (
          <circle key={i} cx={20 + (i / (sparkCount - 1)) * 360} cy={190 - v * 0.8} r="3" fill="var(--color-highlight)" className="signal-pulse" />
        ))}
      </svg>
    </ArtifactFrame>
  );
}
