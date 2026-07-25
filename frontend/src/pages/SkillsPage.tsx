import { Sparkles, ArrowRight, Clock, Radio, ShieldCheck, Code2, Mail, TrendingUp, type LucideIcon } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { LinkButton } from '../components/Button';
import { Reveal } from '../components/Reveal';
import { SecurityRadar } from '../components/artifacts/SecurityRadar';
import { AgentMatrix } from '../components/artifacts/AgentMatrix';

interface Skill {
  name: string;
  icon: LucideIcon;
  description: string;
  tag: string;
  schedule: string;
}

const SKILLS: Skill[] = [
  {
    name: 'Inbox Triage',
    icon: Mail,
    description:
      'Sorts, labels, and drafts replies for incoming email on a fixed schedule. Categorizes by urgency, drafts responses in your voice, and only escalates when a real decision is needed. Works with Gmail, Outlook, and any IMAP inbox.',
    tag: 'Scheduled',
    schedule: 'Every 15 min',
  },
  {
    name: 'Price Watch',
    icon: TrendingUp,
    description:
      'Monitors a product, stock, or metric across any number of sources and notifies you the moment it crosses a threshold you define. Tracks Amazon, Shopify, financial feeds, and custom endpoints.',
    tag: 'Continuous',
    schedule: 'Real time',
  },
  {
    name: 'Daily Brief',
    icon: Clock,
    description:
      'Compiles a morning summary from your repositories, calendars, news feeds, and project boards. Delivered to your inbox or chat channel before you open your laptop. Fully customizable format and sources.',
    tag: 'Scheduled',
    schedule: 'Daily 7:00 AM',
  },
  {
    name: 'Repo Sentry',
    icon: Code2,
    description:
      'Watches a repository for failing CI, open pull requests, stale issues, and security advisories. Posts a digest to your channel of choice and can auto assign reviewers based on CODEOWNERS.',
    tag: 'Continuous',
    schedule: 'Every 30 min',
  },
  {
    name: 'Brand Monitor',
    icon: Radio,
    description:
      'Scans social media, review sites, and news for mentions of your brand or competitors. Sentiment analysis flags issues before they escalate and highlights opportunities worth engaging with.',
    tag: 'Continuous',
    schedule: 'Every hour',
  },
  {
    name: 'Compliance Scan',
    icon: ShieldCheck,
    description:
      'Audits your infrastructure, repositories, and access logs against SOC 2, GDPR, and HIPAA controls. Generates remediation tickets and evidence reports ready for your next security review.',
    tag: 'Scheduled',
    schedule: 'Weekly',
  },
];

export function SkillsPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Skills Library"
        eyebrowIcon={Sparkles}
        title={
          <>
            Skills that keep a <span className="font-display italic font-normal text-[var(--color-accent-primary)]">steady</span> rhythm.
          </>
        }
        subtitle="Skills are packaged, repeatable workflows your agent runs on a schedule or around the clock. Each one is preconfigured, tested, and monitored. Drop a skill onto any agent and it starts working immediately. No prompts to babysit, no infrastructure to maintain."
        artifact={<SecurityRadar />}
      />

      {/* Skills grid */}
      <section className="py-10 lg:py-16">
        <div className="mx-auto max-w-container px-6 sm:px-12 lg:px-20">
          <Reveal>
            <div className="max-w-[42ch] mb-8">
              <span className="eyebrow text-[var(--color-accent-tertiary)]">Library</span>
              <h2 className="text-h2 text-[var(--color-ink)] mt-3">Six skills, ready to deploy</h2>
              <p className="text-body text-[var(--color-ink-muted)] mt-3">
                Each skill runs independently or alongside others on the same agent. Mix and match to build the exact workflow your team needs.
              </p>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SKILLS.map((skill, i) => (
              <Reveal key={skill.name} delay={i * 60}>
                <article className="group h-full rounded-radius-md bg-[var(--color-bg-raised)] border border-[var(--color-border)] p-6 lg:p-8 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-1">
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] shrink-0">
                      <skill.icon size={22} strokeWidth={1.5} className="text-[var(--color-accent-tertiary)]" />
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <span className="text-mono-label text-[0.65rem] px-2.5 py-1 rounded-full bg-[rgba(124,139,78,0.16)] text-[var(--color-accent-secondary)]">
                        {skill.tag}
                      </span>
                      <span className="text-[0.75rem] font-body text-[var(--color-ink-muted)]">{skill.schedule}</span>
                    </div>
                  </div>
                  <h3 className="text-h3 text-[var(--color-ink)] mb-3">{skill.name}</h3>
                  <p className="text-body text-[var(--color-ink-muted)] mb-6">{skill.description}</p>
                  <LinkButton href="#/agents" variant="secondary" size="md" icon={ArrowRight}>
                    Add to an agent
                  </LinkButton>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Monitoring section */}
      <section className="py-10 lg:py-16">
        <div className="mx-auto max-w-container px-6 sm:px-12 lg:px-20">
          <Reveal>
            <div className="max-w-[42ch] mb-8">
              <span className="eyebrow text-[var(--color-accent-tertiary)]">Control room</span>
              <h2 className="text-h2 text-[var(--color-ink)] mt-3">Every skill, monitored</h2>
              <p className="text-body text-[var(--color-ink-muted)] mt-3">
                Each running skill broadcasts a live health signal. Tune in anytime to verify it is healthy, steady, and on schedule. Alerts route to your preferred channel the moment anything drifts.
              </p>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Reveal delay={0}>
              <AgentMatrix />
            </Reveal>
            <Reveal delay={80}>
              <div className="flex flex-col gap-4 h-full justify-center">
                {[
                  { title: 'Health signals', body: 'Every skill emits a heartbeat. If it misses one, our operations layer opens an incident and notifies you in your channel of choice.' },
                  { title: 'Execution logs', body: 'Full audit trail of every run: what triggered it, what it did, how long it took, and what it returned. Searchable and exportable.' },
                  { title: 'Cost transparency', body: 'Each skill reports its API consumption per run. You see exactly what it costs and can set per skill budgets with hard caps.' },
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
