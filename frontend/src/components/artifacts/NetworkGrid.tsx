import { useEffect, useState } from 'react';
import { ArtifactFrame } from './ArtifactFrame';

/**
 * Animated network topology: nodes pulse and connection lines carry
 * travelling data packets. Represents the distributed agent mesh.
 */
export function NetworkGrid() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const update = () => setReduced(mq.matches);
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const nodes = [
    { x: 80, y: 60, label: 'A1' },
    { x: 200, y: 40, label: 'A2' },
    { x: 320, y: 70, label: 'A3' },
    { x: 120, y: 130, label: 'S1' },
    { x: 280, y: 140, label: 'S2' },
    { x: 200, y: 100, label: 'HUB' },
  ];

  const links: [number, number][] = [
    [0, 5], [1, 5], [2, 5], [3, 5], [4, 5],
    [0, 3], [2, 4], [1, 0], [1, 2],
  ];

  return (
    <ArtifactFrame label="MESH-01" sublabel="Agent topology">
      <svg viewBox="0 0 400 200" className="w-full h-auto" role="img" aria-label="Animated network mesh showing agent connections">
        {/* links */}
        {links.map(([a, b], i) => (
          <line
            key={`link-${i}`}
            x1={nodes[a].x}
            y1={nodes[a].y}
            x2={nodes[b].x}
            y2={nodes[b].y}
            stroke="var(--color-accent-tertiary)"
            strokeWidth="1.5"
            opacity="0.25"
          />
        ))}

        {/* travelling packets */}
        {!reduced && links.map(([a, b], i) => {
          const dur = 2 + (i % 3) * 0.6;
          const delay = i * 0.35;
          return (
            <circle
              key={`packet-${i}`}
              r="2.5"
              fill="var(--color-highlight)"
              opacity="0.9"
            >
              <animateMotion
                dur={`${dur}s`}
                repeatCount="indefinite"
                begin={`${delay}s`}
                path={`M ${nodes[a].x} ${nodes[a].y} L ${nodes[b].x} ${nodes[b].y}`}
              />
            </circle>
          );
        })}

        {/* nodes */}
        {nodes.map((node, i) => {
          const isHub = node.label === 'HUB';
          return (
            <g key={node.label}>
              <circle
                cx={node.x}
                cy={node.y}
                r={isHub ? 10 : 7}
                fill={isHub ? 'var(--color-accent-primary)' : 'var(--color-bg-raised)'}
                stroke={isHub ? 'var(--color-accent-primary)' : 'var(--color-accent-tertiary)'}
                strokeWidth="2"
                className={!reduced ? 'signal-pulse' : ''}
                style={reduced ? {} : { animationDelay: `${i * 0.2}s` }}
              />
              <text
                x={node.x}
                y={node.y + (isHub ? 3.5 : 2.5)}
                fontSize={isHub ? '7' : '6'}
                fontFamily="'Space Mono', monospace"
                fill={isHub ? 'var(--color-bg)' : 'var(--color-ink)'}
                textAnchor="middle"
                fontWeight="700"
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>
    </ArtifactFrame>
  );
}
