import { Sparkles, ArrowRight, Clock, Radio, ShieldCheck, Code2, Mail, TrendingUp, ShoppingCart, FileText, Bell, type LucideIcon } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { LinkButton } from '../components/Button';
import { Reveal } from '../components/Reveal';
import { WaveformBars } from '../components/artifacts/WaveformBars';

interface Skill {
  name: string;
  icon: LucideIcon;
  description: string;
  tag: string;
  schedule: string;
  category: string;
}

const SKILLS: Skill[] = [
  {
    name: 'Inbox Triage',
    icon: Mail,
    description: 'Sorts, labels, and drafts replies for incoming email on a fixed schedule. Categorizes by urgency and drafts responses in your voice.',
    tag: 'Scheduled',
    schedule: 'Every 15 min',
    category: 'Communication',
  },
  {
    name: 'Price Watch',
    icon: TrendingUp,
    description: 'Monitors a product, stock, or metric across any number of sources and notifies you the moment it crosses a threshold you define.',
    tag: 'Continuous',
    schedule: 'Real time',
    category: 'Monitoring',
  },
  {
    name: 'Daily Brief',
    icon: Clock,
    description: 'Compiles a morning summary from your repositories, calendars, news feeds, and project boards. Delivered before you open your laptop.',
    tag: 'Scheduled',
    schedule: 'Daily 7:00 AM',
    category: 'Productivity',
  },
  {
    name: 'Repo Sentry',
    icon: Code2,
    description: 'Watches a repository for failing CI, open pull requests, stale issues, and security advisories. Posts a digest to your channel.',
    tag: 'Continuous',
    schedule: 'Every 30 min',
    category: 'Engineering',
  },
  {
    name: 'Brand Monitor',
    icon: Radio,
    description: 'Scans social media, review sites, and news for mentions of your brand or competitors. Sentiment analysis flags issues early.',
    tag: 'Continuous',
    schedule: 'Every hour',
    category: 'Marketing',
  },
  {
    name: 'Compliance Scan',
    icon: ShieldCheck,
    description: 'Audits your infrastructure, repositories, and access logs against SOC 2, GDPR, and HIPAA controls. Generates remediation tickets.',
    tag: 'Scheduled',
    schedule: 'Weekly',
    category: 'Security',
  },
  {
    name: 'Cart Recovery',
    icon: ShoppingCart,
    description: 'Identifies abandoned carts and sends personalized, timed recovery sequences. Syncs with Shopify, Stripe, and custom checkouts.',
    tag: 'Scheduled',
    schedule: 'Every hour',
    category: 'Commerce',
  },
  {
    name: 'Report Compiler',
    icon: FileText,
    description: 'Gathers metrics from your dashboards, databases, and spreadsheets into a formatted weekly report delivered to stakeholders.',
    tag: 'Scheduled',
    schedule: 'Weekly',
    category: 'Analytics',
  },
  {
    name: 'Alert Router',
    icon: Bell,
    description: 'Consolidates alerts from PagerDuty, Datadog, and Sentry, deduplicates, and routes to the right person based on on-call schedules.',
    tag: 'Continuous',
    schedule: 'Real time',
    category: 'Operations',
  },
];

export function SkillsLibraryPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Skills Library"
        eyebrowIcon={Sparkles}
        title={
          <>
            A growing library of <span className="font-display italic font-normal text-[var(--color-accent-primary)]">ready-to-run</span> skills.
          </>
        }
        subtitle="Skills are packaged, repeatable workflows your agent runs on a schedule or around the clock. Each one is preconfigured, tested, and monitored. Drop a skill onto any agent and it starts working immediately."
        artifact={<WaveformBars />}
      />

      <section className="py-10 lg:py-16">
        <div className="mx-auto max-w-container px-6 sm:px-12 lg:px-20">
          <Reveal>
            <div className="max-w-[42ch] mb-8">
              <span className="eyebrow text-[var(--color-accent-tertiary)]">Catalog</span>
              <h2 className="text-h2 text-[var(--color-ink)] mt-3">Nine skills, ready to deploy</h2>
              <p className="text-body text-[var(--color-ink-muted)] mt-3">
                Each skill runs independently or alongside others on the same agent. Mix and match to build the exact workflow your team needs.
              </p>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SKILLS.map((skill, i) => (
              <Reveal key={skill.name} delay={i * 50}>
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
                  <span className="text-mono-label text-[0.6rem] text-[var(--color-ink-muted)] block mb-2">{skill.category}</span>
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
    </main>
  );
}
