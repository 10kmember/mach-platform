interface ArtifactFrameProps {
  label: string;
  sublabel?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Shared frame for hi-fi artifacts: raised card, corner labels, pulsing
 * status dot — same visual language as the hero SignalDial.
 */
export function ArtifactFrame({ label, sublabel, children, className = '' }: ArtifactFrameProps) {
  return (
    <div className={`relative rounded-radius-lg bg-[var(--color-bg-raised)] border border-[var(--color-border)] shadow-md p-6 sm:p-8 ${className}`}>
      <div className="absolute top-4 right-4">
        <div className="inline-flex items-center gap-2 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] px-2.5 py-1.5 shadow-sm">
          <span className="h-2 w-2 rounded-full bg-[var(--color-highlight)] signal-pulse" />
          <span className="text-mono-label text-[0.65rem] text-[var(--color-ink)]">Live</span>
        </div>
      </div>
      <div className="absolute bottom-4 left-4 text-mono-label text-[0.6rem] text-[var(--color-ink-muted)]">
        {label}
        {sublabel && <span className="opacity-60"> · {sublabel}</span>}
      </div>
      {children}
    </div>
  );
}
