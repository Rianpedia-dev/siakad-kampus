import { pgTable, serial, varchar, decimal, text, boolean, integer, timestamp } from 'drizzle-orm/pg-core';
import { mahasiswa } from './mahasiswa';
import { tahunAkademik } from './akademik';
import { users } from './users';

export const jenisPembayaran = pgTable('jenis_pembayaran', {
  id: serial('id').primaryKey(),
  namaJenis: varchar('nama_jenis', { length: 100 }).notNull(),
  nominal: decimal('nominal', { precision: 12, scale: 2 }).notNull(),
  keterangan: text('keterangan'),
  isActive: boolean('is_active').default(true),
});

export const pembayaran = pgTable('pembayaran', {
  id: serial('id').primaryKey(),
  mahasiswaId: integer('mahasiswa_id').references(() => mahasiswa.id),
  jenisPembayaranId: integer('jenis_pembayaran_id').references(() => jenisPembayaran.id),
  tahunAkademikId: integer('tahun_akademik_id').references(() => tahunAkademik.id),
  nominal: decimal('nominal', { precision: 12, scale: 2 }).notNull(),
  tanggalBayar: timestamp('tanggal_bayar').notNull(),
  metodePembayaran: varchar('metode_pembayaran', { length: 50 }),
  nomorReferensi: varchar('nomor_referensi', { length: 100 }),
  status: varchar('status', { length: 20 }).default('pending'), // pending, verified, rejected
  buktiUrl: text('bukti_url'),
  verifiedBy: integer('verified_by').references(() => users.id),
  verifiedAt: timestamp('verified_at'),
  createdAt: timestamp('created_at').defaultNow(),
});
