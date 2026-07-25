import { useEffect, useState, useCallback } from 'react';

export type RouteName =
  | 'home'
  | 'product'
  | 'agents'
  | 'skills'
  | 'pricing'
  | 'about'
  | 'resources'
  | 'skills-library'
  | 'compare-plans'
  | 'agent-catalog'
  | 'use-cases'
  | 'platform'
  | 'how-it-works'
  | 'security'
  | 'api-reference'
  | 'architecture'
  | 'dashboard'
  | 'operator'
  | 'signin'
  | 'signup';

const ROUTES: Record<string, RouteName> = {
  '#/': 'home',
  '#/home': 'home',
  '#/product': 'product',
  '#/agents': 'agents',
  '#/skills': 'skills',
  '#/pricing': 'pricing',
  '#/about': 'about',
  '#/resources': 'resources',
  '#/skills-library': 'skills-library',
  '#/compare-plans': 'compare-plans',
  '#/agent-catalog': 'agent-catalog',
  '#/use-cases': 'use-cases',
  '#/platform': 'platform',
  '#/how-it-works': 'how-it-works',
  '#/security': 'security',
  '#/api-reference': 'api-reference',
  '#/architecture': 'architecture',
  '#/dashboard': 'dashboard',
  '#/operator': 'operator',
  '#/signin': 'signin',
  '#/signup': 'signup',
};

function parseHash(): RouteName {
  const hash = window.location.hash.split('?')[0] || '#/';
  return ROUTES[hash] ?? 'home';
}

export function useHashRoute() {
  const [route, setRoute] = useState<RouteName>(() =>
    typeof window === 'undefined' ? 'home' : parseHash()
  );

  useEffect(() => {
    const onChange = () => {
      setRoute(parseHash());
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  const navigate = useCallback((to: RouteName) => {
    const hash = to === 'home' ? '#/' : `#/${to}`;
    if (window.location.hash === hash) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.location.hash = hash;
    }
  }, []);

  return { route, navigate };
}

export function routeHref(route: RouteName): string {
  return route === 'home' ? '#/' : `#/${route}`;
}
