import { ArtifactFrame } from './ArtifactFrame';

/**
 * Concentric broadcast rings emanating from a central tower — the radio
 * "always broadcasting" metaphor. Three rings stagger out, plus a steady
 * core glow.
 */
export function BroadcastWaves() {
  return (
    <ArtifactFrame label="TX-01" sublabel="Broadcasting">
      <svg viewBox="0 0 400 220" className="w-full h-auto" role="img" aria-label="Broadcast signal waves emanating from a tower">
        {/* arcs emanating */}
        {[0, 1, 2].map((i) => (
          <circle
            key={i}
            cx="200"
            cy="150"
            r="30"
            fill="none"
            stroke="var(--color-accent-tertiary)"
            strokeWidth="2"
            className="broadcast-ring"
            style={{
              transformOrigin: '200px 150px',
              animation: `broadcast-ring 3s ease-out ${i * 1}s infinite`,
            }}
          />
        ))}
        {/* inner glow */}
        <circle cx="200" cy="150" r="22" fill="var(--color-highlight)" opacity="0.25" className="glow-breathe" style={{ transformOrigin: '200px 150px', animation: 'glow-breathe 3s ease-in-out infinite' }} />
        {/* tower mast */}
        <line x1="200" y1="150" x2="200" y2="60" stroke="var(--color-ink)" strokeWidth="3" strokeLinecap="round" />
        <line x1="190" y1="150" x2="210" y2="150" stroke="var(--color-ink)" strokeWidth="3" strokeLinecap="round" />
        {/* mast rungs */}
        <line x1="194" y1="130" x2="206" y2="130" stroke="var(--color-ink)" strokeWidth="2" strokeLinecap="round" />
        <line x1="196" y1="110" x2="204" y2="110" stroke="var(--color-ink)" strokeWidth="2" strokeLinecap="round" />
        {/* tower top light */}
        <circle cx="200" cy="58" r="4" fill="var(--color-highlight)" className="signal-pulse" />
        {/* ground line */}
        <line x1="60" y1="168" x2="340" y2="168" stroke="rgba(46,42,36,0.18)" strokeWidth="1.5" strokeDasharray="4 6" />
        {/* labels on the dial arc */}
        <text x="80" y="40" fill="rgba(46,42,36,0.4)" fontSize="10" fontFamily="'Space Mono', monospace">FM</text>
        <text x="310" y="40" fill="rgba(46,42,36,0.4)" fontSize="10" fontFamily="'Space Mono', monospace">AM</text>
      </svg>
    </ArtifactFrame>
  );
}
