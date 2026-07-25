import { useEffect, useState } from 'react';
import { ArtifactFrame } from './ArtifactFrame';

/**
 * Rotating catalog shelf: cards in a 3D perspective row that slowly
 * rotate, revealing different agent profiles. Unique to the Agent Catalog page.
 */
export function CatalogShelf() {
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
      setAngle(((now - start) / 1000) * 20);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  const cards = [
    { label: 'Mach One', color: 'var(--color-accent-primary)', icon: 'M1' },
    { label: 'Mach Forge', color: 'var(--color-accent-tertiary)', icon: 'MF' },
    { label: 'Mach Relay', color: 'var(--color-accent-secondary)', icon: 'MR' },
    { label: 'Mach Sentry', color: 'var(--color-highlight)', icon: 'MS' },
  ];

  return (
    <ArtifactFrame label="CAT-01" sublabel="Agent catalog">
      <svg viewBox="0 0 400 220" className="w-full h-auto" role="img" aria-label="Rotating shelf of agent catalog cards">
        <defs>
          <linearGradient id="shelf-fade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--color-bg)" stopOpacity="0.9" />
            <stop offset="15%" stopColor="var(--color-bg)" stopOpacity="0" />
            <stop offset="85%" stopColor="var(--color-bg)" stopOpacity="0" />
            <stop offset="100%" stopColor="var(--color-bg)" stopOpacity="0.9" />
          </linearGradient>
        </defs>

        {/* shelf baseline */}
        <line x1="20" y1="170" x2="380" y2="170" stroke="rgba(46,42,36,0.15)" strokeWidth="1.5" strokeDasharray="3 5" />

        {/* cards with perspective */}
        {cards.map((card, i) => {
          const baseX = 60 + i * 80;
          const offset = reduced ? 0 : Math.sin((angle + i * 90) * Math.PI / 180) * 15;
          const yScale = reduced ? 1 : 0.85 + Math.cos((angle + i * 90) * Math.PI / 180) * 0.15;
          const opacity = reduced ? 1 : 0.5 + Math.cos((angle + i * 90) * Math.PI / 180) * 0.5;
          return (
            <g key={card.label} style={{ opacity: Math.max(0.3, opacity) }}>
              {/* card body */}
              <rect
                x={baseX}
                y={50 + offset}
                width="60"
                height="100"
                rx="6"
                fill="var(--color-bg-raised)"
                stroke={card.color}
                strokeWidth="1.5"
                style={{
                  transform: `scale(1, ${yScale})`,
                  transformOrigin: `${baseX + 30}px 150px`,
                }}
              />
              {/* icon circle */}
              <circle
                cx={baseX + 30}
                cy={75 + offset}
                r="14"
                fill={card.color}
                opacity="0.15"
              />
              <text
                x={baseX + 30}
                y={79 + offset}
                textAnchor="middle"
                fontSize="9"
                fontFamily="'Space Mono', monospace"
                fontWeight="700"
                fill={card.color}
              >
                {card.icon}
              </text>
              {/* label */}
              <text
                x={baseX + 30}
                y={120 + offset}
                textAnchor="middle"
                fontSize="8"
                fontFamily="'Space Mono', monospace"
                fill="var(--color-ink)"
              >
                {card.label}
              </text>
              {/* status dot */}
              <circle
                cx={baseX + 30}
                cy={140 + offset}
                r="2.5"
                fill="var(--color-highlight)"
                className="signal-pulse"
              />
            </g>
          );
        })}

        {/* edge fade */}
        <rect x="0" y="0" width="400" height="220" fill="url(#shelf-fade)" pointerEvents="none" />
      </svg>
    </ArtifactFrame>
  );
}
