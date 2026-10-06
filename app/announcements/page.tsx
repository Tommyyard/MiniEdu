import { db } from '@/lib/db';
import { PageHeading } from '@/components/page-heading';
import { RecordManager } from '@/components/record-manager';
import { saveAnnouncement, deleteAnnouncement } from '@/actions/records';
import { requireUser } from '@/lib/auth';
export const dynamic = 'force-dynamic';
export default async function AnnouncementsPage() {
  const user = await requireUser();
  const announcements = await db.announcement.findMany({ orderBy: { createdAt: 'desc' } });
  return <><PageHeading title="Pengumuman" description="Informasi penting untuk lingkungan sekolah."/><RecordManager kind="announcement" readOnly={user.role !== 'ADMIN'} records={announcements.map(a => ({ id: a.id, title: a.title, content: a.content, created: new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(a.createdAt) }))} columns={[{ key: 'title', label: 'Judul' }, { key: 'content', label: 'Isi' }, { key: 'created', label: 'Tanggal Dibuat' }]} fields={[{ key: 'title', label: 'Judul', required: true }, { key: 'content', label: 'Isi', type: 'textarea', required: true }]} searchKeys={['title', 'content']} saveAction={saveAnnouncement} deleteAction={deleteAnnouncement} createLabel="Tambah Pengumuman" emptyText="Belum ada pengumuman."/></>;
}
