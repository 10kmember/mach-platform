import { ShieldCheck, ArrowRight, Lock, Server, FileCheck, KeyRound, Eye, type LucideIcon } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { LinkButton } from '../components/Button';
import { Reveal } from '../components/Reveal';
import { ShieldSweep } from '../components/artifacts/ShieldSweep';

interface Control {
  icon: LucideIcon;
  title: string;
  body: string;
}

const CONTROLS: Control[] = [
  {
    icon: Lock,
    title: 'Encryption everywhere',
    body: 'Data is encrypted at rest with per-tenant keys and in transit with TLS 1.3. Key rotation is automatic and audited.',
  },
  {
    icon: KeyRound,
    title: 'Access control',
    body: 'SSO via SAML and OIDC, role-based access control, SCIM provisioning, and full audit logs on corporate plans.',
  },
  {
    icon: Server,
    title: 'Isolated runtimes',
    body: 'Every agent runs in an isolated container with network policies, resource limits, and no shared state between tenants.',
  },
  {
    icon: Eye,
    title: 'Continuous monitoring',
    body: 'Every agent, skill, and channel emits structured telemetry. Anomalies trigger incidents automatically and route to your team.',
  },
  {
    icon: FileCheck,
    title: 'Audit trails',
    body: 'Full audit trail of every run: what triggered it, what it did, how long it took, and what it returned. Searchable and exportable.',
  },
  {
    icon: ShieldCheck,
    title: 'Compliance aligned',
    body: 'SOC 2 Type II, GDPR, HIPAA, and ISO 27001 aligned. Documentation, evidence, and audit trails available on request.',
  },
];

const CERTIFICATIONS = ['SOC 2 Type II', 'GDPR', 'HIPAA Ready', 'ISO 27001 Aligned', 'CCPA', 'PCI DSS'];

export function SecurityPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Security & Compliance"
        eyebrowIcon={ShieldCheck}
        title={
          <>
            Security is the <span className="font-display italic font-normal text-[var(--color-accent-primary)]">foundation</span>, not a feature.
          </>
        }
        subtitle="Every agent runs in an isolated, encrypted environment. Access is controlled through SSO, RBAC, and full audit logs. We align with SOC 2 Type II, GDPR, HIPAA, and ISO 27001 so your security team can sign off without a fight."
        artifact={<ShieldSweep />}
      />

      <section className="py-10 lg:py-16">
        <div className="mx-auto max-w-container px-6 sm:px-12 lg:px-20">
          <Reveal>
            <div className="max-w-[42ch] mb-8">
              <span className="eyebrow text-[var(--color-accent-tertiary)]">Controls</span>
              <h2 className="text-h2 text-[var(--color-ink)] mt-3">Six layers of protection</h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CONTROLS.map((control, i) => (
              <Reveal key={control.title} delay={i * 60}>
                <article className="h-full rounded-radius-md bg-[var(--color-bg-raised)] border border-[var(--color-border)] p-6 lg:p-8 shadow-sm">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] mb-5">
                    <control.icon size={22} strokeWidth={1.5} className="text-[var(--color-accent-tertiary)]" />
                  </div>
                  <h3 className="text-h3 text-[var(--color-ink)] mb-3">{control.title}</h3>
                  <p className="text-body text-[var(--color-ink-muted)]">{control.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 lg:py-16">
        <div className="mx-auto max-w-container px-6 sm:px-12 lg:px-20">
          <Reveal>
            <div className="rounded-radius-lg bg-[var(--color-ink)] px-6 py-10 sm:px-12 lg:px-16 lg:py-14">
              <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-12 justify-between">
                <div className="max-w-[36ch]">
                  <h2 className="text-h2 text-[var(--color-bg)] mb-3">Certifications and alignments</h2>
                  <p className="text-lead text-[rgba(239,230,211,0.8)]">
                    We hold ourselves to the same standards your security and compliance teams demand. Documentation, evidence, and audit trails available on request.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {CERTIFICATIONS.map((cert) => (
                    <span
                      key={cert}
                      className="inline-flex items-center gap-2 rounded-radius-sm bg-[rgba(239,230,211,0.08)] border border-[rgba(239,230,211,0.15)] px-4 py-2.5 text-[0.9375rem] font-body font-semibold text-[var(--color-bg)]"
                    >
                      <ShieldCheck size={16} strokeWidth={1.5} className="text-[var(--color-highlight)]" />
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-10 lg:py-16">
        <div className="mx-auto max-w-container px-6 sm:px-12 lg:px-20">
          <Reveal>
            <div className="rounded-radius-lg bg-[var(--color-bg-raised)] border border-[var(--color-border)] p-6 lg:p-10 flex flex-col sm:flex-row items-start sm:items-center gap-6 justify-between">
              <div>
                <h3 className="text-h3 text-[var(--color-ink)] mb-2">Need a security review?</h3>
                <p className="text-body text-[var(--color-ink-muted)] max-w-[48ch]">
                  Our security team can walk your team through our controls, documentation, and compliance evidence.
                </p>
              </div>
              <LinkButton href="mailto:security@mach.ai" variant="secondary" size="lg" icon={ArrowRight} className="shrink-0">
                Contact security
              </LinkButton>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
