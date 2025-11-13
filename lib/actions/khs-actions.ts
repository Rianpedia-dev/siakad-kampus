'use server';

import { db } from '@/db';
import { 
  mahasiswa, 
  nilai, 
  nilaiAkhir, 
  krs, 
  krsDetail, 
  kelas, 
  mataKuliah, 
  tahunAkademik,
  komponenNilai,
  dosen
} from '@/db/schema';
import { eq, and, desc, sql } from 'drizzle-orm';

export async function getKhsData(userId: string) {
  try {
    // Get mahasiswa info
    const mhs = await db.query.mahasiswa.findFirst({
      where: eq(mahasiswa.userId, parseInt(userId)),
      with: {
        prodi: true
      }
    });

    if (!mhs) {
      return { error: 'Mahasiswa tidak ditemukan' };
    }

    // Get all KRS records for this student
    const allKrs = await db.query.krs.findMany({
      where: eq(krs.mahasiswaId, mhs.id),
      with: {
        tahunAkademik: true
      },
      orderBy: [desc(krs.tahunAkademikId)]
    });

    // For each KRS, get all details with nilai
    const allKhsData = [];
    for (const krsRecord of allKrs) {
      const krsDetails = await db.query.krsDetail.findMany({
        where: eq(krsDetail.krsId, krsRecord.id),
        with: {
          kelas: {
            with: {
              mataKuliah: true,
              dosen: true
            }
          },
          nilaiAkhir: true
        }
      });

      for (const detail of krsDetails) {
        if (detail.nilaiAkhir) {
          allKhsData.push({
            ...detail,
            tahunAkademik: krsRecord.tahunAkademik
          });
        }
      }
    }

    return {
      mahasiswa: mhs,
      khsData: allKhsData
    };
  } catch (error) {
    console.error('Error in getKhsData:', error);
    return { error: 'Gagal mengambil data KHS' };
  }
}