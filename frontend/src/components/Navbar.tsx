import { useEffect, useRef, useState, useCallback } from 'react';
import { Menu, X, ChevronDown, LogIn, ArrowRight, LogOut, UserCircle, LayoutDashboard, Sun, Moon } from 'lucide-react';
import { Logo } from './Logo';
import { Button, LinkButton } from './Button';
import { useHashRoute, routeHref, type RouteName } from '../hooks/useHashRoute';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';

interface NavChild {
  label: string;
  route: RouteName;
  note?: string;
}

interface NavItem {
  label: string;
  route: RouteName;
  children?: NavChild[];
}

const NAV: NavItem[] = [
  { label: 'Home', route: 'home' },
  { label: 'Product', route: 'product' },
  {
    label: 'Agents',
    route: 'agents',
    children: [
      { label: 'Mach One', route: 'agents', note: 'Flagship agent' },
      { label: 'Mach Forge', route: 'agents', note: 'Engineering agent' },
      { label: 'Mach Relay', route: 'agents', note: 'Communication agent' },
      { label: 'Mach Sentry', route: 'agents', note: 'Monitoring agent' },
      { label: 'Agent Catalog', route: 'agent-catalog', note: 'Browse all agents' },
    ],
  },
  { label: 'Skills', route: 'skills' },
  { label: 'Pricing', route: 'pricing' },
  {
    label: 'Resources',
    route: 'resources',
    children: [
      { label: 'Skills Library', route: 'skills-library', note: 'Pre-built workflows' },
      { label: 'Compare Plans', route: 'compare-plans', note: 'Feature matrix' },
      { label: 'Use Cases', route: 'use-cases', note: 'Real-world examples' },
      { label: 'API Reference', route: 'api-reference', note: 'REST API docs' },
    ],
  },
  {
    label: 'Platform',
    route: 'platform',
    children: [
      { label: 'How It Works', route: 'how-it-works', note: 'Five-step setup' },
      { label: 'Security & Compliance', route: 'security', note: 'SOC 2, GDPR, HIPAA' },
      { label: 'Architecture', route: 'architecture', note: 'Platform deep dive' },
    ],
  },
  { label: 'About', route: 'about' },
];

function DesktopDropdown({ item, current, onNavigate }: { item: NavItem; current: RouteName; onNavigate: (r: RouteName) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const isActive = current === item.route;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        className={`nav-underline inline-flex items-center gap-1 font-body font-semibold transition-colors py-1 ${
          isActive ? 'text-[var(--color-accent-tertiary)]' : 'text-[var(--color-ink)] hover:text-[var(--color-accent-tertiary)]'
        }`}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
      >
        {item.label}
        <ChevronDown
          size={15}
          strokeWidth={1.75}
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div
          className="absolute left-1/2 top-full -translate-x-1/2 mt-3 w-64 rounded-radius-md bg-[var(--color-bg-raised)] shadow-md border border-[var(--color-border)] p-2 z-50"
          role="menu"
        >
          {item.children!.map((child) => (
            <a
              key={child.label}
              href={routeHref(child.route)}
              className="block rounded-radius-sm px-3 py-2.5 hover:bg-[rgba(46,42,36,0.05)] transition-colors"
              role="menuitem"
              onClick={(e) => {
                e.preventDefault();
                onNavigate(child.route);
                setOpen(false);
              }}
            >
              <div className="font-body font-semibold text-[0.9375rem] text-[var(--color-ink)]">
                {child.label}
              </div>
              {child.note && (
                <div className="text-[0.8125rem] text-[var(--color-ink-muted)] mt-0.5">
                  {child.note}
                </div>
              )}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

interface DrawerItemProps {
  item: NavItem;
  onNavigate: (r: RouteName) => void;
  current: RouteName;
  firstLinkRef?: React.RefObject<HTMLAnchorElement>;
}

function DrawerItem({ item, onNavigate, current, firstLinkRef }: DrawerItemProps) {
  const [expanded, setExpanded] = useState(false);
  const isActive = current === item.route;

  if (!item.children) {
    return (
      <a
        ref={firstLinkRef}
        href={routeHref(item.route)}
        onClick={(e) => {
          e.preventDefault();
          onNavigate(item.route);
        }}
        className={`block min-h-[48px] flex items-center font-body font-semibold text-[1.0625rem] transition-colors ${
          isActive ? 'text-[var(--color-accent-tertiary)]' : 'text-[var(--color-ink)] hover:text-[var(--color-accent-tertiary)]'
        }`}
      >
        {item.label}
      </a>
    );
  }
  return (
    <div>
      <button
        type="button"
        className={`w-full min-h-[48px] flex items-center justify-between font-body font-semibold text-[1.0625rem] transition-colors ${
          isActive ? 'text-[var(--color-accent-tertiary)]' : 'text-[var(--color-ink)] hover:text-[var(--color-accent-tertiary)]'
        }`}
        aria-expanded={expanded}
        onClick={() => setExpanded((v) => !v)}
      >
        <span>{item.label}</span>
        <ChevronDown
          size={18}
          strokeWidth={1.75}
          className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
        />
      </button>
      {expanded && (
        <div className="pb-2 pl-4 flex flex-col gap-0.5">
          {item.children.map((child) => (
            <a
              key={child.label}
              href={routeHref(child.route)}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(child.route);
              }}
              className="block min-h-[44px] py-2 flex items-center text-[0.9375rem] text-[var(--color-ink-muted)] hover:text-[var(--color-accent-tertiary)] transition-colors"
            >
              <span className="text-[var(--color-accent-tertiary)] mr-2">·</span>
              {child.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMounted, setDrawerMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const hamburgerRef = useRef<HTMLButtonElement | null>(null);
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const firstLinkRef = useRef<HTMLAnchorElement | null>(null);
  const { route, navigate } = useHashRoute();
  const { user, signOut } = useAuth();
  const { theme, toggle } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!drawerOpen) {
      setDrawerMounted(false);
      return;
    }
    setDrawerMounted(true);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const t = window.setTimeout(() => firstLinkRef.current?.focus(), 120);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.clearTimeout(t);
    };
  }, [drawerOpen]);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDrawerOpen(false);
        hamburgerRef.current?.focus();
        return;
      }
      if (e.key === 'Tab' && drawerRef.current) {
        const focusables = drawerRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [drawerOpen]);

  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const handleNavigate = useCallback(
    (r: RouteName) => {
      navigate(r);
      setDrawerOpen(false);
    },
    [navigate]
  );

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[rgba(239,230,211,0.92)] dark:bg-[rgba(26,24,20,0.92)] backdrop-blur-md border-b border-[var(--color-border)]'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <nav
          className="mx-auto max-w-container flex items-center justify-between gap-4 px-6 sm:px-12 lg:px-20 h-16 lg:h-[72px]"
          aria-label="Primary"
        >
          <a
            href={routeHref('home')}
            onClick={(e) => {
              e.preventDefault();
              navigate('home');
            }}
            className="shrink-0"
            aria-label="Mach home"
          >
            <Logo size={22} />
          </a>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-6">
            {NAV.map((item) =>
              item.children ? (
                <DesktopDropdown key={item.label} item={item} current={route} onNavigate={handleNavigate} />
              ) : (
                <a
                  key={item.label}
                  href={routeHref(item.route)}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(item.route);
                  }}
                  className={`nav-underline font-body font-semibold transition-colors py-1 ${
                    route === item.route ? 'text-[var(--color-accent-tertiary)]' : 'text-[var(--color-ink)] hover:text-[var(--color-accent-tertiary)]'
                  }`}
                >
                  {item.label}
                </a>
              )
            )}
          </div>

          {/* Right cluster */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={toggle}
              className="inline-flex items-center justify-center h-9 w-9 rounded-radius-sm text-[var(--color-ink)] hover:bg-[rgba(46,42,36,0.06)] dark:hover:bg-[rgba(239,230,211,0.08)] transition-colors"
              aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
              title={theme === 'light' ? 'Dark mode' : 'Light mode'}
            >
              {theme === 'light' ? <Moon size={18} strokeWidth={1.75} /> : <Sun size={18} strokeWidth={1.75} />}
            </button>
            {user ? (
              <>
                <a
                  href={routeHref('dashboard')}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('dashboard');
                  }}
                  className="hidden lg:inline-flex items-center gap-1.5 font-body font-semibold text-[var(--color-ink)] hover:text-[var(--color-accent-tertiary)] transition-colors"
                >
                  <LayoutDashboard size={16} strokeWidth={1.5} />
                  Dashboard
                </a>
                <span className="hidden lg:inline-flex items-center gap-1.5 font-body font-semibold text-[var(--color-ink-muted)]">
                  <UserCircle size={16} strokeWidth={1.5} className="text-[var(--color-accent-tertiary)]" />
                  {user.name}
                </span>
                <button
                  type="button"
                  onClick={() => { void signOut(); }}
                  className="hidden lg:inline-flex items-center gap-1.5 font-body font-semibold text-[var(--color-ink-muted)] hover:text-[var(--color-accent-primary)] transition-colors"
                >
                  <LogOut size={16} strokeWidth={1.75} />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <a
                  href={routeHref('signin')}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('signin');
                  }}
                  className="hidden lg:inline-flex items-center gap-1.5 font-body font-semibold text-[var(--color-ink)] hover:text-[var(--color-accent-tertiary)] transition-colors"
                >
                  <LogIn size={16} strokeWidth={1.75} />
                  Sign In
                </a>
                <LinkButton
                  href={routeHref('signup')}
                  variant="primary"
                  size="md"
                  icon={ArrowRight}
                  className="hidden sm:inline-flex"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('signup');
                  }}
                >
                  Get Started
                </LinkButton>
              </>
            )}
            <button
              ref={hamburgerRef}
              type="button"
              className="lg:hidden inline-flex items-center justify-center h-10 w-10 rounded-radius-sm text-[var(--color-ink)] hover:bg-[rgba(46,42,36,0.05)] transition-colors"
              aria-expanded={drawerOpen}
              aria-controls="mobile-nav-drawer"
              aria-label="Toggle menu"
              onClick={() => setDrawerOpen((v) => !v)}
            >
              {drawerOpen ? <X size={22} strokeWidth={1.75} /> : <Menu size={22} strokeWidth={1.75} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Drawer + scrim */}
      {drawerOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" aria-hidden={false}>
          <div
            className="scrim-enter absolute inset-0 bg-[rgba(46,42,36,0.4)]"
            onClick={closeDrawer}
          />
          <div
            id="mobile-nav-drawer"
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            className={`drawer-enter absolute top-0 h-full bg-[var(--color-bg)] shadow-lg flex flex-col ${
              isMobile ? 'inset-0' : 'right-0 w-[360px]'
            }`}
            style={{
              transform: isMobile ? 'none' : drawerMounted ? 'translateX(0)' : 'translateX(100%)',
            }}
          >
            <div className="flex items-center justify-between px-6 h-16 border-b border-[var(--color-border)] shrink-0">
              <Logo size={22} />
              <button
                type="button"
                onClick={closeDrawer}
                className="inline-flex items-center justify-center h-10 w-10 rounded-radius-sm text-[var(--color-ink)] hover:bg-[rgba(46,42,36,0.05)] transition-colors"
                aria-label="Close menu"
              >
                <X size={22} strokeWidth={1.75} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-1">
              {NAV.map((item, i) => (
                <DrawerItem
                  key={item.label}
                  item={item}
                  current={route}
                  onNavigate={handleNavigate}
                  firstLinkRef={i === 0 ? firstLinkRef : undefined}
                />
              ))}

              {user && (
                <a
                  href={routeHref('dashboard')}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigate('dashboard');
                  }}
                  className="block min-h-[48px] flex items-center font-body font-semibold text-[1.0625rem] text-[var(--color-ink)] hover:text-[var(--color-accent-tertiary)] transition-colors"
                >
                  Dashboard
                </a>
              )}

              <div className="h-px bg-[var(--color-border)] my-4" />

              <button
                type="button"
                onClick={toggle}
                className="inline-flex items-center gap-2.5 min-h-[48px] font-body font-semibold text-[1.0625rem] text-[var(--color-ink)] hover:text-[var(--color-accent-tertiary)] transition-colors"
              >
                {theme === 'light' ? <Moon size={20} strokeWidth={1.75} /> : <Sun size={20} strokeWidth={1.75} />}
                {theme === 'light' ? 'Dark mode' : 'Light mode'}
              </button>

              <div className="flex flex-col gap-3 mt-4">
                {user ? (
                  <>
                    <div className="flex items-center gap-2 px-4 py-3 text-[var(--color-ink)] font-body font-semibold">
                      <UserCircle size={18} strokeWidth={1.5} className="text-[var(--color-accent-tertiary)]" />
                      {user.name}
                    </div>
                    <Button
                      variant="secondary"
                      size="lg"
                      icon={LogOut}
                      iconPosition="left"
                      className="w-full"
                      onClick={() => {
                        void signOut();
                        setDrawerOpen(false);
                      }}
                    >
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="secondary"
                      size="lg"
                      icon={LogIn}
                      iconPosition="left"
                      className="w-full"
                      onClick={() => handleNavigate('signin')}
                    >
                      Sign In
                    </Button>
                    <LinkButton
                      href={routeHref('signup')}
                      variant="primary"
                      size="lg"
                      icon={ArrowRight}
                      className="w-full"
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavigate('signup');
                      }}
                    >
                      Get Started
                    </LinkButton>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
