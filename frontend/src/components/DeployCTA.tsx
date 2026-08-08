import {
  ArrowRight,
  MousePointerClick,
  RefreshCw,
  Save,
  RadioTower,
  Headphones,
  type LucideIcon,
} from 'lucide-react';
import { LinkButton } from './Button';
import { Reveal } from './Reveal';
import { routeHref } from '../hooks/useRoute';

interface Bullet {
  icon: LucideIcon;
  label: string;
}

const BULLETS: Bullet[] = [
  { icon: MousePointerClick, label: 'One click deploy' },
  { icon: RefreshCw, label: 'Auto updates' },
  { icon: Save, label: 'Daily backups' },
  { icon: RadioTower, label: 'Always on' },
  { icon: Headphones, label: 'Real support' },
];

export function DeployCTA() {
  return (
    <section id="deploy" className="py-16 lg:py-24">
      <div className="mx-auto max-w-container px-6 sm:px-12 lg:px-20">
        <Reveal>
          <div className="relative overflow-hidden rounded-radius-lg bg-[var(--color-ink)] px-6 py-14 sm:px-12 lg:px-20 lg:py-24 text-center">
            {/* subtle signal glow */}
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(50% 60% at 50% 0%, rgba(217,162,39,0.12), transparent 70%), radial-gradient(40% 50% at 80% 100%, rgba(47,111,107,0.14), transparent 70%)',
              }}
            />

            <div className="relative flex flex-col items-center gap-6">
              <h2 className="text-h2 text-[var(--color-bg)] max-w-[20ch]">
                Ready to put an agent to work?
              </h2>
              <p className="text-lead text-[rgba(239,230,211,0.8)] max-w-[52ch]">
                Get a managed, always on agent instance without the infrastructure headache.
              </p>

              <LinkButton
                href={routeHref('pricing')}
                variant="highlight"
                size="lg"
                icon={ArrowRight}
                className="mt-2"
              >
                Deploy on Mach
              </LinkButton>

              <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 max-w-[60ch]">
                {BULLETS.map((b) => (
                  <li
                    key={b.label}
                    className="inline-flex items-center gap-2 text-[rgba(239,230,211,0.85)]"
                  >
                    <b.icon size={16} strokeWidth={1.5} className="text-[var(--color-highlight)]" />
                    <span className="text-caption">{b.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
