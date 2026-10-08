'use client';
import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogClose = DialogPrimitive.Close;
function DialogContent({ className, children, ...props }: React.ComponentProps<typeof DialogPrimitive.Content>) {
  return <DialogPrimitive.Portal><DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/55"/><DialogPrimitive.Content className={cn('fixed left-1/2 top-1/2 z-50 max-h-[min(90vh,800px)] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl border border-border bg-card p-6 text-card-foreground shadow-xl', className)} {...props}>{children}<DialogPrimitive.Close className="absolute right-4 top-4 grid size-9 place-items-center rounded-md hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label="Tutup"><X size={18}/></DialogPrimitive.Close></DialogPrimitive.Content></DialogPrimitive.Portal>;
}
function DialogTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) { return <DialogPrimitive.Title className={cn('mb-5 text-lg font-semibold', className)} {...props}/>; }
export { Dialog, DialogTrigger, DialogClose, DialogContent, DialogTitle };
