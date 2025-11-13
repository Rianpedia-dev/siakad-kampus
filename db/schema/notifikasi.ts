import { pgTable, serial, varchar, text, boolean, integer, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users';

export const pengumuman = pgTable('pengumuman', {
  id: serial('id').primaryKey(),
  judul: varchar('judul', { length: 200 }).notNull(),
  konten: text('konten').notNull(),
  kategori: varchar('kategori', { length: 50 }), // akademik, umum, event
  targetRole: varchar('target_role', { length: 50 }), // all, mahasiswa, dosen
  isPinned: boolean('is_pinned').default(false),
  publishedBy: integer('published_by').references(() => users.id),
  publishedAt: timestamp('published_at'),
  expiresAt: timestamp('expires_at'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const notifikasi = pgTable('notifikasi', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  judul: varchar('judul', { length: 200 }).notNull(),
  pesan: text('pesan').notNull(),
  tipe: varchar('tipe', { length: 50 }), // info, warning, success, error
  isRead: boolean('is_read').default(false),
  link: text('link'),
  createdAt: timestamp('created_at').defaultNow(),
});
