import { BookOpen, ArrowRight, FileText, Video, Code2, HelpCircle, Newspaper, type LucideIcon } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { Reveal } from '../components/Reveal';
import { PulseRings } from '../components/artifacts/PulseRings';

interface Resource {
  icon: LucideIcon;
  title: string;
  description: string;
  type: string;
  href: string;
}

const RESOURCES: Resource[] = [
  {
    icon: FileText,
    title: 'Getting Started Guide',
    description: 'Everything you need to deploy your first agent in under five minutes. Step-by-step walkthroughs from sign-up to first skill.',
    type: 'Guide',
    href: '#/how-it-works',
  },
  {
    icon: Code2,
    title: 'API Reference',
    description: 'Complete REST API documentation with code samples in Python, JavaScript, Go, and curl. Webhooks, authentication, and SDKs.',
    type: 'Docs',
    href: '#/api-reference',
  },
  {
    icon: Video,
    title: 'Video Tutorials',
    description: 'Watch over-the-shoulder walkthroughs of real agent deployments, skill configurations, and channel integrations.',
    type: 'Videos',
    href: '#/use-cases',
  },
  {
    icon: Newspaper,
    title: 'Changelog',
    description: 'Every release, every improvement, every fix. Subscribe to stay current as we ship new agents, skills, and platform features.',
    type: 'Updates',
    href: '#/platform',
  },
  {
    icon: HelpCircle,
    title: 'Help Center',
    description: 'Searchable knowledge base with answers to common questions, troubleshooting guides, and best practices for running agents in production.',
    type: 'Support',
    href: '#/about',
  },
  {
    icon: BookOpen,
    title: 'Skills Library',
    description: 'Browse the full catalog of pre-built skills. Each one is tested, monitored, and ready to drop onto any agent.',
    type: 'Library',
    href: '#/skills-library',
  },
];

export function ResourcesPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Resources"
        eyebrowIcon={BookOpen}
        title={
          <>
            Everything you need to <span className="font-display italic font-normal text-[var(--color-accent-primary)]">go live</span>.
          </>
        }
        subtitle="Guides, docs, tutorials, and best practices for running agents on Mach. Whether you are deploying your first agent or scaling across an enterprise, the resources here will get you there faster."
        artifact={<PulseRings />}
      />

      <section className="py-10 lg:py-16">
        <div className="mx-auto max-w-container px-6 sm:px-12 lg:px-20">
          <Reveal>
            <div className="max-w-[42ch] mb-8">
              <span className="eyebrow text-[var(--color-accent-tertiary)]">Browse</span>
              <h2 className="text-h2 text-[var(--color-ink)] mt-3">Resource library</h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {RESOURCES.map((resource, i) => (
              <Reveal key={resource.title} delay={i * 60}>
                <a
                  href={resource.href}
                  className="group block h-full rounded-radius-md bg-[var(--color-bg-raised)] border border-[var(--color-border)] p-6 lg:p-8 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] shrink-0">
                      <resource.icon size={22} strokeWidth={1.5} className="text-[var(--color-accent-tertiary)]" />
                    </div>
                    <span className="text-mono-label text-[0.65rem] px-2.5 py-1 rounded-full bg-[rgba(47,111,107,0.1)] text-[var(--color-accent-tertiary)]">
                      {resource.type}
                    </span>
                  </div>
                  <h3 className="text-h3 text-[var(--color-ink)] mb-3">{resource.title}</h3>
                  <p className="text-body text-[var(--color-ink-muted)] mb-5">{resource.description}</p>
                  <span className="inline-flex items-center gap-1.5 font-body font-semibold text-[0.9375rem] text-[var(--color-accent-tertiary)] group-hover:gap-2.5 transition-all">
                    Explore
                    <ArrowRight size={16} strokeWidth={1.75} />
                  </span>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
