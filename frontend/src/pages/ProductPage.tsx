import { Boxes, ArrowRight, Zap, Shield, Clock, Globe, type LucideIcon } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { LinkButton } from '../components/Button';
import { Reveal } from '../components/Reveal';
import { OrbitConstellation } from '../components/artifacts/OrbitConstellation';
import { Connectors } from '../components/Connectors';
import { routeHref } from '../hooks/useRoute';

interface Pillar {
  icon: LucideIcon;
  title: string;
  body: string;
}

const PILLARS: Pillar[] = [
  {
    icon: Zap,
    title: 'Deploy in seconds',
    body: 'Pick an agent, connect a channel, and it is live. No Dockerfiles, no YAML, no infrastructure tickets. One click and it is already working.',
  },
  {
    icon: Clock,
    title: 'Always on, never babysat',
    body: 'Agents run around the clock on managed infrastructure with automatic updates, daily backups, and health monitoring. You set the goal, we keep the lights on.',
  },
  {
    icon: Shield,
    title: 'Secure by default',
    body: 'Every agent runs in an isolated, encrypted environment. SSO, RBAC, and full audit logs on corporate plans. SOC 2 Type II, GDPR, and HIPAA aligned.',
  },
  {
    icon: Globe,
    title: 'Meets your workflow',
    body: 'Email, Telegram, WhatsApp, Slack, Discord, Signal, browser, API, webhook. Connect the repos, files, and services your workflow already runs on.',
  },
];

export function ProductPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Product"
        eyebrowIcon={Boxes}
        title={
          <>
            The managed platform for <span className="font-display italic font-normal text-[var(--color-accent-primary)]">always-on</span> agents.
          </>
        }
        subtitle="Mach is the calm, managed home for your AI agents. We engineer, host, and monitor the entire stack so your agents stay on, stay secure, and stay within budget. You set the goal. We handle the rest."
        artifact={<OrbitConstellation />}
      />

      <section className="py-10 lg:py-16">
        <div className="mx-auto max-w-container px-6 sm:px-12 lg:px-20">
          <Reveal>
            <div className="max-w-[42ch] mb-8">
              <span className="eyebrow text-[var(--color-accent-tertiary)]">Four pillars</span>
              <h2 className="text-h2 text-[var(--color-ink)] mt-3">What makes Mach different</h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {PILLARS.map((pillar, i) => (
              <Reveal key={pillar.title} delay={i * 80}>
                <article className="group h-full rounded-radius-md bg-[var(--color-bg-raised)] border border-[var(--color-border)] p-6 lg:p-8 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-1">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] mb-5">
                    <pillar.icon size={22} strokeWidth={1.5} className="text-[var(--color-accent-tertiary)]" />
                  </div>
                  <h3 className="text-h3 text-[var(--color-ink)] mb-3">{pillar.title}</h3>
                  <p className="text-body text-[var(--color-ink-muted)]">{pillar.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Connectors />

      <section className="py-10 lg:py-16">
        <div className="mx-auto max-w-container px-6 sm:px-12 lg:px-20">
          <Reveal>
            <div className="rounded-radius-lg bg-[var(--color-ink)] px-6 py-12 sm:px-12 lg:px-16 lg:py-16 text-center">
              <h2 className="text-h2 text-[var(--color-bg)] mb-4">See it in action</h2>
              <p className="text-lead text-[rgba(239,230,211,0.8)] max-w-[52ch] mx-auto mb-8">
                Deploy your first agent in under a minute. No credit card required to explore.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <LinkButton href={routeHref('signup')} variant="highlight" size="lg" icon={ArrowRight}>
                  Get Started Free
                </LinkButton>
                <LinkButton href={routeHref('how-it-works')} variant="secondary" size="lg" className="text-[var(--color-bg)] border-[rgba(239,230,211,0.3)] hover:bg-[rgba(239,230,211,0.08)]">
                  See how it works
                </LinkButton>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
