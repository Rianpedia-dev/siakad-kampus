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
  presensi,
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

    let presensiData = [];
    if (krsRecord) {
      // Get all classes from this KRS
      const krsDetails = await db.query.krsDetail.findMany({
        where: eq(krsDetail.krsId, krsRecord.id),
        with: {
          kelas: {
            with: {
              mataKuliah: true,
              dosen: true
            }
          }
        }
      });

      // For each class, get all pertemuan and presensi
      for (const detail of krsDetails) {
        // Get all pertemuan for this class
        const pertemuanList = await db.query.pertemuan.findMany({
          where: eq(pertemuan.kelasId, detail.kelasId),
          orderBy: [desc(pertemuan.tanggal)]
        });

        let presensiList = [];
        if (pertemuanList.length > 0) {
          // Get all presensi for this student in this class
          presensiList = await db.query.presensi.findMany({
            where: and(
              eq(presensi.mahasiswaId, mhs.id),
              sql`${presensi.pertemuanId} = ANY(ARRAY[${sql.join(pertemuanList.map(p => p.id), sql`, `)}])`
            )
          });
        }

        // Create attendance record for each pertemuan
        const attendanceRecords = pertemuanList.map(pertemuan => {
          const studentPresensi = presensiList.find(p => p.pertemuanId === pertemuan.id);
          return {
            pertemuanId: pertemuan.id,
            pertemuanKe: pertemuan.pertemuanKe,
            tanggal: pertemuan.tanggal,
            topik: pertemuan.topik,
            status: studentPresensi?.status || 'belum',
            keterangan: studentPresensi?.keterangan || ''
          };
        });

        presensiData.push({
          ...detail,
          pertemuan: attendanceRecords
        });
      }
    }

    // Get all academic years for selector
    const allTahunAkademik = await db
      .select()
      .from(tahunAkademik)
      .orderBy(desc(tahunAkademik.tahun));

    return Response.json({
      mahasiswa: mhs,
      availableSemesters: allTahunAkademik,
      presensiData,
      selectedSemester: targetTahunAkademik
    });
  } catch (error) {
    console.error('Error in GET /api/presensi:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}