import { StudentDirectory } from '../student-directory';
import { requireRole } from '@/lib/auth';
export const dynamic = 'force-dynamic';
export default async function EditStudentsPage() {
  await requireRole(['TEACHER']);
  return <StudentDirectory editOnly/>;
}
