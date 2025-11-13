import { relations } from 'drizzle-orm';
import * as schema from './';

export const usersRelations = relations(schema.users, ({ one, many }) => ({
  mahasiswa: one(schema.mahasiswa, { fields: [schema.users.id], references: [schema.mahasiswa.userId] }),
  dosen: one(schema.dosen, { fields: [schema.users.id], references: [schema.dosen.userId] }),
  sessions: many(schema.sessions),
  activityLogs: many(schema.activityLog),
  approvedKrs: many(schema.krs, { relationName: 'approvedBy' }),
  verifiedPembayaran: many(schema.pembayaran, { relationName: 'verifiedBy' }),
  processedSurat: many(schema.pengajuanSurat, { relationName: 'processedBy' }),
  approvedCuti: many(schema.cutiAkademik, { relationName: 'approvedBy' }),
  publishedPengumuman: many(schema.pengumuman, { relationName: 'publishedBy' }),
  notifikasi: many(schema.notifikasi),
}));

export const sessionsRelations = relations(schema.sessions, ({ one }) => ({
  user: one(schema.users, { fields: [schema.sessions.userId], references: [schema.users.id] }),
}));

export const mahasiswaRelations = relations(schema.mahasiswa, ({ one, many }) => ({
  user: one(schema.users, { fields: [schema.mahasiswa.userId], references: [schema.users.id] }),
  prodi: one(schema.programStudi, { fields: [schema.mahasiswa.prodiId], references: [schema.programStudi.id] }),
  dosenPa: one(schema.dosen, { fields: [schema.mahasiswa.dosenPaId], references: [schema.dosen.id], relationName: 'dosenPa' }),
  detail: one(schema.mahasiswaDetail, { fields: [schema.mahasiswa.id], references: [schema.mahasiswaDetail.mahasiswaId] }),
  krs: many(schema.krs),
  pembayaran: many(schema.pembayaran),
  presensi: many(schema.presensi),
  tugasSubmissions: many(schema.tugasSubmission),
  pengajuanSurat: many(schema.pengajuanSurat),
  cutiAkademik: many(schema.cutiAkademik),
}));

export const mahasiswaDetailRelations = relations(schema.mahasiswaDetail, ({ one }) => ({
  mahasiswa: one(schema.mahasiswa, { fields: [schema.mahasiswaDetail.mahasiswaId], references: [schema.mahasiswa.id] }),
}));

export const dosenRelations = relations(schema.dosen, ({ one, many }) => ({
  user: one(schema.users, { fields: [schema.dosen.userId], references: [schema.users.id] }),
  mahasiswaBimbingan: many(schema.mahasiswa, { relationName: 'dosenPa' }),
  kaprodiDi: many(schema.programStudi, { relationName: 'kaprodi' }),
  mengajarKelas: many(schema.kelas),
  mengajarPertemuan: many(schema.pertemuan),
  uploadMateri: many(schema.materi),
  membuatTugas: many(schema.tugas),
}));

export const programStudiRelations = relations(schema.programStudi, ({ one, many }) => ({
  kaprodi: one(schema.dosen, { fields: [schema.programStudi.kaprodiId], references: [schema.dosen.id], relationName: 'kaprodi' }),
  mahasiswa: many(schema.mahasiswa),
  mataKuliah: many(schema.mataKuliah),
  kurikulum: many(schema.kurikulum),
}));

export const mataKuliahRelations = relations(schema.mataKuliah, ({ one, many }) => ({
  prodi: one(schema.programStudi, { fields: [schema.mataKuliah.prodiId], references: [schema.programStudi.id] }),
  kurikulumDetail: many(schema.kurikulumDetail),
  kelas: many(schema.kelas),
}));

export const kurikulumRelations = relations(schema.kurikulum, ({ one, many }) => ({
  prodi: one(schema.programStudi, { fields: [schema.kurikulum.prodiId], references: [schema.programStudi.id] }),
  details: many(schema.kurikulumDetail),
}));

export const kurikulumDetailRelations = relations(schema.kurikulumDetail, ({ one }) => ({
  kurikulum: one(schema.kurikulum, { fields: [schema.kurikulumDetail.kurikulumId], references: [schema.kurikulum.id] }),
  mataKuliah: one(schema.mataKuliah, { fields: [schema.kurikulumDetail.mataKuliahId], references: [schema.mataKuliah.id] }),
}));

export const tahunAkademikRelations = relations(schema.tahunAkademik, ({ many }) => ({
  kelas: many(schema.kelas),
  krs: many(schema.krs),
  pembayaran: many(schema.pembayaran),
  cutiAkademik: many(schema.cutiAkademik),
}));

export const ruanganRelations = relations(schema.ruangan, ({ many }) => ({
  kelas: many(schema.kelas),
}));

export const kelasRelations = relations(schema.kelas, ({ one, many }) => ({
  mataKuliah: one(schema.mataKuliah, { fields: [schema.kelas.mataKuliahId], references: [schema.mataKuliah.id] }),
  dosen: one(schema.dosen, { fields: [schema.kelas.dosenId], references: [schema.dosen.id] }),
  tahunAkademik: one(schema.tahunAkademik, { fields: [schema.kelas.tahunAkademikId], references: [schema.tahunAkademik.id] }),
  ruangan: one(schema.ruangan, { fields: [schema.kelas.ruanganId], references: [schema.ruangan.id] }),
  krsDetail: many(schema.krsDetail),
  pertemuan: many(schema.pertemuan),
  materi: many(schema.materi),
  tugas: many(schema.tugas),
}));

export const krsRelations = relations(schema.krs, ({ one, many }) => ({
  mahasiswa: one(schema.mahasiswa, { fields: [schema.krs.mahasiswaId], references: [schema.mahasiswa.id] }),
  tahunAkademik: one(schema.tahunAkademik, { fields: [schema.krs.tahunAkademikId], references: [schema.tahunAkademik.id] }),
  approvedBy: one(schema.users, { fields: [schema.krs.approvedBy], references: [schema.users.id], relationName: 'approvedBy' }),
  details: many(schema.krsDetail),
}));

export const krsDetailRelations = relations(schema.krsDetail, ({ one, many }) => ({
  krs: one(schema.krs, { fields: [schema.krsDetail.krsId], references: [schema.krs.id] }),
  kelas: one(schema.kelas, { fields: [schema.krsDetail.kelasId], references: [schema.kelas.id] }),
  nilai: many(schema.nilai),
  nilaiAkhir: one(schema.nilaiAkhir, { fields: [schema.krsDetail.id], references: [schema.nilaiAkhir.krsDetailId] }),
}));

export const pertemuanRelations = relations(schema.pertemuan, ({ one, many }) => ({
  kelas: one(schema.kelas, { fields: [schema.pertemuan.kelasId], references: [schema.kelas.id] }),
  dosen: one(schema.dosen, { fields: [schema.pertemuan.dosenId], references: [schema.dosen.id] }),
  presensi: many(schema.presensi),
}));

export const presensiRelations = relations(schema.presensi, ({ one }) => ({
  pertemuan: one(schema.pertemuan, { fields: [schema.presensi.pertemuanId], references: [schema.pertemuan.id] }),
  mahasiswa: one(schema.mahasiswa, { fields: [schema.presensi.mahasiswaId], references: [schema.mahasiswa.id] }),
}));

export const komponenNilaiRelations = relations(schema.komponenNilai, ({ many }) => ({
  nilai: many(schema.nilai),
}));

export const nilaiRelations = relations(schema.nilai, ({ one }) => ({
  krsDetail: one(schema.krsDetail, { fields: [schema.nilai.krsDetailId], references: [schema.krsDetail.id] }),
  komponenNilai: one(schema.komponenNilai, { fields: [schema.nilai.komponenNilaiId], references: [schema.komponenNilai.id] }),
}));

export const nilaiAkhirRelations = relations(schema.nilaiAkhir, ({ one }) => ({
  krsDetail: one(schema.krsDetail, { fields: [schema.nilaiAkhir.krsDetailId], references: [schema.krsDetail.id] }),
}));

export const materiRelations = relations(schema.materi, ({ one }) => ({
  kelas: one(schema.kelas, { fields: [schema.materi.kelasId], references: [schema.kelas.id] }),
  uploadedBy: one(schema.dosen, { fields: [schema.materi.uploadedBy], references: [schema.dosen.id] }),
}));

export const tugasRelations = relations(schema.tugas, ({ one, many }) => ({
  kelas: one(schema.kelas, { fields: [schema.tugas.kelasId], references: [schema.kelas.id] }),
  createdBy: one(schema.dosen, { fields: [schema.tugas.createdBy], references: [schema.dosen.id] }),
  submissions: many(schema.tugasSubmission),
}));

export const tugasSubmissionRelations = relations(schema.tugasSubmission, ({ one }) => ({
  tugas: one(schema.tugas, { fields: [schema.tugasSubmission.tugasId], references: [schema.tugas.id] }),
  mahasiswa: one(schema.mahasiswa, { fields: [schema.tugasSubmission.mahasiswaId], references: [schema.mahasiswa.id] }),
}));

export const jenisPembayaranRelations = relations(schema.jenisPembayaran, ({ many }) => ({
  pembayaran: many(schema.pembayaran),
}));

export const pembayaranRelations = relations(schema.pembayaran, ({ one }) => ({
  mahasiswa: one(schema.mahasiswa, { fields: [schema.pembayaran.mahasiswaId], references: [schema.mahasiswa.id] }),
  jenisPembayaran: one(schema.jenisPembayaran, { fields: [schema.pembayaran.jenisPembayaranId], references: [schema.jenisPembayaran.id] }),
  tahunAkademik: one(schema.tahunAkademik, { fields: [schema.pembayaran.tahunAkademikId], references: [schema.tahunAkademik.id] }),
  verifiedBy: one(schema.users, { fields: [schema.pembayaran.verifiedBy], references: [schema.users.id], relationName: 'verifiedBy' }),
}));

export const jenisSuratRelations = relations(schema.jenisSurat, ({ many }) => ({
  pengajuanSurat: many(schema.pengajuanSurat),
}));

export const pengajuanSuratRelations = relations(schema.pengajuanSurat, ({ one }) => ({
  mahasiswa: one(schema.mahasiswa, { fields: [schema.pengajuanSurat.mahasiswaId], references: [schema.mahasiswa.id] }),
  jenisSurat: one(schema.jenisSurat, { fields: [schema.pengajuanSurat.jenisSuratId], references: [schema.jenisSurat.id] }),
  processedBy: one(schema.users, { fields: [schema.pengajuanSurat.processedBy], references: [schema.users.id], relationName: 'processedBy' }),
}));

export const cutiAkademikRelations = relations(schema.cutiAkademik, ({ one }) => ({
  mahasiswa: one(schema.mahasiswa, { fields: [schema.cutiAkademik.mahasiswaId], references: [schema.mahasiswa.id] }),
  tahunAkademik: one(schema.tahunAkademik, { fields: [schema.cutiAkademik.tahunAkademikId], references: [schema.tahunAkademik.id] }),
  approvedBy: one(schema.users, { fields: [schema.cutiAkademik.approvedBy], references: [schema.users.id], relationName: 'approvedBy' }),
}));

export const pengumumanRelations = relations(schema.pengumuman, ({ one }) => ({
  publishedBy: one(schema.users, { fields: [schema.pengumuman.publishedBy], references: [schema.users.id], relationName: 'publishedBy' }),
}));

export const notifikasiRelations = relations(schema.notifikasi, ({ one }) => ({
  user: one(schema.users, { fields: [schema.notifikasi.userId], references: [schema.users.id] }),
}));

export const activityLogRelations = relations(schema.activityLog, ({ one }) => ({
  user: one(schema.users, { fields: [schema.activityLog.userId], references: [schema.users.id] }),
}));
