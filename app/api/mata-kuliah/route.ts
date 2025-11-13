import { NextRequest } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { db } from '@/db';
import { mataKuliah, programStudi, kurikulumDetail, kelas } from '@/db/schema';
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
    const prodiId = searchParams.get('prodiId');
    const semester = searchParams.get('semester');

    let whereCondition: any = {};
    if (search) {
      whereCondition = and(
        whereCondition,
        like(mataKuliah.namaMk, `%${search}%`)
      );
    }
    if (prodiId) {
      whereCondition = and(
        whereCondition,
        eq(mataKuliah.prodiId, parseInt(prodiId))
      );
    }
    if (semester) {
      whereCondition = and(
        whereCondition,
        eq(mataKuliah.semester, parseInt(semester))
      );
    }

    const results = await db
      .select({
        id: mataKuliah.id,
        kodeMk: mataKuliah.kodeMk,
        namaMk: mataKuliah.namaMk,
        sks: mataKuliah.sks,
        semester: mataKuliah.semester,
        jenis: mataKuliah.jenis,
        prodiId: mataKuliah.prodiId,
        deskripsi: mataKuliah.deskripsi,
        silabus: mataKuliah.silabus,
        createdAt: mataKuliah.createdAt,
        namaProdi: programStudi.namaProdi,
      })
      .from(mataKuliah)
      .leftJoin(programStudi, eq(mataKuliah.prodiId, programStudi.id))
      .where(whereCondition)
      .limit(parseInt(limit))
      .offset(parseInt(offset));

    const total = await db
      .select({ count: sql<number>`count(*)` })
      .from(mataKuliah)
      .leftJoin(programStudi, eq(mataKuliah.prodiId, programStudi.id))
      .where(whereCondition);

    return Response.json({
      data: results,
      total: total[0].count,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Error in GET /api/mata-kuliah:', error);
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
      kodeMk,
      namaMk,
      sks,
      semester,
      jenis,
      prodiId,
      deskripsi,
      silabus
    } = await req.json();

    // Validasi input
    if (!kodeMk || !namaMk || !sks || !semester || !prodiId) {
      return Response.json({ error: 'Kode MK, nama MK, SKS, semester, and prodi ID are required' }, { status: 400 });
    }

    // Cek apakah kode MK sudah ada
    const existingKodeMk = await db.query.mataKuliah.findFirst({
      where: eq(mataKuliah.kodeMk, kodeMk)
    });
    if (existingKodeMk) {
      return Response.json({ error: 'Kode MK already exists' }, { status: 400 });
    }

    // Cek apakah prodi ID valid
    const existingProdi = await db.query.programStudi.findFirst({
      where: eq(programStudi.id, prodiId)
    });
    if (!existingProdi) {
      return Response.json({ error: 'Program Studi ID does not exist' }, { status: 400 });
    }

    // Buat data mata kuliah
    const [newMataKuliah] = await db.insert(mataKuliah).values({
      kodeMk,
      namaMk,
      sks,
      semester,
      jenis: jenis || 'wajib',
      prodiId,
      deskripsi,
      silabus
    }).returning();

    return Response.json({
      message: 'Mata Kuliah created successfully',
      data: newMataKuliah
    });
  } catch (error) {
    console.error('Error in POST /api/mata-kuliah:', error);
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

    // Cek apakah mata kuliah ada
    const existingMataKuliah = await db.query.mataKuliah.findFirst({
      where: eq(mataKuliah.id, id)
    });
    if (!existingMataKuliah) {
      return Response.json({ error: 'Mata Kuliah not found' }, { status: 404 });
    }

    // Cek apakah prodi ID baru valid jika di-update
    if (updateData.prodiId) {
      const existingProdi = await db.query.programStudi.findFirst({
        where: eq(programStudi.id, updateData.prodiId)
      });
      if (!existingProdi) {
        return Response.json({ error: 'Program Studi ID does not exist' }, { status: 400 });
      }
    }

    // Update data mata kuliah
    const [updatedMataKuliah] = await db
      .update(mataKuliah)
      .set(updateData)
      .where(eq(mataKuliah.id, id))
      .returning();

    return Response.json({
      message: 'Mata Kuliah updated successfully',
      data: updatedMataKuliah
    });
  } catch (error) {
    console.error('Error in PUT /api/mata-kuliah:', error);
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

    // Cek apakah mata kuliah ada
    const existingMataKuliah = await db.query.mataKuliah.findFirst({
      where: eq(mataKuliah.id, parseInt(id))
    });
    if (!existingMataKuliah) {
      return Response.json({ error: 'Mata Kuliah not found' }, { status: 404 });
    }

    // Cek apakah mata kuliah ini digunakan di kelas atau kurikulum
    const kelasWithMataKuliah = await db.query.kelas.findFirst({
      where: eq(kelas.mataKuliahId, parseInt(id))
    });
    if (kelasWithMataKuliah) {
      return Response.json({ error: 'Mata Kuliah is currently used in classes' }, { status: 400 });
    }

    const kurikulumDetailWithMataKuliah = await db.query.kurikulumDetail.findFirst({
      where: eq(kurikulumDetail.mataKuliahId, parseInt(id))
    });
    if (kurikulumDetailWithMataKuliah) {
      return Response.json({ error: 'Mata Kuliah is currently used in curriculum' }, { status: 400 });
    }

    // Hapus mata kuliah
    await db.delete(mataKuliah).where(eq(mataKuliah.id, parseInt(id)));

    return Response.json({
      message: 'Mata Kuliah deleted successfully'
    });
  } catch (error) {
    console.error('Error in DELETE /api/mata-kuliah:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}