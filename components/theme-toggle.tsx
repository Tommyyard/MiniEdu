'use client';
import { useSyncExternalStore } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from '@gravity-ui/icons';
import { Button } from '@/components/ui/button';
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);
  return <Button variant="ghost" size="icon" aria-label="Ganti tema" title="Ganti tema" onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')} disabled={!mounted}>{mounted && resolvedTheme === 'dark' ? <Sun width={18} height={18}/> : <Moon width={18} height={18}/>}</Button>;
}
