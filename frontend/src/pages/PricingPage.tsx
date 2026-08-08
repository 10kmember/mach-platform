import { useState } from 'react';
import {
  Layers,
  Check,
  ArrowRight,
  Building2,
  User,
  ShieldCheck,
  Headphones,
  Server,
  Lock,
  Cpu,
  DollarSign,
  HardDrive,
  MemoryStick,
  Network,
  type LucideIcon,
} from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { LinkButton } from '../components/Button';
import { Reveal } from '../components/Reveal';
import { FrequencyTrace } from '../components/artifacts/FrequencyTrace';
import { routeHref } from '../hooks/useRoute';

type Mode = 'personal' | 'corporate';
type Billing = 'monthly' | 'annual';

interface Plan {
  name: string;
  monthly: number;
  annual: number;
  cadence: string;
  audience: string;
  tagline: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
}

interface VpsSpec {
  icon: LucideIcon;
  label: string;
  value: string;
}

interface VpsTier {
  name: string;
  monthly: number;
  annual: number;
  audience: string;
  tagline: string;
  specs: VpsSpec[];
  features: string[];
  highlighted?: boolean;
}

const PERSONAL_PLANS: Plan[] = [
  {
    name: 'Solo',
    monthly: 19,
    annual: 182,
    cadence: 'per month',
    audience: 'For individuals',
    tagline: 'One agent, always on. Perfect for a personal recurring task or two.',
    features: [
      '1 hosted agent',
      '3 scheduled skills',
      'Email + browser channel',
      'Daily backups',
      'Community support',
    ],
    cta: 'Start with Solo',
  },
  {
    name: 'Team',
    monthly: 49,
    annual: 470,
    cadence: 'per month',
    audience: 'For small teams',
    tagline: 'Two agents working in parallel, with every channel open.',
    features: [
      '2 hosted agents',
      'Unlimited scheduled skills',
      'All channels (Email, Telegram, WhatsApp, API)',
      'Daily backups + auto-updates',
      'Priority email support',
    ],
    cta: 'Choose Team',
    highlighted: true,
  },
  {
    name: 'Venture',
    monthly: 149,
    annual: 1430,
    cadence: 'per month',
    audience: 'For founders & side projects',
    tagline: 'Three agents across your projects, clients, and side hustles.',
    features: [
      '3 hosted agents',
      'Unlimited skills + custom skills',
      'All channels + webhooks + API access',
      'Daily backups + auto-updates',
      'Priority support + uptime SLA',
    ],
    cta: 'Go Venture',
  },
];

const CORPORATE_PLANS: Plan[] = [
  {
    name: 'Department',
    monthly: 499,
    annual: 4790,
    cadence: 'per month',
    audience: 'For a single department',
    tagline: 'Standardize agent usage across one team or business unit.',
    features: [
      '3 hosted agents',
      'Unlimited skills + custom skills',
      'All channels + webhooks + API access',
      'SSO (SAML / OIDC)',
      'Audit logs + role-based access',
      'Priority support + 99.9% uptime SLA',
    ],
    cta: 'Start with Department',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    monthly: 1499,
    annual: 14390,
    cadence: 'per month',
    audience: 'For the whole organization',
    tagline: 'Dedicated infrastructure, custom regions, and a solutions partner.',
    features: [
      '5 hosted agents',
      'Dedicated infrastructure + custom regions',
      'SSO, audit logs, RBAC, and SCIM provisioning',
      'Custom SLAs + dedicated onboarding',
      'Dedicated solutions engineer',
      '24/7 phone + priority support',
    ],
    cta: 'Go Enterprise',
  },
];

const PERSONAL_VPS: VpsTier[] = [
  {
    name: 'VPS Starter',
    monthly: 29,
    annual: 278,
    audience: 'Personal VPS',
    tagline: 'A private virtual server for your agent with dedicated resources.',
    specs: [
      { icon: Cpu, label: 'vCPU', value: '2 cores' },
      { icon: MemoryStick, label: 'RAM', value: '4 GB' },
      { icon: HardDrive, label: 'SSD', value: '40 GB' },
      { icon: Network, label: 'Transfer', value: '2 TB/mo' },
    ],
    features: [
      '1 dedicated VPS instance',
      'Agent runtime pre-installed',
      'Root SSH access',
      'Weekly snapshots',
      '1 Gbps uplink',
    ],
  },
  {
    name: 'VPS Pro',
    monthly: 79,
    annual: 758,
    audience: 'Power users',
    tagline: 'More compute for agents running multiple skills concurrently.',
    specs: [
      { icon: Cpu, label: 'vCPU', value: '4 cores' },
      { icon: MemoryStick, label: 'RAM', value: '8 GB' },
      { icon: HardDrive, label: 'SSD', value: '80 GB' },
      { icon: Network, label: 'Transfer', value: '5 TB/mo' },
    ],
    features: [
      '1 dedicated VPS instance',
      'Agent runtime + Docker support',
      'Root SSH access',
      'Daily snapshots',
      '2 Gbps uplink',
      'GPU passthrough available',
    ],
    highlighted: true,
  },
  {
    name: 'VPS Max',
    monthly: 199,
    annual: 1910,
    audience: 'Heavy workloads',
    tagline: 'Maximum compute for agents with browser automation and vision.',
    specs: [
      { icon: Cpu, label: 'vCPU', value: '8 cores' },
      { icon: MemoryStick, label: 'RAM', value: '16 GB' },
      { icon: HardDrive, label: 'SSD', value: '160 GB' },
      { icon: Network, label: 'Transfer', value: '10 TB/mo' },
    ],
    features: [
      '1 dedicated VPS instance',
      'Agent runtime + Docker + sandbox',
      'Root SSH access',
      'Daily snapshots + 30-day retention',
      '5 Gbps uplink',
      'GPU passthrough included',
    ],
  },
];

const CORPORATE_VDS: VpsTier[] = [
  {
    name: 'VDS Department',
    monthly: 599,
    annual: 5750,
    audience: 'Team VDS',
    tagline: 'A dedicated virtual server for your department with isolated tenants.',
    specs: [
      { icon: Cpu, label: 'vCPU', value: '8 cores' },
      { icon: MemoryStick, label: 'RAM', value: '32 GB' },
      { icon: HardDrive, label: 'NVMe', value: '320 GB' },
      { icon: Network, label: 'Transfer', value: '15 TB/mo' },
    ],
    features: [
      'Dedicated VDS with isolated tenants',
      'Up to 5 agent instances',
      'SSO + RBAC + audit logs',
      'Daily snapshots + 90-day retention',
      '10 Gbps uplink',
      'Priority support + 99.9% SLA',
    ],
    highlighted: true,
  },
  {
    name: 'VDS Enterprise',
    monthly: 1899,
    annual: 18230,
    audience: 'Organization VDS',
    tagline: 'A dedicated server with custom regions and a solutions engineer.',
    specs: [
      { icon: Cpu, label: 'vCPU', value: '16 cores' },
      { icon: MemoryStick, label: 'RAM', value: '64 GB' },
      { icon: HardDrive, label: 'NVMe', value: '640 GB' },
      { icon: Network, label: 'Transfer', value: 'Unlimited' },
    ],
    features: [
      'Dedicated VDS with custom regions',
      'Unlimited agent instances',
      'SSO, RBAC, SCIM, full audit suite',
      'Daily snapshots + 1-year retention',
      '25 Gbps uplink + redundant uplinks',
      'Dedicated solutions engineer + 24/7 support',
    ],
  },
];

const CORPORATE_TRUST: { icon: typeof ShieldCheck; label: string }[] = [
  { icon: ShieldCheck, label: 'SOC 2 Type II' },
  { icon: Lock, label: 'Data encryption at rest + in transit' },
  { icon: Server, label: 'Dedicated infrastructure' },
  { icon: Headphones, label: '24/7 dedicated support' },
  { icon: Cpu, label: 'GPU-backed inference' },
  { icon: DollarSign, label: 'Transparent API cost reporting' },
];

function formatPrice(plan: Plan, billing: Billing): string {
  const amount = billing === 'monthly' ? plan.monthly : Math.round(plan.annual / 12);
  return `$${amount}`;
}

function formatVpsPrice(tier: VpsTier, billing: Billing): string {
  const amount = billing === 'monthly' ? tier.monthly : Math.round(tier.annual / 12);
  return `$${amount}`;
}

export function PricingPage() {
  const [mode, setMode] = useState<Mode>('personal');
  const [billing, setBilling] = useState<Billing>('monthly');
  const plans = mode === 'personal' ? PERSONAL_PLANS : CORPORATE_PLANS;
  const vpsTiers = mode === 'personal' ? PERSONAL_VPS : CORPORATE_VDS;
  const isCorporate = mode === 'corporate';

  return (
    <main>
      <PageHeader
        eyebrow="Pricing"
        eyebrowIcon={Layers}
        title={
          isCorporate ? (
            <>
              Built for the <span className="font-display italic font-normal text-[var(--color-accent-primary)]">whole org</span>.
            </>
          ) : (
            <>
              Plans for one or <span className="font-display italic font-normal text-[var(--color-accent-primary)]">a whole company</span>.
            </>
          )
        }
        subtitle={
          isCorporate
            ? 'Mach Corporate gives your organization dedicated infrastructure, single sign on, audit logs, and a solutions engineer who knows your stack. Every agent is hand tuned, monitored, and cost controlled. No runaway API bills, no unmanaged sprawl.'
            : "Whether you're automating your own inbox or running agents across an entire organization, there's a plan that fits. Every tier includes daily backups, automatic updates, and a managed, always-on host."
        }
        artifact={<FrequencyTrace />}
      />

      {/* Mode toggle + billing toggle */}
      <div className="mx-auto max-w-container px-6 sm:px-12 lg:px-20 -mt-4 mb-10">
        <Reveal>
          <div className="flex flex-col items-center gap-4">
            <div className="inline-flex items-center rounded-radius-md border border-[var(--color-border)] bg-[var(--color-bg-raised)] p-1.5 shadow-sm w-full max-w-[420px]">
              <button
                type="button"
                onClick={() => setMode('personal')}
                className={`flex-1 inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-radius-sm font-body font-semibold text-[1rem] transition-all ${
                  mode === 'personal'
                    ? 'bg-[var(--color-accent-primary)] text-[var(--color-bg)] shadow-sm'
                    : 'text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]'
                }`}
              >
                <User size={18} strokeWidth={1.75} />
                Personal
              </button>
              <button
                type="button"
                onClick={() => setMode('corporate')}
                className={`flex-1 inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-radius-sm font-body font-semibold text-[1rem] transition-all ${
                  mode === 'corporate'
                    ? 'bg-[var(--color-ink)] text-[var(--color-bg)] shadow-sm'
                    : 'text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]'
                }`}
              >
                <Building2 size={18} strokeWidth={1.75} />
                Corporate
              </button>
            </div>

            {/* Billing toggle */}
            <div className="inline-flex items-center rounded-radius-md border border-[var(--color-border)] bg-[var(--color-bg-raised)] p-1 shadow-sm">
              <button
                type="button"
                onClick={() => setBilling('monthly')}
                className={`px-5 py-2 rounded-radius-sm font-body font-semibold text-[0.875rem] transition-all ${
                  billing === 'monthly'
                    ? 'bg-[var(--color-accent-tertiary)] text-[var(--color-bg)] shadow-sm'
                    : 'text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]'
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBilling('annual')}
                className={`px-5 py-2 rounded-radius-sm font-body font-semibold text-[0.875rem] transition-all inline-flex items-center gap-2 ${
                  billing === 'annual'
                    ? 'bg-[var(--color-accent-tertiary)] text-[var(--color-bg)] shadow-sm'
                    : 'text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]'
                }`}
              >
                Annual
                <span
                  className={`text-[0.65rem] font-mono px-1.5 py-0.5 rounded-full ${
                    billing === 'annual'
                      ? 'bg-[rgba(239,230,211,0.2)] text-[var(--color-bg)]'
                      : 'bg-[rgba(47,111,107,0.12)] text-[var(--color-accent-tertiary)]'
                  }`}
                >
                  -20%
                </span>
              </button>
            </div>
          </div>
        </Reveal>
      </div>

      <section className="py-2 lg:py-8">
        <div className="mx-auto max-w-container px-6 sm:px-12 lg:px-20">
          {/* Corporate trust badges */}
          {isCorporate && (
            <Reveal>
              <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mb-10">
                {CORPORATE_TRUST.map((badge) => (
                  <div key={badge.label} className="inline-flex items-center gap-2 text-[var(--color-ink-muted)]">
                    <badge.icon size={16} strokeWidth={1.5} className="text-[var(--color-accent-tertiary)]" />
                    <span className="text-[0.875rem] font-body font-semibold">{badge.label}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          )}

          {/* Plan cards */}
          <div className={`grid grid-cols-1 gap-6 items-start ${isCorporate ? 'lg:grid-cols-2 max-w-[760px] mx-auto' : 'lg:grid-cols-3'}`}>
            {plans.map((plan, i) => (
              <Reveal key={plan.name} delay={i * 80}>
                <div
                  className={`relative h-full rounded-radius-md border p-6 lg:p-8 transition-all duration-200 hover:-translate-y-1 ${
                    plan.highlighted
                      ? 'bg-[var(--color-ink)] text-[var(--color-bg)] border-[var(--color-ink)] shadow-lg'
                      : 'bg-[var(--color-bg-raised)] border-[var(--color-border)] shadow-sm hover:shadow-md'
                  }`}
                >
                  {plan.highlighted && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-mono-label text-[0.6rem] px-3 py-1 rounded-full bg-[var(--color-highlight)] text-[var(--color-ink)]">
                      {isCorporate ? 'Recommended' : 'Most popular'}
                    </span>
                  )}
                  <span
                    className={`text-mono-label text-[0.62rem] mb-2 block ${plan.highlighted ? 'text-[var(--color-highlight)]' : 'text-[var(--color-accent-tertiary)]'}`}
                  >
                    {plan.audience}
                  </span>
                  <h3
                    className={`text-h3 mb-2 ${plan.highlighted ? 'text-[var(--color-bg)]' : 'text-[var(--color-ink)]'}`}
                  >
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-1.5 mb-1">
                    <span
                      className={`font-display font-bold text-[2.5rem] leading-none ${plan.highlighted ? 'text-[var(--color-bg)]' : 'text-[var(--color-ink)]'}`}
                    >
                      {formatPrice(plan, billing)}
                    </span>
                    <span className={`text-[0.875rem] ${plan.highlighted ? 'text-[rgba(239,230,211,0.7)]' : 'text-[var(--color-ink-muted)]'}`}>
                      {plan.cadence}
                    </span>
                  </div>
                  <div className={`text-[0.75rem] mb-4 ${plan.highlighted ? 'text-[rgba(239,230,211,0.5)]' : 'text-[var(--color-ink-muted)]'}`}>
                    {billing === 'annual'
                      ? `$${plan.annual} billed annually`
                      : 'Billed monthly'}
                  </div>
                  <p className={`text-[0.9375rem] mb-6 ${plan.highlighted ? 'text-[rgba(239,230,211,0.8)]' : 'text-[var(--color-ink-muted)]'}`}>
                    {plan.tagline}
                  </p>
                  <ul className="flex flex-col gap-3 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5">
                        <Check
                          size={16}
                          strokeWidth={2}
                          className={`mt-0.5 shrink-0 ${plan.highlighted ? 'text-[var(--color-highlight)]' : 'text-[var(--color-accent-tertiary)]'}`}
                        />
                        <span className={`text-[0.9375rem] ${plan.highlighted ? 'text-[rgba(239,230,211,0.9)]' : 'text-[var(--color-ink)]'}`}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <LinkButton
                    href={routeHref('signup')}
                    variant={plan.highlighted ? 'highlight' : 'secondary'}
                    size="md"
                    icon={ArrowRight}
                    className="w-full"
                  >
                    {plan.cta}
                  </LinkButton>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Corporate: custom enterprise CTA below */}
          {isCorporate && (
            <Reveal delay={160}>
              <div className="mt-6 rounded-radius-md border border-[var(--color-border)] bg-[var(--color-bg-raised)] shadow-sm p-6 lg:p-8 max-w-[760px] mx-auto">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] shrink-0">
                      <Building2 size={22} strokeWidth={1.5} className="text-[var(--color-accent-tertiary)]" />
                    </div>
                    <div>
                      <h3 className="text-h3 text-[var(--color-ink)]">Need something custom?</h3>
                      <p className="text-[0.9375rem] text-[var(--color-ink-muted)] mt-1">
                        On-premise deployments, custom integrations, volume pricing, and procurement-friendly contracts.
                      </p>
                    </div>
                  </div>
                  <LinkButton
                    href="mailto:hello@mach.ai"
                    variant="secondary"
                    size="md"
                    icon={ArrowRight}
                    className="shrink-0"
                  >
                    Talk to us
                  </LinkButton>
                </div>
              </div>
            </Reveal>
          )}

          {/* Personal: Enterprise band */}
          {!isCorporate && (
            <Reveal delay={160}>
              <div className="mt-6 rounded-radius-md border border-[var(--color-border)] bg-[var(--color-bg-raised)] shadow-sm p-6 lg:p-8">
                <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10">
                  <div className="flex items-start gap-4 lg:w-[34ch] shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] shrink-0">
                      <Building2 size={22} strokeWidth={1.5} className="text-[var(--color-accent-tertiary)]" />
                    </div>
                    <div>
                      <h3 className="text-h3 text-[var(--color-ink)]">Looking for corporate?</h3>
                      <p className="text-[0.9375rem] text-[var(--color-ink-muted)] mt-1">
                        If you're buying for a company, switch to corporate plans for SSO, audit logs, dedicated infrastructure, and volume pricing.
                      </p>
                    </div>
                  </div>
                  <ul className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2.5">
                    {[
                      'SSO (SAML / OIDC)',
                      'Audit logs + role-based access',
                      'Dedicated infrastructure',
                      'Custom SLAs + onboarding',
                      'Dedicated solutions engineer',
                    ].map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5">
                        <Check size={16} strokeWidth={2} className="mt-0.5 shrink-0 text-[var(--color-accent-tertiary)]" />
                        <span className="text-[0.9375rem] text-[var(--color-ink)]">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="shrink-0 lg:self-center">
                    <button
                      type="button"
                      onClick={() => setMode('corporate')}
                      className="inline-flex items-center gap-2 font-body font-semibold text-[0.9375rem] text-[var(--color-accent-tertiary)] hover:underline"
                    >
                      View corporate plans
                      <ArrowRight size={16} strokeWidth={1.75} />
                    </button>
                  </div>
                </div>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* VPS / VDS section */}
      <section className="py-10 lg:py-16">
        <div className="mx-auto max-w-container px-6 sm:px-12 lg:px-20">
          <Reveal>
            <div className="max-w-[48ch] mb-10">
              <span className="eyebrow text-[var(--color-accent-tertiary)]">
                {isCorporate ? 'Virtual Dedicated Servers' : 'Virtual Private Servers'}
              </span>
              <h2 className="text-h2 text-[var(--color-ink)] mt-3">
                {isCorporate ? 'Dedicated VDS for your organization' : 'Your own private VPS for agents'}
              </h2>
              <p className="text-body text-[var(--color-ink-muted)] mt-3">
                {isCorporate
                  ? 'Run agents on dedicated hardware with isolated tenants, custom regions, and enterprise-grade SLAs. Full control with none of the infrastructure burden.'
                  : 'A private virtual server with dedicated resources for your agent. Root access, your runtime, your rules. We handle the hosting, updates, and uptime.'}
              </p>
            </div>
          </Reveal>

          <div className={`grid grid-cols-1 gap-6 items-start ${isCorporate ? 'lg:grid-cols-2 max-w-[760px] mx-auto' : 'lg:grid-cols-3'}`}>
            {vpsTiers.map((tier, i) => (
              <Reveal key={tier.name} delay={i * 80}>
                <div
                  className={`relative h-full rounded-radius-md border p-6 lg:p-8 transition-all duration-200 hover:-translate-y-1 ${
                    tier.highlighted
                      ? 'bg-[var(--color-ink)] text-[var(--color-bg)] border-[var(--color-ink)] shadow-lg'
                      : 'bg-[var(--color-bg-raised)] border border-[var(--color-border)] shadow-sm hover:shadow-md'
                  }`}
                >
                  {tier.highlighted && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-mono-label text-[0.6rem] px-3 py-1 rounded-full bg-[var(--color-highlight)] text-[var(--color-ink)]">
                      Best value
                    </span>
                  )}
                  <span
                    className={`text-mono-label text-[0.62rem] mb-2 block ${tier.highlighted ? 'text-[var(--color-highlight)]' : 'text-[var(--color-accent-tertiary)]'}`}
                  >
                    {tier.audience}
                  </span>
                  <h3 className={`text-h3 mb-2 ${tier.highlighted ? 'text-[var(--color-bg)]' : 'text-[var(--color-ink)]'}`}>
                    {tier.name}
                  </h3>
                  <div className="flex items-baseline gap-1.5 mb-1">
                    <span
                      className={`font-display font-bold text-[2.5rem] leading-none ${tier.highlighted ? 'text-[var(--color-bg)]' : 'text-[var(--color-ink)]'}`}
                    >
                      {formatVpsPrice(tier, billing)}
                    </span>
                    <span className={`text-[0.875rem] ${tier.highlighted ? 'text-[rgba(239,230,211,0.7)]' : 'text-[var(--color-ink-muted)]'}`}>
                      per month
                    </span>
                  </div>
                  <div className={`text-[0.75rem] mb-5 ${tier.highlighted ? 'text-[rgba(239,230,211,0.5)]' : 'text-[var(--color-ink-muted)]'}`}>
                    {billing === 'annual'
                      ? `$${tier.annual} billed annually`
                      : 'Billed monthly'}
                  </div>
                  <p className={`text-[0.9375rem] mb-5 ${tier.highlighted ? 'text-[rgba(239,230,211,0.8)]' : 'text-[var(--color-ink-muted)]'}`}>
                    {tier.tagline}
                  </p>

                  {/* Server specs grid */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {tier.specs.map((spec) => (
                      <div
                        key={spec.label}
                        className={`rounded-radius-sm border p-3 ${
                          tier.highlighted
                            ? 'bg-[rgba(239,230,211,0.06)] border-[rgba(239,230,211,0.12)]'
                            : 'bg-[var(--color-bg)] border border-[var(--color-border)]'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          <spec.icon
                            size={14}
                            strokeWidth={1.5}
                            className={tier.highlighted ? 'text-[var(--color-highlight)]' : 'text-[var(--color-accent-tertiary)]'}
                          />
                          <span
                            className={`text-mono-label text-[0.55rem] ${tier.highlighted ? 'text-[rgba(239,230,211,0.6)]' : 'text-[var(--color-ink-muted)]'}`}
                          >
                            {spec.label}
                          </span>
                        </div>
                        <span
                          className={`font-display font-bold text-[1.125rem] leading-none ${tier.highlighted ? 'text-[var(--color-bg)]' : 'text-[var(--color-ink)]'}`}
                        >
                          {spec.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  <ul className="flex flex-col gap-2.5 mb-8">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5">
                        <Check
                          size={16}
                          strokeWidth={2}
                          className={`mt-0.5 shrink-0 ${tier.highlighted ? 'text-[var(--color-highlight)]' : 'text-[var(--color-accent-tertiary)]'}`}
                        />
                        <span className={`text-[0.875rem] ${tier.highlighted ? 'text-[rgba(239,230,211,0.9)]' : 'text-[var(--color-ink)]'}`}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <LinkButton
                    href={routeHref('signup')}
                    variant={tier.highlighted ? 'highlight' : 'secondary'}
                    size="md"
                    icon={ArrowRight}
                    className="w-full"
                  >
                    Deploy {tier.name}
                  </LinkButton>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
