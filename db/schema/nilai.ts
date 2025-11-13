import { pgTable, serial, varchar, integer, text, decimal, timestamp } from 'drizzle-orm/pg-core';
import { krsDetail } from './krs';

export const komponenNilai = pgTable('komponen_nilai', {
  id: serial('id').primaryKey(),
  namaKomponen: varchar('nama_komponen', { length: 50 }).notNull(), // UTS, UAS, Tugas, Quiz
  bobot: integer('bobot').notNull(), // persentase
  deskripsi: text('deskripsi'),
});

export const nilai = pgTable('nilai', {
  id: serial('id').primaryKey(),
  krsDetailId: integer('krs_detail_id').references(() => krsDetail.id),
  komponenNilaiId: integer('komponen_nilai_id').references(() => komponenNilai.id),
  nilai: decimal('nilai', { precision: 5, scale: 2 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const nilaiAkhir = pgTable('nilai_akhir', {
  id: serial('id').primaryKey(),
  krsDetailId: integer('krs_detail_id').references(() => krsDetail.id),
  nilaiAngka: decimal('nilai_angka', { precision: 5, scale: 2 }),
  nilaiHuruf: varchar('nilai_huruf', { length: 2 }), // A, B+, B, C+, C, D, E
  nilaiIndeks: decimal('nilai_indeks', { precision: 3, scale: 2 }), // 4.00, 3.50, dst
  status: varchar('status', { length: 20 }), // lulus, tidak_lulus
  createdAt: timestamp('created_at').defaultNow(),
});
