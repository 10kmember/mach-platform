import { useEffect, useState } from 'react';
import { ArtifactFrame } from './ArtifactFrame';

/**
 * Agent activity matrix: a grid of cells that light up in patterns,
 * representing multiple agents running skills concurrently. Each cell
 * pulses independently to show live agent activity.
 */
export function AgentMatrix() {
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
    const interval = setInterval(() => setTick((t) => t + 1), 600);
    return () => clearInterval(interval);
  }, [reduced]);

  const cols = 10;
  const rows = 6;
  const cells = Array.from({ length: cols * rows });

  const cellState = (i: number): 'active' | 'idle' | 'cool' => {
    if (reduced) return 'idle';
    const seed = (i * 7 + tick * 3) % 100;
    if (seed < 15) return 'active';
    if (seed < 30) return 'cool';
    return 'idle';
  };

  const cellColor = (state: string) => {
    switch (state) {
      case 'active':
        return { fill: 'var(--color-highlight)', opacity: 0.9 };
      case 'cool':
        return { fill: 'var(--color-accent-tertiary)', opacity: 0.5 };
      default:
        return { fill: 'var(--color-accent-tertiary)', opacity: 0.12 };
    }
  };

  return (
    <ArtifactFrame label="GRID-01" sublabel="Agent activity">
      <svg viewBox="0 0 400 200" className="w-full h-auto" role="img" aria-label="Grid showing live agent activity across the fleet">
        {cells.map((_, i) => {
          const col = i % cols;
          const row = Math.floor(i / cols);
          const x = 20 + col * 36;
          const y = 20 + row * 28;
          const state = cellState(i);
          const { fill, opacity } = cellColor(state);
          return (
            <rect
              key={i}
              x={x}
              y={y}
              width="28"
              height="20"
              rx="3"
              fill={fill}
              opacity={opacity}
              style={{ transition: 'opacity 0.4s ease, fill 0.4s ease' }}
            />
          );
        })}
        {/* legend */}
        <g transform="translate(20, 188)">
          <rect x="0" y="0" width="8" height="6" rx="1" fill="var(--color-highlight)" opacity="0.9" />
          <text x="12" y="6" fontSize="7" fontFamily="'Space Mono', monospace" fill="var(--color-ink-muted)">ACTIVE</text>
          <rect x="60" y="0" width="8" height="6" rx="1" fill="var(--color-accent-tertiary)" opacity="0.5" />
          <text x="72" y="6" fontSize="7" fontFamily="'Space Mono', monospace" fill="var(--color-ink-muted)">COOL</text>
          <rect x="115" y="0" width="8" height="6" rx="1" fill="var(--color-accent-tertiary)" opacity="0.12" />
          <text x="127" y="6" fontSize="7" fontFamily="'Space Mono', monospace" fill="var(--color-ink-muted)">IDLE</text>
        </g>
      </svg>
    </ArtifactFrame>
  );
}
