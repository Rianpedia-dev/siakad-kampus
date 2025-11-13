import { pgTable, serial, integer, varchar, timestamp, text } from 'drizzle-orm/pg-core';
import { mahasiswa } from './mahasiswa';
import { tahunAkademik, kelas } from './akademik';
import { users } from './users';

export const krs = pgTable('krs', {
  id: serial('id').primaryKey(),
  mahasiswaId: integer('mahasiswa_id').references(() => mahasiswa.id),
  tahunAkademikId: integer('tahun_akademik_id').references(() => tahunAkademik.id),
  totalSks: integer('total_sks').default(0),
  status: varchar('status', { length: 20 }).default('draft'), // draft, submitted, approved, rejected
  approvedBy: integer('approved_by').references(() => users.id),
  approvedAt: timestamp('approved_at'),
  catatan: text('catatan'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const krsDetail = pgTable('krs_detail', {
  id: serial('id').primaryKey(),
  krsId: integer('krs_id').references(() => krs.id),
  kelasId: integer('kelas_id').references(() => kelas.id),
  createdAt: timestamp('created_at').defaultNow(),
});
