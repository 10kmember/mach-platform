import { useEffect, useRef, useState } from 'react';
import { ArtifactFrame } from './ArtifactFrame';

/**
 * Pipeline flow: animated dots travel along a serpentine path through
 * connected stages, representing the step-by-step agent workflow.
 * Unique to the How It Works page.
 */
export function PipelineFlow() {
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

  const stages = [
    { x: 50, y: 60, label: '01', color: 'var(--color-accent-tertiary)' },
    { x: 150, y: 60, label: '02', color: 'var(--color-accent-secondary)' },
    { x: 250, y: 60, label: '03', color: 'var(--color-highlight)' },
    { x: 350, y: 60, label: '04', color: 'var(--color-accent-primary)' },
    { x: 350, y: 150, label: '05', color: 'var(--color-accent-tertiary)' },
    { x: 250, y: 150, label: '06', color: 'var(--color-accent-secondary)' },
    { x: 150, y: 150, label: '07', color: 'var(--color-highlight)' },
    { x: 50, y: 150, label: '08', color: 'var(--color-accent-primary)' },
  ];

  const pathD = `M ${stages[0].x} ${stages[0].y} ${stages.slice(1).map((s) => `L ${s.x} ${s.y}`).join(' ')}`;

  function pointOnPath(progress: number) {
    const totalSegs = stages.length - 1;
    const scaled = progress * totalSegs;
    const segIdx = Math.floor(scaled) % totalSegs;
    const segT = scaled - Math.floor(scaled);
    const a = stages[segIdx];
    const b = stages[segIdx + 1];
    return {
      x: a.x + (b.x - a.x) * segT,
      y: a.y + (b.y - a.y) * segT,
    };
  }

  const packets = [0, 0.25, 0.5, 0.75];

  return (
    <ArtifactFrame label="FLW-01" sublabel="Workflow pipeline">
      <svg viewBox="0 0 400 220" className="w-full h-auto" role="img" aria-label="Animated pipeline showing data flowing through workflow stages">
        {/* pipeline path */}
        <path d={pathD} fill="none" stroke="rgba(46,42,36,0.1)" strokeWidth="2" strokeDasharray="4 4" />

        {/* stage nodes */}
        {stages.map((stage) => (
          <g key={stage.label}>
            <circle cx={stage.x} cy={stage.y} r="14" fill="var(--color-bg-raised)" stroke={stage.color} strokeWidth="2" />
            <text
              x={stage.x}
              y={stage.y + 3}
              textAnchor="middle"
              fontSize="8"
              fontFamily="'Space Mono', monospace"
              fontWeight="700"
              fill={stage.color}
            >
              {stage.label}
            </text>
          </g>
        ))}

        {/* travelling packets */}
        {!reduced && packets.map((offset, i) => {
          const progress = ((t * 0.15 + offset) % 1);
          const pos = pointOnPath(progress);
          return (
            <g key={`pkt-${i}`}>
              <circle cx={pos.x} cy={pos.y} r="6" fill="var(--color-highlight)" opacity="0.2" />
              <circle cx={pos.x} cy={pos.y} r="3.5" fill="var(--color-highlight)" />
            </g>
          );
        })}
      </svg>
    </ArtifactFrame>
  );
}
