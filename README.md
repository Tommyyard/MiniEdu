# MiniEdu

Sistem informasi sekolah internal dengan dashboard, data siswa dan guru, absensi, nilai, dan pengumuman. Project ini memakai Next.js App Router dan sengaja dijaga sederhana.

## Stack

- pnpm 12, Next.js 16.3.8, TypeScript, Tailwind CSS 4
- shadcn/ui (source komponen di `components/ui/`), Gravity UI Icons untuk ikon baru (beberapa ikon lama masih memakai `lucide-react`), React Hook Form, Zod
- Prisma 6 dan PostgreSQL (provider saat ini: Neon)
- `iron-session` untuk cookie sesi terenkripsi, `bcryptjs` untuk password
- `next-themes` untuk mode terang dan gelap
- SheetJS 0.20.3 untuk XLSX (tarball resmi yang dipin di `package.json` dan `pnpm-lock.yaml`)
- Zustand tersedia untuk kebutuhan state global berikutnya; data server dan state form saat ini tidak diduplikasi ke store

## Persyaratan

Node.js 22 atau lebih baru, pnpm 12, dan PostgreSQL. Tidak ada Docker atau layanan auth eksternal.

## Instalasi dan environment

```bash
pnpm install
cp -n .env.example .env
```

Isi `DATABASE_URL` dengan koneksi Neon **pooled** untuk runtime aplikasi dan `DIRECT_URL` dengan koneksi Neon **direct** ke database yang sama untuk Prisma migration. Host direct biasanya tidak mengandung `-pooler`; ambil kedua URL dari Neon, jangan menebak atau mengganti credential. Isi `AUTH_SECRET` dengan string acak minimal 32 karakter, misalnya hasil `openssl rand -base64 32`. `DATABASE_URL` dan `AUTH_SECRET` wajib saat runtime; `DIRECT_URL` wajib tersedia saat menjalankan migrasi. Setel ketiganya di Vercel agar konfigurasi Prisma lengkap; pada Prisma 6.19 saat ini, `pnpm prisma generate` dan `pnpm build` dapat selesai tanpa `DIRECT_URL`, tetapi itu tidak membuktikan migrasi dapat dijalankan. `SEED_ADMIN_PASSWORD`, `SEED_TEACHER_PASSWORD`, dan `SEED_STUDENT_PASSWORD` hanya diperlukan saat menjalankan seed demo. Jangan commit `.env`.

**Penting:** `.env` dari versi lama mungkin masih berisi URL SQLite (`file:./dev.db`). Ganti URL tersebut sebelum menjalankan migrasi atau aplikasi. File SQLite lama tetap ada dan tidak dihapus; migrasi PostgreSQL tidak memindahkan isi SQLite secara otomatis.

## Database dan seed

```bash
pnpm db:generate
pnpm db:migrate
pnpm db:seed
```

`db:migrate` menerapkan migrasi awal PostgreSQL memakai `DIRECT_URL`. Pada deployment yang sudah disetujui gunakan `pnpm db:deploy`. Periksa bahwa `DIRECT_URL` menunjuk database yang sama dengan `DATABASE_URL` sebelum menjalankan migrasi; jangan jalankan migrasi destruktif atau reset. **`pnpm db:seed` hanya untuk development/demo, bukan bootstrap production**: seed dapat dijalankan ulang tanpa menghapus data, tetapi membuat 4 kelas, 20 siswa, 6 guru, absensi, nilai, 4 pengumuman, serta akun demo yang belum ada. Password demo diambil dari `SEED_ADMIN_PASSWORD`, `SEED_TEACHER_PASSWORD`, dan `SEED_STUDENT_PASSWORD`, lalu di-hash sebelum disimpan.

Untuk database production baru yang sudah dimigrasi, buat **Admin pertama saja** dari terminal operator dengan `pnpm admin:create`. Script meminta nama, username, dan password minimal 12 karakter tanpa menampilkan password saat diketik. Script menggunakan `DATABASE_URL` dari environment terminal, atau dari `.env` lokal bila environment belum mengisinya; periksa target database sebelum menjalankan. Script menolak username yang sudah digunakan dan tidak dapat dijalankan lagi setelah Admin pertama dibuat. Tidak ada data demo yang dibuat. Lihat [panduan deployment](docs/deployment-vercel.md) untuk urutannya.

Untuk mengganti password akun yang sudah ada, jalankan `pnpm user:password` dari terminal interaktif. Masukkan username Admin, NIP Guru, atau NIS Siswa, lalu password baru minimal 12 karakter. Input password tersembunyi; script hanya memperbarui hash password akun yang ditemukan, tanpa membuat akun atau mengubah role. Pastikan `DATABASE_URL` menunjuk database yang benar sebelum menjalankan; script memakai environment terminal atau `.env` lokal. Perintah ini melakukan perubahan data langsung dan tidak mencabut sesi yang sudah aktif.

Akun demo login dengan username `admin-demo` (Admin), NIP `198501012010011001` (Teacher), atau NIS `20260001` (Student), masing-masing memakai password seed sesuai role. Form login memakai satu kolom **Username / NIP / NIS** dan password; email lama tidak dipakai untuk login. Tidak ada pendaftaran mandiri. Admin dapat mengelola semua data; Teacher dapat melihat siswa/guru dan mengelola absensi/nilai; Student hanya melihat nilai dan absensinya sendiri serta pengumuman.

## Development

```bash
pnpm dev
```

Buka `http://localhost:3000`. Database PostgreSQL harus tersedia. Dev tidak menjalankan seed atau migrasi secara otomatis agar tidak mengubah data tanpa sengaja.

## Spreadsheet

Halaman Guru dan Nilai menyediakan export XLSX, import XLSX, serta template XLSX kosong. CSV export lama tetap tersedia. Sheet pertama file import harus memakai kolom berikut persis:

- Guru: `NIP`, `Nama`, `Mata Pelajaran`, `Nomor Telepon`
- Nilai: `NIS`, `Nama`, `Kelas`, `Mata Pelajaran`, `Semester`, `Nilai`

Simpan NIP dan NIS sebagai **teks** di spreadsheet agar angka nol awal dan digit panjang tidak hilang. Nilai harus bilangan bulat 0–100; NIS, nama, dan kelas harus cocok dengan siswa yang sudah ada. Seluruh baris divalidasi sebelum disimpan. Maksimal 500 baris dan 2 MB per file. File dapat dibuka di Google Sheets, Microsoft Excel, dan LibreOffice Calc. Tidak ada Google Sheets API.

## Verifikasi dan build

```bash
pnpm lint
pnpm build
pnpm start
```

Migrasi SQLite sebelumnya disimpan di `docs/legacy-sqlite/` sebagai referensi. Database SQLite lokal tidak dihapus.

## Workflow kontribusi

Aturan kerja Codex untuk repository ini ada di `AGENTS.md`. Untuk perubahan fitur: audit kode terkait, implementasikan perubahan kecil yang mempertahankan behavior, jalankan lint/build sesuai dampak, lalu review di localhost/preview. Deploy hanya setelah persetujuan pengguna. Jangan commit atau push otomatis.

## Panduan

- [Panduan penggunaan untuk Admin, Guru, dan Siswa](docs/guides/README.md)
- [Panduan deployment Vercel](docs/deployment-vercel.md)

Untuk runtime production, `DATABASE_URL` dan `AUTH_SECRET` wajib disetel. `DIRECT_URL` dibutuhkan untuk migrasi dan sebaiknya tersedia juga di Vercel agar konfigurasi Prisma lengkap. Variabel `SEED_*` hanya diperlukan saat menjalankan seed demo. Database baru memerlukan migrasi dan akun Admin sebelum dapat digunakan; gunakan `pnpm admin:create` untuk bootstrap Admin tanpa data demo.
