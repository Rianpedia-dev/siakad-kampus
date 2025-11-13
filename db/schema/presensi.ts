import { pgTable, serial, integer, timestamp, text, varchar } from 'drizzle-orm/pg-core';
import { kelas } from './akademik';
import { dosen } from './dosen';
import { mahasiswa } from './mahasiswa';

export const pertemuan = pgTable('pertemuan', {
  id: serial('id').primaryKey(),
  kelasId: integer('kelas_id').references(() => kelas.id),
  pertemuanKe: integer('pertemuan_ke').notNull(),
  tanggal: timestamp('tanggal').notNull(),
  topik: text('topik'),
  materi: text('materi'),
  dosenId: integer('dosen_id').references(() => dosen.id),
  createdAt: timestamp('created_at').defaultNow(),
});

export const presensi = pgTable('presensi', {
  id: serial('id').primaryKey(),
  pertemuanId: integer('pertemuan_id').references(() => pertemuan.id),
  mahasiswaId: integer('mahasiswa_id').references(() => mahasiswa.id),
  status: varchar('status', { length: 10 }).notNull(), // hadir, izin, sakit, alpa
  keterangan: text('keterangan'),
  createdAt: timestamp('created_at').defaultNow(),
});
