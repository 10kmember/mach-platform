import { RadioTower, ArrowRight, ShieldCheck, Cpu, Globe, Lock, Server, Headphones, type LucideIcon } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { Reveal } from '../components/Reveal';
import { LinkButton } from '../components/Button';
import { NetworkGrid } from '../components/artifacts/NetworkGrid';
import { SecurityRadar } from '../components/artifacts/SecurityRadar';

interface Value {
  icon: LucideIcon;
  title: string;
  body: string;
}

const VALUES: Value[] = [
  {
    icon: Cpu,
    title: 'Agents that do real work',
    body: 'Mach agents do not just answer questions. They browse the web, write and review code, draft documents, manage schedules, and hand back finished work you can use immediately. Each one is purpose built for a category of work and tuned for reliability over novelty.',
  },
  {
    icon: ShieldCheck,
    title: 'Security is the foundation',
    body: 'Every agent runs in an isolated, encrypted environment. Data is encrypted at rest and in transit. Access is controlled through SSO, RBAC, and full audit logs on corporate plans. We align with SOC 2 Type II, GDPR, HIPAA, and ISO 27001 so your security team can sign off without a fight.',
  },
  {
    icon: Globe,
    title: 'Meet your workflow where it is',
    body: 'Your agents speak through email, Telegram, WhatsApp, Slack, Discord, Signal, browser, API, and webhook. They connect to the repositories, files, and services your workflow already runs on. No rip and replace, no proprietary runtime lock in.',
  },
  {
    icon: Server,
    title: 'Managed infrastructure, zero babysitting',
    body: 'We handle hosting, scaling, daily backups, automatic updates, and monitoring. You set the goal and we keep the lights on. No servers to provision, no Dockerfiles to write, no API key rotations to schedule.',
  },
  {
    icon: Lock,
    title: 'Cost controls, not cost surprises',
    body: 'API usage is capped per agent with transparent reporting. You see exactly what each agent costs and why. Alerts fire before budgets are exceeded, so a runaway agent never becomes a runaway bill.',
  },
  {
    icon: Headphones,
    title: 'Support from engineers, not scripts',
    body: 'When something breaks you talk to the engineers who built the platform, not a chatbot reading a script. Priority support on every paid plan, with dedicated solutions engineers on corporate tiers.',
  },
];

const COMPLIANCE = ['SOC 2 Type II', 'GDPR', 'HIPAA Ready', 'ISO 27001 Aligned'];

export function AboutPage() {
  return (
    <main>
      <PageHeader
        eyebrow="About Mach"
        eyebrowIcon={RadioTower}
        title={
          <>
            The managed home for <span className="font-display italic font-normal text-[var(--color-accent-primary)]">AI agents</span>.
          </>
        }
        subtitle="Mach engineers, hosts, and monitors AI agents for individuals and enterprises. We build the infrastructure, controls, and monitoring layer so your agents stay on, stay secure, and stay within budget. No server management, no API key sprawl, no silent failures at 3 AM."
        artifact={<NetworkGrid />}
      />

      {/* Values grid */}
      <section className="py-10 lg:py-16">
        <div className="mx-auto max-w-container px-6 sm:px-12 lg:px-20">
          <Reveal>
            <div className="max-w-[42ch] mb-8">
              <span className="eyebrow text-[var(--color-accent-tertiary)]">What we believe</span>
              <h2 className="text-h2 text-[var(--color-ink)] mt-3">Principles that shape the platform</h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {VALUES.map((value, i) => (
              <Reveal key={value.title} delay={i * 60}>
                <article className="h-full rounded-radius-md bg-[var(--color-bg-raised)] border border-[var(--color-border)] p-6 lg:p-8 shadow-sm">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] mb-5">
                    <value.icon size={22} strokeWidth={1.5} className="text-[var(--color-accent-tertiary)]" />
                  </div>
                  <h3 className="text-h3 text-[var(--color-ink)] mb-3">{value.title}</h3>
                  <p className="text-body text-[var(--color-ink-muted)]">{value.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture section */}
      <section className="py-10 lg:py-16">
        <div className="mx-auto max-w-container px-6 sm:px-12 lg:px-20">
          <Reveal>
            <div className="max-w-[42ch] mb-8">
              <span className="eyebrow text-[var(--color-accent-tertiary)]">Architecture</span>
              <h2 className="text-h2 text-[var(--color-ink)] mt-3">Built for reliability, not demos</h2>
              <p className="text-body text-[var(--color-ink-muted)] mt-3">
                Every layer of the Mach stack is designed for production. From the agent runtime to the monitoring mesh, we engineer for uptime, security, and cost predictability.
              </p>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Reveal delay={0}>
              <SecurityRadar />
            </Reveal>
            <Reveal delay={80}>
              <div className="flex flex-col gap-4 h-full justify-center">
                {[
                  { title: 'Agent runtime', body: 'Each agent runs in an isolated container with resource limits, network policies, and automatic health checks. Crashes trigger automatic restart within seconds.' },
                  { title: 'Data layer', body: 'PostgreSQL with point in time recovery, daily snapshots retained for 30 days, and read replicas for query isolation. Your data is encrypted at rest with per tenant keys.' },
                  { title: 'Monitoring mesh', body: 'Every agent, skill, and channel emits structured telemetry. Our operations layer correlates signals across the fleet and opens incidents automatically when patterns break.' },
                  { title: 'API gateway', body: 'FastAPI behind a hardened reverse proxy with rate limiting, request validation, and full audit logging. Bearer token auth with automatic rotation and revocation.' },
                ].map((item) => (
                  <div key={item.title} className="rounded-radius-md bg-[var(--color-bg-raised)] border border-[var(--color-border)] p-5 shadow-sm">
                    <h3 className="font-body font-semibold text-[var(--color-ink)] text-[1rem] mb-1.5">{item.title}</h3>
                    <p className="text-[0.9375rem] text-[var(--color-ink-muted)]">{item.body}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Compliance band */}
      <section className="py-10 lg:py-16">
        <div className="mx-auto max-w-container px-6 sm:px-12 lg:px-20">
          <Reveal>
            <div className="rounded-radius-lg bg-[var(--color-ink)] px-6 py-10 sm:px-12 lg:px-16 lg:py-14">
              <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-12 justify-between">
                <div className="max-w-[36ch]">
                  <h2 className="text-h2 text-[var(--color-bg)] mb-3">Compliance without compromise</h2>
                  <p className="text-lead text-[rgba(239,230,211,0.8)]">
                    We hold ourselves to the same standards your security and compliance teams demand. Documentation, evidence, and audit trails available on request.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {COMPLIANCE.map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center gap-2 rounded-radius-sm bg-[rgba(239,230,211,0.08)] border border-[rgba(239,230,211,0.15)] px-4 py-2.5 text-[0.9375rem] font-body font-semibold text-[var(--color-bg)]"
                    >
                      <ShieldCheck size={16} strokeWidth={1.5} className="text-[var(--color-highlight)]" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-10 lg:py-16">
        <div className="mx-auto max-w-container px-6 sm:px-12 lg:px-20">
          <Reveal>
            <div className="rounded-radius-lg bg-[var(--color-bg-raised)] border border-[var(--color-border)] p-6 lg:p-10 flex flex-col sm:flex-row items-start sm:items-center gap-6 justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] shrink-0">
                  <Headphones size={22} strokeWidth={1.5} className="text-[var(--color-accent-tertiary)]" />
                </div>
                <div>
                  <h3 className="text-h3 text-[var(--color-ink)]">Talk to our team</h3>
                  <p className="text-body text-[var(--color-ink-muted)] mt-1">
                    Whether you are evaluating Mach for a team of five or a Fortune 500, we are ready to help.
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <a
                  href="mailto:hello@mach.ai"
                  className="font-body font-semibold text-[var(--color-accent-tertiary)] hover:underline whitespace-nowrap"
                >
                  hello@mach.ai
                </a>
                <LinkButton href="mailto:enterprise@mach.ai" variant="secondary" size="md" icon={ArrowRight}>
                  Enterprise sales
                </LinkButton>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
