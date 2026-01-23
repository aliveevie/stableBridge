/**
 * Toast renderer for `src/hooks/use-toast.ts`.
 */

'use client';

import * as React from 'react';
import { useToast } from '@/hooks/use-toast';
import { Toast, ToastClose, ToastDescription, ToastTitle } from '@/components/ui/toast';

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex w-full max-w-sm flex-col gap-2">
      {toasts.map(t => (
        <Toast
          key={t.id}
          open={t.open}
          onOpenChange={open => {
            if (!open) dismiss(t.id);
          }}
          variant={(t as any).variant}
        >
          <div className="relative pr-10">
            {t.title && <ToastTitle>{t.title}</ToastTitle>}
            {t.description && <ToastDescription>{t.description}</ToastDescription>}
            {(t as any).action}
            <ToastClose onClick={() => dismiss(t.id)} />
          </div>
        </Toast>
      ))}
    </div>
  );
}

