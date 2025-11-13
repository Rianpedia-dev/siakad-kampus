import { NextRequest } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { db } from '@/db';
import { programStudi, dosen, mahasiswa, mataKuliah } from '@/db/schema';
import { eq, and, like, sql } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session || session.user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    const limit = searchParams.get('limit') || '10';
    const offset = searchParams.get('offset') || '0';
    const isActive = searchParams.get('isActive');

    let whereCondition: any = {};
    if (search) {
      whereCondition = and(
        whereCondition,
        like(programStudi.namaProdi, `%${search}%`)
      );
    }
    if (isActive) {
      whereCondition = and(
        whereCondition,
        eq(programStudi.isActive, isActive === 'true')
      );
    }

    const results = await db
      .select({
        id: programStudi.id,
        kodeProdi: programStudi.kodeProdi,
        namaProdi: programStudi.namaProdi,
        jenjang: programStudi.jenjang,
        fakultas: programStudi.fakultas,
        kaprodiId: programStudi.kaprodiId,
        akreditasi: programStudi.akreditasi,
        isActive: programStudi.isActive,
        createdAt: programStudi.createdAt,
        namaKaprodi: dosen.namaLengkap,
      })
      .from(programStudi)
      .leftJoin(dosen, eq(programStudi.kaprodiId, dosen.id))
      .where(whereCondition)
      .limit(parseInt(limit))
      .offset(parseInt(offset));

    const total = await db
      .select({ count: sql<number>`count(*)` })
      .from(programStudi)
      .leftJoin(dosen, eq(programStudi.kaprodiId, dosen.id))
      .where(whereCondition);

    return Response.json({
      data: results,
      total: total[0].count,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Error in GET /api/program-studi:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session || session.user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      kodeProdi,
      namaProdi,
      jenjang,
      fakultas,
      kaprodiId,
      akreditasi
    } = await req.json();

    // Validasi input
    if (!kodeProdi || !namaProdi) {
      return Response.json({ error: 'Kode Prodi and nama Prodi are required' }, { status: 400 });
    }

    // Cek apakah kode prodi sudah ada
    const existingKodeProdi = await db.query.programStudi.findFirst({
      where: eq(programStudi.kodeProdi, kodeProdi)
    });
    if (existingKodeProdi) {
      return Response.json({ error: 'Kode Prodi already exists' }, { status: 400 });
    }

    // Cek apakah kaprodi ID valid
    if (kaprodiId) {
      const existingDosen = await db.query.dosen.findFirst({
        where: eq(dosen.id, kaprodiId)
      });
      if (!existingDosen) {
        return Response.json({ error: 'Kaprodi ID does not exist' }, { status: 400 });
      }
    }

    // Buat data program studi
    const [newProgramStudi] = await db.insert(programStudi).values({
      kodeProdi,
      namaProdi,
      jenjang,
      fakultas,
      kaprodiId,
      akreditasi,
      isActive: true
    }).returning();

    return Response.json({
      message: 'Program Studi created successfully',
      data: newProgramStudi
    });
  } catch (error) {
    console.error('Error in POST /api/program-studi:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session || session.user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, ...updateData } = await req.json();

    if (!id) {
      return Response.json({ error: 'ID is required' }, { status: 400 });
    }

    // Cek apakah program studi ada
    const existingProgramStudi = await db.query.programStudi.findFirst({
      where: eq(programStudi.id, id)
    });
    if (!existingProgramStudi) {
      return Response.json({ error: 'Program Studi not found' }, { status: 404 });
    }

    // Cek apakah kaprodi ID baru valid
    if (updateData.kaprodiId) {
      const existingDosen = await db.query.dosen.findFirst({
        where: eq(dosen.id, updateData.kaprodiId)
      });
      if (!existingDosen) {
        return Response.json({ error: 'Kaprodi ID does not exist' }, { status: 400 });
      }
    }

    // Update data program studi
    const [updatedProgramStudi] = await db
      .update(programStudi)
      .set(updateData)
      .where(eq(programStudi.id, id))
      .returning();

    return Response.json({
      message: 'Program Studi updated successfully',
      data: updatedProgramStudi
    });
  } catch (error) {
    console.error('Error in PUT /api/program-studi:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session || session.user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return Response.json({ error: 'ID is required' }, { status: 400 });
    }

    // Cek apakah program studi ada
    const existingProgramStudi = await db.query.programStudi.findFirst({
      where: eq(programStudi.id, parseInt(id))
    });
    if (!existingProgramStudi) {
      return Response.json({ error: 'Program Studi not found' }, { status: 404 });
    }

    // Cek apakah program studi ini digunakan oleh mahasiswa atau mata kuliah
    const mahasiswaInProdi = await db.query.mahasiswa.findFirst({
      where: eq(mahasiswa.prodiId, parseInt(id))
    });
    if (mahasiswaInProdi) {
      return Response.json({ error: 'Program Studi has registered students' }, { status: 400 });
    }

    const mataKuliahInProdi = await db.query.mataKuliah.findFirst({
      where: eq(mataKuliah.prodiId, parseInt(id))
    });
    if (mataKuliahInProdi) {
      return Response.json({ error: 'Program Studi has associated courses' }, { status: 400 });
    }

    // Hapus program studi
    await db.delete(programStudi).where(eq(programStudi.id, parseInt(id)));

    return Response.json({
      message: 'Program Studi deleted successfully'
    });
  } catch (error) {
    console.error('Error in DELETE /api/program-studi:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}