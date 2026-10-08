export default function Loading() {
  return <div className="space-y-5" role="status" aria-label="Memuat halaman"><div className="h-8 w-48 animate-pulse rounded-lg bg-muted"/><div className="panel h-64 animate-pulse bg-muted"/><span className="sr-only">Memuat halaman</span></div>;
}
