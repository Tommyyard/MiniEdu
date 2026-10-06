import { db } from '@/lib/db';
import { PageHeading } from '@/components/page-heading';
import { AttendanceForm } from '@/components/attendance-form';
import { z } from 'zod';
import { requireUser } from '@/lib/auth';
export const dynamic = 'force-dynamic';
export default async function AttendancePage({ searchParams }: { searchParams: Promise<{ classId?: string; date?: string }> }) {
  const user = await requireUser();
  if (user.role === 'STUDENT') {
    const records = await db.attendance.findMany({ where: { studentId: user.studentId ?? '__none__' }, orderBy: { date: 'desc' }, take: 100 });
    const labels = { PRESENT: 'Hadir', SICK: 'Sakit', EXCUSED: 'Izin', ABSENT: 'Alpha' };
    return <><PageHeading title="Absensi Saya" description="Riwayat kehadiran Anda."/><div className="panel table-wrap"><table><thead><tr><th>Tanggal</th><th>Status</th></tr></thead><tbody>{records.map(record => <tr key={record.id}><td>{new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeZone: 'UTC' }).format(record.date)}</td><td>{labels[record.status]}</td></tr>)}</tbody></table>{!records.length && <p className="p-8 text-center text-sm text-slate-500">Belum ada absensi.</p>}</div></>;
  }
  const params = await searchParams;
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  const date = z.iso.date().safeParse(params.date).success ? params.date! : today;
  const classes = await db.class.findMany({ orderBy: { name: 'asc' } });
  const classId = classes.some(c => c.id === params.classId) ? params.classId! : classes[0]?.id ?? '';
  const students = classId ? await db.student.findMany({ where: { classId }, include: { attendance: { where: { date: new Date(`${date}T00:00:00.000Z`) } } }, orderBy: { name: 'asc' } }) : [];
  return <><PageHeading title="Absensi" description="Catat kehadiran siswa berdasarkan kelas dan tanggal."/><AttendanceForm key={`${classId}-${date}`} classes={classes.map(c => ({ id: c.id, name: c.name }))} classId={classId} date={date} students={students.map(s => ({ id: s.id, nis: s.nis, name: s.name, status: s.attendance[0]?.status ?? 'PRESENT' }))}/></>;
}
