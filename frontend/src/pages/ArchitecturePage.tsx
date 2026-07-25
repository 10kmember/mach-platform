import { Boxes, ArrowRight, Cpu, Database, Globe, Activity, Server, type LucideIcon } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { LinkButton } from '../components/Button';
import { Reveal } from '../components/Reveal';
import { LayerStack } from '../components/artifacts/LayerStack';

interface Layer {
  icon: LucideIcon;
  title: string;
  body: string;
  tech: string[];
}

const LAYERS: Layer[] = [
  {
    icon: Globe,
    title: 'API Gateway',
    body: 'FastAPI behind a hardened reverse proxy with rate limiting, request validation, and full audit logging. Bearer token auth with automatic rotation and revocation.',
    tech: ['FastAPI', 'Nginx', 'Redis'],
  },
  {
    icon: Cpu,
    title: 'Agent Runtime',
    body: 'Each agent runs in an isolated container with resource limits, network policies, and automatic health checks. Crashes trigger automatic restart within seconds.',
    tech: ['Docker', 'Kubernetes', 'gVisor'],
  },
  {
    icon: Database,
    title: 'Data Layer',
    body: 'PostgreSQL with point-in-time recovery, daily snapshots retained for 30 days, and read replicas for query isolation. Your data is encrypted at rest with per-tenant keys.',
    tech: ['PostgreSQL', 'pgvecto.rs', 'S3'],
  },
  {
    icon: Activity,
    title: 'Monitoring Mesh',
    body: 'Every agent, skill, and channel emits structured telemetry. Our operations layer correlates signals across the fleet and opens incidents automatically when patterns break.',
    tech: ['OpenTelemetry', 'Prometheus', 'Grafana'],
  },
  {
    icon: Server,
    title: 'Infrastructure',
    body: 'Dedicated infrastructure on corporate plans with custom regions. Auto-scaling, GPU-backed inference, and transparent API cost reporting with per-agent budgets.',
    tech: ['AWS', 'Terraform', 'GPU Clusters'],
  },
];

export function ArchitecturePage() {
  return (
    <main>
      <PageHeader
        eyebrow="Architecture"
        eyebrowIcon={Boxes}
        title={
          <>
            Built for <span className="font-display italic font-normal text-[var(--color-accent-primary)]">production</span>, not demos.
          </>
        }
        subtitle="Every layer of the Mach stack is designed for uptime, security, and cost predictability. From the agent runtime to the monitoring mesh, we engineer for reliability at scale. Here is the full architecture, layer by layer."
        artifact={<LayerStack />}
      />

      <section className="py-10 lg:py-16">
        <div className="mx-auto max-w-container px-6 sm:px-12 lg:px-20">
          <Reveal>
            <div className="max-w-[42ch] mb-8">
              <span className="eyebrow text-[var(--color-accent-tertiary)]">Stack</span>
              <h2 className="text-h2 text-[var(--color-ink)] mt-3">Five layers, end to end</h2>
            </div>
          </Reveal>
          <div className="flex flex-col gap-6">
            {LAYERS.map((layer, i) => (
              <Reveal key={layer.title} delay={i * 80}>
                <article className="rounded-radius-md bg-[var(--color-bg-raised)] border border-[var(--color-border)] p-6 lg:p-8 shadow-sm">
                  <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr_auto] gap-6 items-start lg:items-center">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center h-14 w-14 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] shrink-0">
                        <layer.icon size={24} strokeWidth={1.5} className="text-[var(--color-accent-tertiary)]" />
                      </div>
                      <span className="font-display font-bold text-[1.5rem] text-[var(--color-accent-primary)] opacity-30">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-h3 text-[var(--color-ink)] mb-3">{layer.title}</h3>
                      <p className="text-body text-[var(--color-ink-muted)]">{layer.body}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 lg:justify-end max-w-[200px]">
                      {layer.tech.map((tech) => (
                        <span
                          key={tech}
                          className="text-mono-label text-[0.6rem] px-2.5 py-1 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-ink-muted)]"
                        >
                          {tech}
                        </span>
                      ))}
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
            <div className="rounded-radius-lg bg-[var(--color-bg-raised)] border border-[var(--color-border)] p-6 lg:p-10 flex flex-col sm:flex-row items-start sm:items-center gap-6 justify-between">
              <div>
                <h3 className="text-h3 text-[var(--color-ink)] mb-2">Want to see it in production?</h3>
                <p className="text-body text-[var(--color-ink-muted)] max-w-[48ch]">
                  Our solutions engineers can walk you through the architecture and help you plan a deployment.
                </p>
              </div>
              <LinkButton href="mailto:enterprise@mach.ai" variant="secondary" size="lg" icon={ArrowRight} className="shrink-0">
                Talk to engineering
              </LinkButton>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
