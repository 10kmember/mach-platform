import { RadioTower, ArrowRight } from 'lucide-react';
import { LinkButton } from './Button';
import { SignalDial } from './SignalDial';
import { Reveal } from './Reveal';
import { routeHref } from '../hooks/useHashRoute';

export function Hero() {
  return (
    <section
      id="home"
      className="relative pt-28 lg:pt-36 pb-16 lg:pb-24 overflow-hidden"
    >
      {/* soft radial wash for warmth */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(60% 50% at 70% 20%, rgba(217,162,39,0.10), transparent 70%), radial-gradient(50% 40% at 20% 80%, rgba(47,111,107,0.08), transparent 70%)',
        }}
      />

      <div className="relative mx-auto max-w-container px-6 sm:px-12 lg:px-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Copy */}
          <div className="flex flex-col gap-6 max-w-[42rem]">
            <Reveal>
              <div className="inline-flex items-center gap-2 text-[var(--color-accent-tertiary)]">
                <RadioTower size={16} strokeWidth={1.5} />
                <span className="eyebrow">Steady Agent Hosting</span>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <h1 className="text-h1 text-[var(--color-ink)]">
                Your agents, always on.
                <br />
                <span className="font-display italic font-normal text-[var(--color-accent-primary)]">
                  Steady
                </span>
                , simple, yours.
              </h1>
            </Reveal>

            <Reveal delay={160}>
              <p className="text-lead text-[var(--color-ink-muted)] max-w-[42ch]">
                Mach is the calm, managed home for your AI agents. Deploy in seconds, run them
                around the clock, skip the infrastructure babysitting.
              </p>
            </Reveal>

            <Reveal delay={240}>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5 pt-2">
                <LinkButton
                  href={routeHref('pricing')}
                  variant="primary"
                  size="lg"
                  icon={ArrowRight}
                  className="w-full sm:w-auto"
                >
                  Launch Your Agent
                </LinkButton>
                <span className="text-caption text-[var(--color-ink-muted)]">
                  No setup required. Live in under a minute
                </span>
              </div>
            </Reveal>
          </div>

          {/* Visual */}
          <Reveal delay={200}>
            <SignalDial />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
