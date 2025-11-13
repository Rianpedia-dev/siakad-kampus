import { NextRequest } from 'next/server';
import { getAuthSession } from '@/lib/auth';
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
        prodi: true,
        dosenPa: true
      }
    });

    if (!mhs) {
      return Response.json({ error: 'Mahasiswa tidak ditemukan' }, { status: 404 });
    }

    // Get active academic year
    const activeTahunAkademik = await db.query.tahunAkademik.findFirst({
      where: eq(tahunAkademik.isActive, true)
    });
    
    if (!activeTahunAkademik) {
      return Response.json({ error: 'Tidak ada tahun akademik aktif' }, { status: 404 });
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

    const totalSks = krsDetails.reduce((sum, detail) => sum + (detail.kelas?.mataKuliah?.sks || 0), 0);

    return Response.json({
      mahasiswa: mhs,
      tahunAkademikAktif: activeTahunAkademik,
      krsAktif: activeKrs,
      krsDetails,
      availableClasses,
      totalSks
    });
  } catch (error) {
    console.error('Error in GET /api/krs:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}