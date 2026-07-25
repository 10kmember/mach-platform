import { useEffect, useRef, useState } from 'react';
import { ArtifactFrame } from './ArtifactFrame';

/**
 * Oscilloscope frequency trace: a live waveform that genuinely moves.
 * A requestAnimationFrame loop advances the phase so the sine wave travels
 * leftward in real time, like a real scope. Pauses when off-screen and
 * respects prefers-reduced-motion (renders a static trace).
 */
export function FrequencyTrace() {
  const pathRef = useRef<SVGPathElement | null>(null);
  const faintRef = useRef<SVGPathElement | null>(null);
  const [reduced, setReduced] = useState(false);

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
    const W = 400;
    const H = 100;
    const N = 96;
    let visible = true;

    const root = pathRef.current?.closest('svg') as SVGSVGElement | null;
    const io = root ? new IntersectionObserver((entries) => {
      visible = entries[0]?.isIntersecting ?? true;
    }, { threshold: 0.1 }) : null;
    if (root && io) io.observe(root);

    const draw = (t: number) => {
      raf = requestAnimationFrame(draw);
      if (!visible) {
        start = t;
        return;
      }
      if (!start) start = t;
      const elapsed = (t - start) / 1000;
      const phase = elapsed * 1.8;
      const pts = Array.from({ length: N }, (_, i) => {
        const x = 10 + (i / (N - 1)) * (W - 20);
        const y =
          H +
          Math.sin(i * 0.32 - phase * 2.4) * 30 +
          Math.sin(i * 0.11 - phase * 1.1) * 14 +
          Math.sin(i * 0.06 + phase * 0.4) * 7;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      });
      const d = `M ${pts.join(' L ')}`;
      if (pathRef.current) pathRef.current.setAttribute('d', d);
      if (faintRef.current) faintRef.current.setAttribute('d', d);
    };

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      if (io) io.disconnect();
    };
  }, [reduced]);

  // static path for reduced-motion or first paint
  const staticPts = Array.from({ length: 80 }, (_, i) => {
    const x = 10 + (i / 79) * 380;
    const y =
      100 +
      Math.sin(i * 0.32) * 30 +
      Math.sin(i * 0.11) * 14 +
      Math.sin(i * 0.06) * 7;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const staticD = `M ${staticPts.join(' L ')}`;

  return (
    <ArtifactFrame label="OSC-01" sublabel="Live trace">
      <svg viewBox="0 0 400 200" className="w-full h-auto" role="img" aria-label="Oscilloscope showing a live frequency trace">
        {/* scope background tint */}
        <rect x="6" y="6" width="388" height="188" rx="10" fill="rgba(47,111,107,0.04)" />
        {/* grid */}
        {Array.from({ length: 9 }).map((_, i) => (
          <line key={`v${i}`} x1={10 + i * 47.5} y1="10" x2={10 + i * 47.5} y2="190" stroke="rgba(47,111,107,0.12)" strokeWidth="1" />
        ))}
        {Array.from({ length: 5 }).map((_, i) => (
          <line key={`h${i}`} x1="10" y1={10 + i * 45} x2="390" y2={10 + i * 45} stroke="rgba(47,111,107,0.12)" strokeWidth="1" />
        ))}
        {/* center axis */}
        <line x1="10" y1="100" x2="390" y2="100" stroke="rgba(47,111,107,0.3)" strokeWidth="1" strokeDasharray="2 4" />
        {/* secondary faint trace (ghost) */}
        <path
          ref={faintRef}
          d={staticD}
          fill="none"
          stroke="var(--color-accent-tertiary)"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.35"
        />
        {/* live trace */}
        <path
          ref={pathRef}
          d={staticD}
          fill="none"
          stroke="var(--color-highlight)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* corner readout */}
        <text x="20" y="28" fill="var(--color-ink-muted)" fontSize="10" fontFamily="'Space Mono', monospace">2.4 kHz</text>
        <text x="320" y="28" fill="var(--color-ink-muted)" fontSize="10" fontFamily="'Space Mono', monospace">CH1</text>
      </svg>
    </ArtifactFrame>
  );
}
