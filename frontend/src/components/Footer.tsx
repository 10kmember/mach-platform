import { useState } from 'react';
import { ChevronDown, Mail } from 'lucide-react';
import { Logo } from './Logo';
import { routeHref, type RouteName } from '../hooks/useHashRoute';

interface FooterLink {
  label: string;
  route: RouteName;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

const COLUMNS: FooterColumn[] = [
  {
    title: 'Product',
    links: [
      { label: 'Product', route: 'product' },
      { label: 'Agents', route: 'agents' },
      { label: 'Skills', route: 'skills' },
      { label: 'Pricing', route: 'pricing' },
      { label: 'About', route: 'about' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Resources', route: 'resources' },
      { label: 'Skills Library', route: 'skills-library' },
      { label: 'Compare Plans', route: 'compare-plans' },
      { label: 'Agent Catalog', route: 'agent-catalog' },
      { label: 'Use Cases', route: 'use-cases' },
    ],
  },
  {
    title: 'Platform',
    links: [
      { label: 'Platform', route: 'platform' },
      { label: 'How It Works', route: 'how-it-works' },
      { label: 'Security & Compliance', route: 'security' },
      { label: 'API Reference', route: 'api-reference' },
      { label: 'Architecture', route: 'architecture' },
    ],
  },
];

function ColumnDesktop({ column }: { column: FooterColumn }) {
  return (
    <div>
      <h3 className="text-mono-label text-[0.75rem] text-[var(--color-ink-muted)] mb-4">
        {column.title}
      </h3>
      <ul className="flex flex-col gap-3">
        {column.links.map((link) => (
          <li key={link.label}>
            <a
              href={routeHref(link.route)}
              className="text-[0.9375rem] text-[var(--color-ink)] hover:text-[var(--color-accent-tertiary)] transition-colors"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ColumnMobile({ column }: { column: FooterColumn }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[var(--color-border)]">
      <button
        type="button"
        className="w-full flex items-center justify-between py-4 font-body font-semibold text-[var(--color-ink)]"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="text-mono-label text-[0.8rem]">{column.title}</span>
        <ChevronDown
          size={18}
          strokeWidth={1.75}
          className={`transition-transform duration-200 text-[var(--color-ink-muted)] ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <ul className="flex flex-col gap-3 pb-4">
          {column.links.map((link) => (
            <li key={link.label}>
              <a
                href={routeHref(link.route)}
                className="text-[0.9375rem] text-[var(--color-ink-muted)] hover:text-[var(--color-accent-tertiary)] transition-colors"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg)]">
      <div className="mx-auto max-w-container px-6 sm:px-12 lg:px-20 py-12 lg:py-16">
        {/* Desktop: brand + link columns + contact */}
        <div className="hidden sm:grid grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          <div className="max-w-[28ch]">
            <Logo size={24} />
            <p className="mt-4 font-display italic font-normal text-[1.125rem] leading-snug text-[var(--color-ink)]">
              MACH Labs. Set it once. It&rsquo;s already working.
            </p>
            <p className="mt-4 text-[0.875rem] text-[var(--color-ink-muted)] leading-relaxed">
              The managed home for AI agents. We handle the infrastructure, monitoring, and updates so your agents stay on, quietly, reliably, around the clock.
            </p>
          </div>
          {COLUMNS.map((col) => (
            <ColumnDesktop key={col.title} column={col} />
          ))}
          <div>
            <h3 className="text-mono-label text-[0.75rem] text-[var(--color-ink-muted)] mb-4">
              Contact
            </h3>
            <a
              href="mailto:hello@mach.ai"
              className="inline-flex items-center gap-2 text-[0.9375rem] text-[var(--color-ink)] hover:text-[var(--color-accent-tertiary)] transition-colors"
            >
              <Mail size={15} strokeWidth={1.5} className="text-[var(--color-accent-tertiary)] opacity-70" />
              hello@mach.ai
            </a>
            <p className="mt-4 text-[0.8125rem] text-[var(--color-ink-muted)] leading-relaxed">
              For enterprise inquiries, reach our solutions team at{' '}
              <a href="mailto:enterprise@mach.ai" className="text-[var(--color-accent-tertiary)] hover:underline">
                enterprise@mach.ai
              </a>
              .
            </p>
          </div>
        </div>

        {/* Mobile: brand + accordion + contact */}
        <div className="sm:hidden">
          <div className="max-w-[28ch] mb-6">
            <Logo size={24} />
            <p className="mt-4 font-display italic font-normal text-[1.125rem] leading-snug text-[var(--color-ink)]">
              MACH Labs. Set it once. It&rsquo;s already working.
            </p>
            <p className="mt-4 text-[0.875rem] text-[var(--color-ink-muted)] leading-relaxed">
              The managed home for AI agents. We handle the infrastructure, monitoring, and updates so your agents stay on, quietly, reliably, around the clock.
            </p>
          </div>
          {COLUMNS.map((col) => (
            <ColumnMobile key={col.title} column={col} />
          ))}
          <div className="py-4">
            <h3 className="text-mono-label text-[0.8rem] text-[var(--color-ink-muted)] mb-3">
              Contact
            </h3>
            <a
              href="mailto:hello@mach.ai"
              className="inline-flex items-center gap-2 text-[0.9375rem] text-[var(--color-ink)] hover:text-[var(--color-accent-tertiary)] transition-colors"
            >
              <Mail size={15} strokeWidth={1.5} className="text-[var(--color-accent-tertiary)] opacity-70" />
              hello@mach.ai
            </a>
            <p className="mt-3 text-[0.8125rem] text-[var(--color-ink-muted)] leading-relaxed">
              For enterprise inquiries, reach our solutions team at{' '}
              <a href="mailto:enterprise@mach.ai" className="text-[var(--color-accent-tertiary)] hover:underline">
                enterprise@mach.ai
              </a>
              .
            </p>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-10 lg:mt-14 pt-6 border-t border-[var(--color-border)]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-mono-label text-[0.7rem] text-[var(--color-ink-muted)]">
              &copy; 2026 MACH Labs. All rights reserved.
            </p>
            <p className="text-mono-label text-[0.7rem] text-[var(--color-ink-muted)]">
              SOC 2 Type II &middot; GDPR &middot; HIPAA-ready &middot; ISO 27001 aligned
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
