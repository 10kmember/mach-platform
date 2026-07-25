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
import { useHashRoute } from './hooks/useHashRoute';
import { AuthProvider, useAuth } from './hooks/useAuth';

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
  const { route } = useHashRoute();
  const { user, initialLoading } = useAuth();

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
  const { route } = useHashRoute();
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
  return (
    <AuthProvider>
      <AppChrome />
    </AuthProvider>
  );
}
