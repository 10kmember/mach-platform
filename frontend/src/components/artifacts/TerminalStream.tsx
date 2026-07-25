import { useEffect, useRef, useState } from 'react';
import { ArtifactFrame } from './ArtifactFrame';

const LOG_LINES = [
  { text: 'POST /api/auth/signin  200  12ms', color: 'tertiary' },
  { text: 'agent_01  skill=inbox_triage  ok', color: 'secondary' },
  { text: 'GET  /api/agents        200   4ms', color: 'tertiary' },
  { text: 'agent_02  skill=price_watch  ok', color: 'secondary' },
  { text: 'POST /api/skills/run    200  28ms', color: 'tertiary' },
  { text: 'backup   snapshot=ok   1.2MB', color: 'highlight' },
  { text: 'agent_03  skill=daily_brief  ok', color: 'secondary' },
  { text: 'PATCH /api/agents/01    200   8ms', color: 'tertiary' },
  { text: 'agent_01  skill=repo_sentry  ok', color: 'secondary' },
  { text: 'GET  /api/auth/me       200   3ms', color: 'tertiary' },
  { text: 'update   agent_02  v2.4.1 ok', color: 'highlight' },
  { text: 'agent_03  skill=price_watch  ok', color: 'secondary' },
];

const COLOR_MAP: Record<string, string> = {
  tertiary: 'var(--color-accent-tertiary)',
  secondary: 'var(--color-accent-secondary)',
  highlight: 'var(--color-highlight)',
  primary: 'var(--color-accent-primary)',
  muted: 'var(--color-ink-muted)',
  ink: 'var(--color-ink)',
};

/**
 * Terminal log stream: lines appear one by one with a blinking cursor,
 * like a live server console. Represents the API and monitoring layer.
 */
export function TerminalStream() {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [reduced, setReduced] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const update = () => setReduced(mq.matches);
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (reduced) {
      setVisibleLines(LOG_LINES.length);
      return;
    }
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx % LOG_LINES.length) + 1;
      setVisibleLines(idx);
    }, 900);
    return () => clearInterval(interval);
  }, [reduced]);

  const shown = reduced ? LOG_LINES : LOG_LINES.slice(0, visibleLines);

  return (
    <ArtifactFrame label="LOG-01" sublabel="API stream">
      <div
        ref={scrollRef}
        className="rounded-radius-sm bg-[var(--color-ink)] p-4 font-mono text-[0.75rem] leading-relaxed h-[200px] overflow-hidden"
        style={{ fontFamily: "'Space Mono', monospace" }}
      >
        <div className="flex items-center gap-1.5 mb-3 pb-2 border-b border-[rgba(239,230,211,0.1)]">
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-accent-primary)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-highlight)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-accent-secondary)]" />
          <span className="ml-2 text-[0.65rem] text-[rgba(239,230,211,0.4)]">mach@server: ~/logs</span>
        </div>
        {shown.map((line, i) => (
          <div key={i} className="flex items-center gap-2 mb-1">
            <span className="text-[rgba(239,230,211,0.35)] shrink-0">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span style={{ color: COLOR_MAP[line.color] || COLOR_MAP.ink }}>
              {line.text}
            </span>
          </div>
        ))}
        {!reduced && visibleLines < LOG_LINES.length && (
          <span className="inline-block h-3.5 w-2 bg-[var(--color-highlight)] animate-pulse" />
        )}
      </div>
    </ArtifactFrame>
  );
}
