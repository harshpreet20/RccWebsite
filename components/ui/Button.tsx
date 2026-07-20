import { type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'text';

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'inline-flex items-center justify-center gap-2 rounded-full bg-gold-bright px-6 py-3 font-body text-sm font-semibold uppercase tracking-wide text-black transition-colors hover:bg-gold',
  secondary:
    'inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-transparent px-6 py-3 font-body text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:border-teal hover:text-teal',
  text: 'inline-flex items-center gap-1 font-body text-sm font-semibold uppercase tracking-wide text-teal transition-all hover:gap-2',
};

function ArrowIcon({ variant }: { variant: ButtonVariant }) {
  return (
    <ArrowRight
      className={variant === 'text' ? 'h-4 w-4' : 'h-4 w-4'}
      aria-hidden="true"
    />
  );
}

type CommonProps = {
  variant?: ButtonVariant;
  arrow?: boolean;
  children: ReactNode;
  className?: string;
};

type ButtonProps = CommonProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'>;

export function Button({
  variant = 'primary',
  arrow = true,
  children,
  className = '',
  ...rest
}: ButtonProps) {
  return (
    <button className={`${VARIANT_CLASSES[variant]} ${className}`} {...rest}>
      <span>{children}</span>
      {arrow && <ArrowIcon variant={variant} />}
    </button>
  );
}

type LinkButtonProps = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className'> & { href: string };

export function LinkButton({
  variant = 'primary',
  arrow = true,
  children,
  className = '',
  href,
  ...rest
}: LinkButtonProps) {
  const isExternal = /^https?:\/\//.test(href) || rest.target === '_blank';
  const content = (
    <>
      <span>{children}</span>
      {arrow && <ArrowIcon variant={variant} />}
    </>
  );

  if (isExternal) {
    return (
      <a
        href={href}
        className={`${VARIANT_CLASSES[variant]} ${className}`}
        rel={rest.rel ?? 'noopener noreferrer'}
        {...rest}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={`${VARIANT_CLASSES[variant]} ${className}`} {...rest}>
      {content}
    </Link>
  );
}
