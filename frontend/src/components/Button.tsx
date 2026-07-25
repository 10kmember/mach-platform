import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'highlight';
type Size = 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: typeof ArrowRight;
  iconPosition?: 'left' | 'right';
  children: ReactNode;
}

const base =
  'inline-flex items-center justify-center gap-2 font-body font-semibold rounded-radius-sm transition-all duration-150 ease-out disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap';

const sizes: Record<Size, string> = {
  md: 'text-[0.9375rem] px-5 py-2.5',
  lg: 'text-[1rem] px-7 py-3.5',
};

const variants: Record<Variant, string> = {
  primary:
    'bg-[var(--color-accent-primary)] text-[var(--color-bg)] hover:bg-[var(--color-accent-primary-hover)] hover:scale-[1.02] shadow-sm',
  secondary:
    'bg-transparent text-[var(--color-ink)] border border-[var(--color-border)] hover:bg-[rgba(46,42,36,0.04)]',
  ghost: 'bg-transparent text-[var(--color-ink)] hover:bg-[rgba(46,42,36,0.04)]',
  highlight:
    'bg-[var(--color-highlight)] text-[var(--color-ink)] hover:brightness-95 hover:scale-[1.02] shadow-sm',
};

export function Button({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'right',
  children,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
      {Icon && iconPosition === 'left' && <Icon size={16} strokeWidth={1.75} className="shrink-0" />}
      <span>{children}</span>
      {Icon && iconPosition === 'right' && <Icon size={16} strokeWidth={1.75} className="shrink-0" />}
    </button>
  );
}

/**
 * Anchor-styled link that visually matches Button, used for href navigation.
 */
export function LinkButton({
  variant = 'primary',
  size = 'md',
  icon: Icon = ArrowRight,
  iconPosition = 'right',
  children,
  className = '',
  href = '#',
  onClick,
  ...props
}: {
  variant?: Variant;
  size?: Size;
  icon?: typeof ArrowRight;
  iconPosition?: 'left' | 'right';
  children: ReactNode;
  className?: string;
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon size={16} strokeWidth={1.75} className="shrink-0" />}
      <span>{children}</span>
      {Icon && iconPosition === 'right' && <Icon size={16} strokeWidth={1.75} className="shrink-0" />}
    </a>
  );
}
