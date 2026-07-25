import { useEffect, useState } from 'react';
import { ArtifactFrame } from './ArtifactFrame';

/**
 * Interlocking gears: two gears that rotate in opposite directions,
 * with teeth that mesh. Represents the platform's machinery.
 * Unique to the Platform page.
 */
export function GearAssembly() {
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
      setAngle(((now - start) / 1000) * 30);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  const gear1 = { cx: 140, cy: 110, r: 50, teeth: 12 };
  const gear2 = { cx: 260, cy: 110, r: 35, teeth: 10 };

  function gearPath(cx: number, cy: number, r: number, teeth: number, toothHeight: number) {
    const innerR = r - toothHeight;
    let d = '';
    for (let i = 0; i < teeth; i++) {
      const a1 = (i / teeth) * Math.PI * 2;
      const a2 = ((i + 0.4) / teeth) * Math.PI * 2;
      const a3 = ((i + 0.6) / teeth) * Math.PI * 2;
      const a4 = ((i + 1) / teeth) * Math.PI * 2;
      const p1 = `${cx + r * Math.cos(a1)},${cy + r * Math.sin(a1)}`;
      const p2 = `${cx + r * Math.cos(a2)},${cy + r * Math.sin(a2)}`;
      const p3 = `${cx + innerR * Math.cos(a3)},${cy + innerR * Math.sin(a3)}`;
      const p4 = `${cx + innerR * Math.cos(a4)},${cy + innerR * Math.sin(a4)}`;
      d += (i === 0 ? `M ${p1}` : ` L ${p1}`) + ` L ${p2} L ${p3} L ${p4}`;
    }
    return d + ' Z';
  }

  return (
    <ArtifactFrame label="PLT-01" sublabel="Platform machinery">
      <svg viewBox="0 0 400 220" className="w-full h-auto" role="img" aria-label="Interlocking gears representing platform machinery">
        {/* gear 1 — clockwise */}
        <g style={reduced ? {} : { transformOrigin: `${gear1.cx}px ${gear1.cy}px`, transform: `rotate(${angle}deg)` }}>
          <path d={gearPath(gear1.cx, gear1.cy, gear1.r, gear1.teeth, 8)} fill="var(--color-accent-tertiary)" opacity="0.2" stroke="var(--color-accent-tertiary)" strokeWidth="1.5" />
          <circle cx={gear1.cx} cy={gear1.cy} r={gear1.r * 0.6} fill="none" stroke="var(--color-accent-tertiary)" strokeWidth="1" opacity="0.4" />
          <circle cx={gear1.cx} cy={gear1.cy} r="6" fill="var(--color-accent-tertiary)" />
        </g>

        {/* gear 2 — counter-clockwise */}
        <g style={reduced ? {} : { transformOrigin: `${gear2.cx}px ${gear2.cy}px`, transform: `rotate(${-angle}deg)` }}>
          <path d={gearPath(gear2.cx, gear2.cy, gear2.r, gear2.teeth, 7)} fill="var(--color-highlight)" opacity="0.2" stroke="var(--color-highlight)" strokeWidth="1.5" />
          <circle cx={gear2.cx} cy={gear2.cy} r={gear2.r * 0.55} fill="none" stroke="var(--color-highlight)" strokeWidth="1" opacity="0.4" />
          <circle cx={gear2.cx} cy={gear2.cy} r="5" fill="var(--color-highlight)" />
        </g>

        {/* connecting belt */}
        <path
          d={`M ${gear1.cx} ${gear1.cy - gear1.r * 0.7} Q 200 30 ${gear2.cx} ${gear2.cy - gear2.r * 0.7}`}
          fill="none"
          stroke="var(--color-ink)"
          strokeWidth="1"
          opacity="0.1"
          strokeDasharray="3 3"
        />
      </svg>
    </ArtifactFrame>
  );
}
