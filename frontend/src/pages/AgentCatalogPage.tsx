import { Library, ArrowRight, Cpu, Terminal, Globe, Code2, type LucideIcon } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { LinkButton } from '../components/Button';
import { Reveal } from '../components/Reveal';
import { CatalogShelf } from '../components/artifacts/CatalogShelf';

interface AgentEntry {
  name: string;
  type: string;
  tier: string;
  icon: LucideIcon;
  description: string;
  bestFor: string;
  startingPrice: string;
}

const AGENTS: AgentEntry[] = [
  {
    name: 'Mach One',
    type: 'mach_one',
    tier: 'Flagship',
    icon: Cpu,
    description: 'Our signature agent, built for the Mach platform. Browses the web, writes and reviews code, drafts documents, and runs scheduled tasks autonomously with persistent memory.',
    bestFor: 'General-purpose work, personal productivity, small teams',
    startingPrice: '$19/mo',
  },
  {
    name: 'Mach Forge',
    type: 'mach_forge',
    tier: 'Engineering',
    icon: Terminal,
    description: 'A heavyweight engineering agent for continuous codebase work. Monitors pull requests, writes tests, refactors modules, and posts review comments in a sandboxed environment.',
    bestFor: 'Engineering teams, CI/CD automation, code review',
    startingPrice: '$49/mo',
  },
  {
    name: 'Mach Relay',
    type: 'mach_relay',
    tier: 'Communication',
    icon: Globe,
    description: 'A cross-platform communication agent with native support for persistent conversations, task planning in natural language, and sub-agent delegation across every channel.',
    bestFor: 'Customer support, team coordination, multi-channel workflows',
    startingPrice: '$49/mo',
  },
  {
    name: 'Mach Sentry',
    type: 'mach_sentry',
    tier: 'Monitoring',
    icon: Code2,
    description: 'A lightweight monitoring agent that watches your infrastructure, repositories, and external services. Alerts you the moment something needs attention and compiles digests.',
    bestFor: 'DevOps, infrastructure monitoring, alert routing',
    startingPrice: '$19/mo',
  },
];

export function AgentCatalogPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Agent Catalog"
        eyebrowIcon={Library}
        title={
          <>
            Four agents, each <span className="font-display italic font-normal text-[var(--color-accent-primary)]">purpose-built</span>.
          </>
        }
        subtitle="Browse the full catalog of Mach agents. Each one is engineered for a specific category of work, monitored around the clock, and ready to deploy in under a minute. Compare specs and pick the one that fits your workflow."
        artifact={<CatalogShelf />}
      />

      <section className="py-10 lg:py-16">
        <div className="mx-auto max-w-container px-6 sm:px-12 lg:px-20">
          <div className="flex flex-col gap-6">
            {AGENTS.map((agent, i) => (
              <Reveal key={agent.name} delay={i * 80}>
                <article className="group rounded-radius-md bg-[var(--color-bg-raised)] border border-[var(--color-border)] p-6 lg:p-8 shadow-sm transition-all duration-200 hover:shadow-md">
                  <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr_auto] gap-6 items-start lg:items-center">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center h-14 w-14 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] shrink-0">
                        <agent.icon size={26} strokeWidth={1.5} className="text-[var(--color-accent-tertiary)]" />
                      </div>
                      <div>
                        <h3 className="text-h3 text-[var(--color-ink)]">{agent.name}</h3>
                        <span className="text-mono-label text-[0.65rem] text-[var(--color-accent-primary)]">{agent.tier}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-body text-[var(--color-ink-muted)] mb-3">{agent.description}</p>
                      <div className="flex flex-wrap gap-x-6 gap-y-1 text-[0.875rem]">
                        <span className="text-[var(--color-ink-muted)]">
                          <span className="font-semibold text-[var(--color-ink)]">Best for:</span> {agent.bestFor}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-start lg:items-end gap-2">
                      <span className="font-display font-bold text-[1.5rem] text-[var(--color-ink)]">{agent.startingPrice}</span>
                      <LinkButton href="#/pricing" variant="secondary" size="md" icon={ArrowRight}>
                        Deploy
                      </LinkButton>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
