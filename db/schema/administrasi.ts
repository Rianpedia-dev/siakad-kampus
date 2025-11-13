import { pgTable, serial, varchar, text, boolean, integer, timestamp } from 'drizzle-orm/pg-core';
import { mahasiswa } from './mahasiswa';
import { users } from './users';
import { tahunAkademik } from './akademik';

export const jenisSurat = pgTable('jenis_surat', {
  id: serial('id').primaryKey(),
  namaSurat: varchar('nama_surat', { length: 100 }).notNull(),
  kodeTemplate: varchar('kode_template', { length: 20 }).unique(),
  template: text('template'),
  isActive: boolean('is_active').default(true),
});

export const pengajuanSurat = pgTable('pengajuan_surat', {
  id: serial('id').primaryKey(),
  mahasiswaId: integer('mahasiswa_id').references(() => mahasiswa.id),
  jenisSuratId: integer('jenis_surat_id').references(() => jenisSurat.id),
  keperluan: text('keperluan'),
  status: varchar('status', { length: 20 }).default('pending'), // pending, approved, rejected
  nomorSurat: varchar('nomor_surat', { length: 100 }),
  fileSurat: text('file_surat'),
  processedBy: integer('processed_by').references(() => users.id),
  processedAt: timestamp('processed_at'),
  catatan: text('catatan'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const cutiAkademik = pgTable('cuti_akademik', {
  id: serial('id').primaryKey(),
  mahasiswaId: integer('mahasiswa_id').references(() => mahasiswa.id),
  tahunAkademikId: integer('tahun_akademik_id').references(() => tahunAkademik.id),
  alasan: text('alasan').notNull(),
  filePendukung: text('file_pendukung'),
  status: varchar('status', { length: 20 }).default('pending'),
  approvedBy: integer('approved_by').references(() => users.id),
  approvedAt: timestamp('approved_at'),
  catatan: text('catatan'),
  createdAt: timestamp('created_at').defaultNow(),
});
