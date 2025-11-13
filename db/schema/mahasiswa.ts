import { pgTable, serial, varchar, timestamp, text, integer, decimal } from 'drizzle-orm/pg-core';
import { users } from './users';
import { programStudi } from './akademik';
import { dosen } from './dosen';

export const mahasiswa = pgTable('mahasiswa', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).unique(),
  nim: varchar('nim', { length: 20 }).unique().notNull(),
  namaLengkap: varchar('nama_lengkap', { length: 100 }).notNull(),
  tempatLahir: varchar('tempat_lahir', { length: 50 }),
  tanggalLahir: timestamp('tanggal_lahir'),
  jenisKelamin: varchar('jenis_kelamin', { length: 10 }),
  alamat: text('alamat'),
  noTelp: varchar('no_telp', { length: 20 }),
  prodiId: integer('prodi_id').references(() => programStudi.id),
  angkatan: varchar('angkatan', { length: 4 }),
  semester: integer('semester').default(1),
  status: varchar('status', { length: 20 }).default('aktif'), // aktif, cuti, lulus, dropout
  dosenPaId: integer('dosen_pa_id').references(() => dosen.id),
  foto: text('foto'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const mahasiswaDetail = pgTable('mahasiswa_detail', {
  id: serial('id').primaryKey(),
  mahasiswaId: integer('mahasiswa_id').references(() => mahasiswa.id).unique(),
  ipk: decimal('ipk', { precision: 3, scale: 2 }).default('0.00'),
  totalSks: integer('total_sks').default(0),
  sksLulus: integer('sks_lulus').default(0),
  nikOrtu: varchar('nik_ortu', { length: 20 }),
  namaOrtu: varchar('nama_ortu', { length: 100 }),
  pekerjaanOrtu: varchar('pekerjaan_ortu', { length: 50 }),
  penghasilanOrtu: varchar('penghasilan_ortu', { length: 50 }),
});
