# Deployment MiniEdu ke Vercel

Alur: **GitHub → Vercel → Neon PostgreSQL**. Panduan ini untuk operator yang sudah mendapat persetujuan deploy. Menulis panduan ini tidak menjalankan deploy atau migrasi.

## 1. Siapkan repository GitHub

Periksa file yang akan dikomit. `.gitignore` mengecualikan `.env` dan turunannya, `.next/`, `.vercel/`, `node_modules/`, serta `prisma/*.db`; `.env.example` tetap masuk repository karena hanya berisi placeholder. Pastikan tidak ada secret di file lain atau riwayat Git. Commit kode dan `pnpm-lock.yaml`, lalu push ke repository GitHub yang Anda pilih. Jangan unggah database SQLite lama.

## 2. Siapkan Neon PostgreSQL dan Admin pertama

Gunakan project PostgreSQL Neon yang memang ditujukan untuk lingkungan production. Isi `DATABASE_URL` dengan URL **pooled** Neon untuk runtime aplikasi dan `DIRECT_URL` dengan URL **direct** Neon untuk Prisma migration; keduanya harus menunjuk database yang sama. Host pooled biasanya mengandung `-pooler`, sedangkan host direct tidak. Ambil URL direct dari dashboard Neon dan pertahankan opsi TLS sesuai URL Neon; jangan sekadar menghapus teks `-pooler` dari URL secara manual. Pastikan skema telah dimigrasi dan ada akun `ADMIN` yang sah sebelum aplikasi dipakai.

Database kosong belum memiliki akun dan aplikasi tidak menyediakan signup Admin. Setelah meninjau dampak SQL di `prisma/migrations/`, jalankan `pnpm db:deploy` (`prisma migrate deploy`) dari terminal operator tepercaya dengan `DIRECT_URL` yang mengarah ke database target. Perintah `pnpm db:migrate` (`prisma migrate dev`) hanya untuk development. Jangan reset atau drop database. Migrasi tidak berjalan otomatis saat build. Jika advisory lock masih timeout, periksa proses migration lain dan aktivitas lock database sebelum mencoba lagi; jangan paksa unlock.

Untuk **database baru**, setelah migrasi jalankan `pnpm admin:create` dari terminal interaktif yang dapat mengakses Neon. Script meminta nama, **username**, dan password minimal 12 karakter; input password tidak ditampilkan. Script memakai `DATABASE_URL` dari environment terminal, atau `.env` lokal jika environment belum mengisinya. **Periksa target database sebelum menekan Enter.** Script membuat satu akun dengan role `ADMIN`, menolak username yang sudah dipakai, dan menolak jika sudah ada Admin. Tidak ada data siswa, guru, kelas, atau demo yang dibuat. Password hanya disimpan sebagai hash `bcryptjs`; jangan menaruhnya di argumen CLI, repository, atau dokumentasi.

Untuk mengganti password user yang sudah ada, operator dapat menjalankan `pnpm user:password` dari terminal interaktif dengan akses ke database target. Script meminta username/NIP/NIS dan password baru minimal 12 karakter, menyembunyikan input password, serta hanya memperbarui hash password akun yang ditemukan. Pastikan `DATABASE_URL` menunjuk database yang benar. Perintah ini tidak membuat user, tidak mengubah role, dan tidak mencabut sesi yang sudah aktif.

Untuk **database yang sudah memiliki akun**, migration `20261006120000_user_identifier_login` menambah `User.identifier` unik dan membuat email opsional tanpa menghapus email lama. Akun Guru/Siswa yang terhubung diisi otomatis dari NIP/NIS. Username Admin lama **tidak dibuat otomatis dari email**. Setelah migrasi, operator harus memilih username yang belum ada pada `User.identifier`, `Teacher.nip`, atau `Student.nis`, lalu mengisi `User.identifier` pada Admin lama sebelum akun itu bisa login. Contoh SQL manual, setelah mengganti placeholder dengan pilihan yang telah diperiksa:

```sql
SELECT "id", "role", "email" FROM "User" WHERE "identifier" IS NULL;
UPDATE "User" SET "identifier" = '<username-pilihan>'
WHERE "id" = '<id-admin-lama>' AND "role" = 'ADMIN' AND "identifier" IS NULL;
```

Periksa juga baris Guru/Siswa yang masih `identifier IS NULL`: baris tersebut biasanya belum memiliki relasi Teacher/Student yang valid dan memerlukan perbaikan relasi sebelum login. Index unik menolak benturan identifier; SQL migration dibungkus transaksi sehingga perubahan skema/data di dalamnya rollback jika NIP dan NIS akun lama bertabrakan. Hentikan deploy, audit dan perbaiki benturan, lalu tangani status migration yang gagal sesuai prosedur Prisma sebelum menjalankannya lagi. Jangan reset database. `pnpm admin:create` tetap hanya untuk Admin pertama pada database yang belum memiliki Admin.

`pnpm db:seed` tetap tersedia **hanya untuk development/demo** dan membuat data sekolah serta tiga akun demo. Jangan gunakan seed untuk bootstrap production. Script Admin tidak memerlukan variabel `SEED_*`.

Login setiap role memakai satu field **Username / NIP / NIS** dan password. Admin memakai username yang ditetapkan operator, Guru memakai NIP, Siswa memakai NIS. Email lama boleh tetap tersimpan sebagai data opsional, tetapi tidak digunakan untuk autentikasi. Beberapa akun per role dapat didukung oleh model User; pembuatan akun tambahan, disable account, dan reset password melalui UI belum tersedia dan memerlukan fitur terpisah.

## 3. Import ke Vercel

Import repository GitHub ke Vercel sebagai project **Next.js**, dengan root directory repository ini. Gunakan Node.js 22 atau versi kompatibel yang didukung project, pnpm sesuai `packageManager` di `package.json` dan `pnpm-lock.yaml`, serta perintah build `pnpm build`. Script build menjalankan `prisma generate` sebelum `next build`; `postinstall` juga menjalankan generate. Jangan memakai `pnpm db:migrate`, `pnpm db:seed`, atau `pnpm admin:create` sebagai build command.

Setelah environment variables disetel, lakukan **deployment pertama secara manual melalui dashboard Vercel**. Tinjau hasil build dan URL deployment sebelum menerima traffic production. Setelah integrasi GitHub aktif, push berikutnya dapat memicu deployment Vercel otomatis; tinjau pengaturan branch dan auto-deploy sebelum push.

Dependency `xlsx` dipin ke tarball SheetJS 0.20.3 dari CDN resmi beserta integrity hash di lockfile. Build Vercel perlu dapat mengunduh tarball tersebut saat instalasi dependency.

## 4. Environment variables

Setel di Vercel untuk lingkungan yang benar, tanpa menaruh nilainya di Git:

| Variable | Kegunaan | Wajib untuk runtime production? |
| --- | --- | --- |
| `DATABASE_URL` | Koneksi PostgreSQL Neon pooled untuk runtime Prisma Client | Ya |
| `DIRECT_URL` | Koneksi PostgreSQL Neon direct untuk Prisma migration | Wajib untuk migrasi; setel juga di Vercel agar konfigurasi lengkap |
| `AUTH_SECRET` | Kunci enkripsi cookie session; string acak minimal 32 karakter | Ya |
| `SEED_ADMIN_PASSWORD` | Password akun demo Admin saat menjalankan seed | Tidak |
| `SEED_TEACHER_PASSWORD` | Password akun demo Guru saat menjalankan seed | Tidak |
| `SEED_STUDENT_PASSWORD` | Password akun demo Siswa saat menjalankan seed | Tidak |

Pasang `DATABASE_URL`, `DIRECT_URL`, dan `AUTH_SECRET` di Vercel: aplikasi memakai koneksi pooled saat runtime, sedangkan Prisma migration memakai direct. Pada Prisma 6.19 saat ini, generate/build dapat selesai meski `DIRECT_URL` belum terisi, tetapi migrasi memerlukannya; keberhasilan build tidak membuktikan koneksi direct siap. `SEED_*` hanya dibaca oleh `prisma/seed.ts`; jika seed tidak dijalankan oleh Vercel, ketiganya tidak perlu dipasang di Vercel. Simpan password akun sebenarnya di tempat aman. Jangan memakai nilai placeholder `.env.example`.

## 5. Verifikasi sebelum dan sesudah deploy

1. Secara lokal/CI, jalankan `pnpm install --frozen-lockfile`, `pnpm prisma generate`, `pnpm lint`, dan `pnpm build`. Periksa bahwa lockfile dan environment sesuai.
2. Pastikan migrasi target dan akun Admin siap melalui pemeriksaan yang tidak mengubah data. Jangan mengasumsikan build yang lolos membuktikan akses Neon production.
3. Setelah deployment disetujui dan selesai, buka halaman login di URL Vercel, masuk dengan akun uji yang sah untuk setiap role, dan periksa halaman sesuai [panduan pengguna](guides/README.md).
4. Uji pembatasan role: siswa hanya melihat nilai/absensi sendiri; Guru tidak dapat mengubah siswa/guru/pengumuman; route import/export menolak role yang tidak berhak.
5. Uji export XLSX guru/nilai dan satu import terkendali di lingkungan yang aman. Periksa log Vercel untuk error auth, Prisma, dan koneksi database.

## Known dependency advisory

`pnpm audit --prod` saat audit kesiapan deploy masih melaporkan `deepmerge-ts@7.1.5` melalui `@prisma/config` milik Prisma 6.19.3: [GHSA-ggr8-5vv4-36mx](https://github.com/advisories/GHSA-ggr8-5vv4-36mx). Masalah ini memerlukan object graph rekursif yang dikirim ke fungsi merge. Pada project ini jalurnya berasal dari pemrosesan konfigurasi Prisma; tidak ditemukan jalur input pengguna aplikasi ke fungsi tersebut. [Diskusi Prisma](https://github.com/prisma/orm/issues/30052) juga menilai paparan pada jalur konfigurasi rendah. Ini adalah penilaian risiko, bukan hasil audit yang hijau. Jangan memaksa override `deepmerge-ts` lintas major atau memakai Prisma release candidate hanya untuk menghilangkan warning. Tinjau upgrade Prisma/dependency yang stabil dalam task terpisah beserta uji kompatibilitas.
