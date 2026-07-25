import { RadioTower } from 'lucide-react';

interface LogoProps {
  /** Size of the wordmark text in pixels (the mark scales with it). */
  size?: number;
  /** Apply ink color suitable for light backgrounds; default. */
  variant?: 'ink' | 'parchment';
  className?: string;
}

/**
 * Mach brand mark: four ascending signal bars with a harvest-gold active dot,
 * paired with the Fraunces wordmark. The active dot carries the signal-pulse
 * animation so the mark itself reads as "live".
 */
export function Logo({ size = 22, variant = 'ink', className = '' }: LogoProps) {
  const textColor = variant === 'parchment' ? 'var(--color-bg)' : 'var(--color-ink)';
  const barColor = variant === 'parchment' ? 'var(--color-accent-tertiary)' : 'var(--color-accent-tertiary)';
  const mark = size * 1.18;

  return (
    <span className={`inline-flex items-center gap-[0.5em] ${className}`}>
      <svg
        width={mark}
        height={mark}
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        <g stroke={barColor} strokeWidth="2.4" strokeLinecap="round">
          <line x1="9.5" y1="22" x2="9.5" y2="22.2" />
          <line x1="14" y1="18.5" x2="14" y2="22.2" />
          <line x1="18.5" y1="14" x2="18.5" y2="22.2" />
          <line x1="23" y1="9.5" x2="23" y2="22.2" />
        </g>
        <circle cx="23" cy="9.5" r="2.8" fill="var(--color-highlight)" className="signal-pulse" />
      </svg>
      <span
        className="font-display font-semibold tracking-[-0.01em]"
        style={{ fontSize: size, color: textColor, lineHeight: 1 }}
      >
        MACH Labs
      </span>
    </span>
  );
}

/**
 * Compact status pill used in the hero: radio-tower icon + pulsing dot + label.
 */
export function StatusPill({
  label = 'Online',
  icon: Icon = RadioTower,
  tone = 'light',
}: {
  label?: string;
  icon?: typeof RadioTower;
  tone?: 'light' | 'dark';
}) {
  const isDark = tone === 'dark';
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 ${
        isDark
          ? 'border-[rgba(239,230,211,0.18)] bg-[rgba(239,230,211,0.06)] text-[var(--color-bg)]'
          : 'border-[var(--color-border)] bg-[var(--color-bg-raised)] text-[var(--color-ink)]'
      }`}
    >
      <Icon size={14} strokeWidth={1.5} className="shrink-0 opacity-90" />
      <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-highlight)] signal-pulse" />
      <span className="text-mono-label text-[0.7rem] leading-none">{label}</span>
    </span>
  );
}
