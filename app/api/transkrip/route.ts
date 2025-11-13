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

    // Get all KRS records for this student
    const allKrs = await db.query.krs.findMany({
      where: eq(krs.mahasiswaId, mhs.id),
      with: {
        tahunAkademik: true
      },
      orderBy: [desc(krs.tahunAkademikId)]
    });

    // For each KRS, get all details with nilai
    const allTranskripData = [];
    let totalSks = 0;
    let totalBobot = 0;
    let totalMataKuliah = 0;

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
          allTranskripData.push({
            ...detail,
            tahunAkademik: krsRecord.tahunAkademik
          });

          // Calculate for overall stats
          const sks = detail.kelas?.mataKuliah?.sks || 0;
          totalSks += sks;
          totalMataKuliah += 1;

          const nilaiIndeks = parseFloat(detail.nilaiAkhir?.nilaiIndeks || '0');
          totalBobot += (nilaiIndeks * sks);
        }
      }
    }

    // Calculate overall stats
    const ipk = totalSks > 0 ? totalBobot / totalSks : 0;

    return Response.json({
      mahasiswa: mhs,
      transkripData: allTranskripData,
      overallStats: {
        totalSks,
        totalMataKuliah,
        ipk: parseFloat(ipk.toFixed(2)),
        totalBobot
      }
    });
  } catch (error) {
    console.error('Error in GET /api/transkrip:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}