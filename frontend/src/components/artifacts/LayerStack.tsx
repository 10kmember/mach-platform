import { useEffect, useState } from 'react';
import { ArtifactFrame } from './ArtifactFrame';

/**
 * Layer stack: stacked horizontal planes that rise and settle in sequence,
 * representing the layered architecture of the platform. Each layer
 * has a label and pulses when active. Unique to the Architecture page.
 */
export function LayerStack() {
  const [reduced, setReduced] = useState(false);
  const [activeLayer, setActiveLayer] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const update = () => setReduced(mq.matches);
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const interval = setInterval(() => {
      setActiveLayer((prev) => (prev + 1) % 5);
    }, 1500);
    return () => clearInterval(interval);
  }, [reduced]);

  const layers = [
    { label: 'API Gateway', color: 'var(--color-accent-primary)' },
    { label: 'Agent Runtime', color: 'var(--color-accent-tertiary)' },
    { label: 'Data Layer', color: 'var(--color-accent-secondary)' },
    { label: 'Monitoring Mesh', color: 'var(--color-highlight)' },
    { label: 'Infrastructure', color: 'var(--color-ink)' },
  ];

  return (
    <ArtifactFrame label="ARC-01" sublabel="Layered stack">
      <svg viewBox="0 0 400 220" className="w-full h-auto" role="img" aria-label="Stacked architectural layers of the platform">
        {/* isometric guide */}
        <line x1="40" y1="200" x2="360" y2="200" stroke="rgba(46,42,36,0.1)" strokeWidth="1" strokeDasharray="3 5" />

        {layers.map((layer, i) => {
          const y = 180 - i * 30;
          const isActive = reduced ? false : activeLayer === i;
          const lift = isActive ? -8 : 0;
          return (
            <g key={layer.label} style={{ transition: 'transform 0.4s ease', transform: `translateY(${lift}px)` }}>
              {/* layer slab */}
              <rect
                x="80"
                y={y}
                width="240"
                height="22"
                rx="4"
                fill={layer.color}
                opacity={isActive ? 0.9 : 0.5}
                style={{ transition: 'opacity 0.4s ease' }}
              />
              {/* top edge highlight */}
              <rect
                x="80"
                y={y}
                width="240"
                height="3"
                rx="1.5"
                fill="var(--color-bg)"
                opacity={isActive ? 0.4 : 0.15}
              />
              {/* label */}
              <text
                x="200"
                y={y + 14}
                textAnchor="middle"
                fontSize="9"
                fontFamily="'Space Mono', monospace"
                fontWeight="700"
                fill="var(--color-bg)"
              >
                {layer.label}
              </text>
              {/* active indicator */}
              {isActive && (
                <circle cx="70" cy={y + 11} r="3" fill="var(--color-highlight)" className="signal-pulse" />
              )}
              {/* connector */}
              {i < layers.length - 1 && (
                <line
                  x1="200"
                  y1={y}
                  x2="200"
                  y2={y - 8}
                  stroke="rgba(46,42,36,0.2)"
                  strokeWidth="1.5"
                  strokeDasharray="2 2"
                />
              )}
            </g>
          );
        })}
      </svg>
    </ArtifactFrame>
  );
}
