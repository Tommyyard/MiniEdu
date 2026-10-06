import { PrismaClient, UserRole } from '@prisma/client';
import { hash } from 'bcryptjs';

const db = new PrismaClient();
function demoPassword(key: string): string {
  const password = process.env[key];
  if (!password || password.length < 12 || password.startsWith('replace-')) throw new Error(`${key} wajib diisi dengan password demo minimal 12 karakter sebelum seed.`);
  return password;
}
async function main() {
  const passwords = {
    admin: await hash(demoPassword('SEED_ADMIN_PASSWORD'), 12),
    teacher: await hash(demoPassword('SEED_TEACHER_PASSWORD'), 12),
    student: await hash(demoPassword('SEED_STUDENT_PASSWORD'), 12),
  };
  const classData = [ ['XII TKJ 1', 'TKJ', 12], ['XII TKJ 2', 'TKJ', 12], ['XII RPL 1', 'RPL', 12], ['XI TKJ 1', 'TKJ', 11] ] as const;
  const classes = await Promise.all(classData.map(([name, major, grade]) => db.class.upsert({ where: { name }, update: { major, grade }, create: { name, major, grade } })));
  const names = ['Andi Pratama', 'Budi Santoso', 'Citra Maharani', 'Doni Saputra', 'Eka Putri', 'Fajar Ramadhan', 'Gita Permata', 'Hendra Wijaya', 'Intan Sari', 'Joko Firmansyah', 'Kartika Dewi', 'Lukman Hakim', 'Maya Anggraini', 'Nanda Rizky', 'Olivia Safitri', 'Putra Wibowo', 'Rani Febrianti', 'Satria Nugraha', 'Tika Lestari', 'Yoga Prasetyo'];
  const female = new Set([2,4,6,8,10,12,14,16,18]);
  const students = [];
  for (let i = 0; i < names.length; i++) {
    const nis = `2026${String(i + 1).padStart(4, '0')}`;
    const data = { name: names[i], gender: female.has(i) ? 'P' : 'L', classId: classes[Math.floor(i / 5)].id };
    students.push(await db.student.upsert({ where: { nis }, update: {}, create: { nis, ...data } }));
  }
  const teacherData = [ ['198501012010011001','Ahmad Hidayat','Matematika','081234560101'], ['198704122011012002','Siti Nurhaliza','Bahasa Indonesia','081234560102'], ['198203152009031003','Rudi Hartono','Jaringan Komputer','081234560103'], ['199005212015042004','Dewi Anggraini','Pemrograman Web','081234560104'], ['198809092012051005','Agus Setiawan','Bahasa Inggris','081234560105'], ['199202172018032006','Nur Aisyah','Basis Data','081234560106'] ];
  const teachers = [];
  for (const [nip, name, subject, phone] of teacherData) teachers.push(await db.teacher.upsert({ where: { nip }, update: {}, create: { nip, name, subject, phone } }));
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  const date = new Date(`${today}T00:00:00.000Z`);
  for (const [i, student] of students.slice(0, 15).entries()) await db.attendance.upsert({ where: { studentId_date: { studentId: student.id, date } }, update: {}, create: { studentId: student.id, date, status: i === 2 ? 'SICK' : i === 8 ? 'EXCUSED' : i === 13 ? 'ABSENT' : 'PRESENT' } });
  for (const [i, student] of students.entries()) for (const [subject, score] of [['Matematika', 72 + i % 25], [i < 10 ? 'Jaringan Komputer' : 'Pemrograman Web', 75 + i % 22]] as const) {
    const existing = await db.grade.findFirst({ where: { studentId: student.id, subject, semester: 'Ganjil' } });
    if (!existing) await db.grade.create({ data: { studentId: student.id, subject, semester: 'Ganjil', score } });
  }
  for (const [title, content] of [ ['Selamat Datang di MiniEdu', 'Sistem informasi sekolah kini tersedia untuk membantu pengelolaan data akademik.'], ['Jadwal Ujian Tengah Semester', 'Ujian tengah semester dimulai pada minggu ketiga bulan ini. Siapkan diri dengan baik.'], ['Rapat Koordinasi Guru', 'Seluruh guru diharapkan hadir pada rapat koordinasi hari Jumat pukul 13.00 WIB.'], ['Kegiatan Jumat Bersih', 'Siswa dan guru mengikuti kegiatan Jumat Bersih mulai pukul 07.00 WIB.'] ]) {
    if (!await db.announcement.findFirst({ where: { title } })) await db.announcement.create({ data: { title, content } });
  }
  const demoAdmin = await db.user.findFirst({ where: { role: UserRole.ADMIN, OR: [{ identifier: 'admin-demo' }, { email: 'admin@miniedu.local' }] } });
  if (demoAdmin) {
    if (!demoAdmin.identifier) await db.user.update({ where: { id: demoAdmin.id }, data: { identifier: 'admin-demo' } });
  } else {
    await db.user.create({ data: { identifier: 'admin-demo', name: 'Admin MiniEdu', role: UserRole.ADMIN, passwordHash: passwords.admin } });
  }
  await db.user.upsert({ where: { teacherId: teachers[0].id }, update: { identifier: teachers[0].nip }, create: { identifier: teachers[0].nip, name: teachers[0].name, role: UserRole.TEACHER, teacherId: teachers[0].id, passwordHash: passwords.teacher } });
  await db.user.upsert({ where: { studentId: students[0].id }, update: { identifier: students[0].nis }, create: { identifier: students[0].nis, name: students[0].name, role: UserRole.STUDENT, studentId: students[0].id, passwordHash: passwords.student } });
  console.log('Seed demo selesai tanpa menghapus data yang sudah ada.');
}
main().finally(() => db.$disconnect());
