import { pgTable, serial, varchar, timestamp, boolean, text, integer } from 'drizzle-orm/pg-core';
import { dosen } from './dosen';

export const programStudi = pgTable('program_studi', {
  id: serial('id').primaryKey(),
  kodeProdi: varchar('kode_prodi', { length: 10 }).unique().notNull(),
  namaProdi: varchar('nama_prodi', { length: 100 }).notNull(),
  jenjang: varchar('jenjang', { length: 10 }), // D3, S1, S2, S3
  fakultas: varchar('fakultas', { length: 100 }),
  kaprodiId: integer('kaprodi_id').references(() => dosen.id),
  akreditasi: varchar('akreditasi', { length: 5 }),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

export const mataKuliah = pgTable('mata_kuliah', {
  id: serial('id').primaryKey(),
  kodeMk: varchar('kode_mk', { length: 20 }).unique().notNull(),
  namaMk: varchar('nama_mk', { length: 100 }).notNull(),
  sks: integer('sks').notNull(),
  semester: integer('semester').notNull(),
  jenis: varchar('jenis', { length: 20 }), // wajib, pilihan
  prodiId: integer('prodi_id').references(() => programStudi.id),
  deskripsi: text('deskripsi'),
  silabus: text('silabus'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const kurikulum = pgTable('kurikulum', {
  id: serial('id').primaryKey(),
  prodiId: integer('prodi_id').references(() => programStudi.id),
  tahunKurikulum: varchar('tahun_kurikulum', { length: 9 }).notNull(), // 2023/2024
  totalSks: integer('total_sks').notNull(),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

export const kurikulumDetail = pgTable('kurikulum_detail', {
  id: serial('id').primaryKey(),
  kurikulumId: integer('kurikulum_id').references(() => kurikulum.id),
  mataKuliahId: integer('mata_kuliah_id').references(() => mataKuliah.id),
  semester: integer('semester').notNull(),
  isWajib: boolean('is_wajib').default(true),
});

export const tahunAkademik = pgTable('tahun_akademik', {
  id: serial('id').primaryKey(),
  tahun: varchar('tahun', { length: 9 }).notNull(), // 2023/2024
  semester: varchar('semester', { length: 10 }).notNull(), // Ganjil, Genap
  tanggalMulai: timestamp('tanggal_mulai').notNull(),
  tanggalSelesai: timestamp('tanggal_selesai').notNull(),
  isActive: boolean('is_active').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export const ruangan = pgTable('ruangan', {
  id: serial('id').primaryKey(),
  kodeRuangan: varchar('kode_ruangan', { length: 20 }).unique().notNull(),
  namaRuangan: varchar('nama_ruangan', { length: 50 }),
  gedung: varchar('gedung', { length: 50 }),
  lantai: integer('lantai'),
  kapasitas: integer('kapasitas'),
  fasilitas: text('fasilitas'),
  isActive: boolean('is_active').default(true),
});

export const kelas = pgTable('kelas', {
  id: serial('id').primaryKey(),
  kodeKelas: varchar('kode_kelas', { length: 20 }).notNull(),
  mataKuliahId: integer('mata_kuliah_id').references(() => mataKuliah.id),
  dosenId: integer('dosen_id').references(() => dosen.id),
  tahunAkademikId: integer('tahun_akademik_id').references(() => tahunAkademik.id),
  ruanganId: integer('ruangan_id').references(() => ruangan.id),
  kapasitas: integer('kapasitas').default(40),
  kuota: integer('kuota').default(40),
  hari: varchar('hari', { length: 10 }),
  jamMulai: varchar('jam_mulai', { length: 5 }), // HH:MM
  jamSelesai: varchar('jam_selesai', { length: 5 }),
  createdAt: timestamp('created_at').defaultNow(),
});
