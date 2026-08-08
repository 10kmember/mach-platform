import { Layers, Check, X, ArrowRight } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { LinkButton } from '../components/Button';
import { Reveal } from '../components/Reveal';
import { BarRace } from '../components/artifacts/BarRace';
import { routeHref } from '../hooks/useRoute';

interface Feature {
  label: string;
  solo: boolean | string;
  team: boolean | string;
  venture: boolean | string;
  department: boolean | string;
  enterprise: boolean | string;
}

const PLANS = ['Solo', 'Team', 'Venture', 'Department', 'Enterprise'];

const FEATURES: Feature[] = [
  { label: 'Hosted agents', solo: '1', team: '2', venture: '3', department: '3', enterprise: '5+' },
  { label: 'Scheduled skills', solo: '3', team: 'Unlimited', venture: 'Unlimited', department: 'Unlimited', enterprise: 'Unlimited' },
  { label: 'Custom skills', solo: false, team: false, venture: true, department: true, enterprise: true },
  { label: 'All channels', solo: 'Email + Browser', team: 'All', venture: 'All + Webhooks', department: 'All + Webhooks', enterprise: 'All + Custom' },
  { label: 'Daily backups', solo: true, team: true, venture: true, department: true, enterprise: true },
  { label: 'Auto updates', solo: false, team: true, venture: true, department: true, enterprise: true },
  { label: 'SSO (SAML / OIDC)', solo: false, team: false, venture: false, department: true, enterprise: true },
  { label: 'Audit logs + RBAC', solo: false, team: false, venture: false, department: true, enterprise: true },
  { label: 'SCIM provisioning', solo: false, team: false, venture: false, department: false, enterprise: true },
  { label: 'Dedicated infrastructure', solo: false, team: false, venture: false, department: false, enterprise: true },
  { label: 'Uptime SLA', solo: false, team: false, venture: '99.5%', department: '99.9%', enterprise: 'Custom' },
  { label: 'Support tier', solo: 'Community', team: 'Priority email', venture: 'Priority', department: 'Priority + SLA', enterprise: '24/7 phone' },
];

const PRICES: Record<string, string> = {
  Solo: '$19',
  Team: '$49',
  Venture: '$149',
  Department: '$499',
  Enterprise: '$1,499',
};

function Cell({ value }: { value: boolean | string }) {
  if (value === true) return <Check size={16} strokeWidth={2.5} className="text-[var(--color-accent-tertiary)] mx-auto" />;
  if (value === false) return <X size={16} strokeWidth={2} className="text-[var(--color-ink-muted)] opacity-30 mx-auto" />;
  return <span className="text-[0.875rem] text-[var(--color-ink)]">{value}</span>;
}

export function ComparePlansPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Compare Plans"
        eyebrowIcon={Layers}
        title={
          <>
            Every plan, <span className="font-display italic font-normal text-[var(--color-accent-primary)]">side by side</span>.
          </>
        }
        subtitle="Compare features across all five tiers. Whether you are an individual automating your inbox or an enterprise standardizing across the org, this table shows exactly what you get at each level."
        artifact={<BarRace />}
      />

      <section className="py-10 lg:py-16">
        <div className="mx-auto max-w-container px-6 sm:px-12 lg:px-20">
          <Reveal>
            <div className="overflow-x-auto rounded-radius-md border border-[var(--color-border)] shadow-sm">
              <table className="w-full min-w-[640px]">
                <thead>
                  <tr className="bg-[var(--color-bg-raised)] border-b border-[var(--color-border)]">
                    <th className="text-left p-4 lg:p-5 text-mono-label text-[0.7rem] text-[var(--color-ink-muted)]">Feature</th>
                    {PLANS.map((plan) => (
                      <th key={plan} className="p-4 lg:p-5 text-center">
                        <div className="font-display font-bold text-[1.125rem] text-[var(--color-ink)]">{plan}</div>
                        <div className="text-[0.875rem] font-body text-[var(--color-accent-tertiary)] mt-1">{PRICES[plan]}/mo</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {FEATURES.map((feature, i) => (
                    <tr
                      key={feature.label}
                      className={i % 2 === 0 ? 'bg-[var(--color-bg)]' : 'bg-[var(--color-bg-raised)]'}
                    >
                      <td className="p-4 lg:p-5 text-[0.9375rem] text-[var(--color-ink)] font-body font-semibold">
                        {feature.label}
                      </td>
                      {PLANS.map((plan) => (
                        <td key={plan} className="p-4 lg:p-5 text-center">
                          <Cell value={feature[plan.toLowerCase() as keyof Feature] as boolean | string} />
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr className="bg-[var(--color-ink)]">
                    <td className="p-4 lg:p-5"></td>
                    {PLANS.map((plan) => (
                      <td key={plan} className="p-4 lg:p-5 text-center">
                        <LinkButton
                          href={routeHref('signup')}
                          variant="highlight"
                          size="md"
                          icon={ArrowRight}
                          className="whitespace-nowrap"
                        >
                          Choose {plan}
                        </LinkButton>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
