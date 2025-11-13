import { NextRequest } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { db } from '@/db';
import { tahunAkademik } from '@/db/schema';
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
        like(tahunAkademik.tahun, `%${search}%`)
      );
    }
    if (isActive) {
      whereCondition = and(
        whereCondition,
        eq(tahunAkademik.isActive, isActive === 'true')
      );
    }

    const results = await db
      .select({
        id: tahunAkademik.id,
        tahun: tahunAkademik.tahun,
        semester: tahunAkademik.semester,
        tanggalMulai: tahunAkademik.tanggalMulai,
        tanggalSelesai: tahunAkademik.tanggalSelesai,
        isActive: tahunAkademik.isActive,
        createdAt: tahunAkademik.createdAt,
      })
      .from(tahunAkademik)
      .where(whereCondition)
      .orderBy(sql`${tahunAkademik.tanggalMulai} DESC`)
      .limit(parseInt(limit))
      .offset(parseInt(offset));

    const total = await db
      .select({ count: sql<number>`count(*)` })
      .from(tahunAkademik)
      .where(whereCondition);

    return Response.json({
      data: results,
      total: total[0].count,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Error in GET /api/tahun-akademik:', error);
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
      tahun,
      semester,
      tanggalMulai,
      tanggalSelesai
    } = await req.json();

    // Validasi input
    if (!tahun || !semester || !tanggalMulai || !tanggalSelesai) {
      return Response.json({ error: 'Tahun, semester, tanggal mulai, and tanggal selesai are required' }, { status: 400 });
    }

    // Validasi format tahun
    const tahunPattern = /^\d{4}\/\d{4}$/;
    if (!tahunPattern.test(tahun)) {
      return Response.json({ error: 'Tahun must be in format YYYY/YYYY (e.g., 2023/2024)' }, { status: 400 });
    }

    // Validasi semester
    const validSemesters = ['Ganjil', 'Genap'];
    if (!validSemesters.includes(semester)) {
      return Response.json({ error: 'Semester must be Ganjil or Genap' }, { status: 400 });
    }

    // Cek apakah tahun akademik dengan tahun dan semester yang sama sudah ada
    const existingTahunAkademik = await db.query.tahunAkademik.findFirst({
      where: and(
        eq(tahunAkademik.tahun, tahun),
        eq(tahunAkademik.semester, semester)
      )
    });
    if (existingTahunAkademik) {
      return Response.json({ error: 'Tahun akademik with this year and semester already exists' }, { status: 400 });
    }

    // Buat data tahun akademik
    const [newTahunAkademik] = await db.insert(tahunAkademik).values({
      tahun,
      semester,
      tanggalMulai: new Date(tanggalMulai),
      tanggalSelesai: new Date(tanggalSelesai),
      isActive: false  // Default tidak aktif, harus diaktifkan secara eksplisit
    }).returning();

    return Response.json({
      message: 'Tahun Akademik created successfully',
      data: newTahunAkademik
    });
  } catch (error) {
    console.error('Error in POST /api/tahun-akademik:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session || session.user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, isActive, ...updateData } = await req.json();

    if (!id) {
      return Response.json({ error: 'ID is required' }, { status: 400 });
    }

    // Cek apakah tahun akademik ada
    const existingTahunAkademik = await db.query.tahunAkademik.findFirst({
      where: eq(tahunAkademik.id, id)
    });
    if (!existingTahunAkademik) {
      return Response.json({ error: 'Tahun Akademik not found' }, { status: 404 });
    }

    // Jika mengaktifkan tahun akademik, pastikan tidak ada tahun aktif lainnya
    if (isActive) {
      // Nonaktifkan tahun akademik aktif lainnya jika akan mengaktifkan tahun ini
      await db.update(tahunAkademik)
        .set({ isActive: false })
        .where(eq(tahunAkademik.isActive, true));
    }

    // Update data tahun akademik
    const [updatedTahunAkademik] = await db
      .update(tahunAkademik)
      .set({ ...updateData, isActive })
      .where(eq(tahunAkademik.id, id))
      .returning();

    return Response.json({
      message: 'Tahun Akademik updated successfully',
      data: updatedTahunAkademik
    });
  } catch (error) {
    console.error('Error in PUT /api/tahun-akademik:', error);
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

    // Cek apakah tahun akademik ada
    const existingTahunAkademik = await db.query.tahunAkademik.findFirst({
      where: eq(tahunAkademik.id, parseInt(id))
    });
    if (!existingTahunAkademik) {
      return Response.json({ error: 'Tahun Akademik not found' }, { status: 404 });
    }

    // Cek apakah tahun akademik ini sedang aktif
    if (existingTahunAkademik.isActive) {
      return Response.json({ error: 'Cannot delete active academic year' }, { status: 400 });
    }

    // Cek apakah tahun akademik ini digunakan di KRS atau kelas
    // Dalam implementasi lengkap, perlu mengecek tabel-tabel terkait seperti krs, kelas, dll.

    // Hapus tahun akademik
    await db.delete(tahunAkademik).where(eq(tahunAkademik.id, parseInt(id)));

    return Response.json({
      message: 'Tahun Akademik deleted successfully'
    });
  } catch (error) {
    console.error('Error in DELETE /api/tahun-akademik:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}