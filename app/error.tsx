'use client';
export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return <div className="panel mx-auto max-w-lg p-10 text-center"><h1 className="text-xl font-bold">Halaman gagal dimuat</h1><p className="mt-2 text-sm text-slate-500">Terjadi kesalahan saat mengambil data. Coba muat ulang halaman.</p><button className="btn btn-primary mt-6" onClick={reset}>Coba lagi</button></div>;
}
