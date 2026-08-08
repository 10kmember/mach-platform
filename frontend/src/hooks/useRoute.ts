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
  | 'ops-cathedral'
  | 'signin'
  | 'signup';

const PATH_TO_ROUTE: Record<string, RouteName> = {
  '/': 'home',
  '/home': 'home',
  '/product': 'product',
  '/agents': 'agents',
  '/skills': 'skills',
  '/pricing': 'pricing',
  '/about': 'about',
  '/resources': 'resources',
  '/skills-library': 'skills-library',
  '/compare-plans': 'compare-plans',
  '/agent-catalog': 'agent-catalog',
  '/use-cases': 'use-cases',
  '/platform': 'platform',
  '/how-it-works': 'how-it-works',
  '/security': 'security',
  '/api-reference': 'api-reference',
  '/architecture': 'architecture',
  '/dashboard': 'dashboard',
  '/ops-cathedral': 'ops-cathedral',
  '/signin': 'signin',
  '/signup': 'signup',
};

const ROUTE_TO_PATH: Record<RouteName, string> = {
  home: '/',
  product: '/product',
  agents: '/agents',
  skills: '/skills',
  pricing: '/pricing',
  about: '/about',
  resources: '/resources',
  'skills-library': '/skills-library',
  'compare-plans': '/compare-plans',
  'agent-catalog': '/agent-catalog',
  'use-cases': '/use-cases',
  platform: '/platform',
  'how-it-works': '/how-it-works',
  security: '/security',
  'api-reference': '/api-reference',
  architecture: '/architecture',
  dashboard: '/dashboard',
  'ops-cathedral': '/ops-cathedral',
  signin: '/signin',
  signup: '/signup',
};

const NAV_EVENT = 'mach:navigate';

function parsePath(): RouteName {
  // Legacy hash links (#/pricing) — transparently upgrade to real paths.
  const hash = window.location.hash;
  if (hash.startsWith('#/')) {
    const legacy = hash.split('?')[0];
    const path = legacy === '#/' ? '/' : legacy.slice(1);
    window.history.replaceState(null, '', path);
    return PATH_TO_ROUTE[path] ?? 'home';
  }
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  return PATH_TO_ROUTE[path] ?? 'home';
}

export function useRoute() {
  const [route, setRoute] = useState<RouteName>(() =>
    typeof window === 'undefined' ? 'home' : parsePath()
  );

  useEffect(() => {
    const onChange = () => {
      setRoute(parsePath());
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    };
    window.addEventListener('popstate', onChange);
    window.addEventListener(NAV_EVENT, onChange);
    return () => {
      window.removeEventListener('popstate', onChange);
      window.removeEventListener(NAV_EVENT, onChange);
    };
  }, []);

  const navigate = useCallback((to: RouteName) => {
    const path = ROUTE_TO_PATH[to];
    if (window.location.pathname === path) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.history.pushState(null, '', path);
      window.dispatchEvent(new Event(NAV_EVENT));
    }
  }, []);

  return { route, navigate };
}

export function routeHref(route: RouteName): string {
  return ROUTE_TO_PATH[route];
}

/** Programmatic navigation to a raw internal path (e.g. from link clicks). */
export function navigatePath(path: string) {
  window.history.pushState(null, '', path);
  window.dispatchEvent(new Event(NAV_EVENT));
}
