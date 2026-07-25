import { useEffect, useState } from 'react';
import { ArtifactFrame } from './ArtifactFrame';

/**
 * Code terminal: lines of API code type themselves out character by
 * character, with a blinking cursor. Represents the API reference.
 * Unique to the API Reference page.
 */
export function CodeTerminal() {
  const [reduced, setReduced] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const lines = [
    { text: 'POST /v1/agents', color: 'var(--color-accent-primary)' },
    { text: 'Authorization: Bearer sk-...', color: 'var(--color-ink-muted)' },
    { text: 'Content-Type: application/json', color: 'var(--color-ink-muted)' },
    { text: '', color: '' },
    { text: '{', color: 'var(--color-ink)' },
    { text: '  "name": "Mach One",', color: 'var(--color-accent-secondary)' },
    { text: '  "type": "mach_one",', color: 'var(--color-accent-secondary)' },
    { text: '  "channels": ["email"]', color: 'var(--color-accent-secondary)' },
    { text: '}', color: 'var(--color-ink)' },
    { text: '', color: '' },
    { text: '200 OK', color: 'var(--color-highlight)' },
    { text: '"id": "agt_8x2k..."', color: 'var(--color-accent-tertiary)' },
  ];

  const fullText = lines.map((l) => l.text).join('\n');

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const update = () => setReduced(mq.matches);
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (reduced) {
      setCharCount(fullText.length);
      return;
    }
    let idx = 0;
    const interval = setInterval(() => {
      idx += 2;
      if (idx >= fullText.length) {
        idx = 0;
      }
      setCharCount(idx);
    }, 80);
    return () => clearInterval(interval);
  }, [reduced, fullText]);

  const visibleText = fullText.slice(0, charCount);
  const visibleLines = visibleText.split('\n');

  return (
    <ArtifactFrame label="API-01" sublabel="Live request">
      <div
        className="rounded-radius-sm bg-[var(--color-ink)] p-4 font-mono text-[0.75rem] leading-relaxed h-[200px] overflow-hidden"
        style={{ fontFamily: "'Space Mono', monospace" }}
      >
        <div className="flex items-center gap-1.5 mb-3 pb-2 border-b border-[rgba(239,230,211,0.1)]">
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-accent-primary)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-highlight)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-accent-secondary)]" />
          <span className="ml-2 text-[0.65rem] text-[rgba(239,230,211,0.4)]">curl — mach-api</span>
        </div>
        {visibleLines.map((line, i) => {
          const sourceLine = lines[i];
          if (!sourceLine) return null;
          return (
            <div key={i} className="flex items-center gap-2 mb-1">
              <span className="text-[rgba(239,230,211,0.3)] shrink-0 w-5">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span style={{ color: sourceLine.color || 'var(--color-bg)' }}>
                {line}
              </span>
              {i === visibleLines.length - 1 && !reduced && (
                <span className="inline-block h-3.5 w-2 bg-[var(--color-highlight)] ml-0.5" style={{ animation: 'code-type 0.8s step-end infinite' }} />
              )}
            </div>
          );
        })}
      </div>
    </ArtifactFrame>
  );
}
