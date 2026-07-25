import type { ReactNode, ElementType } from 'react';
import { useReveal } from '../hooks/useReveal';

interface RevealProps {
  children: ReactNode;
  /** Delay in ms before the reveal transition fires. */
  delay?: number;
  as?: ElementType;
  className?: string;
}

/**
 * Wrap children in a one-shot scroll fade-up. Stagger siblings by passing
 * incremental `delay` values (e.g. 0, 80, 160).
 */
export function Reveal({ children, delay = 0, as: Tag = 'div', className = '' }: RevealProps) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
