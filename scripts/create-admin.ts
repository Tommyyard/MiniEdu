import { existsSync } from 'node:fs';
import { loadEnvFile, stdin, stdout } from 'node:process';
import { createInterface } from 'node:readline/promises';
import { Prisma, PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';
import { z } from 'zod';
import { askHidden } from './terminal-input';

const adminInputSchema = z.object({
  name: z.string().trim().min(1, 'Nama Admin wajib diisi.'),
  username: z.string().trim().min(1, 'Username Admin wajib diisi.'),
  password: z.string().min(12, 'Password minimal 12 karakter.'),
});

async function promptInput() {
  if (!stdin.isTTY || !stdout.isTTY) throw new Error('Jalankan pnpm admin:create di terminal interaktif.');
  const reader = createInterface({ input: stdin, output: stdout });
  let name: string;
  let username: string;
  try {
    name = await reader.question('Nama Admin: ');
    username = await reader.question('Username Admin: ');
  } finally {
    reader.close();
  }
  const password = await askHidden('Password Admin (minimal 12 karakter): ');
  return adminInputSchema.parse({ name, username, password });
}

async function main() {
  if (!process.env.DATABASE_URL && existsSync('.env')) loadEnvFile('.env');
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL wajib disetel sebelum membuat Admin.');
  const input = await promptInput();
  const db = new PrismaClient();
  try {
    const [user, teacher, student] = await Promise.all([
      db.user.findUnique({ where: { identifier: input.username }, select: { id: true } }),
      db.teacher.findUnique({ where: { nip: input.username }, select: { id: true } }),
      db.student.findUnique({ where: { nis: input.username }, select: { id: true } }),
    ]);
    if (user || teacher || student) {
      throw new Error('Username sudah digunakan sebagai identifier.');
    }
    if (await db.user.count({ where: { role: 'ADMIN' } })) {
      throw new Error('Akun Admin sudah ada. Script ini hanya untuk Admin pertama.');
    }
    await db.user.create({
      data: { name: input.name, identifier: input.username, passwordHash: await hash(input.password, 12), role: 'ADMIN' },
    });
    console.log('Akun Admin pertama berhasil dibuat.');
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new Error('Username sudah digunakan sebagai identifier.');
    }
    throw error;
  } finally {
    await db.$disconnect();
  }
}

main().catch(error => {
  if (error instanceof z.ZodError) console.error(error.issues[0]?.message ?? 'Input tidak valid.');
  else if (error instanceof Error && ['Dibatalkan.', 'Username sudah digunakan sebagai identifier.', 'Akun Admin sudah ada. Script ini hanya untuk Admin pertama.', 'DATABASE_URL wajib disetel sebelum membuat Admin.', 'Jalankan pnpm admin:create di terminal interaktif.'].includes(error.message)) console.error(error.message);
  else console.error('Gagal membuat Admin. Periksa koneksi database dan schema.');
  process.exitCode = 1;
});
