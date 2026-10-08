'use client';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { login } from '@/actions/auth';
import { loginSchema } from '@/lib/validation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
export function LoginForm() {
  const router = useRouter(); const [pending, startTransition] = useTransition(); const [message, setMessage] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm<{ identifier: string; password: string }>({ resolver: zodResolver(loginSchema) });
  return <form noValidate onSubmit={handleSubmit(values => {
    const form = new FormData(); form.set('identifier', values.identifier); form.set('password', values.password);
    startTransition(async () => { const result = await login(form); if (result.ok) { router.push('/'); router.refresh(); } else setMessage(result.message); });
  })} className="space-y-4"><div><label className="field-label" htmlFor="identifier">Username, NIP, atau NIS</label><Input id="identifier" type="text" placeholder="Masukkan identitas akun" autoComplete="username" aria-invalid={!!errors.identifier} aria-describedby={errors.identifier ? 'identifier-error' : undefined} {...register('identifier')}/>{errors.identifier && <p id="identifier-error" className="mt-1 text-xs text-destructive">{errors.identifier.message}</p>}</div><div><label className="field-label" htmlFor="password">Password</label><Input id="password" type="password" autoComplete="current-password" aria-invalid={!!errors.password} aria-describedby={errors.password ? 'password-error' : undefined} {...register('password')}/>{errors.password && <p id="password-error" className="mt-1 text-xs text-destructive">{errors.password.message}</p>}</div>{message && <p role="alert" className="feedback-error rounded-lg p-3 text-sm">{message}</p>}<Button type="submit" className="w-full" disabled={pending}>{pending ? 'Masuk...' : 'Masuk'}</Button></form>;
}
