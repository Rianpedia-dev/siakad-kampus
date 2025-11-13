# Dokumentasi Sistem Informasi Akademik (SIAKAD)
## Tech Stack: Next.js 15, Drizzle ORM, PostgreSQL, Docker, TypeScript, shadcn/ui

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [Technology Stack](#technology-stack)
4. [Database Schema](#database-schema)
5. [Project Structure](#project-structure)
6. [Setup Instructions](#setup-instructions)
7. [API Routes](#api-routes)
8. [Authentication & Authorization](#authentication--authorization)
9. [Feature Implementation](#feature-implementation)
10. [Deployment](#deployment)

---

## 1. Project Overview

### 1.1 Deskripsi Sistem
SIAKAD adalah sistem manajemen akademik berbasis web yang melayani tiga role utama:
- **Mahasiswa**: Mengelola KRS, melihat nilai, presensi, dan materi kuliah
- **Dosen**: Input nilai, presensi, upload materi, dan manajemen kelas
- **Admin**: Manajemen master data, penjadwalan, dan reporting

### 1.2 Fitur Utama
- Multi-role authentication & authorization
- Manajemen akademik (KRS, KHS, Jadwal, Presensi)
- Manajemen perkuliahan (Materi, Tugas, Nilai)
- Administrasi (Pembayaran, Surat, Laporan)
- Real-time notifications
- Export/Import data (Excel, PDF)

---

## 2. System Architecture

### 2.1 Architecture Diagram
```
┌─────────────────────────────────────────────────────┐
│                  Client Layer                        │
│  (Next.js 14 App Router + shadcn/ui + TailwindCSS) │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│              API Layer (Next.js API Routes)          │
│  - RESTful endpoints                                 │
│  - Server Actions (Next.js 15)                       │
│  - Middleware (Auth, CORS, Rate Limiting)            │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│           Business Logic Layer                       │
│  - Services (Academic, Admin, Student, Lecturer)     │
│  - Validators (Zod schemas)                          │
│  - Utils (PDF generator, Excel parser, etc)          │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│              Data Access Layer                       │
│  - Drizzle ORM                                       │
│  - Query builders                                    │
│  - Migrations                                        │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│              PostgreSQL Database                     │
│  (Running in Docker container)                       │
└─────────────────────────────────────────────────────┘
```

### 2.2 User Flow Architecture
Berdasarkan diagram yang diberikan:
- **Authentication Layer**: Login → Role Detection → Route ke dashboard sesuai role
- **Mahasiswa Flow**: Dashboard → Akademik/Perkuliahan/Keuangan → Actions
- **Dosen Flow**: Dashboard → Perkuliahan/Jadwal/Bimbingan → Actions
- **Admin Flow**: Dashboard → Master Data/Akademik/Laporan → CRUD Operations

---

## 3. Technology Stack

### 3.1 Frontend
```json
{
  "next": "^14.2.0",
  "react": "^18.3.0",
  "typescript": "^5.4.0",
  "@radix-ui/react-*": "latest",
  "tailwindcss": "^3.4.0",
  "shadcn/ui": "latest",
  "react-hook-form": "^7.51.0",
  "zod": "^3.22.0",
  "lucide-react": "^0.363.0",
  "recharts": "^2.12.0",
  "date-fns": "^3.6.0"
}
```

### 3.2 Backend
```json
{
  "drizzle-orm": "^0.30.0",
  "drizzle-kit": "^0.20.0",
  "postgres": "^3.4.0",
  "@auth/drizzle-adapter": "^1.0.0",
  "next-auth": "^5.0.0-beta",
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.0.2",
  "zod": "^3.22.0"
}
```

### 3.3 Utilities
```json
{
  "xlsx": "^0.18.5",
  "jspdf": "^2.5.1",
  "jspdf-autotable": "^3.8.0",
  "nodemailer": "^6.9.0",
  "sharp": "^0.33.0",
  "@uploadthing/react": "^6.4.0"
}
```

---

## 4. Database Schema

### 4.1 Core Tables

#### Users & Authentication
```typescript
// src/db/schema/users.ts
import { pgTable, serial, varchar, timestamp, boolean, text } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 50 }).unique().notNull(),
  email: varchar('email', { length: 100 }).unique().notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  role: varchar('role', { length: 20 }).notNull(), // 'mahasiswa', 'dosen', 'admin'
  isActive: boolean('is_active').default(true),
  lastLogin: timestamp('last_login'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const sessions = pgTable('sessions', {
  id: serial('id').primaryKey(),
  userId: serial('user_id').references(() => users.id),
  token: text('token').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});
```

#### Mahasiswa (Students)
```typescript
// src/db/schema/mahasiswa.ts
export const mahasiswa = pgTable('mahasiswa', {
  id: serial('id').primaryKey(),
  userId: serial('user_id').references(() => users.id).unique(),
  nim: varchar('nim', { length: 20 }).unique().notNull(),
  namaLengkap: varchar('nama_lengkap', { length: 100 }).notNull(),
  tempatLahir: varchar('tempat_lahir', { length: 50 }),
  tanggalLahir: timestamp('tanggal_lahir'),
  jenisKelamin: varchar('jenis_kelamin', { length: 10 }),
  alamat: text('alamat'),
  noTelp: varchar('no_telp', { length: 20 }),
  prodiId: serial('prodi_id').references(() => programStudi.id),
  angkatan: varchar('angkatan', { length: 4 }),
  semester: integer('semester').default(1),
  status: varchar('status', { length: 20 }).default('aktif'), // aktif, cuti, lulus, dropout
  dosenPaId: serial('dosen_pa_id').references(() => dosen.id),
  foto: text('foto'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const mahasiswaDetail = pgTable('mahasiswa_detail', {
  id: serial('id').primaryKey(),
  mahasiswaId: serial('mahasiswa_id').references(() => mahasiswa.id).unique(),
  ipk: decimal('ipk', { precision: 3, scale: 2 }).default('0.00'),
  totalSks: integer('total_sks').default(0),
  sksLulus: integer('sks_lulus').default(0),
  nikOrtu: varchar('nik_ortu', { length: 20 }),
  namaOrtu: varchar('nama_ortu', { length: 100 }),
  pekerjaanOrtu: varchar('pekerjaan_ortu', { length: 50 }),
  penghasilanOrtu: varchar('penghasilan_ortu', { length: 50 }),
});
```

#### Dosen (Lecturers)
```typescript
// src/db/schema/dosen.ts
export const dosen = pgTable('dosen', {
  id: serial('id').primaryKey(),
  userId: serial('user_id').references(() => users.id).unique(),
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
```

#### Program Studi & Kurikulum
```typescript
// src/db/schema/akademik.ts
export const programStudi = pgTable('program_studi', {
  id: serial('id').primaryKey(),
  kodeProdi: varchar('kode_prodi', { length: 10 }).unique().notNull(),
  namaProdi: varchar('nama_prodi', { length: 100 }).notNull(),
  jenjang: varchar('jenjang', { length: 10 }), // D3, S1, S2, S3
  fakultas: varchar('fakultas', { length: 100 }),
  kaprodiId: serial('kaprodi_id').references(() => dosen.id),
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
  prodiId: serial('prodi_id').references(() => programStudi.id),
  deskripsi: text('deskripsi'),
  silabus: text('silabus'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const kurikulum = pgTable('kurikulum', {
  id: serial('id').primaryKey(),
  prodiId: serial('prodi_id').references(() => programStudi.id),
  tahunKurikulum: varchar('tahun_kurikulum', { length: 9 }).notNull(), // 2023/2024
  totalSks: integer('total_sks').notNull(),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

export const kurikulumDetail = pgTable('kurikulum_detail', {
  id: serial('id').primaryKey(),
  kurikulumId: serial('kurikulum_id').references(() => kurikulum.id),
  mataKuliahId: serial('mata_kuliah_id').references(() => mataKuliah.id),
  semester: integer('semester').notNull(),
  isWajib: boolean('is_wajib').default(true),
});
```

#### Tahun Akademik & Kelas
```typescript
export const tahunAkademik = pgTable('tahun_akademik', {
  id: serial('id').primaryKey(),
  tahun: varchar('tahun', { length: 9 }).notNull(), // 2023/2024
  semester: varchar('semester', { length: 10 }).notNull(), // Ganjil, Genap
  tanggalMulai: timestamp('tanggal_mulai').notNull(),
  tanggalSelesai: timestamp('tanggal_selesai').notNull(),
  isActive: boolean('is_active').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export const kelas = pgTable('kelas', {
  id: serial('id').primaryKey(),
  kodeKelas: varchar('kode_kelas', { length: 20 }).notNull(),
  mataKuliahId: serial('mata_kuliah_id').references(() => mataKuliah.id),
  dosenId: serial('dosen_id').references(() => dosen.id),
  tahunAkademikId: serial('tahun_akademik_id').references(() => tahunAkademik.id),
  ruanganId: serial('ruangan_id').references(() => ruangan.id),
  kapasitas: integer('kapasitas').default(40),
  kuota: integer('kuota').default(40),
  hari: varchar('hari', { length: 10 }),
  jamMulai: varchar('jam_mulai', { length: 5 }), // HH:MM
  jamSelesai: varchar('jam_selesai', { length: 5 }),
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
```

#### KRS (Study Plan Card)
```typescript
// src/db/schema/krs.ts
export const krs = pgTable('krs', {
  id: serial('id').primaryKey(),
  mahasiswaId: serial('mahasiswa_id').references(() => mahasiswa.id),
  tahunAkademikId: serial('tahun_akademik_id').references(() => tahunAkademik.id),
  totalSks: integer('total_sks').default(0),
  status: varchar('status', { length: 20 }).default('draft'), // draft, submitted, approved, rejected
  approvedBy: serial('approved_by').references(() => users.id),
  approvedAt: timestamp('approved_at'),
  catatan: text('catatan'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const krsDetail = pgTable('krs_detail', {
  id: serial('id').primaryKey(),
  krsId: serial('krs_id').references(() => krs.id),
  kelasId: serial('kelas_id').references(() => kelas.id),
  createdAt: timestamp('created_at').defaultNow(),
});
```

#### Presensi (Attendance)
```typescript
// src/db/schema/presensi.ts
export const pertemuan = pgTable('pertemuan', {
  id: serial('id').primaryKey(),
  kelasId: serial('kelas_id').references(() => kelas.id),
  pertemuanKe: integer('pertemuan_ke').notNull(),
  tanggal: timestamp('tanggal').notNull(),
  topik: text('topik'),
  materi: text('materi'),
  dosenId: serial('dosen_id').references(() => dosen.id),
  createdAt: timestamp('created_at').defaultNow(),
});

export const presensi = pgTable('presensi', {
  id: serial('id').primaryKey(),
  pertemuanId: serial('pertemuan_id').references(() => pertemuan.id),
  mahasiswaId: serial('mahasiswa_id').references(() => mahasiswa.id),
  status: varchar('status', { length: 10 }).notNull(), // hadir, izin, sakit, alpa
  keterangan: text('keterangan'),
  createdAt: timestamp('created_at').defaultNow(),
});
```

#### Nilai (Grades)
```typescript
// src/db/schema/nilai.ts
export const komponenNilai = pgTable('komponen_nilai', {
  id: serial('id').primaryKey(),
  namaKomponen: varchar('nama_komponen', { length: 50 }).notNull(), // UTS, UAS, Tugas, Quiz
  bobot: integer('bobot').notNull(), // persentase
  deskripsi: text('deskripsi'),
});

export const nilai = pgTable('nilai', {
  id: serial('id').primaryKey(),
  krsDetailId: serial('krs_detail_id').references(() => krsDetail.id),
  komponenNilaiId: serial('komponen_nilai_id').references(() => komponenNilai.id),
  nilai: decimal('nilai', { precision: 5, scale: 2 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const nilaiAkhir = pgTable('nilai_akhir', {
  id: serial('id').primaryKey(),
  krsDetailId: serial('krs_detail_id').references(() => krsDetail.id),
  nilaiAngka: decimal('nilai_angka', { precision: 5, scale: 2 }),
  nilaiHuruf: varchar('nilai_huruf', { length: 2 }), // A, B+, B, C+, C, D, E
  nilaiIndeks: decimal('nilai_indeks', { precision: 3, scale: 2 }), // 4.00, 3.50, dst
  status: varchar('status', { length: 20 }), // lulus, tidak_lulus
  createdAt: timestamp('created_at').defaultNow(),
});
```

#### Materi & Tugas
```typescript
// src/db/schema/pembelajaran.ts
export const materi = pgTable('materi', {
  id: serial('id').primaryKey(),
  kelasId: serial('kelas_id').references(() => kelas.id),
  judulMateri: varchar('judul_materi', { length: 200 }).notNull(),
  deskripsi: text('deskripsi'),
  fileUrl: text('file_url'),
  fileType: varchar('file_type', { length: 20 }), // pdf, ppt, video
  uploadedBy: serial('uploaded_by').references(() => dosen.id),
  createdAt: timestamp('created_at').defaultNow(),
});

export const tugas = pgTable('tugas', {
  id: serial('id').primaryKey(),
  kelasId: serial('kelas_id').references(() => kelas.id),
  judulTugas: varchar('judul_tugas', { length: 200 }).notNull(),
  deskripsi: text('deskripsi'),
  deadline: timestamp('deadline').notNull(),
  maxFile: integer('max_file').default(1),
  createdBy: serial('created_by').references(() => dosen.id),
  createdAt: timestamp('created_at').defaultNow(),
});

export const tugasSubmission = pgTable('tugas_submission', {
  id: serial('id').primaryKey(),
  tugasId: serial('tugas_id').references(() => tugas.id),
  mahasiswaId: serial('mahasiswa_id').references(() => mahasiswa.id),
  fileUrl: text('file_url'),
  catatan: text('catatan'),
  nilai: decimal('nilai', { precision: 5, scale: 2 }),
  feedback: text('feedback'),
  submittedAt: timestamp('submitted_at').defaultNow(),
  gradedAt: timestamp('graded_at'),
});
```

#### Pembayaran (Payment)
```typescript
// src/db/schema/keuangan.ts
export const jenisPembayaran = pgTable('jenis_pembayaran', {
  id: serial('id').primaryKey(),
  namaJenis: varchar('nama_jenis', { length: 100 }).notNull(),
  nominal: decimal('nominal', { precision: 12, scale: 2 }).notNull(),
  keterangan: text('keterangan'),
  isActive: boolean('is_active').default(true),
});

export const pembayaran = pgTable('pembayaran', {
  id: serial('id').primaryKey(),
  mahasiswaId: serial('mahasiswa_id').references(() => mahasiswa.id),
  jenisPembayaranId: serial('jenis_pembayaran_id').references(() => jenisPembayaran.id),
  tahunAkademikId: serial('tahun_akademik_id').references(() => tahunAkademik.id),
  nominal: decimal('nominal', { precision: 12, scale: 2 }).notNull(),
  tanggalBayar: timestamp('tanggal_bayar').notNull(),
  metodePembayaran: varchar('metode_pembayaran', { length: 50 }),
  nomorReferensi: varchar('nomor_referensi', { length: 100 }),
  status: varchar('status', { length: 20 }).default('pending'), // pending, verified, rejected
  buktiUrl: text('bukti_url'),
  verifiedBy: serial('verified_by').references(() => users.id),
  verifiedAt: timestamp('verified_at'),
  createdAt: timestamp('created_at').defaultNow(),
});
```

#### Surat & Administrasi
```typescript
// src/db/schema/administrasi.ts
export const jenisSurat = pgTable('jenis_surat', {
  id: serial('id').primaryKey(),
  namaSurat: varchar('nama_surat', { length: 100 }).notNull(),
  kodeTemplate: varchar('kode_template', { length: 20 }).unique(),
  template: text('template'),
  isActive: boolean('is_active').default(true),
});

export const pengajuanSurat = pgTable('pengajuan_surat', {
  id: serial('id').primaryKey(),
  mahasiswaId: serial('mahasiswa_id').references(() => mahasiswa.id),
  jenisSuratId: serial('jenis_surat_id').references(() => jenisSurat.id),
  keperluan: text('keperluan'),
  status: varchar('status', { length: 20 }).default('pending'), // pending, approved, rejected
  nomorSurat: varchar('nomor_surat', { length: 100 }),
  fileSurat: text('file_surat'),
  processedBy: serial('processed_by').references(() => users.id),
  processedAt: timestamp('processed_at'),
  catatan: text('catatan'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const cutiAkademik = pgTable('cuti_akademik', {
  id: serial('id').primaryKey(),
  mahasiswaId: serial('mahasiswa_id').references(() => mahasiswa.id),
  tahunAkademikId: serial('tahun_akademik_id').references(() => tahunAkademik.id),
  alasan: text('alasan').notNull(),
  filePendukung: text('file_pendukung'),
  status: varchar('status', { length: 20 }).default('pending'),
  approvedBy: serial('approved_by').references(() => users.id),
  approvedAt: timestamp('approved_at'),
  catatan: text('catatan'),
  createdAt: timestamp('created_at').defaultNow(),
});
```

#### Pengumuman & Notifikasi
```typescript
// src/db/schema/notifikasi.ts
export const pengumuman = pgTable('pengumuman', {
  id: serial('id').primaryKey(),
  judul: varchar('judul', { length: 200 }).notNull(),
  konten: text('konten').notNull(),
  kategori: varchar('kategori', { length: 50 }), // akademik, umum, event
  targetRole: varchar('target_role', { length: 50 }), // all, mahasiswa, dosen
  isPinned: boolean('is_pinned').default(false),
  publishedBy: serial('published_by').references(() => users.id),
  publishedAt: timestamp('published_at'),
  expiresAt: timestamp('expires_at'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const notifikasi = pgTable('notifikasi', {
  id: serial('id').primaryKey(),
  userId: serial('user_id').references(() => users.id),
  judul: varchar('judul', { length: 200 }).notNull(),
  pesan: text('pesan').notNull(),
  tipe: varchar('tipe', { length: 50 }), // info, warning, success, error
  isRead: boolean('is_read').default(false),
  link: text('link'),
  createdAt: timestamp('created_at').defaultNow(),
});
```

#### Activity Log
```typescript
// src/db/schema/logs.ts
export const activityLog = pgTable('activity_log', {
  id: serial('id').primaryKey(),
  userId: serial('user_id').references(() => users.id),
  action: varchar('action', { length: 100 }).notNull(),
  module: varchar('module', { length: 50 }),
  description: text('description'),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow(),
});
```

### 4.2 Database Relations
```typescript
// src/db/schema/relations.ts
import { relations } from 'drizzle-orm';

export const usersRelations = relations(users, ({ one, many }) => ({
  mahasiswa: one(mahasiswa, {
    fields: [users.id],
    references: [mahasiswa.userId],
  }),
  dosen: one(dosen, {
    fields: [users.id],
    references: [dosen.userId],
  }),
  sessions: many(sessions),
  activityLogs: many(activityLog),
}));

export const mahasiswaRelations = relations(mahasiswa, ({ one, many }) => ({
  user: one(users, {
    fields: [mahasiswa.userId],
    references: [users.id],
  }),
  prodi: one(programStudi, {
    fields: [mahasiswa.prodiId],
    references: [programStudi.id],
  }),
  dosenPa: one(dosen, {
    fields: [mahasiswa.dosenPaId],
    references: [dosen.id],
  }),
  krs: many(krs),
  pembayaran: many(pembayaran),
  presensi: many(presensi),
}));

// ... tambahkan relations lainnya
```

---

## 5. Project Structure

```
siakad-kampus/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   └── forgot-password/
│   │   │       └── page.tsx
│   │   ├── (mahasiswa)/
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── akademik/
│   │   │   │   ├── krs/
│   │   │   │   ├── khs/
│   │   │   │   ├── jadwal/
│   │   │   │   ├── presensi/
│   │   │   │   └── transkrip/
│   │   │   ├── perkuliahan/
│   │   │   │   ├── materi/
│   │   │   │   └── tugas/
│   │   │   ├── keuangan/
│   │   │   ├── administrasi/
│   │   │   └── profil/
│   │   ├── (dosen)/
│   │   │   ├── dashboard/
│   │   │   ├── perkuliahan/
│   │   │   │   ├── presensi/
│   │   │   │   ├── nilai/
│   │   │   │   ├── materi/
│   │   │   │   └── tugas/
│   │   │   ├── jadwal/
│   │   │   ├── mahasiswa/
│   │   │   ├── bimbingan/
│   │   │   └── profil/
│   │   ├── (admin)/
│   │   │   ├── dashboard/
│   │   │   ├── master-data/
│   │   │   │   ├── mahasiswa/
│   │   │   │   ├── dosen/
│   │   │   │   ├── mata-kuliah/
│   │   │   │   ├── ruangan/
│   │   │   │   └── prodi/
│   │   │   ├── akademik/
│   │   │   │   ├── penjadwalan/
│   │   │   │   ├── krs/
│   │   │   │   └── kelas/
│   │   │   ├── keuangan/
│   │   │   ├── laporan/
│   │   │   ├── pengumuman/
│   │   │   └── users/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/
│   │   │   │       └── route.ts
│   │   │   ├── mahasiswa/
│   │   │   │   ├── krs/
│   │   │   │   ├── khs/
│   │   │   │   ├── nilai/
│   │   │   │   └── presensi/
│   │   │   ├── dosen/
│   │   │   │   ├── kelas/
│   │   │   │   ├── presensi/
│   │   │   │   ├── nilai/
│   │   │   │   └── materi/
│   │   │   ├── admin/
│   │   │   │   ├── mahasiswa/
│   │   │   │   ├── dosen/
│   │   │   │   ├── mata-kuliah/
│   │   │   │   └── jadwal/
│   │   │   └── upload/
│   │   │       └── route.ts
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── table.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── select.tsx
│   │   │   └── ...
│   │   ├── layouts/
│   │   │   ├── MainLayout.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Navbar.tsx
│   │   │   └── Footer.tsx
│   │   ├── mahasiswa/
│   │   │   ├── KRSForm.tsx
│   │   │   ├── KHSTable.tsx
│   │   │   ├── JadwalCard.tsx
│   │   │   └── PresensiTable.tsx
│   │   ├── dosen/
│   │   │   ├── PresensiInput.tsx
│   │   │   ├── NilaiForm.tsx
│   │   │   └── MateriUpload.tsx
│   │   ├── admin/
│   │   │   ├── MahasiswaTable.tsx
│   │   │   ├── JadwalBuilder.tsx
│   │   │   └── ImportExcel.tsx
│   │   └── shared/
│   │       ├── LoadingSpinner.tsx
│   │       ├── ErrorBoundary.tsx
│   │       ├── DataTable.tsx
│   │       └── FileUpload.tsx
│   ├── db/
│   │   ├── index.ts         # Database connection
│   │   ├── schema/
│   │   │   ├── users.ts
│   │   │   ├── mahasiswa.ts
│   │   │   ├── dosen.ts
│   │   │   ├── akademik.ts
│   │   │   ├── krs.ts
│   │   │   ├── nilai.ts
│   │   │   ├── presensi.ts
│   │   │   ├── pembelajaran.ts
│   │   │   ├── keuangan.ts
│   │   │   ├── administrasi.ts
│   │   │   ├── notifikasi.ts
│   │   │   ├── logs.ts
│   │   │   └── relations.ts
│   │   └── migrations/
│   ├── lib/
│   │   ├── auth.ts          # NextAuth config
│   │   ├── utils.ts         # Utility functions
│   │   ├── validations.ts   # Zod schemas
│   │   ├── constants.ts
│   │   └── helpers/
│   │       ├── pdf-generator.ts
│   │       ├── excel-parser.ts
│   │       ├── email-sender.ts
│   │       └── file-uploader.ts
│   ├── services/
│   │   ├── mahasiswa.service.ts
│   │   ├── dosen.service.ts
│   │   ├── admin.service.ts
│   │   ├── krs.service.ts
│   │   ├── nilai.service.ts
│   │   ├── presensi.service.ts
│   │   ├── pembayaran.service.ts
│   │   └── notification.service.ts
│   ├── types/
│   │   ├── index.ts
│   │   ├── api.types.ts
│   │   ├── database.types.ts
│   │   └── component.types.ts
│   └── middleware.ts        # Route protection
├── public/
│   ├── images/
│   ├── documents/
│   └── uploads/
├── drizzle/
│   └── migrations/
├── .env.local
├── .env.example
├── docker-compose.yml
├── Dockerfile
├── drizzle.config.ts
├── next.config.js
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

---

## 6. Setup Instructions

### 6.1 Prerequisites
```bash
- Node.js >= 18.x
- Docker & Docker Compose
- npm
- PostgreSQL 15+ (via Docker)
```

### 6.2 Initial Setup

#### Step 1: Clone & Install Dependencies
```bash
# Create project
npx create-next-app@latest siakad-nextjs --typescript --tailwind --app

# Navigate to project
cd siakad-kampus

# Install dependencies
npm install

# Install additional packages
npm add drizzle-orm postgres
npm add -D drizzle-kit

# Install shadcn/ui
npm dlx shadcn-ui@latest init

# Install UI components
npm dlx shadcn-ui@latest add button input card table dialog select form dropdown-menu

# Install other dependencies
npm add next-auth @auth/drizzle-adapter bcryptjs zod react-hook-form @hookform/resolvers
npm add date-fns recharts lucide-react
npm add xlsx jspdf jspdf-autotable nodemailer
npm add @uploadthing/react uploadthing
```

#### Step 2: Docker Setup
```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: siakad_postgres
    environment:
      POSTGRES_USER: siakad_user
      POSTGRES_PASSWORD: siakad_password
      POSTGRES_DB: siakad_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - siakad_network

  pgadmin:
    image: dpage/pgadmin4
    container_name: siakad_pgadmin
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@siakad.com
      PGADMIN_DEFAULT_PASSWORD: admin123
    ports:
      - "5050:80"
    depends_on:
      - postgres
    networks:
      - siakad_network

  redis:
    image: redis:7-alpine
    container_name: siakad_redis
    ports:
      - "6379:6379"
    networks:
      - siakad_network

volumes:
  postgres_data:

networks:
  siakad_network:
    driver: bridge
```

```bash
# Start Docker containers
docker-compose up -d

# Check containers
docker ps
```

#### Step 3: Environment Variables
```bash
# .env.local
# Database
DATABASE_URL="postgresql://siakad_user:siakad_password@localhost:5432/siakad_db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-generate-with-openssl"
# Generate with: openssl rand -base64 32

# Redis (for sessions/cache)
REDIS_URL="redis://localhost:6379"

# Email (NodeMailer)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="noreply@siakad.com"

# Upload (UploadThing or AWS S3)
UPLOADTHING_SECRET="your-uploadthing-secret"
UPLOADTHING_APP_ID="your-uploadthing-app-id"

# AWS S3 (alternative)
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_REGION="ap-southeast-1"
AWS_BUCKET_NAME="siakad-uploads"

# App Config
NEXT_PUBLIC_APP_NAME="SIAKAD"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

#### Step 4: Drizzle Configuration
```typescript
// drizzle.config.ts
import type { Config } from 'drizzle-kit';

export default {
  schema: './src/db/schema/*.ts',
  out: './drizzle/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
} satisfies Config;
```

```typescript
// src/db/index.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL!;

// For queries
const client = postgres(connectionString);
export const db = drizzle(client, { schema });

// For migrations
export const migrationClient = postgres(connectionString, { max: 1 });
```

#### Step 5: Generate & Run Migrations
```bash
# Generate migration files
npm drizzle-kit generate:pg

# Push schema to database
npm drizzle-kit push:pg

# Or run migrations
npm drizzle-kit migrate
```

#### Step 6: Seed Database
```typescript
// src/db/seed.ts
import { db } from './index';
import { users, mahasiswa, dosen, programStudi } from './schema';
import bcrypt from 'bcryptjs';

async function seed() {
  console.log('Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const [admin] = await db.insert(users).values({
    username: 'admin',
    email: 'admin@siakad.com',
    password: adminPassword,
    role: 'admin',
  }).returning();

  // Create program studi
  const [prodi] = await db.insert(programStudi).values({
    kodeProdi: 'TI',
    namaProdi: 'Teknik Informatika',
    jenjang: 'S1',
    fakultas: 'Fakultas Teknik',
  }).returning();

  // Create dosen
  const dosenPassword = await bcrypt.hash('dosen123', 10);
  const [dosenUser] = await db.insert(users).values({
    username: 'dosen001',
    email: 'dosen@siakad.com',
    password: dosenPassword,
    role: 'dosen',
  }).returning();

  await db.insert(dosen).values({
    userId: dosenUser.id,
    nip: '198501012010121001',
    nidn: '0101018501',
    namaLengkap: 'Dr. Budi Santoso, M.Kom',
    jenisKelamin: 'L',
    pendidikanTerakhir: 'S3',
  });

  // Create mahasiswa
  const mahasiswaPassword = await bcrypt.hash('mahasiswa123', 10);
  const [mahasiswaUser] = await db.insert(users).values({
    username: 'mhs001',
    email: 'mahasiswa@siakad.com',
    password: mahasiswaPassword,
    role: 'mahasiswa',
  }).returning();

  await db.insert(mahasiswa).values({
    userId: mahasiswaUser.id,
    nim: '2023010001',
    namaLengkap: 'Ahmad Rizki',
    jenisKelamin: 'L',
    prodiId: prodi.id,
    angkatan: '2023',
    semester: 1,
  });

  console.log('Seeding completed!');
}

seed().catch(console.error);
```

```bash
# Run seed
npm tsx src/db/seed.ts
```

---

## 7. API Routes

### 7.1 Authentication API

```typescript
// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export const authOptions = {
  adapter: DrizzleAdapter(db),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        const user = await db.query.users.findFirst({
          where: eq(users.username, credentials.username),
        });

        if (!user || !user.isActive) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id.toString(),
          username: user.username,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.username = token.username;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

### 7.2 Mahasiswa API Routes

```typescript
// src/app/api/mahasiswa/krs/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { db } from '@/db';
import { krs, krsDetail, kelas, mataKuliah } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

// GET - Fetch KRS by mahasiswa
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'mahasiswa') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const tahunAkademikId = searchParams.get('tahunAkademikId');

    const krsList = await db.query.krs.findMany({
      where: and(
        eq(krs.mahasiswaId, session.user.id),
        tahunAkademikId ? eq(krs.tahunAkademikId, parseInt(tahunAkademikId)) : undefined
      ),
      with: {
        tahunAkademik: true,
        krsDetail: {
          with: {
            kelas: {
              with: {
                mataKuliah: true,
                dosen: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(krsList);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// POST - Create new KRS
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'mahasiswa') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { tahunAkademikId, kelasIds } = body;

    // Calculate total SKS
    const selectedKelas = await db.query.kelas.findMany({
      where: (kelas, { inArray }) => inArray(kelas.id, kelasIds),
      with: { mataKuliah: true },
    });

    const totalSks = selectedKelas.reduce(
      (sum, k) => sum + (k.mataKuliah?.sks || 0),
      0
    );

    // Create KRS
    const [newKrs] = await db.insert(krs).values({
      mahasiswaId: session.user.id,
      tahunAkademikId,
      totalSks,
      status: 'draft',
    }).returning();

    // Create KRS details
    await db.insert(krsDetail).values(
      kelasIds.map((kelasId: number) => ({
        krsId: newKrs.id,
        kelasId,
      }))
    );

    return NextResponse.json(newKrs, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
```

```typescript
// src/app/api/mahasiswa/nilai/route.ts
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'mahasiswa') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const nilaiData = await db.query.nilaiAkhir.findMany({
      where: (nilaiAkhir, { eq, and }) => {
        return eq(krsDetail.mahasiswaId, session.user.id);
      },
      with: {
        krsDetail: {
          with: {
            kelas: {
              with: {
                mataKuliah: true,
                dosen: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(nilaiData);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
```

### 7.3 Dosen API Routes

```typescript
// src/app/api/dosen/presensi/route.ts
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'dosen') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { pertemuanId, presensiData } = body;
    // presensiData: [{ mahasiswaId, status, keterangan }]

    // Bulk insert presensi
    await db.insert(presensi).values(
      presensiData.map((p: any) => ({
        pertemuanId,
        mahasiswaId: p.mahasiswaId,
        status: p.status,
        keterangan: p.keterangan,
      }))
    );

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
```

```typescript
// src/app/api/dosen/nilai/route.ts
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'dosen') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { krsDetailId, komponenNilaiId, nilaiValue } = body;

    const [newNilai] = await db.insert(nilai).values({
      krsDetailId,
      komponenNilaiId,
      nilai: nilaiValue,
    }).returning();

    // Calculate nilai akhir if all components are filled
    await calculateNilaiAkhir(krsDetailId);

    return NextResponse.json(newNilai, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

async function calculateNilaiAkhir(krsDetailId: number) {
  // Get all nilai for this krsDetail
  const nilaiList = await db.query.nilai.findMany({
    where: eq(nilai.krsDetailId, krsDetailId),
    with: { komponenNilai: true },
  });

  // Calculate weighted average
  let totalNilai = 0;
  let totalBobot = 0;

  nilaiList.forEach((n) => {
    totalNilai += parseFloat(n.nilai) * (n.komponenNilai.bobot / 100);
    totalBobot += n.komponenNilai.bobot;
  });

  if (totalBobot === 100) {
    const nilaiAngka = totalNilai;
    const { huruf, indeks } = convertToGrade(nilaiAngka);

    await db.insert(nilaiAkhir).values({
      krsDetailId,
      nilaiAngka,
      nilaiHuruf: huruf,
      nilaiIndeks: indeks,
      status: indeks >= 2.0 ? 'lulus' : 'tidak_lulus',
    }).onConflictDoUpdate({
      target: nilaiAkhir.krsDetailId,
      set: {
        nilaiAngka,
        nilaiHuruf: huruf,
        nilaiIndeks: indeks,
      },
    });
  }
}

function convertToGrade(nilaiAngka: number) {
  if (nilaiAngka >= 85) return { huruf: 'A', indeks: 4.0 };
  if (nilaiAngka >= 80) return { huruf: 'A-', indeks: 3.7 };
  if (nilaiAngka >= 75) return { huruf: 'B+', indeks: 3.3 };
  if (nilaiAngka >= 70) return { huruf: 'B', indeks: 3.0 };
  if (nilaiAngka >= 65) return { huruf: 'B-', indeks: 2.7 };
  if (nilaiAngka >= 60) return { huruf: 'C+', indeks: 2.3 };
  if (nilaiAngka >= 55) return { huruf: 'C', indeks: 2.0 };
  if (nilaiAngka >= 50) return { huruf: 'D', indeks: 1.0 };
  return { huruf: 'E', indeks: 0.0 };
}
```

### 7.4 Admin API Routes

```typescript
// src/app/api/admin/mahasiswa/route.ts
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    const offset = (page - 1) * limit;

    const mahasiswaList = await db.query.mahasiswa.findMany({
      where: search
        ? or(
            like(mahasiswa.nim, `%${search}%`),
            like(mahasiswa.namaLengkap, `%${search}%`)
          )
        : undefined,
      limit,
      offset,
      with: {
        user: true,
        prodi: true,
        dosenPa: true,
      },
    });

    return NextResponse.json(mahasiswaList);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { nim, namaLengkap, email, prodiId, angkatan, ...rest } = body;

    // Create user account
    const password = await bcrypt.hash(nim, 10); // Default password = NIM
    const [user] = await db.insert(users).values({
      username: nim,
      email,
      password,
      role: 'mahasiswa',
    }).returning();

    // Create mahasiswa profile
    const [newMahasiswa] = await db.insert(mahasiswa).values({
      userId: user.id,
      nim,
      namaLengkap,
      prodiId,
      angkatan,
      ...rest,
    }).returning();

    return NextResponse.json(newMahasiswa, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
```

```typescript
// src/app/api/admin/jadwal/route.ts
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      mataKuliahId,
      dosenId,
      tahunAkademikId,
      ruanganId,
      hari,
      jamMulai,
      jamSelesai,
      kapasitas,
    } = body;

    // Generate kode kelas
    const kodeKelas = await generateKodeKelas(mataKuliahId, tahunAkademikId);

    const [newKelas] = await db.insert(kelas).values({
      kodeKelas,
      mataKuliahId,
      dosenId,
      tahunAkademikId,
      ruanganId,
      hari,
      jamMulai,
      jamSelesai,
      kapasitas,
      kuota: kapasitas,
    }).returning();

    return NextResponse.json(newKelas, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

async function generateKodeKelas(mataKuliahId: number, tahunAkademikId: number) {
  const mk = await db.query.mataKuliah.findFirst({
    where: eq(mataKuliah.id, mataKuliahId),
  });

  const existingCount = await db.select({ count: count() })
    .from(kelas)
    .where(and(
      eq(kelas.mataKuliahId, mataKuliahId),
      eq(kelas.tahunAkademikId, tahunAkademikId)
    ));

  const kelasNumber = (existingCount[0]?.count || 0) + 1;
  return `${mk?.kodeMk}-${String(kelasNumber).padStart(2, '0')}`;
}
```

---

## 8. Authentication & Authorization

### 8.1 Middleware Protection

```typescript
// src/middleware.ts
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Role-based route protection
    if (path.startsWith('/mahasiswa') && token?.role !== 'mahasiswa') {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    if (path.startsWith('/dosen') && token?.role !== 'dosen') {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    if (path.startsWith('/admin') && token?.role !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ['/mahasiswa/:path*', '/dosen/:path*', '/admin/:path*', '/api/:path*'],
};
```

### 8.2 Client-Side Auth Hook

```typescript
// src/hooks/useAuth.ts
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function useAuth(requiredRole?: string) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/login');
      return;
    }

    if (requiredRole && session.user.role !== requiredRole) {
      router.push('/unauthorized');
    }
  }, [session, status, requiredRole, router]);

  return { session, status, user: session?.user };
}
```

---

## 9. Feature Implementation

### 9.1 Mahasiswa Features

#### Dashboard Mahasiswa
```typescript
// src/app/(mahasiswa)/dashboard/page.tsx
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { db } from '@/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Calendar, DollarSign, FileText } from 'lucide-react';

export default async function MahasiswaDashboard() {
  const session = await getServerSession(authOptions);
  
  // Fetch student data
  const mahasiswaData = await db.query.mahasiswa.findFirst({
    where: (mahasiswa, { eq }) => eq(mahasiswa.userId, session.user.id),
    with: {
      mahasiswaDetail: true,
      prodi: true,
    },
  });

  // Fetch today's schedule
  const today = new Date().toLocaleDateString('id-ID', { weekday: 'long' });
  const jadwalHariIni = await db.query.kelas.findMany({
    where: (kelas, { eq, and }) => and(
      eq(kelas.hari, today),
      // Add KRS join condition
    ),
    with: {
      mataKuliah: true,
      dosen: true,
      ruangan: true,
    },
  });

  // Fetch latest announcements
  const pengumuman = await db.query.pengumuman.findMany({
    where: (pengumuman, { or, eq }) => or(
      eq(pengumuman.targetRole, 'all'),
      eq(pengumuman.targetRole, 'mahasiswa')
    ),
    orderBy: (pengumuman, { desc }) => [desc(pengumuman.publishedAt)],
    limit: 5,
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Selamat datang, {mahasiswaData?.namaLengkap}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">IPK</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mahasiswaData?.mahasiswaDetail?.ipk || '0.00'}
            </div>
            <p className="text-xs text-muted-foreground">
              Indeks Prestasi Kumulatif
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">SKS</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mahasiswaData?.mahasiswaDetail?.totalSks || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Total SKS Diambil
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Semester</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mahasiswaData?.semester || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Semester Aktif
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Status Bayar</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Lunas</div>
            <p className="text-xs text-muted-foreground">
              Semester ini
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Jadwal Hari Ini</CardTitle>
        </CardHeader>
        <CardContent>
          {jadwalHariIni.length > 0 ? (
            <div className="space-y-4">
              {jadwalHariIni.map((jadwal) => (
                <div
                  key={jadwal.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <h3 className="font-semibold">
                      {jadwal.mataKuliah.namaMk}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {jadwal.dosen.namaLengkap} • {jadwal.ruangan.namaRuangan}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {jadwal.jamMulai} - {jadwal.jamSelesai}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {jadwal.mataKuliah.sks} SKS
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              Tidak ada jadwal hari ini
            </p>
          )}
        </CardContent>
      </Card>

      {/* Announcements */}
      <Card>
        <CardHeader>
          <CardTitle>Pengumuman Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pengumuman.map((item) => (
              <div key={item.id} className="border-b pb-4 last:border-0">
                <h3 className="font-semibold">{item.judul}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {item.konten.substring(0, 150)}...
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {new Date(item.publishedAt).toLocaleDateString('id-ID')}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

#### KRS Form Component
```typescript
// src/components/mahasiswa/KRSForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

interface Kelas {
  id: number;
  kodeKelas: string;
  mataKuliah: {
    namaMk: string;
    sks: number;
  };
  dosen: {
    namaLengkap: string;
  };
  hari: string;
  jamMulai: string;
  jamSelesai: string;
  kuota: number;
}

export function KRSForm() {
  const [availableKelas, setAvailableKelas] = useState<Kelas[]>([]);
  const [selectedKelas, setSelectedKelas] = useState<number[]>([]);
  const [totalSKS, setTotalSKS] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    fetchAvailableKelas();
  }, []);

  useEffect(() => {
    const total = availableKelas
      .filter((k) => selectedKelas.includes(k.id))
      .reduce((sum, k) => sum + k.mataKuliah.sks, 0);
    setTotalSKS(total);
  }, [selectedKelas, availableKelas]);

  async function fetchAvailableKelas() {
    const response = await fetch('/api/mahasiswa/kelas-tersedia');
    const data = await response.json();
    setAvailableKelas(data);
  }

  function handleToggleKelas(kelasId: number) {
    setSelectedKelas((prev) =>
      prev.includes(kelasId)
        ? prev.filter((id) => id !== kelasId)
        : [...prev, kelasId]
    );
  }

  async function handleSubmitKRS() {
    if (totalSKS < 12 || totalSKS > 24) {
      toast({
        title: 'Error',
        description: 'Total SKS harus antara 12-24',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await fetch('/api/mahasiswa/krs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tahunAkademikId: 1, // Get from context
          kelasIds: selectedKelas,
        }),
      });

      if (response.ok) {
        toast({
          title: 'Berhasil',
          description: 'KRS berhasil disimpan',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Gagal menyimpan KRS',
        variant: 'destructive',
      });
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Total SKS: {totalSKS}</CardTitle>
        </CardHeader>
      </Card>

      <div className="space-y-4">
        {availableKelas.map((kelas) => (
          <Card key={kelas.id}>
            <CardContent className="flex items-center gap-4 pt-6">
              <Checkbox
                checked={selectedKelas.includes(kelas.id)}
                onCheckedChange={() => handleToggleKelas(kelas.id)}
              />
              <div className="flex-1">
                <h3 className="font-semibold">{kelas.mataKuliah.namaMk}</h3>
                <p className="text-sm text-muted-foreground">
                  {kelas.dosen.namaLengkap} • {kelas.hari} {kelas.jamMulai}-
                  {kelas.jamSelesai}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">{kelas.mataKuliah.sks} SKS</p>
                <p className="text-sm text-muted-foreground">
                  Kuota: {kelas.kuota}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button onClick={handleSubmitKRS} className="w-full">
        Submit KRS
      </Button>
    </div>
  );
}
```

### 9.2 Dosen Features

#### Input Presensi Component
```typescript
// src/components/dosen/PresensiInput.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';

interface Mahasiswa {
  id: number;
  nim: string;
  namaLengkap: string;
}

export function PresensiInput({ kelasId }: { kelasId: number }) {
  const [mahasiswaList, setMahasiswaList] = useState<Mahasiswa[]>([]);
  const [presensiData, setPresensiData] = useState<
    Record<number, { status: string; keterangan: string }>
  >({});
  const [pertemuanKe, setPertemuanKe] = useState(1);
  const { toast } = useToast();

  useEffect(() => {
    fetchMahasiswaKelas();
  }, [kelasId]);

  async function fetchMahasiswaKelas() {
    const response = await fetch(`/api/dosen/kelas/${kelasId}/mahasiswa`);
    const data = await response.json();
    setMahasiswaList(data);

    // Initialize presensi data
    const initialData: Record<number, { status: string; keterangan: string }> =
      {};
    data.forEach((mhs: Mahasiswa) => {
      initialData[mhs.id] = { status: 'hadir', keterangan: '' };
    });
    setPresensiData(initialData);
  }

  function handleStatusChange(mahasiswaId: number, status: string) {
    setPresensiData((prev) => ({
      ...prev,
      [mahasiswaId]: { ...prev[mahasiswaId], status },
    }));
  }

  async function handleSubmit() {
    try {
      // First create pertemuan
      const pertemuanResponse = await fetch('/api/dosen/pertemuan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kelasId,
          pertemuanKe,
          tanggal: new Date(),
          topik: 'Topik pertemuan',
        }),
      });

      const pertemuan = await pertemuanResponse.json();

      // Then submit presensi
      const presensiPayload = Object.entries(presensiData).map(
        ([mahasiswaId, data]) => ({
          mahasiswaId: parseInt(mahasiswaId),
          status: data.status,
          keterangan: data.keterangan,
        })
      );

      await fetch('/api/dosen/presensi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pertemuanId: pertemuan.id,
          presensiData: presensiPayload,
        }),
      });

      toast({
        title: 'Berhasil',
        description: 'Presensi berhasil disimpan',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Gagal menyimpan presensi',
        variant: 'destructive',
      });
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <label>Pertemuan ke:</label>
        <Select
          value={pertemuanKe.toString()}
          onValueChange={(v) => setPertemuanKe(parseInt(v))}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 16 }, (_, i) => i + 1).map((n) => (
              <SelectItem key={n} value={n.toString()}>
                {n}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>NIM</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mahasiswaList.map((mhs) => (
            <TableRow key={mhs.id}>
              <TableCell>{mhs.nim}</TableCell>
              <TableCell>{mhs.namaLengkap}</TableCell>
              <TableCell>
                <Select
                  value={presensiData[mhs.id]?.status}
                  onValueChange={(v) => handleStatusChange(mhs.id, v)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hadir">Hadir</SelectItem>
                    <SelectItem value="izin">Izin</SelectItem>
                    <SelectItem value="sakit">Sakit</SelectItem>
                    <SelectItem value="alpa">Alpa</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Button onClick={handleSubmit} className="w-full">
        Simpan Presensi
      </Button>
    </div>
  );
}
```

### 9.3 Admin Features

#### Import Excel Component
```typescript
// src/components/admin/ImportExcel.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import * as XLSX from 'xlsx';

interface MahasiswaImport {
  nim: string;
  nama_lengkap: string;
  email: string;
  prodi_id: number;
  angkatan: string;
  jenis_kelamin: string;
}

export function ImportExcel() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  async function handleImport() {
    if (!file) return;

    setLoading(true);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData: MahasiswaImport[] = XLSX.utils.sheet_to_json(worksheet);

      // Validate and transform data
      const validData = jsonData.map((row) => ({
        nim: row.nim,
        namaLengkap: row.nama_lengkap,
        email: row.email,
        prodiId: row.prodi_id,
        angkatan: row.angkatan,
        jenisKelamin: row.jenis_kelamin,
      }));

      // Send to API
      const response = await fetch('/api/admin/mahasiswa/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: validData }),
      });

      if (response.ok) {
        toast({
          title: 'Berhasil',
          description: `${validData.length} mahasiswa berhasil diimport`,
        });
        setFile(null);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Gagal mengimport data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <Input
          type="file"
          accept=".xlsx,.xls"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <p className="text-sm text-muted-foreground mt-2">
          Format: nim, nama_lengkap, email, prodi_id, angkatan, jenis_kelamin
        </p>
      </div>

      <Button onClick={handleImport} disabled={!file || loading}>
        {loading ? 'Mengimport...' : 'Import Data'}
      </Button>
    </div>
  );
}
```

#### Jadwal Builder Component
```typescript
// src/components/admin/JadwalBuilder.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

export function JadwalBuilder() {
  const [mataKuliahList, setMataKuliahList] = useState([]);
  const [dosenList, setDosenList] = useState([]);
  const [ruanganList, setRuanganList] = useState([]);

  const [formData, setFormData] = useState({
    mataKuliahId: '',
    dosenId: '',
    ruanganId: '',
    hari: '',
    jamMulai: '',
    jamSelesai: '',
    kapasitas: 40,
  });

  const { toast } = useToast();

  useEffect(() => {
    fetchOptions();
  }, []);

  async function fetchOptions() {
    const [mkRes, dosenRes, ruanganRes] = await Promise.all([
      fetch('/api/admin/mata-kuliah'),
      fetch('/api/admin/dosen'),
      fetch('/api/admin/ruangan'),
    ]);

    setMataKuliahList(await mkRes.json());
    setDosenList(await dosenRes.json());
    setRuanganList(await ruanganRes.json());
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const response = await fetch('/api/admin/jadwal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: 'Berhasil',
          description: 'Jadwal berhasil dibuat',
        });
        // Reset form
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Gagal membuat jadwal',
        variant: 'destructive',
      });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Mata Kuliah</Label>
        <Select
          value={formData.mataKuliahId}
          onValueChange={(v) =>
            setFormData({ ...formData, mataKuliahId: v })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Pilih mata kuliah" />
          </SelectTrigger>
          <SelectContent>
            {mataKuliahList.map((mk: any) => (
              <SelectItem key={mk.id} value={mk.id.toString()}>
                {mk.kodeMk} - {mk.namaMk}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Dosen</Label>
        <Select
          value={formData.dosenId}
          onValueChange={(v) => setFormData({ ...formData, dosenId: v })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Pilih dosen" />
          </SelectTrigger>
          <SelectContent>
            {dosenList.map((dosen: any) => (
              <SelectItem key={dosen.id} value={dosen.id.toString()}>
                {dosen.namaLengkap}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Hari</Label>
        <Select
          value={formData.hari}
          onValueChange={(v) => setFormData({ ...formData, hari: v })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Pilih hari" />
          </SelectTrigger>
          <SelectContent>
            {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'].map(
              (hari) => (
                <SelectItem key={hari} value={hari}>
                  {hari}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Jam Mulai</Label>
          <Input
            type="time"
            value={formData.jamMulai}
            onChange={(e) =>
              setFormData({ ...formData, jamMulai: e.target.value })
            }
          />
        </div>
        <div>
          <Label>Jam Selesai</Label>
          <Input
            type="time"
            value={formData.jamSelesai}
            onChange={(e) =>
              setFormData({ ...formData, jamSelesai: e.target.value })
            }
          />
        </div>
      </div>

      <Button type="submit" className="w-full">
        Buat Jadwal
      </Button>
    </form>
  );
}
```

---

## 10. Utilities & Helpers

### 10.1 PDF Generator
```typescript
// src/lib/helpers/pdf-generator.ts
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function generateKHSPDF(data: any) {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(16);
  doc.text('KARTU HASIL STUDI (KHS)', 105, 20, { align: 'center' });

  // Student info
  doc.setFontSize(10);
  doc.text(`NIM: ${data.nim}`, 20, 40);
  doc.text(`Nama: ${data.namaLengkap}`, 20, 47);
  doc.text(`Program Studi: ${data.prodi}`, 20, 54);
  doc.text(`Semester: ${data.semester}`, 20, 61);

  // Grades table
  autoTable(doc, {
    startY: 70,
    head: [['No', 'Kode MK', 'Mata Kuliah', 'SKS', 'Nilai', 'Indeks']],
    body: data.nilai.map((item: any, index: number) => [
      index + 1,
      item.kodeMk,
      item.namaMk,
      item.sks,
      item.nilaiHuruf,
      item.nilaiIndeks,
    ]),
  });

  // Summary
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  doc.text(`Total SKS: ${data.totalSKS}`, 20, finalY);
  doc.text(`IPS: ${data.ips}`, 20, finalY + 7);
  doc.text(`IPK: ${data.ipk}`, 20, finalY + 14);

  return doc;
}

export function generateTranskripPDF(data: any) {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text('TRANSKRIP NILAI', 105, 20, { align: 'center' });

  doc.setFontSize(10);
  doc.text(`NIM: ${data.nim}`, 20, 40);
  doc.text(`Nama: ${data.namaLengkap}`, 20, 47);
  doc.text(`Program Studi: ${data.prodi}`, 20, 54);

  autoTable(doc, {
    startY: 65,
    head: [['Semester', 'Kode', 'Mata Kuliah', 'SKS', 'Nilai', 'Mutu']],
    body: data.allNilai.map((item: any) => [
      item.semester,
      item.kodeMk,
      item.namaMk,
      item.sks,
      item.nilaiHuruf,
      (item.sks * item.nilaiIndeks).toFixed(2),
    ]),
  });

  const finalY = (doc as any).lastAutoTable.finalY + 10;
  doc.text(`Total SKS: ${data.totalSKS}`, 20, finalY);
  doc.text(`Total Mutu: ${data.totalMutu}`, 20, finalY + 7);
  doc.text(`IPK: ${data.ipk}`, 20, finalY + 14);

  return doc;
}
```

### 10.2 Excel Parser
```typescript
// src/lib/helpers/excel-parser.ts
import * as XLSX from 'xlsx';

export async function parseExcelFile<T>(file: File): Promise<T[]> {
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  return XLSX.utils.sheet_to_json(worksheet);
}

export function generateExcelTemplate(headers: string[], filename: string) {
  const ws = XLSX.utils.aoa_to_sheet([headers]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Template');
  XLSX.writeFile(wb, filename);
}

export async function exportToExcel(data: any[], filename: string) {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Data');
  XLSX.writeFile(wb, filename);
}
```

### 10.3 Email Sender
```typescript
// src/lib/helpers/email-sender.ts
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_SERVER_HOST,
  port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export async function sendEmail(options: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
    return { success: true };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error };
  }
}

export async function sendKRSApprovalEmail(
  email: string,
  mahasiswaName: string,
  status: 'approved' | 'rejected'
) {
  const subject =
    status === 'approved' ? 'KRS Anda Disetujui' : 'KRS Anda Ditolak';

  const html = `
    <h2>Pemberitahuan Status KRS</h2>
    <p>Halo ${mahasiswaName},</p>
    <p>KRS Anda telah ${status === 'approved' ? 'disetujui' : 'ditolak'}.</p>
    <p>Silakan login ke sistem untuk informasi lebih lanjut.</p>
    <br/>
    <p>Terima kasih,</p>
    <p>Tim SIAKAD</p>
  `;

  return sendEmail({ to: email, subject, html });
}

export async function sendPasswordResetEmail(email: string, resetToken: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;

  const html = `
    <h2>Reset Password</h2>
    <p>Klik link berikut untuk mereset password Anda:</p>
    <a href="${resetUrl}">${resetUrl}</a>
    <p>Link ini berlaku selama 1 jam.</p>
    <br/>
    <p>Jika Anda tidak meminta reset password, abaikan email ini.</p>
  `;

  return sendEmail({
    to: email,
    subject: 'Reset Password SIAKAD',
    html,
  });
}
```

### 10.4 File Uploader
```typescript
// src/lib/helpers/file-uploader.ts
import { put } from '@vercel/blob';

export async function uploadFile(file: File, folder: string = 'uploads') {
  try {
    const filename = `${folder}/${Date.now()}-${file.name}`;
    const blob = await put(filename, file, {
      access: 'public',
    });
    return { success: true, url: blob.url };
  } catch (error) {
    return { success: false, error };
  }
}

// Alternative: Local file upload
export async function saveFileLocally(file: File, folder: string = 'uploads') {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const filename = `${Date.now()}-${file.name}`;
  const filepath = `./public/${folder}/${filename}`;

  const fs = require('fs').promises;
  await fs.writeFile(filepath, buffer);

  return { success: true, url: `/${folder}/${filename}` };
}
```

---

## 11. Deployment

### 11.1 Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN corepack enable pnpm && pnpm i --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN corepack enable pnpm && pnpm build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: siakad_app
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://siakad_user:siakad_password@postgres:5432/siakad_db
      - NEXTAUTH_URL=https://your-domain.com
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
    depends_on:
      - postgres
      - redis
    networks:
      - siakad_network
    restart: unless-stopped

  postgres:
    image: postgres:15-alpine
    container_name: siakad_postgres_prod
    environment:
      POSTGRES_USER: siakad_user
      POSTGRES_PASSWORD: siakad_password
      POSTGRES_DB: siakad_db
    volumes:
      - postgres_prod_data:/var/lib/postgresql/data
    networks:
      - siakad_network
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    container_name: siakad_redis_prod
    volumes:
      - redis_data:/data
    networks:
      - siakad_network
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    container_name: siakad_nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    networks:
      - siakad_network
    restart: unless-stopped

volumes:
  postgres_prod_data:
  redis_data:

networks:
  siakad_network:
    driver: bridge
```

```bash
# Build and run production
docker-compose -f docker-compose.prod.yml up -d --build

# View logs
docker-compose logs -f app

# Run migrations
docker-compose exec app pnpm drizzle-kit migrate

# Backup database
docker exec siakad_postgres_prod pg_dump -U siakad_user siakad_db > backup.sql
```

### 11.2 Vercel Deployment

```json
// vercel.json
{
  "buildCommand": "pnpm build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "env": {
    "DATABASE_URL": "@database_url",
    "NEXTAUTH_SECRET": "@nextauth_secret",
    "NEXTAUTH_URL": "@nextauth_url"
  }
}
```

```bash
# Install Vercel CLI
pnpm i -g vercel

# Login
vercel login

# Deploy
vercel --prod

# Set environment variables
vercel env add DATABASE_URL production
vercel env add NEXTAUTH_SECRET production
vercel env add NEXTAUTH_URL production
```

### 11.3 Production Checklist

```markdown
## Pre-Deployment Checklist

### Security
- [ ] Change all default passwords
- [ ] Set strong NEXTAUTH_SECRET
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Enable CSP headers
- [ ] Sanitize user inputs
- [ ] Implement SQL injection prevention

### Database
- [ ] Run all migrations
- [ ] Set up automated backups
- [ ] Configure connection pooling
- [ ] Add database indices for performance
- [ ] Test database restore procedure

### Performance
- [ ] Enable Redis caching
- [ ] Optimize images (next/image)
- [ ] Enable gzip compression
- [ ] Configure CDN for static assets
- [ ] Set up database read replicas

### Monitoring
- [ ] Set up error tracking (Sentry)
- [ ] Configure logging (Winston/Pino)
- [ ] Set up uptime monitoring
- [ ] Configure alerts
- [ ] Set up analytics

### Testing
- [ ] Run all unit tests
- [ ] Perform load testing
- [ ] Test all user flows
- [ ] Verify email sending
- [ ] Test file uploads
- [ ] Verify PDF generation
```

---

## 12. Testing

### 12.1 Unit Tests Example

```typescript
// __tests__/api/krs.test.ts
import { POST } from '@/app/api/mahasiswa/krs/route';
import { getServerSession } from 'next-auth';

jest.mock('next-auth');

describe('KRS API', () => {
  beforeEach(() => {
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { id: 1, role: 'mahasiswa' },
    });
  });

  it('should create KRS successfully', async () => {
    const request = new Request('http://localhost:3000/api/mahasiswa/krs', {
      method: 'POST',
      body: JSON.stringify({
        tahunAkademikId: 1,
        kelasIds: [1, 2, 3],
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data).toHaveProperty('id');
  });

  it('should reject unauthorized access', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);

    const request = new Request('http://localhost:3000/api/mahasiswa/krs', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    const response = await POST(request);

    expect(response.status).toBe(401);
  });
});
```

### 12.2 Integration Tests

```typescript
// __tests__/integration/auth.test.ts
import { signIn } from 'next-auth/react';

describe('Authentication Flow', () => {
  it('should login successfully with valid credentials', async () => {
    const result = await signIn('credentials', {
      username: 'mhs001',
      password: 'mahasiswa123',
      redirect: false,
    });

    expect(result?.ok).toBe(true);
    expect(result?.error).toBeNull();
  });

  it('should fail with invalid credentials', async () => {
    const result = await signIn('credentials', {
      username: 'invalid',
      password: 'wrong',
      redirect: false,
    });

    expect(result?.ok).toBe(false);
    expect(result?.error).toBeTruthy();
  });
});
```

---

## 13. Additional Features Implementation

### 13.1 Notification System

```typescript
// src/services/notification.service.ts
import { db } from '@/db';
import { notifikasi } from '@/db/schema';
import { sendEmail } from '@/lib/helpers/email-sender';

export async function createNotification(
  userId: number,
  judul: string,
  pesan: string,
  tipe: string = 'info',
  link?: string
) {
  await db.insert(notifikasi).values({
    userId,
    judul,
    pesan,
    tipe,
    link,
  });
}

export async function notifyKRSStatus(
  mahasiswaId: number,
  status: 'approved' | 'rejected'
) {
  const mahasiswa = await db.query.mahasiswa.findFirst({
    where: (mahasiswa, { eq }) => eq(mahasiswa.id, mahasiswaId),
    with: { user: true },
  });

  if (!mahasiswa) return;

  const judul =
    status === 'approved' ? 'KRS Disetujui' : 'KRS Ditolak';
  const pesan =
    status === 'approved'
      ? 'KRS Anda telah disetujui. Anda dapat melihat jadwal kuliah.'
      : 'KRS Anda ditolak. Silakan revisi dan ajukan kembali.';

  await createNotification(
    mahasiswa.userId,
    judul,
    pesan,
    status === 'approved' ? 'success' : 'warning',
    '/mahasiswa/akademik/krs'
  );

  // Send email
  await sendEmail({
    to: mahasiswa.user.email,
    subject: judul,
    html: `<p>${pesan}</p>`,
  });
}
```

### 13.2 Activity Logger

```typescript
// src/lib/logger.ts
import { db } from '@/db';
import { activityLog } from '@/db/schema';

export async function logActivity(
  userId: number,
  action: string,
  module: string,
  description: string,
  ipAddress?: string,
  userAgent?: string
) {
  await db.insert(activityLog).values({
    userId,
    action,
    module,
    description,
    ipAddress,
    userAgent,
  });
}

// Middleware integration
export function withActivityLog(
  action: string,
  module: string
) {
  return async (req: Request, handler: Function) => {
    const session = await getServerSession();
    const result = await handler(req);

    if (session?.user) {
      await logActivity(
        session.user.id,
        action,
        module,
        `${action} in ${module}`,
        req.headers.get('x-forwarded-for') || undefined,
        req.headers.get('user-agent') || undefined
      );
    }

    return result;
  };
}
```

---

## 14. Performance Optimization

### 14.1 Database Indexing

```sql
-- Add indexes for frequently queried columns
CREATE INDEX idx_mahasiswa_nim ON mahasiswa(nim);
CREATE INDEX idx_mahasiswa_prodi ON mahasiswa(prodi_id);
CREATE INDEX idx_krs_mahasiswa ON krs(mahasiswa_id);
CREATE INDEX idx_krs_tahun_akademik ON krs(tahun_akademik_id);
CREATE INDEX idx_nilai_krs_detail ON nilai(krs_detail_id);
CREATE INDEX idx_presensi_mahasiswa ON presensi(mahasiswa_id);
CREATE INDEX idx_presensi_pertemuan ON presensi(pertemuan_id);

-- Composite indexes
CREATE INDEX idx_kelas_tahun_dosen ON kelas(tahun_akademik_id, dosen_id);
CREATE INDEX idx_users_role_active ON users(role, is_active);
```

### 14.2 Caching Strategy

```typescript
// src/lib/cache.ts
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.REDIS_URL!,
  token: process.env.REDIS_TOKEN!,
});

export async function getCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 3600
): Promise<T> {
  const cached = await redis.get(key);

  if (cached) {
    return cached as T;
  }

  const data = await fetcher();
  await redis.set(key, JSON.stringify(data), { ex: ttl });

  return data;
}

export async function invalidateCache(pattern: string) {
  const keys = await redis.keys(pattern);
  if (keys.length > 0) {
    await redis.del(...keys);
  }
}

// Usage example
export async function getMahasiswaData(mahasiswaId: number) {
  return getCached(
    `mahasiswa:${mahasiswaId}`,
    async () => {
      return await db.query.mahasiswa.findFirst({
        where: eq(mahasiswa.id, mahasiswaId),
        with: { prodi: true, dosenPa: true },
      });
    },
    3600 // 1 hour
  );
}
```

---

## 15. Best Practices

### 15.1 Code Organization
- Use consistent naming conventions (camelCase for variables, PascalCase for components)
- Separate business logic into services
- Keep components small and focused
- Use TypeScript for type safety
- Implement proper error handling

### 15.2 Security Best Practices
- Always validate and sanitize user inputs
- Use parameterized queries (Drizzle ORM handles this)
- Implement rate limiting for API routes
- Use HTTPS in production
- Store sensitive data in environment variables
- Implement proper session management
- Use bcrypt for password hashing
- Implement CSRF protection

### 15.3 Database Best Practices
- Use transactions for multi-step operations
- Implement soft deletes where appropriate
- Regular backups
- Monitor query performance
- Use connection pooling
- Implement proper indexing

### 15.4 API Design Best Practices
- Use RESTful conventions
- Implement pagination for list endpoints
- Return appropriate HTTP status codes
- Include error messages in responses
- Version your API if needed
- Document API endpoints

---

## 16. Troubleshooting

### Common Issues and Solutions

**Issue: Database connection fails**
```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Check connection string
echo $DATABASE_URL

# Test connection
docker exec -it siakad_postgres psql -U siakad_user -d siakad_db
```

**Issue: Migration fails**
```bash
# Reset migrations
npm drizzle-kit drop

# Regenerate and run
npm drizzle-kit generate:pg
npm drizzle-kit push:pg
```

**Issue: Authentication not working**
```bash
# Verify NEXTAUTH_SECRET is set
echo $NEXTAUTH_SECRET

# Clear browser cookies
# Check session in database
```

---

## 17. Maintenance

### Daily Tasks
- Monitor error logs
- Check application performance
- Review security alerts

### Weekly Tasks
- Review and optimize slow queries
- Check disk space usage
- Update dependencies
- Review user feedback

### Monthly Tasks
- Database backup verification
- Security audit
- Performance analysis
- Update documentation

---


