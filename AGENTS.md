# MiniEdu — aturan utama Codex

Aturan ini berlaku untuk setiap task di repository MiniEdu. Baca instruksi task dan kode yang relevan sebelum bertindak. README.md menjelaskan setup dan penggunaan; jika dokumentasi bertentangan dengan implementasi, periksa kode lalu selaraskan dokumentasi sesuai scope task.

## Project dan stack tetap

MiniEdu adalah sistem informasi sekolah internal berskala kecil. Gunakan pnpm (`packageManager` di `package.json`), Next.js 16 App Router, TypeScript, Tailwind CSS, source shadcn/ui di `components/ui/`, `@gravity-ui/icons`, React Hook Form, Zod, Prisma, PostgreSQL (provider saat ini: Neon), `xlsx`/SheetJS, serta tema terang/gelap melalui `next-themes`. Auth yang ada berbasis session `iron-session` dan password `bcryptjs`. Role database: `ADMIN`, `TEACHER`, `STUDENT`. Zustand sudah tersedia; pakai hanya bila ada state global client yang benar-benar dibagi antar komponen. Testing belum wajib kecuali task membutuhkannya.

Jangan mengganti package manager, Next.js/App Router, Prisma, PostgreSQL, auth, atau shadcn/ui tanpa instruksi eksplisit. Jangan gunakan npm, yarn, bun, Pages Router, atau UI library lain. Jangan menambah dependency tanpa alasan teknis jelas; utamakan API bawaan dan dependency yang sudah ada.

## Peta repository

- `app/`: halaman App Router dan Route Handlers import/export. Halaman internal memakai Server Components dan membaca data lewat Prisma.
- `components/`: komponen interaktif; `components/ui/` berisi source shadcn/ui.
- `actions/`: login/logout dan mutasi internal melalui Server Actions.
- `lib/`: Prisma client, auth, validasi Zod, hasil action, spreadsheet, dan CSV lama.
- `prisma/`: schema PostgreSQL, migrasi, dan seed. `docs/legacy-sqlite/` hanya arsip migrasi SQLite; jangan diterapkan ke PostgreSQL atau menganggap datanya sudah dipindahkan.

## Workflow setiap task

1. Baca permintaan, cari file terkait, pahami implementasi dan behavior yang ada. Jangan menebak arsitektur yang dapat diperiksa di codebase.
2. Ubah bagian yang relevan saja. Pilih perubahan terkecil yang menyelesaikan task dengan benar; pertahankan fitur lama. Hindari refactor besar atau redesign yang tidak diminta.
3. Implementasikan, lalu verifikasi sesuai dampak perubahan. Periksa diff sebelum melaporkan hasil.
4. Laporkan bug lain tanpa memperbaikinya, kecuali menghalangi task utama.

Alur perubahan fitur: permintaan → audit → implementasi → lint/build → review pengguna di localhost/preview → setelah persetujuan pengguna, baru deploy. Jangan membuat commit, push, merge, rebase, force push, menghapus atau mengganti branch, maupun deploy tanpa instruksi eksplisit. Membaca status/diff Git dan mengubah file yang diperlukan untuk task diperbolehkan.

## Next.js, data, form, dan state

- Prioritaskan Server Components. Gunakan Client Components hanya untuk hooks client, event handler, browser API, form interaktif, dialog/interaksi client, atau Zustand. Jangan tambahkan `use client` tanpa kebutuhan.
- Akses database hanya di server melalui Prisma. Pilih Server Actions untuk CRUD internal bila cocok; gunakan Route Handlers untuk upload/download spreadsheet atau endpoint khusus. Jangan membangun REST API penuh tanpa kebutuhan. Client Component tidak boleh memutasi database langsung.
- Validasi mutasi penting di server dengan Zod, termasuk input Route Handler. Gunakan schema reusable di `lib/validation.ts` bila cocok; jangan mengandalkan validasi client atau menggandakan aturan validasi.
- Gunakan React Hook Form untuk form interaktif bila bermanfaat. Gunakan React state untuk state lokal sederhana; jangan duplikasi data server ke Zustand tanpa alasan.
- UI memakai Tailwind CSS dan shadcn/ui; gunakan `@gravity-ui/icons` untuk ikon baru. Beberapa komponen lama masih memakai `lucide-react`; jangan refactor hanya untuk mengganti ikonnya. Pertahankan dashboard sekolah yang bersih, minimal, responsif, profesional, dan kompatibel light/dark. Jangan redesign tanpa permintaan.

## Auth dan authorization

`iron-session` menyimpan ID user dalam cookie terenkripsi; `lib/auth.ts` mengambil role dan relasi guru/siswa dari database. Login memakai `User.identifier` unik: username Admin, NIP Guru, atau NIS Siswa; email lama opsional dan bukan kredensial login. Password disimpan sebagai hash `bcryptjs`. Setiap halaman internal, Server Action, dan Route Handler sensitif harus memeriksa pengguna/role di server. Menyembunyikan tombol di frontend bukan pemeriksaan izin.

- `ADMIN`: mengelola siswa, guru, absensi, nilai, dan pengumuman.
- `TEACHER`: membaca data siswa/guru, memperbarui data siswa yang sudah ada melalui menu Edit Data Siswa, serta mengelola absensi dan nilai. Pembuatan dan penghapusan siswa tetap khusus Admin.
- `STUDENT`: membaca pengumuman serta hanya nilai dan absensi miliknya sendiri.

Halaman umum tersedia di `/` tanpa login. Setelah login, `/` menampilkan beranda sesuai peran. Menu Mode Developer di `/developer` khusus Admin dan menampilkan ikhtisar serta pintasan data sekolah.

## Database, environment, dan tindakan berisiko

`DATABASE_URL` berasal dari environment dan harus menunjuk koneksi PostgreSQL Neon pooled untuk runtime. `DIRECT_URL` harus menunjuk koneksi direct ke database yang sama untuk Prisma migration; sediakan juga di Vercel agar konfigurasi lengkap. Prisma generate/build pada versi saat ini dapat selesai tanpa `DIRECT_URL`, tetapi migrasi tidak boleh dijalankan tanpa URL direct yang valid. Jangan hardcode atau tampilkan connection string, password, `AUTH_SECRET`, atau API key. Jangan commit `.env`, menghapus/mengganti secret yang ada tanpa alasan, atau mengarang credential. Dokumentasikan variabel baru di `.env.example` dan README bila memengaruhi setup.

Jika schema berubah, buat migration yang sesuai dan jelaskan dampaknya. Jangan reset database, drop tabel, hapus data/migration, atau jalankan migration destruktif tanpa persetujuan pengguna. Sebelum menghapus banyak file, mengganti arsitektur besar atau dependency utama, maupun menimpa konfigurasi penting, minta persetujuan. Jangan jalankan seed atau migration pada database produksi tanpa memahami efeknya dan persetujuan pengguna. Migrasi/seed development juga perlu memastikan target database sebelum dijalankan.

Script pnpm tersedia: `pnpm install`, `pnpm dev`, `pnpm build`, `pnpm start`, `pnpm lint`, `pnpm db:generate`, `pnpm db:migrate` (`prisma migrate dev`), `pnpm db:deploy` (`prisma migrate deploy`), `pnpm db:seed` untuk data demo, `pnpm admin:create` untuk Admin pertama tanpa data demo, dan `pnpm user:password` untuk mengganti password user yang sudah ada. `pnpm build` sudah menjalankan `prisma generate`. Jangan menjalankan migration, seed, atau deployment hanya untuk verifikasi dokumentasi.

## Spreadsheet dan dokumentasi

Gunakan SheetJS/`xlsx` untuk import/export guru dan nilai. CSV export lama tetap ada. Jangan tambahkan Google Sheets API tanpa instruksi eksplisit. Selaraskan README.md dan AGENTS.md jika task mengubah setup, command, environment, database, auth, atau workflow developer. Jangan mengubah dokumentasi lain tanpa kebutuhan.

## Verifikasi dan laporan

- Task kecil: jalankan `pnpm lint` bila relevan.
- Perubahan fitur atau logic yang cukup besar: jalankan `pnpm lint` dan `pnpm build`.
- Perubahan Prisma: jalankan `pnpm db:generate` dan verifikasi migration bila environment memungkinkan; jangan mengubah database produksi untuk verifikasi.
- Jika verifikasi gagal, investigasi dan perbaiki penyebab dalam scope. Jelaskan hambatan external/environment. Jangan tulis PASS untuk command yang tidak dijalankan. Untuk task dokumentasi saja, pemeriksaan isi/diff cukup bila lint/build tidak relevan.

Setelah setiap task, beri laporan ringkas dengan format:

A. Yang diubah — ringkasan perubahan.
B. File penting — file yang diubah.
C. Verification — `pnpm lint`, `pnpm build`, Prisma generate: PASS/FAIL/NOT RUN; migration: PASS/FAIL/NOT RUN bila relevan.
D. Catatan — limitation, dependency baru, dan dampak migration bila ada.
E. Next step — maksimal tiga saran, hanya bila relevan.
