/**
 * Abstract signal-dial / waveform visual for the hero.
 * Petrol Teal bars + Harvest Gold active elements, with the pulsing
 * signal-bar motif in the corner next to an "Online" label.
 * Pure SVG so it scales without cropping and respects reduced-motion.
 */
export function SignalDial() {
  const bars = [12, 22, 34, 46, 58, 70, 82, 92, 82, 70, 58, 46, 34, 22, 12];

  return (
    <div className="relative w-full max-w-[460px] mx-auto">
      <div className="relative rounded-radius-lg bg-[var(--color-bg-raised)] border border-[var(--color-border)] shadow-md p-6 sm:p-8">
        {/* Dial face */}
        <svg
          viewBox="0 0 400 260"
          className="w-full h-auto"
          role="img"
          aria-label="Signal strength dial showing a steady broadcast"
        >
          {/* arc track */}
          <path
            d="M 70 220 A 130 130 0 0 1 330 220"
            fill="none"
            stroke="rgba(46,42,36,0.12)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* arc active */}
          <path
            d="M 70 220 A 130 130 0 0 1 330 220"
            fill="none"
            stroke="var(--color-accent-tertiary)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="120 1000"
            opacity="0.5"
          />
          {/* tick marks */}
          {Array.from({ length: 11 }).map((_, i) => {
            const angle = -90 + (i * 180) / 10;
            const rad = (angle * Math.PI) / 180;
            const cx = 200;
            const cy = 220;
            const r1 = 118;
            const r2 = 128;
            return (
              <line
                key={i}
                x1={cx + r1 * Math.cos(rad)}
                y1={cy + r1 * Math.sin(rad)}
                x2={cx + r2 * Math.cos(rad)}
                y2={cy + r2 * Math.sin(rad)}
                stroke="rgba(46,42,36,0.25)"
                strokeWidth={i % 5 === 0 ? 2 : 1}
                strokeLinecap="round"
              />
            );
          })}
          {/* needle */}
          <g
            className="dial-sweep"
            style={{
              transformOrigin: '200px 220px',
              animation: 'dial-sweep 6s ease-in-out infinite alternate',
            }}
          >
            <line
              x1="200"
              y1="220"
              x2="200"
              y2="108"
              stroke="var(--color-accent-primary)"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle cx="200" cy="108" r="4" fill="var(--color-accent-primary)" />
          </g>
          {/* center hub */}
          <circle cx="200" cy="220" r="9" fill="var(--color-ink)" />
          <circle cx="200" cy="220" r="4" fill="var(--color-highlight)" className="signal-pulse" />

          {/* waveform bars below the dial */}
          <g transform="translate(60, 244)">
            {bars.map((h, i) => (
              <rect
                key={i}
                x={i * 18}
                y={-h * 0.18}
                width="10"
                height={h * 0.18}
                rx="2"
                fill={i === 7 ? 'var(--color-highlight)' : 'var(--color-accent-tertiary)'}
                opacity={i === 7 ? 1 : 0.35 + (h / 92) * 0.45}
              />
            ))}
          </g>
        </svg>

        {/* Live status pill in the corner */}
        <div className="absolute top-4 right-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] px-2.5 py-1.5 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-[var(--color-highlight)] signal-pulse" />
            <span className="text-mono-label text-[0.65rem] text-[var(--color-ink)]">Online</span>
          </div>
        </div>

        {/* Channel label */}
        <div className="absolute bottom-4 left-4 text-mono-label text-[0.6rem] text-[var(--color-ink-muted)]">
          CH 01 · 24/7
        </div>
      </div>

      {/* Floating mini stat chips */}
      <div className="hidden sm:flex absolute -left-6 top-1/3 items-center gap-2 rounded-radius-sm bg-[var(--color-bg)] border border-[var(--color-border)] shadow-sm px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-[var(--color-accent-secondary)] signal-pulse" />
        <span className="text-mono-label text-[0.62rem] text-[var(--color-ink)]">UPTIME 24/7</span>
      </div>
      <div className="hidden sm:flex absolute -right-4 bottom-10 items-center gap-2 rounded-radius-sm bg-[var(--color-bg)] border border-[var(--color-border)] shadow-sm px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-[var(--color-accent-tertiary)] signal-pulse" />
        <span className="text-mono-label text-[0.62rem] text-[var(--color-ink)]">SIGNAL STEADY</span>
      </div>
    </div>
  );
}
