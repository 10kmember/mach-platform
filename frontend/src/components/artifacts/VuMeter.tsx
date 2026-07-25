import { ArtifactFrame } from './ArtifactFrame';

/**
 * Analog VU meter: a sweeping needle over an arc scale, with tick marks
 * and a red-zone peak. The needle bounces like a real VU meter.
 */
export function VuMeter() {
  // tick marks across the arc
  const ticks = Array.from({ length: 13 });
  return (
    <ArtifactFrame label="VU-01" sublabel="Signal level">
      <svg viewBox="0 0 400 220" className="w-full h-auto" role="img" aria-label="Analog VU meter showing signal level">
        {/* arc track */}
        <path
          d="M 60 190 A 140 140 0 0 1 340 190"
          fill="none"
          stroke="rgba(46,42,36,0.12)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* green zone */}
        <path
          d="M 60 190 A 140 140 0 0 1 250 64"
          fill="none"
          stroke="var(--color-accent-secondary)"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.5"
        />
        {/* red zone (peak) */}
        <path
          d="M 260 66 A 140 140 0 0 1 340 190"
          fill="none"
          stroke="var(--color-accent-primary)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* tick marks */}
        {ticks.map((_, i) => {
          const angle = -180 + (i * 180) / 12;
          const rad = (angle * Math.PI) / 180;
          const cx = 200, cy = 190, r1 = 128, r2 = 138;
          return (
            <line
              key={i}
              x1={cx + r1 * Math.cos(rad)}
              y1={cy + r1 * Math.sin(rad)}
              x2={cx + r2 * Math.cos(rad)}
              y2={cy + r2 * Math.sin(rad)}
              stroke="rgba(46,42,36,0.35)"
              strokeWidth={i >= 9 ? 2 : 1}
              strokeLinecap="round"
            />
          );
        })}
        {/* scale labels */}
        <text x="56" y="186" fill="rgba(46,42,36,0.5)" fontSize="9" fontFamily="'Space Mono', monospace">-20</text>
        <text x="190" y="58" fill="rgba(46,42,36,0.5)" fontSize="9" fontFamily="'Space Mono', monospace">0</text>
        <text x="330" y="186" fill="rgba(46,42,36,0.5)" fontSize="9" fontFamily="'Space Mono', monospace">+5</text>
        <text x="200" y="130" fill="var(--color-ink-muted)" fontSize="11" fontFamily="'Space Mono', monospace" textAnchor="middle" letterSpacing="2">VU</text>
        {/* needle — bounces like a real meter */}
        <g
          className="vu-needle"
          style={{
            transformOrigin: '200px 190px',
            animation: 'vu-bounce 2.4s ease-in-out infinite',
          }}
        >
          <line x1="200" y1="190" x2="200" y2="70" stroke="var(--color-ink)" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="200" cy="70" r="3" fill="var(--color-accent-primary)" />
        </g>
        {/* hub */}
        <circle cx="200" cy="190" r="8" fill="var(--color-ink)" />
        <circle cx="200" cy="190" r="3" fill="var(--color-highlight)" />
      </svg>
    </ArtifactFrame>
  );
}
