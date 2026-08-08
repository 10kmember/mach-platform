import { Server, ArrowRight, Cpu, Database, Globe, Lock, Activity, type LucideIcon } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { LinkButton } from '../components/Button';
import { Reveal } from '../components/Reveal';
import { GearAssembly } from '../components/artifacts/GearAssembly';

interface Component {
  icon: LucideIcon;
  title: string;
  body: string;
}

const COMPONENTS: Component[] = [
  {
    icon: Cpu,
    title: 'Agent runtime',
    body: 'Each agent runs in an isolated container with resource limits, network policies, and automatic health checks. Crashes trigger restart within seconds.',
  },
  {
    icon: Database,
    title: 'Data layer',
    body: 'PostgreSQL with point-in-time recovery, daily snapshots retained for 30 days, and read replicas for query isolation. Per-tenant encryption keys.',
  },
  {
    icon: Globe,
    title: 'Channel gateway',
    body: 'A unified gateway connects email, Telegram, WhatsApp, Slack, Discord, Signal, browser, API, and webhook. Each channel is independently scalable.',
  },
  {
    icon: Lock,
    title: 'Auth and access',
    body: 'SSO via SAML and OIDC, role-based access control, SCIM provisioning, and full audit logs. Bearer token auth with automatic rotation.',
  },
  {
    icon: Activity,
    title: 'Monitoring mesh',
    body: 'Every agent, skill, and channel emits structured telemetry. Our operations layer correlates signals and opens incidents automatically.',
  },
  {
    icon: Server,
    title: 'Infrastructure',
    body: 'Dedicated infrastructure on corporate plans with custom regions. Auto-scaling, GPU-backed inference, and transparent API cost reporting.',
  },
];

export function PlatformPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Platform"
        eyebrowIcon={Server}
        title={
          <>
            The machinery <span className="font-display italic font-normal text-[var(--color-accent-primary)]">behind</span> your agents.
          </>
        }
        subtitle="Mach is a complete platform, not a wrapper around an API. Every layer from the agent runtime to the monitoring mesh is engineered in-house for reliability, security, and cost predictability. Here is what runs under the hood."
        artifact={<GearAssembly />}
      />

      <section className="py-10 lg:py-16">
        <div className="mx-auto max-w-container px-6 sm:px-12 lg:px-20">
          <Reveal>
            <div className="max-w-[42ch] mb-8">
              <span className="eyebrow text-[var(--color-accent-tertiary)]">Components</span>
              <h2 className="text-h2 text-[var(--color-ink)] mt-3">Six layers, one platform</h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {COMPONENTS.map((component, i) => (
              <Reveal key={component.title} delay={i * 60}>
                <article className="h-full rounded-radius-md bg-[var(--color-bg-raised)] border border-[var(--color-border)] p-6 lg:p-8 shadow-sm">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] mb-5">
                    <component.icon size={22} strokeWidth={1.5} className="text-[var(--color-accent-tertiary)]" />
                  </div>
                  <h3 className="text-h3 text-[var(--color-ink)] mb-3">{component.title}</h3>
                  <p className="text-body text-[var(--color-ink-muted)]">{component.body}</p>
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
              <h2 className="text-h2 text-[var(--color-bg)] mb-4">Want the deep dive?</h2>
              <p className="text-lead text-[rgba(239,230,211,0.8)] max-w-[52ch] mx-auto mb-8">
                Read the full architecture breakdown and see how each layer fits together.
              </p>
              <LinkButton href="/architecture" variant="highlight" size="lg" icon={ArrowRight}>
                View architecture
              </LinkButton>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
