'use server';

import { db } from '@/db';
import { 
  mahasiswa, 
  krs, 
  krsDetail, 
  kelas, 
  mataKuliah, 
  tahunAkademik,
  dosen,
  ruangan
} from '@/db/schema';
import { eq, and, desc, sql } from 'drizzle-orm';

export async function getKrsData(userId: string) {
  try {
    // Get mahasiswa info
    const mhs = await db.query.mahasiswa.findFirst({
      where: eq(mahasiswa.userId, parseInt(userId)),
      with: {
        prodi: true,
        dosenPa: true
      }
    });

    if (!mhs) {
      return { error: 'Mahasiswa tidak ditemukan' };
    }

    // Get active academic year
    const activeTahunAkademik = await db.query.tahunAkademik.findFirst({
      where: eq(tahunAkademik.isActive, true)
    });
    
    if (!activeTahunAkademik) {
      return { error: 'Tidak ada tahun akademik aktif' };
    }

    // Get active KRS
    const activeKrs = await db.query.krs.findFirst({
      where: and(
        eq(krs.mahasiswaId, mhs.id),
        eq(krs.tahunAkademikId, activeTahunAkademik.id)
      )
    });
    
    let krsDetails = [];
    if (activeKrs) {
      krsDetails = await db.query.krsDetail.findMany({
        where: eq(krsDetail.krsId, activeKrs.id),
        with: {
          kelas: {
            with: {
              mataKuliah: true,
              dosen: true,
              ruangan: true
            }
          }
        }
      });
    }

    // Load available classes
    const allClasses = await db.select({
      kelasId: kelas.id,
      kodeKelas: kelas.kodeKelas,
      hari: kelas.hari,
      jamMulai: kelas.jamMulai,
      jamSelesai: kelas.jamSelesai,
      kapasitas: kelas.kapasitas,
      kuota: kelas.kuota,
      mataKuliahId: mataKuliah.id,
      kodeMk: mataKuliah.kodeMk,
      namaMk: mataKuliah.namaMk,
      sks: mataKuliah.sks,
      semester: mataKuliah.semester,
      jenis: mataKuliah.jenis,
      dosenId: dosen.id,
      namaDosen: dosen.namaLengkap,
      kodeRuangan: ruangan.kodeRuangan,
      namaRuangan: ruangan.namaRuangan
    })
    .from(kelas)
    .innerJoin(mataKuliah, eq(kelas.mataKuliahId, mataKuliah.id))
    .innerJoin(dosen, eq(kelas.dosenId, dosen.id))
    .leftJoin(ruangan, eq(kelas.ruanganId, ruangan.id))
    .where(eq(kelas.tahunAkademikId, activeTahunAkademik.id));
    
    // Filter out classes already taken by this student
    const existingClassIds = krsDetails.map(detail => detail.kelasId);
    const availableClasses = allClasses.filter(cls => !existingClassIds.includes(cls.kelasId));

    return {
      mahasiswa: mhs,
      tahunAkademikAktif: activeTahunAkademik,
      krsAktif: activeKrs,
      krsDetails,
      availableClasses,
      totalSks: krsDetails.reduce((sum, detail) => sum + (detail.kelas?.mataKuliah?.sks || 0), 0)
    };
  } catch (error) {
    console.error('Error in getKrsData:', error);
    return { error: 'Gagal mengambil data KRS' };
  }
}

export async function addClassToKrs(userId: string, kelasId: number) {
  try {
    const mhs = await db.query.mahasiswa.findFirst({
      where: eq(mahasiswa.userId, parseInt(userId))
    });
    
    if (!mhs) return { error: 'Mahasiswa tidak ditemukan' };
    
    // Get active academic year
    const activeTahunAkademik = await db.query.tahunAkademik.findFirst({
      where: eq(tahunAkademik.isActive, true)
    });
    
    if (!activeTahunAkademik) return { error: 'Tidak ada tahun akademik aktif' };
    
    // Create or get active KRS
    let activeKrs = await db.query.krs.findFirst({
      where: and(
        eq(krs.mahasiswaId, mhs.id),
        eq(krs.tahunAkademikId, activeTahunAkademik.id)
      )
    });
    
    if (!activeKrs) {
      const newKrs = await db.insert(krs).values({
        mahasiswaId: mhs.id,
        tahunAkademikId: activeTahunAkademik.id,
        status: 'draft'
      }).returning();
      activeKrs = newKrs[0];
    }
    
    // Add class to KRS
    await db.insert(krsDetail).values({
      krsId: activeKrs.id,
      kelasId
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error in addClassToKrs:', error);
    return { error: 'Gagal menambahkan kelas ke KRS' };
  }
}

export async function removeClassFromKrs(krsDetailId: number) {
  try {
    await db.delete(krsDetail).where(eq(krsDetail.id, krsDetailId));
    return { success: true };
  } catch (error) {
    console.error('Error in removeClassFromKrs:', error);
    return { error: 'Gagal menghapus kelas dari KRS' };
  }
}

export async function submitKrs(krsId: number) {
  try {
    await db.update(krs).set({ status: 'submitted' }).where(eq(krs.id, krsId));
    return { success: true };
  } catch (error) {
    console.error('Error in submitKrs:', error);
    return { error: 'Gagal mengirim KRS' };
  }
}