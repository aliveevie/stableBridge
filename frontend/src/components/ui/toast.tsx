/**
 * Minimal toast primitives used by `src/hooks/use-toast.ts`.
 *
 * This is intentionally lightweight (no Radix dependency) to keep the project
 * self-contained while still enabling basic toast rendering.
 */

'use client';

import * as React from 'react';

export type ToastActionElement = React.ReactElement;

export type ToastProps = React.HTMLAttributes<HTMLDivElement> & {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  variant?: 'default' | 'destructive';
};

export function Toast({
  open = true,
  onOpenChange,
  variant = 'default',
  className,
  ...props
}: ToastProps) {
  if (!open) return null;

  const base =
    'pointer-events-auto w-full max-w-sm rounded-xl border p-4 shadow-lg backdrop-blur bg-background/90';
  const variantClass =
    variant === 'destructive' ? 'border-red-500/40 bg-red-500/10' : 'border-border';

  return (
    <div
      role="status"
      aria-live="polite"
      className={[base, variantClass, className].filter(Boolean).join(' ')}
      {...props}
    />
  );
}

export function ToastTitle(props: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h5 className="mb-1 font-semibold" {...props} />;
}

export function ToastDescription(props: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className="text-sm text-muted-foreground" {...props} />;
}

export function ToastClose({
  onClick,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className="absolute right-2 top-2 rounded-md px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
      onClick={onClick}
      {...props}
    >
      Close
    </button>
  );
}

