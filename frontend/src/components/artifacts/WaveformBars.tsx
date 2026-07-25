import { ArtifactFrame } from './ArtifactFrame';

/**
 * Classic hi-fi equalizer: animated bars that bounce at varying speeds,
 * colored from Petrol Teal → Harvest Gold peaks. Pure CSS keyframes,
 * no JS timer.
 */
export function WaveformBars() {
  const bars = Array.from({ length: 24 });
  return (
    <ArtifactFrame label="EQ-24" sublabel="Spectrum analyzer">
      <svg viewBox="0 0 400 200" className="w-full h-auto" role="img" aria-label="Audio spectrum analyzer">
        {/* baseline */}
        <line x1="10" y1="180" x2="390" y2="180" stroke="rgba(46,42,36,0.15)" strokeWidth="1" />
        {/* gridlines */}
        {[40, 80, 120, 160].map((y) => (
          <line key={y} x1="10" y1={y} x2="390" y2={y} stroke="rgba(46,42,36,0.06)" strokeWidth="1" />
        ))}
        {bars.map((_, i) => {
          const x = 16 + i * 15;
          const dur = 0.9 + (i % 5) * 0.22;
          const delay = (i % 7) * 0.12;
          const isPeak = i % 6 === 0 || i % 6 === 1;
          return (
            <rect
              key={i}
              x={x}
              y={40}
              width="8"
              height="140"
              rx="2"
              fill={isPeak ? 'var(--color-highlight)' : 'var(--color-accent-tertiary)'}
              opacity={isPeak ? 0.95 : 0.7}
              className="waveform-bar"
              style={{
                transformOrigin: `${x + 4}px 180px`,
                animation: `waveform-bounce ${dur}s ease-in-out ${delay}s infinite`,
              }}
            />
          );
        })}
      </svg>
    </ArtifactFrame>
  );
}
