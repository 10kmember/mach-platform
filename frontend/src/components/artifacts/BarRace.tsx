import { useEffect, useState } from 'react';
import { ArtifactFrame } from './ArtifactFrame';

/**
 * Animated bar race: horizontal bars grow from zero to their target
 * widths at staggered intervals, like a live comparison chart.
 * Unique to the Compare Plans page.
 */
export function BarRace() {
  const [reduced, setReduced] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const update = () => setReduced(mq.matches);
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, [reduced]);

  const bars = [
    { label: 'Solo', value: 25, color: 'var(--color-accent-tertiary)' },
    { label: 'Team', value: 55, color: 'var(--color-accent-secondary)' },
    { label: 'Venture', value: 72, color: 'var(--color-highlight)' },
    { label: 'Department', value: 85, color: 'var(--color-accent-primary)' },
    { label: 'Enterprise', value: 100, color: 'var(--color-ink)' },
  ];

  return (
    <ArtifactFrame label="CMP-01" sublabel="Plan comparison">
      <svg viewBox="0 0 400 220" className="w-full h-auto" role="img" aria-label="Animated bar chart comparing plan tiers">
        {/* axis */}
        <line x1="100" y1="20" x2="100" y2="190" stroke="rgba(46,42,36,0.15)" strokeWidth="1" />
        <line x1="100" y1="190" x2="370" y2="190" stroke="rgba(46,42,36,0.15)" strokeWidth="1" />

        {/* gridlines */}
        {[25, 50, 75, 100].map((pct) => {
          const x = 100 + (pct / 100) * 270;
          return (
            <line key={pct} x1={x} y1="20" x2={x} y2="190" stroke="rgba(46,42,36,0.05)" strokeWidth="1" />
          );
        })}

        {bars.map((bar, i) => {
          const y = 30 + i * 32;
          const targetWidth = reduced || mounted ? (bar.value / 100) * 270 : 0;
          return (
            <g key={bar.label}>
              <text x="92" y={y + 14} textAnchor="end" fontSize="10" fontFamily="'Space Mono', monospace" fill="var(--color-ink-muted)">
                {bar.label}
              </text>
              <rect
                x="100"
                y={y}
                width={targetWidth}
                height="20"
                rx="3"
                fill={bar.color}
                opacity="0.85"
                style={{ transition: 'width 1.2s cubic-bezier(0.22, 1, 0.36, 1)' }}
              />
              <text
                x={100 + targetWidth + 6}
                y={y + 14}
                fontSize="9"
                fontFamily="'Space Mono', monospace"
                fill="var(--color-ink)"
                opacity={reduced || mounted ? 1 : 0}
                style={{ transition: 'opacity 0.5s ease 1s' }}
              >
                {bar.value}%
              </text>
            </g>
          );
        })}
      </svg>
    </ArtifactFrame>
  );
}
