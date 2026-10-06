import { z } from 'zod';

const required = (label: string) => z.string().trim().min(1, `${label} wajib diisi.`);
export const studentSchema = z.object({ nis: required('NIS'), name: required('Nama'), gender: z.enum(['L', 'P']), classId: required('Kelas') });
export const teacherSchema = z.object({ nip: required('NIP'), name: required('Nama'), subject: required('Mata pelajaran'), phone: z.string().trim() });
export const attendanceSchema = z.object({ studentId: required('Siswa'), date: z.iso.date(), status: z.enum(['PRESENT', 'SICK', 'EXCUSED', 'ABSENT']) });
export const gradeSchema = z.object({ studentId: required('Siswa'), subject: required('Mata pelajaran'), semester: required('Semester'), score: z.preprocess(value => value === '' ? undefined : value, z.coerce.number().int('Nilai harus bilangan bulat.').min(0, 'Nilai minimal 0.').max(100, 'Nilai maksimal 100.')) });
export const announcementSchema = z.object({ title: required('Judul'), content: required('Isi') });
export const loginSchema = z.object({ identifier: required('Username / NIP / NIS'), password: z.string().min(1, 'Password wajib diisi.') });
