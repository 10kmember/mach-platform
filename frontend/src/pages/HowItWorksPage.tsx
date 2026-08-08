import { Workflow, ArrowRight, MousePointerClick, Plug, RadioTower, Activity, RefreshCw, type LucideIcon } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { LinkButton } from '../components/Button';
import { Reveal } from '../components/Reveal';
import { PipelineFlow } from '../components/artifacts/PipelineFlow';
import { routeHref } from '../hooks/useRoute';

interface Step {
  icon: LucideIcon;
  title: string;
  body: string;
  stepNumber: string;
}

const STEPS: Step[] = [
  {
    icon: MousePointerClick,
    title: 'Pick your agent',
    body: 'Browse the catalog and choose the agent that fits your workflow. Mach One for general work, Forge for engineering, Relay for communication, Sentry for monitoring.',
    stepNumber: '01',
  },
  {
    icon: Plug,
    title: 'Connect a channel',
    body: 'Link your email, Telegram, WhatsApp, Slack, browser, or API. Each channel takes seconds to connect and can be changed or extended at any time.',
    stepNumber: '02',
  },
  {
    icon: RadioTower,
    title: 'Add skills',
    body: 'Drop one or more skills onto your agent. Each skill is a preconfigured, monitored workflow that runs on a schedule or continuously.',
    stepNumber: '03',
  },
  {
    icon: Activity,
    title: 'It starts working',
    body: 'Your agent goes live immediately. It runs skills around the clock, broadcasts health signals, and only interrupts you when a real decision is needed.',
    stepNumber: '04',
  },
  {
    icon: RefreshCw,
    title: 'We handle the rest',
    body: 'Mach monitors, updates, and backs up your agent automatically. You see cost reports, execution logs, and health status in your dashboard.',
    stepNumber: '05',
  },
];

export function HowItWorksPage() {
  return (
    <main>
      <PageHeader
        eyebrow="How It Works"
        eyebrowIcon={Workflow}
        title={
          <>
            From sign-up to <span className="font-display italic font-normal text-[var(--color-accent-primary)]">working agent</span> in five steps.
          </>
        }
        subtitle="No infrastructure to provision, no Dockerfiles to write, no API keys to rotate. Pick an agent, connect a channel, add skills, and it is already working. Here is the full path from zero to deployed."
        artifact={<PipelineFlow />}
      />

      <section className="py-10 lg:py-16">
        <div className="mx-auto max-w-container px-6 sm:px-12 lg:px-20">
          <div className="flex flex-col gap-6">
            {STEPS.map((step, i) => (
              <Reveal key={step.stepNumber} delay={i * 80}>
                <article className="group rounded-radius-md bg-[var(--color-bg-raised)] border border-[var(--color-border)] p-6 lg:p-8 shadow-sm transition-all duration-200 hover:shadow-md">
                  <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-6 items-start">
                    <div className="flex items-center gap-4">
                      <span className="font-display font-bold text-[2.5rem] leading-none text-[var(--color-accent-primary)] opacity-30">
                        {step.stepNumber}
                      </span>
                      <div className="flex items-center justify-center h-14 w-14 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] shrink-0">
                        <step.icon size={24} strokeWidth={1.5} className="text-[var(--color-accent-tertiary)]" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-h3 text-[var(--color-ink)] mb-3">{step.title}</h3>
                      <p className="text-body text-[var(--color-ink-muted)]">{step.body}</p>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 lg:py-16">
        <div className="mx-auto max-w-container px-6 sm:px-12 lg:px-20">
          <Reveal>
            <div className="rounded-radius-lg bg-[var(--color-ink)] px-6 py-12 sm:px-12 lg:px-16 lg:py-16 text-center">
              <h2 className="text-h2 text-[var(--color-bg)] mb-4">Ready to start?</h2>
              <p className="text-lead text-[rgba(239,230,211,0.8)] max-w-[52ch] mx-auto mb-8">
                Your first agent can be live in under a minute. No credit card required.
              </p>
              <LinkButton href={routeHref('signup')} variant="highlight" size="lg" icon={ArrowRight}>
                Get Started Free
              </LinkButton>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
