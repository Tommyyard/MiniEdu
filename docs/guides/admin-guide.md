# MiniEdu Admin Guide

Admin mengelola siswa, guru, absensi, nilai, dan pengumuman sekolah.

## Masuk dan dashboard

1. Buka alamat MiniEdu yang diberikan pengelola. Pada kolom **Username / NIP / NIS**, masukkan **username Admin** Anda, lalu password akun sendiri.
2. Dashboard menampilkan jumlah siswa, guru, kelas, pengumuman, ringkasan absensi hari ini, dan pengumuman terbaru.
3. Menu Admin: **Dashboard**, **Siswa**, **Guru**, **Absensi**, **Nilai**, **Pengumuman**. Tombol **Ganti tema** di atas mengubah tampilan terang/gelap.

## Siswa dan guru

1. Buka **Siswa** untuk mencari siswa atau menyaring menurut kelas. Klik **Tambah Siswa**, isi NIS, nama, jenis kelamin, dan kelas yang sudah tersedia, lalu **Simpan**.
2. Klik ikon **Edit** untuk memperbarui baris, atau **Hapus** untuk menghapus setelah konfirmasi. Menghapus siswa juga menghapus akun terkait, nilai, dan absensinya.
3. Buka **Guru** untuk mencari guru. Klik **Tambah Guru**, isi NIP, nama, mata pelajaran, dan nomor telepon, lalu **Simpan**. Gunakan **Edit** atau **Hapus** untuk data yang ada. Menghapus guru juga menghapus akun guru terkait.

Kelas belum dapat dibuat atau diubah lewat UI.

## Absensi dan nilai

1. Buka **Absensi**, pilih kelas dan tanggal. Untuk siswa tanpa catatan, status awal tampil sebagai **Hadir**.
2. Pilih **Hadir**, **Sakit**, **Izin**, atau **Alpha** untuk tiap siswa; klik **Simpan Absensi**. Untuk mengubah catatan, buka kelas/tanggal yang sama dan simpan ulang.
3. Buka **Nilai** untuk mencari atau menyaring data. Klik **Tambah Nilai**, pilih siswa, isi mata pelajaran, semester, dan nilai bulat 0–100, lalu **Simpan**. Gunakan **Edit** atau **Hapus** pada baris bila perlu.

## Pengumuman dan spreadsheet

1. Buka **Pengumuman** untuk membaca daftar. Klik **Tambah Pengumuman**, isi judul dan isi, lalu **Simpan**. Gunakan **Edit** atau **Hapus** untuk data yang ada.
2. Pada menu **Guru** dan **Nilai**, klik **Export XLSX** atau **Export CSV** untuk mengunduh data. Untuk mengunggah, klik **Template XLSX**, isi file, lalu **Import XLSX**.
3. Kolom sheet pertama harus sesuai: Guru: `NIP`, `Nama`, `Mata Pelajaran`, `Nomor Telepon`; Nilai: `NIS`, `Nama`, `Kelas`, `Mata Pelajaran`, `Semester`, `Nilai`.
4. Simpan NIP/NIS sebagai teks agar nol awal tidak hilang. Batas impor: 500 baris dan 2 MB. Semua baris diperiksa sebelum disimpan; perbaiki pesan error bila impor ditolak. Impor guru memperbarui NIP yang sama; impor nilai memperbarui catatan terbaru yang cocok untuk siswa, mata pelajaran, dan semester.

XLSX dapat dibuka di Excel, Google Sheets, dan LibreOffice Calc. Tidak ada sinkronisasi Google Sheets langsung.

## Keluar dan batasan

Klik **Keluar** di atas setelah selesai. Hapus data dengan hati-hati. Aplikasi belum menyediakan pengelolaan kelas, akun, atau password lewat UI.
