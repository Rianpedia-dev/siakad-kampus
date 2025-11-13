import { NextRequest } from 'next/server';
import { db } from '@/db';
import { 
  mahasiswa, 
  krs, 
  krsDetail, 
  kelas, 
  mataKuliah, 
  tahunAkademik,
  dosen,
  ruangan,
  pertemuan
} from '@/db/schema';
import { eq, and, desc, sql } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    // Extract userId and tahunAkademikId from query parameters
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const tahunAkademikId = searchParams.get('tahunAkademikId');

    if (!userId) {
      return Response.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Get mahasiswa info
    const mhs = await db.query.mahasiswa.findFirst({
      where: eq(mahasiswa.userId, parseInt(userId))
    });

    if (!mhs) {
      return Response.json({ error: 'Mahasiswa tidak ditemukan' }, { status: 404 });
    }

    // Get tahun akademik (use provided id or active one)
    let targetTahunAkademik;
    if (tahunAkademikId) {
      targetTahunAkademik = await db.query.tahunAkademik.findFirst({
        where: eq(tahunAkademik.id, parseInt(tahunAkademikId))
      });
    } else {
      targetTahunAkademik = await db.query.tahunAkademik.findFirst({
        where: eq(tahunAkademik.isActive, true)
      });
    }

    if (!targetTahunAkademik) {
      return Response.json({ error: 'Tahun akademik tidak ditemukan' }, { status: 404 });
    }

    // Get active KRS for this student and semester
    const krsRecord = await db.query.krs.findFirst({
      where: and(
        eq(krs.mahasiswaId, mhs.id),
        eq(krs.tahunAkademikId, targetTahunAkademik.id)
      )
    });

    let jadwalData = [];
    if (krsRecord) {
      // Get all classes from this KRS
      const krsDetails = await db.query.krsDetail.findMany({
        where: eq(krsDetail.krsId, krsRecord.id),
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

      // Format the data by day
      const jadwalByDay: Record<string, any[]> = {
        'Senin': [],
        'Selasa': [],
        'Rabu': [],
        'Kamis': [],
        'Jumat': [],
        'Sabtu': [],
        'Minggu': []
      };

      krsDetails.forEach(detail => {
        const hari = detail.kelas?.hari || 'Tidak Ada';
        if (jadwalByDay[hari]) {
          jadwalByDay[hari].push(detail);
        }
      });

      // Sort each day by time
      Object.keys(jadwalByDay).forEach(day => {
        jadwalByDay[day].sort((a, b) => {
          if (a.kelas?.jamMulai && b.kelas?.jamMulai) {
            return a.kelas.jamMulai.localeCompare(b.kelas.jamMulai);
          }
          return 0;
        });
      });

      jadwalData = jadwalByDay;
    } else {
      // If no KRS is approved, get all classes the student is enrolled in
      const allClasses = await db
        .select({
          kelas: kelas,
          mataKuliah: mataKuliah,
          dosen: dosen,
          ruangan: ruangan
        })
        .from(kelas)
        .innerJoin(mataKuliah, eq(kelas.mataKuliahId, mataKuliah.id))
        .innerJoin(dosen, eq(kelas.dosenId, dosen.id))
        .leftJoin(ruangan, eq(kelas.ruanganId, ruangan.id))
        .where(eq(kelas.tahunAkademikId, targetTahunAkademik.id));

      // Format the data by day
      const jadwalByDay: Record<string, any[]> = {
        'Senin': [],
        'Selasa': [],
        'Rabu': [],
        'Kamis': [],
        'Jumat': [],
        'Sabtu': [],
        'Minggu': []
      };

      allClasses.forEach(cls => {
        const hari = cls.kelas.hari || 'Tidak Ada';
        if (jadwalByDay[hari]) {
          jadwalByDay[hari].push({
            kelas: cls.kelas,
            kelasData: {
              ...cls.kelas,
              mataKuliah: cls.mataKuliah,
              dosen: cls.dosen,
              ruangan: cls.ruangan
            }
          });
        }
      });

      // Sort each day by time
      Object.keys(jadwalByDay).forEach(day => {
        jadwalByDay[day].sort((a, b) => {
          if (a.kelas?.jamMulai && b.kelas?.jamMulai) {
            return a.kelas.jamMulai.localeCompare(b.kelas.jamMulai);
          }
          return 0;
        });
      });

      jadwalData = jadwalByDay;
    }

    // Get all academic years for selector
    const allTahunAkademik = await db
      .select()
      .from(tahunAkademik)
      .orderBy(desc(tahunAkademik.tahun));

    return Response.json({
      mahasiswa: mhs,
      availableSemesters: allTahunAkademik,
      jadwalData,
      selectedSemester: targetTahunAkademik
    });
  } catch (error) {
    console.error('Error in GET /api/jadwal:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}