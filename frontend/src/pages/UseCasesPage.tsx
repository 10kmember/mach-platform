import {
  Target,
  ArrowRight,
  TrendingUp,
  ShoppingCart,
  Stethoscope,
  Presentation,
  UtensilsCrossed,
  Briefcase,
  type LucideIcon,
} from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { LinkButton } from '../components/Button';
import { Reveal } from '../components/Reveal';
import { UseCaseOrbit } from '../components/artifacts/UseCaseOrbit';
import { Connectors } from '../components/Connectors';

interface UseCaseFlow {
  icon: LucideIcon;
  title: string;
  cadence: string;
  channel: string;
  description: string;
  quote: string;
  attribution: string;
  metrics: { label: string; value: string }[];
}

const USE_CASES: UseCaseFlow[] = [
  {
    icon: TrendingUp,
    title: 'Lead Check',
    cadence: '5x/day',
    channel: 'WhatsApp',
    description: 'Your pipeline used to wait until you had time to catch up. Now leads get checked five times a day, and Monday\'s numbers hit WhatsApp before standup.',
    quote: 'My pipeline used to wait until I had "time to catch up." Now leads get checked five times a day, and Monday\'s numbers hit WhatsApp before standup.',
    attribution: 'B2B sales lead, United Kingdom',
    metrics: [
      { label: 'Check frequency', value: '5x/day' },
      { label: 'Channel', value: 'WhatsApp' },
      { label: 'Agents', value: 'Apex, Nexus, Vanguard' },
    ],
  },
  {
    icon: ShoppingCart,
    title: '16 marketing jobs',
    cadence: 'Continuous',
    channel: 'Multi-channel',
    description: 'Three brands, one brain. SEO posts, ad alerts, coupon leaks — sixteen jobs run while you sleep. It feels like you hired a marketing team overnight.',
    quote: 'Three brands, one brain. SEO posts, ad alerts, coupon leaks — sixteen jobs run while I sleep. It feels like I hired a marketing team overnight.',
    attribution: 'E-commerce operator, United States',
    metrics: [
      { label: 'Jobs', value: '16' },
      { label: 'Scope', value: 'SEO, Ads, Coupons, Posts, Alerts, Reports' },
      { label: 'Brands', value: '3' },
    ],
  },
  {
    icon: Stethoscope,
    title: 'Practice pulse',
    cadence: 'Every 2 hours',
    channel: 'Telegram + Email',
    description: 'Patient ops email does not bury you anymore. The urgent stuff pings Telegram every two hours; Friday\'s practice pulse is written before you walk in the door.',
    quote: 'Patient ops email doesn\'t bury me anymore. The urgent stuff pings Telegram every two hours; Friday\'s practice pulse is written before I walk in the door.',
    attribution: 'Practice administrator, United States',
    metrics: [
      { label: 'Urgent routing', value: 'Every 2 hours' },
      { label: 'Friday report', value: 'Auto-generated' },
      { label: 'Channels', value: 'Telegram, Email' },
    ],
  },
  {
    icon: Presentation,
    title: 'Industry deck',
    cadence: 'On demand',
    channel: 'Browser',
    description: 'Give it an industry and three competitors. It comes back with the research, positioning, and a 12-slide presentation ready to present.',
    quote: 'I gave it an industry and three competitors. It came back with the research, positioning, and a 12-slide PPT.',
    attribution: 'Startup founder, United States',
    metrics: [
      { label: 'Deliverable', value: '12-slide PPT' },
      { label: 'Includes', value: 'Research + positioning' },
      { label: 'Turnaround', value: 'Minutes' },
    ],
  },
  {
    icon: UtensilsCrossed,
    title: 'Harbor Table',
    cadence: 'Daily',
    channel: 'Web platform',
    description: 'Send the menu and a few food photos. The agent builds the restaurant website, writes the seasonal specials, and sends back the live link.',
    quote: 'I sent the menu and a few food photos. Claw built the restaurant website, wrote the specials, and sent me the live link.',
    attribution: 'Restaurant founder, United Arab Emirates',
    metrics: [
      { label: 'Deliverable', value: 'Live website' },
      { label: 'Includes', value: 'Seasonal menu, private dining, weekend specials' },
      { label: 'Turnaround', value: 'Same day' },
    ],
  },
  {
    icon: Briefcase,
    title: 'Daily portfolio run',
    cadence: '8:00 AM daily',
    channel: 'Dashboard + Email',
    description: 'Market open used to mean spreadsheet panic. Now at 8am your book syncs, the dashboard updates, and the risk note is waiting — you just decide.',
    quote: 'Market open used to mean spreadsheet panic. Now at 8am my book syncs, the dashboard updates, and the risk note is waiting — I just decide.',
    attribution: 'Portfolio manager, Switzerland',
    metrics: [
      { label: 'Book sync', value: '8:00 AM' },
      { label: 'Dashboard', value: 'Refreshed' },
      { label: 'Risk note', value: 'Ready' },
    ],
  },
];

export function UseCasesPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Use Cases"
        eyebrowIcon={Target}
        title={
          <>
            Real work, <span className="font-display italic font-normal text-[var(--color-accent-primary)]">real results</span>.
          </>
        }
        subtitle="Mach agents do not just answer questions. They pull their weight across sales, marketing, healthcare, finance, consulting, and hospitality. Here is what teams are accomplishing with agents on Mach today — not demos, not toys, real business outcomes."
        artifact={<UseCaseOrbit />}
      />

      {/* Use case stories */}
      <section className="py-10 lg:py-16">
        <div className="mx-auto max-w-container px-6 sm:px-12 lg:px-20">
          <div className="flex flex-col gap-8">
            {USE_CASES.map((useCase, i) => (
              <Reveal key={useCase.title} delay={i * 60}>
                <article className="rounded-radius-lg bg-[var(--color-bg-raised)] border border-[var(--color-border)] shadow-sm overflow-hidden">
                  <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr]">
                    {/* Left: flow panel */}
                    <div className="p-6 lg:p-8 lg:border-r border-[var(--color-border)] bg-[var(--color-bg)]">
                      <div className="flex items-center gap-3 mb-5">
                        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-[var(--color-bg-raised)] border border-[var(--color-border)] shrink-0">
                          <useCase.icon size={22} strokeWidth={1.5} className="text-[var(--color-accent-tertiary)]" />
                        </div>
                        <div>
                          <h3 className="text-h3 text-[var(--color-ink)]">{useCase.title}</h3>
                          <span className="text-mono-label text-[0.65rem] text-[var(--color-accent-primary)]">
                            {useCase.cadence} · {useCase.channel}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3">
                        {useCase.metrics.map((metric) => (
                          <div key={metric.label} className="flex items-center justify-between gap-4 py-2 border-b border-[var(--color-border)] last:border-b-0">
                            <span className="text-[0.8125rem] text-[var(--color-ink-muted)] font-body">{metric.label}</span>
                            <span className="text-[0.875rem] font-body font-semibold text-[var(--color-ink)] text-right">{metric.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right: quote + description */}
                    <div className="p-6 lg:p-8 flex flex-col justify-center">
                      <p className="text-body text-[var(--color-ink-muted)] mb-5">{useCase.description}</p>
                      <blockquote className="border-l-2 border-[var(--color-accent-primary)] pl-4 py-1">
                        <p className="font-display italic text-[1.0625rem] leading-snug text-[var(--color-ink)]">
                          {useCase.quote}
                        </p>
                        <footer className="text-[0.8125rem] text-[var(--color-ink-muted)] mt-2">
                          — {useCase.attribution}
                        </footer>
                      </blockquote>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Connectors section */}
      <Connectors />

      {/* CTA */}
      <section className="py-10 lg:py-16">
        <div className="mx-auto max-w-container px-6 sm:px-12 lg:px-20">
          <Reveal>
            <div className="rounded-radius-lg bg-[var(--color-bg-raised)] border border-[var(--color-border)] p-6 lg:p-10 flex flex-col sm:flex-row items-start sm:items-center gap-6 justify-between">
              <div>
                <h3 className="text-h3 text-[var(--color-ink)] mb-2">Have a use case in mind?</h3>
                <p className="text-body text-[var(--color-ink-muted)] max-w-[48ch]">
                  Tell us what you want to automate and we will help you pick the right agent, skills, and connectors for the job.
                </p>
              </div>
              <LinkButton href="mailto:hello@mach.ai" variant="secondary" size="lg" icon={ArrowRight} className="shrink-0">
                Talk to our team
              </LinkButton>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
