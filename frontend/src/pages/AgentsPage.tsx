import {
  RadioTower,
  ArrowRight,
  Cpu,
  Terminal,
  Globe,
  Code2,
  Clock,
  Brain,
  MousePointerClick,
  ShieldCheck,
  Puzzle,
  MapPin,
  type LucideIcon,
} from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { LinkButton } from '../components/Button';
import { Reveal } from '../components/Reveal';
import { AgentMatrix } from '../components/artifacts/AgentMatrix';
import { TerminalStream } from '../components/artifacts/TerminalStream';

interface AgentCard {
  name: string;
  tier: string;
  icon: LucideIcon;
  description: string;
  capabilities: string[];
  channels: string[];
}

const AGENTS: AgentCard[] = [
  {
    name: 'Mach One',
    tier: 'Flagship Agent',
    icon: Cpu,
    description:
      'Our signature agent, built from the ground up for the Mach platform. It browses the web, writes and reviews code, drafts documents, and runs scheduled tasks autonomously. Persistent memory means it learns your preferences and adapts over time without retraining.',
    capabilities: ['Web browsing', 'Code generation', 'Document drafting', 'Scheduled tasks', 'Persistent memory'],
    channels: ['Browser', 'Email', 'Telegram', 'WhatsApp', 'API'],
  },
  {
    name: 'Mach Forge',
    tier: 'Engineering Agent',
    icon: Terminal,
    description:
      'A heavyweight engineering agent designed for continuous codebase work. Connect it to your repositories and it monitors pull requests, writes tests, refactors modules, and posts review comments. Runs in a sandboxed environment with daily snapshots and automatic rollback.',
    capabilities: ['Repo monitoring', 'PR review', 'Test writing', 'Refactoring', 'CI integration'],
    channels: ['Browser', 'GitHub', 'GitLab', 'API', 'Webhook'],
  },
  {
    name: 'Mach Relay',
    tier: 'Communication Agent',
    icon: Globe,
    description:
      'A cross platform communication agent with native support for persistent conversations, task planning in natural language, and sub agent delegation. It reads text aloud, generates images, searches the web, and coordinates work across every channel your team already uses.',
    capabilities: ['Natural language planning', 'Sub agent delegation', 'Web search', 'Image generation', 'Text to speech'],
    channels: ['Telegram', 'Discord', 'Slack', 'WhatsApp', 'Signal', 'Email', 'Terminal'],
  },
  {
    name: 'Mach Sentry',
    tier: 'Monitoring Agent',
    icon: Code2,
    description:
      'A lightweight monitoring agent that watches your infrastructure, repositories, and external services. It alerts you the moment something needs attention and compiles digests so you stay informed without drowning in notifications. Ideal for running alongside other agents as a second pair of eyes.',
    capabilities: ['Infrastructure monitoring', 'Alert routing', 'Digest compilation', 'Threshold detection', 'Anomaly flagging'],
    channels: ['Browser', 'API', 'Webhook', 'Slack', 'Email'],
  },
];

interface Feature {
  icon: LucideIcon;
  title: string;
  body: string;
}

const FEATURES: Feature[] = [
  {
    icon: Clock,
    title: 'Works 24/7',
    body: 'Your private agent works around the clock on dedicated infrastructure. We handle hosting, updates, and uptime so it never misses a beat — even at 3 AM.',
  },
  {
    icon: Globe,
    title: 'Any chat app',
    body: 'Talk to it on WhatsApp, Telegram, Discord, Slack, Signal, or iMessage. Works in DMs and group chats. One agent, one memory, every surface you use.',
  },
  {
    icon: Brain,
    title: 'Persistent memory',
    body: 'Remembers you and becomes uniquely yours. Your preferences, your context, your AI. Learns your projects and builds reusable skills from solved tasks.',
  },
  {
    icon: MousePointerClick,
    title: 'Browser control',
    body: 'It can browse the web, fill forms, and extract data from any site. Search, automate browser work, use vision, and reason across multiple models.',
  },
  {
    icon: ShieldCheck,
    title: 'Full system access',
    body: 'Read and write files, run shell commands, execute scripts. Full access or sandboxed — your choice. Isolated containers with namespace isolation.',
  },
  {
    icon: Puzzle,
    title: 'Skills & plugins',
    body: 'Extend with community skills or build your own. It can even write its own. Schedule reports, backups, and briefings in natural language.',
  },
  {
    icon: MapPin,
    title: 'Lives everywhere',
    body: 'Connect Telegram, Discord, Slack, WhatsApp, Signal, email, and CLI. One agent carries one memory across every surface you use.',
  },
  {
    icon: Cpu,
    title: 'Tasks multiplied',
    body: 'Delegate work to isolated subagents, each with its own conversation, terminal, and Python RPC scripts. Choose local, Docker, SSH, Singularity, or Modal backends.',
  },
];

export function AgentsPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Hosted Agents"
        eyebrowIcon={RadioTower}
        title={
          <>
            Every agent, <span className="font-display italic font-normal text-[var(--color-accent-primary)]">tuned in</span>.
          </>
        }
        subtitle="Mach engineers, hosts, and manages a fleet of AI agents purpose built for real work. Each one is monitored around the clock, backed up daily, and updated automatically. Pick the agent that fits your workflow, deploy in under a minute, and let it run."
        artifact={<AgentMatrix />}
      />

      {/* Agent cards */}
      <section className="py-10 lg:py-16">
        <div className="mx-auto max-w-container px-6 sm:px-12 lg:px-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {AGENTS.map((agent, i) => (
              <Reveal key={agent.name} delay={i * 80}>
                <article className="group h-full rounded-radius-md bg-[var(--color-bg-raised)] border border-[var(--color-border)] p-6 lg:p-8 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-1">
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] shrink-0">
                      <agent.icon size={22} strokeWidth={1.5} className="text-[var(--color-accent-tertiary)]" />
                    </div>
                    <span className="text-mono-label text-[0.65rem] px-2.5 py-1 rounded-full bg-[rgba(217,162,39,0.15)] text-[var(--color-accent-primary)]">
                      {agent.tier}
                    </span>
                  </div>
                  <h3 className="text-h3 text-[var(--color-ink)] mb-3">{agent.name}</h3>
                  <p className="text-body text-[var(--color-ink-muted)] mb-5">{agent.description}</p>

                  <div className="mb-5">
                    <span className="text-mono-label text-[0.62rem] text-[var(--color-ink-muted)] block mb-2.5">Capabilities</span>
                    <div className="flex flex-wrap gap-2">
                      {agent.capabilities.map((cap) => (
                        <span
                          key={cap}
                          className="text-[0.8125rem] font-body text-[var(--color-ink)] bg-[var(--color-bg)] border border-[var(--color-border)] rounded-radius-sm px-2.5 py-1"
                        >
                          {cap}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <span className="text-mono-label text-[0.62rem] text-[var(--color-ink-muted)] block mb-2.5">Channels</span>
                    <div className="flex flex-wrap gap-2">
                      {agent.channels.map((ch) => (
                        <span
                          key={ch}
                          className="text-[0.8125rem] font-body text-[var(--color-accent-tertiary)] bg-[rgba(47,111,107,0.08)] border border-[rgba(47,111,107,0.2)] rounded-radius-sm px-2.5 py-1"
                        >
                          {ch}
                        </span>
                      ))}
                    </div>
                  </div>

                  <LinkButton href="/pricing" variant="secondary" size="md" icon={ArrowRight}>
                    Deploy this agent
                  </LinkButton>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities grid */}
      <section className="py-10 lg:py-16">
        <div className="mx-auto max-w-container px-6 sm:px-12 lg:px-20">
          <Reveal>
            <div className="max-w-[48ch] mb-10">
              <span className="eyebrow text-[var(--color-accent-tertiary)]">Capabilities</span>
              <h2 className="text-h2 text-[var(--color-ink)] mt-3">What every agent can do</h2>
              <p className="text-body text-[var(--color-ink-muted)] mt-3">
                Every Mach agent ships with the same core capabilities. The difference is in how they are tuned — Forge for code, Relay for communication, Sentry for monitoring, One for everything.
              </p>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((feature, i) => (
              <Reveal key={feature.title} delay={i * 50}>
                <article className="h-full rounded-radius-md bg-[var(--color-bg-raised)] border border-[var(--color-border)] p-5 lg:p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
                  <div className="flex items-center justify-center h-11 w-11 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] mb-4">
                    <feature.icon size={20} strokeWidth={1.5} className="text-[var(--color-accent-tertiary)]" />
                  </div>
                  <h3 className="font-body font-semibold text-[1rem] text-[var(--color-ink)] mb-2">{feature.title}</h3>
                  <p className="text-[0.9375rem] text-[var(--color-ink-muted)] leading-relaxed">{feature.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* How agents are managed */}
      <section className="py-10 lg:py-16">
        <div className="mx-auto max-w-container px-6 sm:px-12 lg:px-20">
          <Reveal>
            <div className="max-w-[42ch] mb-8">
              <span className="eyebrow text-[var(--color-accent-tertiary)]">Operations</span>
              <h2 className="text-h2 text-[var(--color-ink)] mt-3">How Mach manages your agents</h2>
              <p className="text-body text-[var(--color-ink-muted)] mt-3">
                Every agent runs on dedicated infrastructure with continuous monitoring, automatic updates, and daily backups. You never touch a server, a Dockerfile, or an API key rotation schedule.
              </p>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Reveal delay={0}>
              <TerminalStream />
            </Reveal>
            <Reveal delay={80}>
              <div className="flex flex-col gap-4 h-full justify-center">
                {[
                  { title: 'Continuous monitoring', body: 'Every agent broadcasts a health signal. If something drifts off spec, our operations layer catches it before you do.' },
                  { title: 'Automatic updates', body: 'We push security patches and model improvements as they ship. Your agents stay current without downtime or manual intervention.' },
                  { title: 'Daily backups', body: 'Full state snapshots every 24 hours, retained for 30 days. Rollback to any point with a single request.' },
                  { title: 'Cost controls', body: 'API usage is capped per agent with transparent reporting. You see exactly what each agent costs and why, with alerts before budgets are exceeded.' },
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
    </main>
  );
}
