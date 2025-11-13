import { pgTable, serial, varchar, timestamp, text, integer } from 'drizzle-orm/pg-core';
import { users } from './users';

export const dosen = pgTable('dosen', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).unique(),
  nip: varchar('nip', { length: 20 }).unique().notNull(),
  nidn: varchar('nidn', { length: 20 }).unique(),
  namaLengkap: varchar('nama_lengkap', { length: 100 }).notNull(),
  tempatLahir: varchar('tempat_lahir', { length: 50 }),
  tanggalLahir: timestamp('tanggal_lahir'),
  jenisKelamin: varchar('jenis_kelamin', { length: 10 }),
  alamat: text('alamat'),
  noTelp: varchar('no_telp', { length: 20 }),
  email: varchar('email', { length: 100 }),
  pendidikanTerakhir: varchar('pendidikan_terakhir', { length: 10 }), // S1, S2, S3
  bidangKeahlian: text('bidang_keahlian'),
  status: varchar('status', { length: 20 }).default('aktif'),
  foto: text('foto'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
