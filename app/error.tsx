'use client';
export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return <div className="panel mx-auto max-w-lg p-10 text-center"><h1 className="text-xl font-bold">Halaman gagal dimuat</h1><p className="mt-2 text-sm text-muted-foreground">Terjadi kesalahan saat mengambil data. Coba muat ulang halaman.</p><button className="mt-6 min-h-10 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring" onClick={reset}>Coba lagi</button></div>;
}
