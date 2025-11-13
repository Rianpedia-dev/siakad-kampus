import { pgTable, serial, integer, varchar, text, timestamp, decimal } from 'drizzle-orm/pg-core';
import { kelas } from './akademik';
import { dosen } from './dosen';
import { mahasiswa } from './mahasiswa';

export const materi = pgTable('materi', {
  id: serial('id').primaryKey(),
  kelasId: integer('kelas_id').references(() => kelas.id),
  judulMateri: varchar('judul_materi', { length: 200 }).notNull(),
  deskripsi: text('deskripsi'),
  fileUrl: text('file_url'),
  fileType: varchar('file_type', { length: 20 }), // pdf, ppt, video
  uploadedBy: integer('uploaded_by').references(() => dosen.id),
  createdAt: timestamp('created_at').defaultNow(),
});

export const tugas = pgTable('tugas', {
  id: serial('id').primaryKey(),
  kelasId: integer('kelas_id').references(() => kelas.id),
  judulTugas: varchar('judul_tugas', { length: 200 }).notNull(),
  deskripsi: text('deskripsi'),
  deadline: timestamp('deadline').notNull(),
  maxFile: integer('max_file').default(1),
  createdBy: integer('created_by').references(() => dosen.id),
  createdAt: timestamp('created_at').defaultNow(),
});

export const tugasSubmission = pgTable('tugas_submission', {
  id: serial('id').primaryKey(),
  tugasId: integer('tugas_id').references(() => tugas.id),
  mahasiswaId: integer('mahasiswa_id').references(() => mahasiswa.id),
  fileUrl: text('file_url'),
  catatan: text('catatan'),
  nilai: decimal('nilai', { precision: 5, scale: 2 }),
  feedback: text('feedback'),
  submittedAt: timestamp('submitted_at').defaultNow(),
  gradedAt: timestamp('graded_at'),
});
