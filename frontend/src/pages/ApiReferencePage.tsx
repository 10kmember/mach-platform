import { Code2, ArrowRight, Terminal, Webhook, KeyRound, BookOpen } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { LinkButton } from '../components/Button';
import { Reveal } from '../components/Reveal';
import { CodeTerminal } from '../components/artifacts/CodeTerminal';

interface Endpoint {
  method: string;
  path: string;
  description: string;
}

const ENDPOINTS: Endpoint[] = [
  { method: 'POST', path: '/v1/agents', description: 'Create a new hosted agent instance.' },
  { method: 'GET', path: '/v1/agents', description: 'List all agents in your account.' },
  { method: 'GET', path: '/v1/agents/:id', description: 'Retrieve a single agent by ID.' },
  { method: 'PATCH', path: '/v1/agents/:id', description: 'Update agent configuration or status.' },
  { method: 'DELETE', path: '/v1/agents/:id', description: 'Delete an agent and all its skills.' },
  { method: 'POST', path: '/v1/skills', description: 'Attach a skill to an agent.' },
  { method: 'GET', path: '/v1/skills', description: 'List all skills across your agents.' },
  { method: 'POST', path: '/v1/skills/:id/run', description: 'Trigger a skill to run immediately.' },
  { method: 'GET', path: '/v1/usage', description: 'Retrieve usage and cost metrics for a date range.' },
  { method: 'POST', path: '/v1/webhooks', description: 'Register a webhook endpoint for events.' },
];

const METHOD_COLORS: Record<string, string> = {
  GET: 'var(--color-accent-tertiary)',
  POST: 'var(--color-accent-secondary)',
  PATCH: 'var(--color-highlight)',
  DELETE: 'var(--color-accent-primary)',
};

export function ApiReferencePage() {
  return (
    <main>
      <PageHeader
        eyebrow="API Reference"
        eyebrowIcon={Code2}
        title={
          <>
            Build on Mach with a <span className="font-display italic font-normal text-[var(--color-accent-primary)]">REST API</span>.
          </>
        }
        subtitle="Every action in the dashboard is available through our REST API. Authenticate with a bearer token, create agents, attach skills, trigger runs, and pull usage metrics programmatically. Webhooks keep your systems in sync."
        artifact={<CodeTerminal />}
      />

      <section className="py-10 lg:py-16">
        <div className="mx-auto max-w-container px-6 sm:px-12 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
            {[
              { icon: KeyRound, title: 'Authentication', body: 'Bearer token auth with automatic rotation and revocation. Tokens are scoped per account.' },
              { icon: Terminal, title: 'SDKs', body: 'Official SDKs for JavaScript, Python, and Go. Community SDKs for Ruby, Rust, and .NET.' },
              { icon: Webhook, title: 'Webhooks', body: 'Subscribe to agent events, skill runs, and cost alerts. Signed payloads with retry logic.' },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 80}>
                <article className="h-full rounded-radius-md bg-[var(--color-bg-raised)] border border-[var(--color-border)] p-6 lg:p-8 shadow-sm">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] mb-5">
                    <item.icon size={22} strokeWidth={1.5} className="text-[var(--color-accent-tertiary)]" />
                  </div>
                  <h3 className="text-h3 text-[var(--color-ink)] mb-3">{item.title}</h3>
                  <p className="text-body text-[var(--color-ink-muted)]">{item.body}</p>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="max-w-[42ch] mb-6">
              <span className="eyebrow text-[var(--color-accent-tertiary)]">Endpoints</span>
              <h2 className="text-h2 text-[var(--color-ink)] mt-3">Core API endpoints</h2>
            </div>
          </Reveal>

          <Reveal>
            <div className="rounded-radius-md border border-[var(--color-border)] shadow-sm overflow-hidden">
              {ENDPOINTS.map((endpoint, i) => (
                <div
                  key={endpoint.path}
                  className={`flex items-center gap-4 p-4 lg:p-5 ${i % 2 === 0 ? 'bg-[var(--color-bg)]' : 'bg-[var(--color-bg-raised)]'} border-b border-[var(--color-border)] last:border-b-0`}
                >
                  <span
                    className="text-mono-label text-[0.65rem] px-2.5 py-1 rounded-radius-sm w-16 text-center shrink-0"
                    style={{ backgroundColor: `${METHOD_COLORS[endpoint.method]}20`, color: METHOD_COLORS[endpoint.method] }}
                  >
                    {endpoint.method}
                  </span>
                  <code className="text-[0.9375rem] font-mono text-[var(--color-ink)] shrink-0" style={{ fontFamily: "'Space Mono', monospace" }}>
                    {endpoint.path}
                  </code>
                  <span className="text-[0.875rem] text-[var(--color-ink-muted)] ml-auto hidden sm:block">
                    {endpoint.description}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-10 lg:py-16">
        <div className="mx-auto max-w-container px-6 sm:px-12 lg:px-20">
          <Reveal>
            <div className="rounded-radius-lg bg-[var(--color-ink)] px-6 py-12 sm:px-12 lg:px-16 lg:py-16 text-center">
              <BookOpen size={32} strokeWidth={1.5} className="text-[var(--color-highlight)] mx-auto mb-4" />
              <h2 className="text-h2 text-[var(--color-bg)] mb-4">Full API documentation</h2>
              <p className="text-lead text-[rgba(239,230,211,0.8)] max-w-[52ch] mx-auto mb-8">
                Code samples in Python, JavaScript, Go, and curl. Complete request and response schemas, error codes, and rate limits.
              </p>
              <LinkButton href="/resources" variant="highlight" size="lg" icon={ArrowRight}>
                Browse the docs
              </LinkButton>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
