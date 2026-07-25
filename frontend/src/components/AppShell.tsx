import type { ReactNode } from 'react';
import { LayoutDashboard, ShieldCheck, LogOut, Cpu } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

/**
 * AppShell — the console chrome for authenticated app routes.
 *
 * The public marketing site (Navbar + Footer) is deliberately absent here:
 * once a client is inside the platform, they're in the product, not on the
 * brochure. Operator accounts additionally see the Operator nav item.
 */
export function AppShell({ children, active }: { children: ReactNode; active: string }) {
  const { user, signOut } = useAuth();

  const nav = [
    { id: 'dashboard', label: 'Console', icon: LayoutDashboard, href: '#/dashboard' },
    ...(user?.is_admin
      ? [{ id: 'ops-cathedral', label: 'Operator', icon: ShieldCheck, href: '#/ops-cathedral' }]
      : []),
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-ink)] flex">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 border-r border-[var(--color-midground)] flex flex-col">
        <a href="#/dashboard" className="flex items-center gap-2 px-5 py-5 border-b border-[var(--color-midground)]">
          <Cpu size={20} strokeWidth={1.5} className="text-[var(--color-accent-tertiary)]" />
          <span className="font-display text-sm tracking-wide">MACH Labs</span>
        </a>
        <nav className="flex-1 py-4">
          {nav.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                className={`flex items-center gap-3 px-5 py-2.5 text-sm transition-colors ${
                  isActive
                    ? 'text-[var(--color-accent-tertiary)] bg-[var(--color-midground)]/40 border-r-2 border-[var(--color-accent-tertiary)]'
                    : 'text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]'
                }`}
              >
                <Icon size={16} strokeWidth={1.5} />
                {item.label}
              </a>
            );
          })}
        </nav>
        <div className="border-t border-[var(--color-midground)] px-5 py-4">
          <div className="text-xs text-[var(--color-ink-muted)] mb-1 truncate">{user?.email}</div>
          <div className="text-[0.65rem] uppercase tracking-wider text-[var(--color-ink-muted)] mb-3">
            {user?.plan} plan{user?.is_admin ? ' · operator' : ''}
          </div>
          <button
            onClick={() => void signOut()}
            className="flex items-center gap-2 text-xs text-[var(--color-ink-muted)] hover:text-[var(--color-accent-primary)] transition-colors"
          >
            <LogOut size={14} strokeWidth={1.5} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main pane */}
      <main className="flex-1 min-w-0 overflow-y-auto">{children}</main>
    </div>
  );
}
