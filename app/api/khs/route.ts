import { NextRequest } from 'next/server';
import { db } from '@/db';
import { 
  mahasiswa, 
  nilaiAkhir, 
  krs, 
  krsDetail, 
  kelas, 
  mataKuliah, 
  tahunAkademik,
  dosen
} from '@/db/schema';
import { eq, and, desc, sql } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    // Extract userId from query parameters
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return Response.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Get mahasiswa info
    const mhs = await db.query.mahasiswa.findFirst({
      where: eq(mahasiswa.userId, parseInt(userId)),
      with: {
        prodi: true
      }
    });

    if (!mhs) {
      return Response.json({ error: 'Mahasiswa tidak ditemukan' }, { status: 404 });
    }

    // Get all academic years
    const allTahunAkademik = await db
      .select()
      .from(tahunAkademik)
      .orderBy(desc(tahunAkademik.tahun));

    // For each academic year, get KRS and related data
    const khsData = [];
    for (const tahun of allTahunAkademik) {
      const krsRecord = await db.query.krs.findFirst({
        where: and(
          eq(krs.mahasiswaId, mhs.id),
          eq(krs.tahunAkademikId, tahun.id)
        )
      });

      if (krsRecord) {
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
            khsData.push({
              ...detail,
              tahunAkademik: tahun
            });
          }
        }
      }
    }

    return Response.json({
      mahasiswa: mhs,
      availableSemesters: allTahunAkademik,
      khsData
    });
  } catch (error) {
    console.error('Error in GET /api/khs:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}