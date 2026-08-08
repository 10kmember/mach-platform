import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { DeployCTA } from './components/DeployCTA';
import { Connectors } from './components/Connectors';
import { Footer } from './components/Footer';
import { AgentsPage } from './pages/AgentsPage';
import { SkillsPage } from './pages/SkillsPage';
import { PricingPage } from './pages/PricingPage';
import { AboutPage } from './pages/AboutPage';
import { SignInPage } from './pages/SignInPage';
import { SignUpPage } from './pages/SignUpPage';
import { ProductPage } from './pages/ProductPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { SkillsLibraryPage } from './pages/SkillsLibraryPage';
import { ComparePlansPage } from './pages/ComparePlansPage';
import { AgentCatalogPage } from './pages/AgentCatalogPage';
import { UseCasesPage } from './pages/UseCasesPage';
import { PlatformPage } from './pages/PlatformPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { SecurityPage } from './pages/SecurityPage';
import { ApiReferencePage } from './pages/ApiReferencePage';
import { ArchitecturePage } from './pages/ArchitecturePage';
import { DashboardPage } from './pages/DashboardPage';
import { OperatorPage } from './pages/OperatorPage';
import { AppShell } from './components/AppShell';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useRoute, routeHref, navigatePath, type RouteName } from './hooks/useRoute';
import { AuthProvider, useAuth } from './hooks/useAuth';

// ── Per-route SEO ──────────────────────────────────────────────────────
const SEO: Record<RouteName, { title: string; desc: string; noindex?: boolean }> = {
  home: {
    title: 'Mach — Your agents, always on.',
    desc: 'Mach is the calm, managed home for your AI agents — deploy in seconds, run them around the clock, skip the infrastructure babysitting.',
  },
  product: {
    title: 'Product — Mach',
    desc: 'A managed home for AI agents: deployment, monitoring, schedules, and channels like Email, Telegram, WhatsApp, and API — all handled.',
  },
  platform: {
    title: 'Platform — Mach',
    desc: 'The Mach platform: approval-gated agent hosting with real infrastructure, daily backups, and human oversight on every deployment.',
  },
  'how-it-works': {
    title: 'How it works — Mach',
    desc: 'From signup to a running agent in under a minute: pick an agent, connect channels, attach skills, and let it work around the clock.',
  },
  agents: {
    title: 'Agents — Mach',
    desc: 'Hosted AI agents that browse, write code, draft documents, and hand back finished work — running 24/7 on Mach infrastructure.',
  },
  'agent-catalog': {
    title: 'Agent Catalog — Mach',
    desc: 'Browse ready-to-deploy hosted agents. Every instance is approval-gated, monitored, and backed up daily.',
  },
  skills: {
    title: 'Skills — Mach',
    desc: 'Packaged, repeatable workflows your agent runs on a schedule: inbox triage, price watches, daily briefs, repo sentries.',
  },
  'skills-library': {
    title: 'Skills Library — Mach',
    desc: 'The Mach skills library: attach scheduled, recurring tasks to your agent and let it work while you sleep.',
  },
  'use-cases': {
    title: 'Use Cases — Mach',
    desc: 'What Mach agents do all day: research, reporting, inbox triage, monitoring, drafting, and operations — automatically.',
  },
  pricing: {
    title: 'Pricing — Mach',
    desc: 'Personal and corporate agent-hosting plans. One-click deploy, daily backups, always on, real support.',
  },
  'compare-plans': {
    title: 'Compare Plans — Mach',
    desc: 'Side-by-side comparison of Mach personal and corporate agent-hosting plans: agents, channels, SSO, audit logs, and SLAs.',
  },
  resources: {
    title: 'Resources — Mach',
    desc: 'Guides, documentation, and references for running hosted AI agents on Mach.',
  },
  'api-reference': {
    title: 'API Reference — Mach',
    desc: 'The Mach platform API: agents, skills, channels, and account management over a clean REST surface.',
  },
  architecture: {
    title: 'Architecture — Mach',
    desc: 'How Mach is built: FastAPI, PostgreSQL, systemd, and an approval-gated pipeline between signup and a running agent.',
  },
  security: {
    title: 'Security — Mach',
    desc: 'Mach security practices: Argon2 password hashing, encryption in transit, approval-gated provisioning, and least-privilege access.',
  },
  about: {
    title: 'About — Mach',
    desc: 'Mach builds calm, managed infrastructure for AI agents. Steady, simple, yours.',
  },
  signup: {
    title: 'Create your account — Mach',
    desc: 'Sign up for Mach and deploy your first always-on agent. Every account is reviewed by a human before activation.',
  },
  signin: {
    title: 'Sign in — Mach',
    desc: 'Sign in to your Mach console.',
    noindex: true,
  },
  dashboard: {
    title: 'Console — Mach',
    desc: 'Your Mach agent console.',
    noindex: true,
  },
  'ops-cathedral': {
    title: 'Operator — Mach',
    desc: 'Mach operator console.',
    noindex: true,
  },
};

function setMeta(name: string, content: string) {
  let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function useRouteSEO(route: RouteName) {
  useEffect(() => {
    const s = SEO[route] ?? SEO.home;
    document.title = s.title;
    setMeta('description', s.desc);
    setMeta('robots', s.noindex ? 'noindex,nofollow' : 'index,follow');
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = `https://machlabs.uk${routeHref(route)}`;
  }, [route]);
}

function HomePage() {
  return (
    <main>
      <Hero />
      <Features />
      <Connectors />
      <DeployCTA />
    </main>
  );
}

function AppRoutes() {
  const { route } = useRoute();
  const { user, initialLoading } = useAuth();
  useRouteSEO(route);

  // ── Authenticated console routes ─────────────────────────────────────
  // These render inside the AppShell — no public Navbar/Footer. Once a
  // client is in the platform, they're in the product, not the brochure.
  const isConsoleRoute = route === 'dashboard' || route === 'ops-cathedral';

  if (isConsoleRoute && !user && !initialLoading) {
    return <SignInPage />;
  }

  if (isConsoleRoute && initialLoading) {
    return (
      <main className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={32} className="animate-spin text-[var(--color-accent-tertiary)]" />
      </main>
    );
  }

  if (isConsoleRoute) {
    return (
      <AppShell active={route}>
        {route === 'ops-cathedral' ? <OperatorPage /> : <DashboardPage />}
      </AppShell>
    );
  }

  // ── Public marketing routes ──────────────────────────────────────────
  switch (route) {
    case 'home':
      return <HomePage />;
    case 'product':
      return <ProductPage />;
    case 'agents':
      return <AgentsPage />;
    case 'skills':
      return <SkillsPage />;
    case 'pricing':
      return <PricingPage />;
    case 'about':
      return <AboutPage />;
    case 'resources':
      return <ResourcesPage />;
    case 'skills-library':
      return <SkillsLibraryPage />;
    case 'compare-plans':
      return <ComparePlansPage />;
    case 'agent-catalog':
      return <AgentCatalogPage />;
    case 'use-cases':
      return <UseCasesPage />;
    case 'platform':
      return <PlatformPage />;
    case 'how-it-works':
      return <HowItWorksPage />;
    case 'security':
      return <SecurityPage />;
    case 'api-reference':
      return <ApiReferencePage />;
    case 'architecture':
      return <ArchitecturePage />;
    case 'signin':
      return <SignInPage />;
    case 'signup':
      return <SignUpPage />;
    default:
      return <HomePage />;
  }
}

function AppChrome() {
  const { route } = useRoute();
  const isConsoleRoute = route === 'dashboard' || route === 'ops-cathedral';

  if (isConsoleRoute) {
    // Console: AppShell owns all chrome — no public Navbar/Footer.
    return (
      <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-ink)] font-body antialiased">
        <AppRoutes />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-ink)] font-body antialiased">
      <Navbar />
      <AppRoutes />
      <Footer />
    </div>
  );
}

export default function App() {
  // Intercept internal <a href="/..."> clicks → SPA navigation (no reload).
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement).closest?.('a[href^="/"]') as HTMLAnchorElement | null;
      if (!a || a.target || a.hasAttribute('download')) return;
      const url = new URL(a.href, window.location.origin);
      if (url.origin !== window.location.origin) return;
      e.preventDefault();
      navigatePath(url.pathname + url.search);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  return (
    <AuthProvider>
      <AppChrome />
    </AuthProvider>
  );
}
