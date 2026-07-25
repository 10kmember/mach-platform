import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Reveal } from './Reveal';

interface PageHeaderProps {
  eyebrow: string;
  eyebrowIcon: LucideIcon;
  title: ReactNode;
  subtitle: string;
  artifact?: ReactNode;
}

export function PageHeader({ eyebrow, eyebrowIcon: Icon, title, subtitle, artifact }: PageHeaderProps) {
  return (
    <section className="relative pt-28 lg:pt-36 pb-10 lg:pb-14 overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(60% 50% at 70% 20%, rgba(217,162,39,0.08), transparent 70%), radial-gradient(50% 40% at 20% 80%, rgba(47,111,107,0.06), transparent 70%)',
        }}
      />
      <div className="relative mx-auto max-w-container px-6 sm:px-12 lg:px-20">
        <div className={`grid gap-10 lg:gap-16 items-center ${artifact ? 'lg:grid-cols-2' : ''}`}>
          <div className="flex flex-col gap-5 max-w-[42rem]">
            <Reveal>
              <div className="inline-flex items-center gap-2 text-[var(--color-accent-tertiary)]">
                <Icon size={16} strokeWidth={1.5} />
                <span className="eyebrow">{eyebrow}</span>
              </div>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="text-h1 text-[var(--color-ink)]">{title}</h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="text-lead text-[var(--color-ink-muted)] max-w-[48ch]">{subtitle}</p>
            </Reveal>
          </div>
          {artifact && (
            <Reveal delay={200}>
              {artifact}
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
