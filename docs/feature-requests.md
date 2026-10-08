# Request fitur MiniEdu

## Pengelolaan akun dan status online

- Tanggal request: 8 Oktober 2026.
- Rencana lanjut: 9 Oktober 2026 (besok), atas permintaan pengguna. Mulai dengan membaca catatan ini dan memeriksa kondisi kode terbaru.
- Status: **Ditunda** atas instruksi pengguna karena membutuhkan server dan akses database.
- Implementasi: belum diterapkan; perubahan percobaan sudah dikembalikan. Tidak ada migrasi yang dijalankan.

### Kebutuhan pengguna

1. Tambahkan menu khusus Admin untuk melihat akun yang ada, termasuk Guru dan Siswa.
2. Tampilkan pengguna yang aktif atau sedang online.
3. Sediakan fitur untuk menyiapkan username dan password Guru agar dapat login.
4. Username dapat diisi otomatis atau ditulis manual.
5. Password dapat memakai rekomendasi acak atau ditulis manual.

### Hal yang perlu dipastikan saat dilanjutkan

- Konfirmasi kesiapan server dan target database sebelum implementasi dilanjutkan.
- Bedakan status online berdasarkan aktivitas terbaru dari status akun yang sudah tersedia. Jelaskan batas waktu status online kepada Admin.
- Tentukan hubungan username Guru dengan NIP yang saat ini digunakan untuk login, sambil mempertahankan akses akun lama.
- Periksa izin Admin di server; password tetap disimpan sebagai hash bcryptjs dan password lama tidak ditampilkan.
- Jika pencatatan aktivitas membutuhkan perubahan schema, siapkan migration dan ikuti persetujuan serta pemeriksaan target database dalam AGENTS.md sebelum menjalankannya.
- Pertahankan fitur sekolah, autentikasi iron-session, dan role permissions yang sudah ada.

Catatan ini menyimpan request untuk pekerjaan mendatang dan tidak memberikan persetujuan untuk migrasi database atau deployment.
