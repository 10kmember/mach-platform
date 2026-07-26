import { useEffect, useState, useCallback } from 'react';
import { api, type AgentRow, type SkillRow, type UsageRow } from '../lib/api';

export type { AgentRow, SkillRow, UsageRow };

export interface DashboardData {
  agents: AgentRow[];
  skills: SkillRow[];
  usage: UsageRow[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useDashboardData(userId: string | null): DashboardData {
  const [agents, setAgents] = useState<AgentRow[]>([]);
  const [skills, setSkills] = useState<SkillRow[]>([]);
  const [usage, setUsage] = useState<UsageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async (quiet = false) => {
    if (!userId) {
      setAgents([]);
      setSkills([]);
      setUsage([]);
      setLoading(false);
      setError(null);
      return;
    }
    if (!quiet) setLoading(true);
    setError(null);
    try {
      const [agentsRes, skillsRes, usageRes] = await Promise.all([
        api.listAgents(),
        api.listSkills(),
        api.listUsage(),
      ]);
      setAgents(agentsRes);
      setSkills(skillsRes);
      setUsage(usageRes);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Live console: quiet-refresh every 30s so status changes (approvals,
  // go-lives) surface without the client hammering Refresh.
  useEffect(() => {
    if (!userId) return;
    const id = setInterval(() => { void fetchAll(true); }, 30_000);
    return () => clearInterval(id);
  }, [userId, fetchAll]);

  return { agents, skills, usage, loading, error, refetch: () => fetchAll() };
}
