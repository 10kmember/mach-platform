import { Plug, type LucideIcon } from 'lucide-react';
import { Reveal } from './Reveal';

interface Connector {
  name: string;
  category: string;
  icon: LucideIcon;
  color: string;
}

import {
  Mail,
  FileText,
  Calendar,
  Sheet,
  MessageSquare,
  ShoppingCart,
  Palette,
  Shield,
  Phone,
  Send,
  Github,
  NotebookPen,
  Box,
  MessagesSquare,
  CheckSquare,
  GitBranch,
  Trello,
  Globe,
  Briefcase,
  Database,
  FileCode,
  Cloud,
  Bell,
} from 'lucide-react';

const CONNECTORS: Connector[] = [
  { name: 'Gmail', category: 'Email', icon: Mail, color: '#EA4335' },
  { name: 'Google Docs', category: 'Docs', icon: FileText, color: '#4285F4' },
  { name: 'Google Calendar', category: 'Calendar', icon: Calendar, color: '#34A853' },
  { name: 'Google Sheets', category: 'Sheets', icon: Sheet, color: '#34A853' },
  { name: 'Slack', category: 'Chat', icon: MessageSquare, color: '#4A154B' },
  { name: 'Shopify', category: 'Commerce', icon: ShoppingCart, color: '#95BF47' },
  { name: 'Canva', category: 'Design', icon: Palette, color: '#00C4CC' },
  { name: 'Salesforce', category: 'CRM', icon: Shield, color: '#00A1E0' },
  { name: 'WhatsApp', category: 'Chat', icon: Phone, color: '#25D366' },
  { name: 'Telegram', category: 'Chat', icon: Send, color: '#0088CC' },
  { name: 'GitHub', category: 'Code', icon: Github, color: '#181717' },
  { name: 'Notion', category: 'Docs', icon: NotebookPen, color: '#000000' },
  { name: 'Box', category: 'Storage', icon: Box, color: '#0061D5' },
  { name: 'Discord', category: 'Chat', icon: MessagesSquare, color: '#5865F2' },
  { name: 'ClickUp', category: 'PM', icon: CheckSquare, color: '#7B68EE' },
  { name: 'Jira', category: 'PM', icon: GitBranch, color: '#0052CC' },
  { name: 'Linear', category: 'PM', icon: GitBranch, color: '#5E6AD2' },
  { name: 'Trello', category: 'PM', icon: Trello, color: '#0079BF' },
  { name: 'Web', category: 'Browser', icon: Globe, color: '#2f6f6b' },
  { name: 'HubSpot', category: 'CRM', icon: Briefcase, color: '#FF7A59' },
  { name: 'Airtable', category: 'Database', icon: Database, color: '#FCB400' },
  { name: 'API', category: 'Custom', icon: FileCode, color: '#2e2a24' },
  { name: 'Webhooks', category: 'Custom', icon: Bell, color: '#d9a227' },
  { name: 'AWS S3', category: 'Storage', icon: Cloud, color: '#FF9900' },
];

export function Connectors() {
  return (
    <section className="py-10 lg:py-16">
      <div className="mx-auto max-w-container px-6 sm:px-12 lg:px-20">
        <Reveal>
          <div className="max-w-[48ch] mb-10">
            <span className="eyebrow text-[var(--color-accent-tertiary)]">Connectors</span>
            <h2 className="text-h2 text-[var(--color-ink)] mt-3">
              Connectors for <span className="font-display italic font-normal text-[var(--color-accent-primary)]">real work</span>.
            </h2>
            <p className="text-body text-[var(--color-ink-muted)] mt-3">
              Mach agents pull context from your tools and bring finished work back where your team already operates. No exports, no copy-pasting, no context switching. Twenty-four integrations and counting.
            </p>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
            {CONNECTORS.map((connector, i) => (
              <div
                key={connector.name}
                className="group flex items-center gap-3 rounded-radius-md bg-[var(--color-bg-raised)] border border-[var(--color-border)] p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                style={{ animationDelay: `${i * 20}ms` }}
              >
                <div
                  className="flex items-center justify-center h-10 w-10 rounded-radius-sm shrink-0 transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${connector.color}15` }}
                >
                  <connector.icon
                    size={20}
                    strokeWidth={1.5}
                    style={{ color: connector.color }}
                  />
                </div>
                <div className="min-w-0">
                  <div className="font-body font-semibold text-[0.9375rem] text-[var(--color-ink)] truncate">
                    {connector.name}
                  </div>
                  <div className="text-mono-label text-[0.55rem] text-[var(--color-ink-muted)]">
                    {connector.category}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={160}>
          <div className="mt-8 flex items-center gap-3 text-[var(--color-ink-muted)]">
            <Plug size={18} strokeWidth={1.5} className="text-[var(--color-accent-tertiary)]" />
            <span className="text-[0.9375rem]">
              Don't see your tool? Build a custom connector with our API or request an integration.
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
