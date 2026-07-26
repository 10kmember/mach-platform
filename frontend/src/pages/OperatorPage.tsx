import { useCallback, useEffect, useState, type FormEvent } from 'react';
import {
  ShieldCheck, Check, X, Loader2, AlertCircle, RefreshCw,
  Banknote, Clock, Users, Activity,
} from 'lucide-react';
import { api, ApiError, type AdminAgentRow, type PaymentRow } from '../lib/api';
import { useAuth } from '../hooks/useAuth';

/**
 * OperatorPage — the platform-operator console. Revenue lives here:
 *   request → Approve (awaiting payment) → Mark paid (agent LIVE).
 * PayPal links are sent by hand (human-in-the-middle); this console is
 * the queue, the ledger, and the kill-switch.
 */

const STATUS_STYLE: Record<string, string> = {
  active: 'var(--color-accent-secondary)',
  pending_approval: 'var(--color-highlight)',
  awaiting_payment: 'var(--color-highlight)',
  rejected: 'var(--color-accent-primary)',
  paused: 'var(--color-ink-muted)',
};

function cents(n: number): string {
  return `$${(n / 100).toFixed(2)}`;
}

export function OperatorPage() {
  const { user } = useAuth();
  const [pending, setPending] = useState<AdminAgentRow[]>([]);
  const [fleet, setFleet] = useState<AdminAgentRow[]>([]);
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [acting, setActing] = useState<string | null>(null);
  const [payFor, setPayFor] = useState<string | null>(null);
  const [payAmount, setPayAmount] = useState('49.00');
  const [payNote, setPayNote] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [p, f, pay] = await Promise.all([
        api.adminPending(), api.adminAllAgents(), api.adminPayments(),
      ]);
      setPending(p);
      setFleet(f);
      setPayments(pay);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to load operator data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  // Operator pulse: quiet refresh every 30s — a live queue is the point.
  useEffect(() => {
    const id = setInterval(() => { void load(); }, 30_000);
    return () => clearInterval(id);
  }, [load]);

  async function decide(id: string, action: 'approve' | 'reject') {
    setActing(id);
    try {
      if (action === 'approve') await api.adminApprove(id);
      else await api.adminReject(id);
      await load();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Action failed.');
    } finally {
      setActing(null);
    }
  }

  async function markPaid(e: FormEvent) {
    e.preventDefault();
    if (!payFor) return;
    const centsVal = Math.round(parseFloat(payAmount) * 100);
    if (!Number.isFinite(centsVal) || centsVal <= 0) {
      setError('Enter a valid amount.');
      return;
    }
    setActing(payFor);
    try {
      await api.adminMarkPaid(payFor, centsVal, payNote.trim());
      setPayFor(null);
      setPayNote('');
      await load();
    } catch (e2) {
      setError(e2 instanceof ApiError ? e2.message : 'Payment recording failed.');
    } finally {
      setActing(null);
    }
  }

  if (!user?.is_admin) {
    return (
      <div className="flex items-center gap-3 p-8 text-[var(--color-ink-muted)]">
        <AlertCircle size={20} strokeWidth={1.5} />
        This console is for platform operators.
      </div>
    );
  }

  const awaitingPayment = fleet.filter((a) => a.status === 'awaiting_payment');
  const live = fleet.filter((a) => a.status === 'active');
  const revenue = payments
    .filter((p) => p.status === 'confirmed')
    .reduce((s, p) => s + p.amount_cents, 0);
  const uniqueClients = new Set(fleet.map((a) => a.client_email)).size;

  // Revenue trend: last 14 days of confirmed payments as a sparkline.
  const trend = (() => {
    const days: number[] = new Array(14).fill(0);
    const now = Date.now();
    for (const p of payments) {
      if (p.status !== 'confirmed' || !p.created_at) continue;
      const age = Math.floor((now - new Date(p.created_at).getTime()) / 86_400_000);
      if (age >= 0 && age < 14) days[13 - age] += p.amount_cents;
    }
    return days;
  })();
  const trendMax = Math.max(...trend, 1);

  const stats = [
    { label: 'In queue', value: pending.length, icon: Clock },
    { label: 'Awaiting payment', value: awaitingPayment.length, icon: Banknote },
    { label: 'Live agents', value: live.length, icon: Activity },
    { label: 'Clients', value: uniqueClients, icon: Users },
    { label: 'Revenue', value: cents(revenue), icon: Banknote },
  ];

  return (
    <div className="p-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <ShieldCheck size={24} strokeWidth={1.5} className="text-[var(--color-accent-tertiary)]" />
          <div>
            <h1 className="font-display text-xl">Operator Console</h1>
            <p className="text-xs text-[var(--color-ink-muted)]">
              Requests → approval → payment → live. Nothing breathes without your signature.
            </p>
          </div>
        </div>
        <button
          onClick={() => void load()}
          className="flex items-center gap-2 text-xs text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
        >
          <RefreshCw size={14} strokeWidth={1.5} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-2 text-sm text-[var(--color-accent-primary)]">
          <AlertCircle size={16} strokeWidth={1.5} /> {error}
        </div>
      )}

      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="border border-[var(--color-midground)] p-4">
              <div className="flex items-center gap-2 text-[var(--color-ink-muted)] mb-2">
                <Icon size={14} strokeWidth={1.5} />
                <span className="text-[0.65rem] uppercase tracking-widest">{s.label}</span>
              </div>
              <div className="font-display text-xl">{loading ? '—' : s.value}</div>
            </div>
          );
        })}
      </div>

      {/* Revenue trend — 14-day sparkline */}
      <div className="border border-[var(--color-midground)] p-4 mb-10">
        <div className="text-[0.65rem] uppercase tracking-widest text-[var(--color-ink-muted)] mb-3">
          Revenue — last 14 days
        </div>
        <div className="flex items-end gap-1 h-12">
          {trend.map((v, i) => (
            <div
              key={i}
              title={`$${(v / 100).toFixed(2)}`}
              className="flex-1 transition-all"
              style={{
                height: `${Math.max(4, (v / trendMax) * 100)}%`,
                backgroundColor: v > 0 ? 'var(--color-accent-secondary)' : 'var(--color-midground)',
                opacity: v > 0 ? 1 : 0.35,
              }}
            />
          ))}
        </div>
      </div>

      {/* Approval queue */}
      <section className="mb-10">
        <h2 className="text-mono-label text-[0.7rem] uppercase tracking-widest text-[var(--color-ink-muted)] mb-4">
          Pending approval ({pending.length})
        </h2>
        {loading && pending.length === 0 ? (
          <Loader2 size={20} className="animate-spin text-[var(--color-ink-muted)]" />
        ) : pending.length === 0 ? (
          <p className="text-sm text-[var(--color-ink-muted)] border border-dashed border-[var(--color-midground)] p-6 text-center">
            Queue is clear. No requests waiting.
          </p>
        ) : (
          <div className="space-y-3">
            {pending.map((a) => (
              <div key={a.id} className="border border-[var(--color-midground)] p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="font-medium truncate">{a.name}</div>
                    <div className="text-xs text-[var(--color-ink-muted)] mt-1">
                      {a.type.replace('mach_', 'Mach ')} · {a.channels.join(', ') || 'no channels'}
                    </div>
                    <div className="text-xs text-[var(--color-ink-muted)] mt-0.5">
                      {a.client_name} · {a.client_email} · {a.client_plan} plan
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      disabled={acting === a.id}
                      onClick={() => void decide(a.id, 'approve')}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[var(--color-accent-secondary)]/15 text-[var(--color-accent-secondary)] hover:bg-[var(--color-accent-secondary)]/25 disabled:opacity-50"
                    >
                      {acting === a.id ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                      Approve
                    </button>
                    <button
                      disabled={acting === a.id}
                      onClick={() => void decide(a.id, 'reject')}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[var(--color-accent-primary)]/10 text-[var(--color-accent-primary)] hover:bg-[var(--color-accent-primary)]/20 disabled:opacity-50"
                    >
                      <X size={14} />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Awaiting payment */}
      <section className="mb-10">
        <h2 className="text-mono-label text-[0.7rem] uppercase tracking-widest text-[var(--color-ink-muted)] mb-4">
          Awaiting payment ({awaitingPayment.length})
        </h2>
        {awaitingPayment.length === 0 ? (
          <p className="text-sm text-[var(--color-ink-muted)] border border-dashed border-[var(--color-midground)] p-6 text-center">
            Nobody owes you money right now.
          </p>
        ) : (
          <div className="space-y-3">
            {awaitingPayment.map((a) => (
              <div key={a.id} className="border border-[var(--color-highlight)]/40 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="font-medium truncate">{a.name}</div>
                    <div className="text-xs text-[var(--color-ink-muted)] mt-1">
                      {a.client_email} · approved — send PayPal link, then confirm here.
                    </div>
                  </div>
                  <button
                    onClick={() => { setPayFor(payFor === a.id ? null : a.id); setPayNote(''); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[var(--color-highlight)]/15 text-[var(--color-highlight)] hover:bg-[var(--color-highlight)]/25 shrink-0"
                  >
                    <Banknote size={14} />
                    Mark paid
                  </button>
                </div>
                {payFor === a.id && (
                  <form onSubmit={markPaid} className="mt-4 flex flex-wrap items-end gap-3 border-t border-[var(--color-midground)] pt-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[0.65rem] uppercase tracking-widest text-[var(--color-ink-muted)]">Amount (USD)</label>
                      <input
                        type="number" min="1" step="0.01" required
                        value={payAmount} onChange={(e) => setPayAmount(e.target.value)}
                        className="bg-[var(--color-bg)] border border-[var(--color-midground)] px-3 py-2 text-sm w-32 focus:outline-none focus:border-[var(--color-accent-tertiary)]"
                      />
                    </div>
                    <div className="flex flex-col gap-1 flex-1 min-w-40">
                      <label className="text-[0.65rem] uppercase tracking-widest text-[var(--color-ink-muted)]">Note (PayPal txn, etc.)</label>
                      <input
                        type="text" value={payNote} onChange={(e) => setPayNote(e.target.value)}
                        placeholder="paypal.me link ref / txn id"
                        className="bg-[var(--color-bg)] border border-[var(--color-midground)] px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent-tertiary)]"
                      />
                    </div>
                    <button
                      type="submit" disabled={acting === a.id}
                      className="px-4 py-2 text-xs bg-[var(--color-accent-secondary)]/15 text-[var(--color-accent-secondary)] hover:bg-[var(--color-accent-secondary)]/25 disabled:opacity-50"
                    >
                      {acting === a.id ? <Loader2 size={14} className="animate-spin" /> : 'Confirm payment → go live'}
                    </button>
                  </form>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Ledger */}
      <section className="mb-10">
        <h2 className="text-mono-label text-[0.7rem] uppercase tracking-widest text-[var(--color-ink-muted)] mb-4">
          Ledger ({payments.length})
        </h2>
        <div className="border border-[var(--color-midground)] divide-y divide-[var(--color-midground)]">
          {payments.map((p) => (
            <div key={p.id} className="px-4 py-3 flex items-center justify-between gap-4 text-sm">
              <div className="min-w-0">
                <span className="font-medium">{p.agent}</span>
                <span className="text-xs text-[var(--color-ink-muted)] ml-3">{p.client_email}</span>
                {p.note && <span className="text-xs text-[var(--color-ink-muted)] ml-3">· {p.note}</span>}
              </div>
              <span className="text-[var(--color-accent-secondary)] font-medium shrink-0">{cents(p.amount_cents)}</span>
            </div>
          ))}
          {payments.length === 0 && !loading && (
            <p className="p-6 text-center text-sm text-[var(--color-ink-muted)]">No payments recorded yet.</p>
          )}
        </div>
      </section>

      {/* Revenue by client */}
      <section className="mb-10">
        <h2 className="text-mono-label text-[0.7rem] uppercase tracking-widest text-[var(--color-ink-muted)] mb-4">
          Revenue by client
        </h2>
        <div className="border border-[var(--color-midground)] divide-y divide-[var(--color-midground)]">
          {Object.entries(
            payments
              .filter((p) => p.status === 'confirmed')
              .reduce<Record<string, number>>((acc, p) => {
                acc[p.client_email] = (acc[p.client_email] ?? 0) + p.amount_cents;
                return acc;
              }, {})
          )
            .sort((a, b) => b[1] - a[1])
            .map(([email, total]) => (
              <div key={email} className="px-4 py-3 flex items-center justify-between gap-4 text-sm">
                <span className="min-w-0 truncate">{email}</span>
                <span className="text-[var(--color-accent-secondary)] font-medium shrink-0">{cents(total)}</span>
              </div>
            ))}
          {payments.filter((p) => p.status === 'confirmed').length === 0 && !loading && (
            <p className="p-6 text-center text-sm text-[var(--color-ink-muted)]">No paying clients yet.</p>
          )}
        </div>
      </section>

      {/* Fleet view */}
      <section>
        <h2 className="text-mono-label text-[0.7rem] uppercase tracking-widest text-[var(--color-ink-muted)] mb-4">
          Fleet — all clients ({fleet.length})
        </h2>
        <div className="border border-[var(--color-midground)] divide-y divide-[var(--color-midground)]">
          {fleet.map((a) => (
            <div key={a.id} className="px-4 py-3 flex items-center justify-between gap-4 text-sm">
              <div className="min-w-0">
                <span className="font-medium">{a.name}</span>
                <span className="text-xs text-[var(--color-ink-muted)] ml-3">{a.client_email}</span>
              </div>
              <span
                className="text-[0.7rem] uppercase tracking-wider px-2 py-0.5 shrink-0"
                style={{ color: STATUS_STYLE[a.status] ?? 'var(--color-ink-muted)' }}
              >
                {a.status.replace(/_/g, ' ')}
              </span>
            </div>
          ))}
          {fleet.length === 0 && !loading && (
            <p className="p-6 text-center text-sm text-[var(--color-ink-muted)]">No agents yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
