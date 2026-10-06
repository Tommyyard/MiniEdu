import { existsSync } from 'node:fs';
import { loadEnvFile, stdin, stdout } from 'node:process';
import { createInterface } from 'node:readline/promises';
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';
import { z } from 'zod';
import { askHidden } from './terminal-input';

const inputSchema = z.object({
  identifier: z.string().trim().min(1, 'Identifier wajib diisi.'),
  password: z.string().min(12, 'Password baru minimal 12 karakter.'),
});

async function promptInput() {
  if (!stdin.isTTY || !stdout.isTTY) throw new Error('Jalankan pnpm user:password di terminal interaktif.');
  const reader = createInterface({ input: stdin, output: stdout });
  let identifier: string;
  try {
    identifier = await reader.question('Username / NIP / NIS: ');
  } finally {
    reader.close();
  }
  const password = await askHidden('Password baru (minimal 12 karakter): ');
  return inputSchema.parse({ identifier, password });
}

async function main() {
  if (!process.env.DATABASE_URL && existsSync('.env')) loadEnvFile('.env');
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL wajib disetel sebelum mengganti password.');
  const input = await promptInput();
  const db = new PrismaClient();
  try {
    const user = await db.user.findUnique({ where: { identifier: input.identifier }, select: { id: true } });
    if (!user) throw new Error('User dengan identifier tersebut tidak ditemukan.');
    await db.user.update({
      where: { id: user.id },
      data: { passwordHash: await hash(input.password, 12) },
    });
    console.log('Password user berhasil diperbarui.');
  } finally {
    await db.$disconnect();
  }
}

main().catch(error => {
  if (error instanceof z.ZodError) console.error(error.issues[0]?.message ?? 'Input tidak valid.');
  else if (error instanceof Error && [
    'Dibatalkan.',
    'User dengan identifier tersebut tidak ditemukan.',
    'DATABASE_URL wajib disetel sebelum mengganti password.',
    'Jalankan pnpm user:password di terminal interaktif.',
  ].includes(error.message)) console.error(error.message);
  else console.error('Gagal mengganti password. Periksa koneksi database dan schema.');
  process.exitCode = 1;
});
