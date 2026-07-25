/**
 * MACH Platform API client — replaces the Supabase client.
 *
 * Talks to the self-hosted FastAPI backend (PostgreSQL + SQLAlchemy) on
 * Father's box. JWT bearer token in localStorage; the API base is same-
 * origin under /platform-api when served behind the Caddy proxy, and
 * overridable via VITE_MACH_API_URL for local dev.
 */

const API_BASE =
  (import.meta.env.VITE_MACH_API_URL as string | undefined) ?? '/platform-api';

const TOKEN_KEY = 'mach_token';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null): void {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  auth = true,
): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  const resp = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (resp.status === 204) return undefined as T;
  const data = await resp.json().catch(() => null);
  if (!resp.ok) {
    const detail =
      (data && (data.detail as string)) || `Request failed (${resp.status})`;
    throw new ApiError(resp.status, detail);
  }
  return data as T;
}

export interface ApiUser {
  id: string;
  email: string;
  name: string;
  plan: 'personal' | 'corporate';
  is_admin: boolean;
}

export const api = {
  signUp: (name: string, email: string, password: string, plan: string) =>
    request<{ token: string; user: ApiUser }>(
      'POST',
      '/auth/signup',
      { name, email, password, plan },
      false,
    ),
  signIn: (email: string, password: string) =>
    request<{ token: string; user: ApiUser }>(
      'POST',
      '/auth/signin',
      { email, password },
      false,
    ),
  me: () => request<{ user: ApiUser }>('GET', '/auth/me'),

  listAgents: () => request<AgentRow[]>('GET', '/agents'),
  createAgent: (name: string, type: string, channels: string[]) =>
    request<AgentRow>('POST', '/agents', { name, type, channels }),
  updateAgentStatus: (id: string, status: string) =>
    request<AgentRow>('PATCH', `/agents/${id}`, { status }),
  deleteAgent: (id: string) => request<void>('DELETE', `/agents/${id}`),

  listSkills: () => request<SkillRow[]>('GET', '/skills'),
  listUsage: () => request<UsageRow[]>('GET', '/usage'),

  // Operator (platform admin) endpoints — gated server-side by is_admin.
  adminPending: () => request<AdminAgentRow[]>('GET', '/admin/pending'),
  adminAllAgents: () => request<AdminAgentRow[]>('GET', '/admin/agents'),
  adminApprove: (id: string) =>
    request<AgentRow>('POST', `/admin/agents/${id}/approve`),
  adminReject: (id: string) =>
    request<AgentRow>('POST', `/admin/agents/${id}/reject`),
  adminMarkPaid: (id: string, amount_cents: number, note: string) =>
    request<AgentRow>('POST', `/admin/agents/${id}/mark-paid`, { amount_cents, note }),
  adminPayments: () => request<PaymentRow[]>('GET', '/admin/payments'),
};

export interface PaymentRow {
  id: string;
  agent: string;
  client_email: string;
  amount_cents: number;
  note: string;
  status: string;
  created_at: string | null;
}

export interface AdminAgentRow extends AgentRow {
  client_email: string;
  client_name: string;
  client_plan: string;
}

export interface AgentRow {
  id: string;
  name: string;
  type: string;
  status: string;
  channels: string[];
  created_at: string;
}

export interface SkillRow {
  id: string;
  name: string;
  schedule: string;
  tag: string;
  status: string;
  agent_id: string | null;
  last_run_at: string | null;
  created_at: string;
}

export interface UsageRow {
  id: string;
  event_type: string;
  cost_cents: number;
  duration_ms: number;
  created_at: string;
  agent_id: string | null;
  skill_id: string | null;
}
