import { Terminal, Send, CalendarClock, type LucideIcon } from 'lucide-react';
import { Reveal } from './Reveal';

interface Feature {
  icon: LucideIcon;
  title: string;
  body: string;
}

const FEATURES: Feature[] = [
  {
    icon: Terminal,
    title: 'More than a chat window',
    body: "Mach agents don't just answer. They browse, write code, draft documents, and hand back finished work you can actually use.",
  },
  {
    icon: Send,
    title: 'Meet it where you are',
    body: 'Reach your agent through email, Telegram, WhatsApp, or the browser, and connect it to the repos, files, and tools your workflow already runs on.',
  },
  {
    icon: CalendarClock,
    title: 'Working while you\u2019re not',
    body: 'Set a goal once. Your agent keeps a schedule: daily reports, price checks, inbox triage. It only interrupts you when a real decision is needed.',
  },
];

export function Features() {
  return (
    <section id="use-cases" className="py-16 lg:py-24">
      <div className="mx-auto max-w-container px-6 sm:px-12 lg:px-20">
        <Reveal>
          <div className="max-w-[42ch] mb-10 lg:mb-14">
            <span className="eyebrow text-[var(--color-accent-tertiary)]">What Mach does</span>
            <h2 className="text-h2 text-[var(--color-ink)] mt-3">
              An agent that pulls its weight
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 80}>
              <article className="group h-full rounded-radius-md bg-[var(--color-bg-raised)] border border-[var(--color-border)] p-6 lg:p-8 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-1">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] mb-5">
                  <f.icon
                    size={22}
                    strokeWidth={1.5}
                    className="text-[var(--color-accent-tertiary)]"
                  />
                </div>
                <h3 className="text-h3 text-[var(--color-ink)] mb-3">{f.title}</h3>
                <p className="text-body text-[var(--color-ink-muted)]">{f.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
