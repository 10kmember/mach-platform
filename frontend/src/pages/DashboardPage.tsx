import { useState, type FormEvent } from 'react';
import {
  Plus,
  Cpu,
  Terminal,
  Globe,
  Code2,
  Activity,
  Trash2,
  Loader2,
  AlertCircle,
  RefreshCw,
  type LucideIcon,
} from 'lucide-react';
import { Button } from '../components/Button';
import { Reveal } from '../components/Reveal';
import { useAuth } from '../hooks/useAuth';
import { useDashboardData } from '../hooks/useDashboardData';
import { api } from '../lib/api';

const AGENT_TYPES: { value: string; label: string; icon: LucideIcon }[] = [
  { value: 'mach_one', label: 'Mach One', icon: Cpu },
  { value: 'mach_forge', label: 'Mach Forge', icon: Terminal },
  { value: 'mach_relay', label: 'Mach Relay', icon: Globe },
  { value: 'mach_sentry', label: 'Mach Sentry', icon: Code2 },
];

const STATUS_COLORS: Record<string, string> = {
  active: 'var(--color-accent-secondary)',
  running: 'var(--color-accent-secondary)',
  paused: 'var(--color-ink-muted)',
  deploying: 'var(--color-highlight)',
  pending_approval: 'var(--color-highlight)',
  awaiting_payment: 'var(--color-highlight)',
  rejected: 'var(--color-accent-primary)',
  error: 'var(--color-accent-primary)',
};

const STATUS_LABELS: Record<string, string> = {
  active: 'live',
  paused: 'paused',
  pending_approval: 'awaiting approval',
  awaiting_payment: 'awaiting payment',
  rejected: 'rejected',
};

function formatDate(iso: string | null): string {
  if (!iso) return 'Never';
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) +
    ' ' + d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

function AgentIcon({ type }: { type: string }) {
  const found = AGENT_TYPES.find((a) => a.value === type);
  if (!found) return <Cpu size={20} strokeWidth={1.5} />;
  const Icon = found.icon;
  return <Icon size={20} strokeWidth={1.5} />;
}

export function DashboardPage() {
  const { user, initialLoading } = useAuth();
  const { agents, skills, usage, loading, error, refetch } = useDashboardData(user?.id ?? null);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState('mach_one');
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  const totalCost = usage.reduce((sum, e) => sum + e.cost_cents, 0);
  const totalRuns = usage.length;
  const activeAgents = agents.filter((a) => a.status === 'active').length;

  async function handleAddAgent(e: FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    setAdding(true);
    setAddError(null);
    try {
      await api.createAgent(newName.trim(), newType, ['email']);
      setNewName('');
      setShowAdd(false);
      refetch();
    } catch (e) {
      setAddError(e instanceof Error ? e.message : 'Failed to add agent.');
    } finally {
      setAdding(false);
    }
  }

  async function handleDeleteAgent(id: string) {
    try {
      await api.deleteAgent(id);
      refetch();
    } catch {
      // handled by refetch state
    }
  }

  async function handleToggleAgent(id: string, currentStatus: string) {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    try {
      await api.updateAgentStatus(id, newStatus);
      refetch();
    } catch {
      // handled by refetch state
    }
  }

  const pendingCount = agents.filter((a) => a.status === 'pending_approval').length;

  return (
    <main className="p-8 max-w-6xl">
      {/* Console header — leaner than the marketing PageHeader: this is the
          product interior, not the brochure. */}
      <div className="mb-8">
        <h1 className="font-display text-2xl mb-1">
          Welcome back, <span className="text-[var(--color-accent-tertiary)]">{user?.name ?? 'Operator'}</span>
        </h1>
        <p className="text-sm text-[var(--color-ink-muted)]">
          {user?.plan} plan · {agents.length} agent{agents.length === 1 ? '' : 's'}
          {pendingCount > 0 ? ` · ${pendingCount} awaiting review` : ''}
        </p>
      </div>

      <section>
        <div className="">
          {/* Stats row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {[
              { label: 'Total Agents', value: agents.length, icon: Cpu, color: 'var(--color-accent-tertiary)' },
              { label: 'Active Now', value: activeAgents, icon: Activity, color: 'var(--color-accent-secondary)' },
              { label: 'Total Skills', value: skills.length, icon: Terminal, color: 'var(--color-highlight)' },
              { label: 'Total Runs', value: totalRuns, icon: Code2, color: 'var(--color-accent-primary)' },
            ].map((stat, i) => (
              <Reveal key={stat.label} delay={i * 60}>
                <div className="rounded-radius-md bg-[var(--color-bg-raised)] border border-[var(--color-border)] p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-mono-label text-[0.65rem] text-[var(--color-ink-muted)]">{stat.label}</span>
                    <stat.icon size={18} strokeWidth={1.5} style={{ color: stat.color }} />
                  </div>
                  <div className="font-display font-bold text-[2rem] text-[var(--color-ink)] leading-none">
                    {loading || initialLoading ? '—' : stat.value}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2.5 rounded-radius-sm bg-[rgba(184,92,56,0.1)] border border-[rgba(184,92,56,0.25)] px-3.5 py-3 mb-6">
              <AlertCircle size={16} strokeWidth={1.75} className="text-[var(--color-accent-primary)] shrink-0 mt-0.5" />
              <span className="text-[0.875rem] text-[var(--color-ink)]">{error}</span>
            </div>
          )}

          {/* Agents section */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-h2 text-[var(--color-ink)]">Your Agents</h2>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                size="md"
                icon={RefreshCw}
                iconPosition="left"
                onClick={() => void refetch()}
                disabled={loading}
              >
                Refresh
              </Button>
              <Button
                variant="primary"
                size="md"
                icon={Plus}
                iconPosition="left"
                onClick={() => setShowAdd((v) => !v)}
              >
                Request Agent
              </Button>
            </div>
          </div>

          {/* Add agent form */}
          {showAdd && (
            <Reveal>
              <form onSubmit={handleAddAgent} className="rounded-radius-md bg-[var(--color-bg-raised)] border border-[var(--color-border)] p-6 mb-6 shadow-sm">
                <h3 className="text-h3 text-[var(--color-ink)] mb-4">Request a new agent</h3>
                <p className="text-[0.8125rem] text-[var(--color-ink-muted)] mb-4">
                  Every deployment is reviewed by the platform operator before it goes live — approval typically lands within a day.
                </p>
                {addError && (
                  <div className="flex items-start gap-2.5 rounded-radius-sm bg-[rgba(184,92,56,0.1)] border border-[rgba(184,92,56,0.25)] px-3.5 py-3 mb-4">
                    <AlertCircle size={16} strokeWidth={1.75} className="text-[var(--color-accent-primary)] shrink-0 mt-0.5" />
                    <span className="text-[0.875rem] text-[var(--color-ink)]">{addError}</span>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-3 items-end">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="agent-name" className="text-mono-label text-[0.7rem] text-[var(--color-ink-muted)]">
                      Agent name
                    </label>
                    <input
                      id="agent-name"
                      type="text"
                      required
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="My Mach One"
                      className="rounded-radius-sm bg-[var(--color-bg)] border border-[var(--color-border)] px-4 py-2.5 text-body text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)] focus:outline-none focus:border-[var(--color-accent-tertiary)] transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="agent-type" className="text-mono-label text-[0.7rem] text-[var(--color-ink-muted)]">
                      Type
                    </label>
                    <select
                      id="agent-type"
                      value={newType}
                      onChange={(e) => setNewType(e.target.value)}
                      className="rounded-radius-sm bg-[var(--color-bg)] border border-[var(--color-border)] px-4 py-2.5 text-body text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-accent-tertiary)] transition-colors"
                    >
                      {AGENT_TYPES.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                  <Button type="submit" variant="primary" size="md" disabled={adding}>
                    {adding ? <Loader2 size={16} className="animate-spin" /> : 'Submit request'}
                  </Button>
                </div>
              </form>
            </Reveal>
          )}

          {/* Agents list */}
          {loading || initialLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 size={24} className="animate-spin text-[var(--color-accent-tertiary)]" />
            </div>
          ) : agents.length === 0 ? (
            <div className="rounded-radius-md bg-[var(--color-bg-raised)] border border-[var(--color-border)] p-10 text-center shadow-sm">
              <Cpu size={32} strokeWidth={1.5} className="text-[var(--color-ink-muted)] mx-auto mb-4" />
              <h3 className="text-h3 text-[var(--color-ink)] mb-2">No agents yet</h3>
              <p className="text-body text-[var(--color-ink-muted)] mb-6">Deploy your first agent to get started.</p>
              <Button variant="primary" size="md" icon={Plus} iconPosition="left" onClick={() => setShowAdd(true)}>
                Add your first agent
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {agents.map((agent, i) => (
                <Reveal key={agent.id} delay={i * 50}>
                  <article className="rounded-radius-md bg-[var(--color-bg-raised)] border border-[var(--color-border)] p-5 lg:p-6 shadow-sm">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center h-11 w-11 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] shrink-0">
                          <AgentIcon type={agent.type} />
                        </div>
                        <div>
                          <h3 className="font-body font-semibold text-[1rem] text-[var(--color-ink)]">{agent.name}</h3>
                          <span className="text-mono-label text-[0.6rem] text-[var(--color-ink-muted)]">
                            {AGENT_TYPES.find((t) => t.value === agent.type)?.label ?? agent.type}
                          </span>
                        </div>
                      </div>
                      <span
                        className="text-mono-label text-[0.6rem] px-2.5 py-1 rounded-full inline-flex items-center gap-1.5"
                        style={{ backgroundColor: `${STATUS_COLORS[agent.status]}20`, color: STATUS_COLORS[agent.status] }}
                      >
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: STATUS_COLORS[agent.status] }}
                        />
                        {STATUS_LABELS[agent.status] ?? agent.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {agent.channels.length > 0 ? agent.channels.map((ch) => (
                        <span
                          key={ch}
                          className="text-[0.75rem] font-body text-[var(--color-accent-tertiary)] bg-[rgba(47,111,107,0.08)] border border-[rgba(47,111,107,0.2)] rounded-radius-sm px-2 py-0.5"
                        >
                          {ch}
                        </span>
                      )) : (
                        <span className="text-[0.75rem] text-[var(--color-ink-muted)]">No channels connected</span>
                      )}
                    </div>

                    <div className="text-[0.8125rem] text-[var(--color-ink-muted)] mb-4">
                      {agent.status === 'pending_approval'
                        ? 'Requested — the operator reviews every deployment before it goes live.'
                        : agent.status === 'awaiting_payment'
                          ? 'Approved — the operator will share payment details with you. Your agent goes live once payment clears.'
                          : agent.status === 'rejected'
                            ? 'This request was not approved. Contact the operator if you believe this is an error.'
                            : `Created ${formatDate(agent.created_at)}`}
                    </div>

                    <div className="flex gap-2">
                      {(agent.status === 'active' || agent.status === 'paused') && (
                        <Button
                          variant="secondary"
                          size="md"
                          onClick={() => void handleToggleAgent(agent.id, agent.status)}
                          className="flex-1"
                        >
                          {agent.status === 'active' ? 'Pause' : 'Activate'}
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="md"
                        icon={Trash2}
                        iconPosition="left"
                        onClick={() => void handleDeleteAgent(agent.id)}
                        className="text-[var(--color-accent-primary)] hover:bg-[rgba(184,92,56,0.08)]"
                      >
                        Delete
                      </Button>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          )}

          {/* Recent usage */}
          <div className="mt-12">
            <h2 className="text-h2 text-[var(--color-ink)] mb-6">Recent Activity</h2>
            {loading || initialLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 size={20} className="animate-spin text-[var(--color-accent-tertiary)]" />
              </div>
            ) : usage.length === 0 ? (
              <div className="rounded-radius-md bg-[var(--color-bg-raised)] border border-[var(--color-border)] p-8 text-center shadow-sm">
                <Activity size={28} strokeWidth={1.5} className="text-[var(--color-ink-muted)] mx-auto mb-3" />
                <p className="text-body text-[var(--color-ink-muted)]">No activity yet. Activity will appear here once your agents start running.</p>
              </div>
            ) : (
              <div className="rounded-radius-md border border-[var(--color-border)] shadow-sm overflow-hidden">
                {usage.slice(0, 10).map((event, i) => (
                  <div
                    key={event.id}
                    className={`flex items-center gap-4 p-4 ${i % 2 === 0 ? 'bg-[var(--color-bg)]' : 'bg-[var(--color-bg-raised)]'} border-b border-[var(--color-border)] last:border-b-0`}
                  >
                    <span
                      className="text-mono-label text-[0.6rem] px-2 py-0.5 rounded-radius-sm shrink-0"
                      style={{
                        backgroundColor: `${STATUS_COLORS[event.event_type === 'error' ? 'error' : 'running']}20`,
                        color: STATUS_COLORS[event.event_type === 'error' ? 'error' : 'running'],
                      }}
                    >
                      {event.event_type}
                    </span>
                    <span className="text-[0.875rem] text-[var(--color-ink)] font-body">
                      {formatDate(event.created_at)}
                    </span>
                    <span className="text-[0.8125rem] text-[var(--color-ink-muted)] ml-auto">
                      {event.duration_ms}ms · ${(event.cost_cents / 100).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cost summary */}
          <div className="mt-6 rounded-radius-md bg-[var(--color-ink)] p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-mono-label text-[0.7rem] text-[rgba(239,230,211,0.6)]">Total API spend</span>
                <div className="font-display font-bold text-[2.5rem] text-[var(--color-bg)] leading-none mt-1">
                  ${(totalCost / 100).toFixed(2)}
                </div>
              </div>
              <div className="text-right">
                <span className="text-mono-label text-[0.7rem] text-[rgba(239,230,211,0.6)]">Runs this period</span>
                <div className="font-display font-bold text-[2.5rem] text-[var(--color-highlight)] leading-none mt-1">
                  {totalRuns}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
