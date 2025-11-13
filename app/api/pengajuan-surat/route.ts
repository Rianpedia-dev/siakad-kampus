import { NextRequest } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { db } from '@/db';
import { pengajuanSurat, jenisSurat, mahasiswa, users } from '@/db/schema';
import { eq, and, like, sql, or } from 'drizzle-orm';

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
    const status = searchParams.get('status');
    const jenisSuratId = searchParams.get('jenisSuratId');

    let whereCondition: any = {};
    if (search) {
      whereCondition = and(
        whereCondition,
        or(
          like(pengajuanSurat.keperluan, `%${search}%`),
          like(jenisSurat.namaSurat, `%${search}%`)
        )
      );
    }
    if (status) {
      whereCondition = and(
        whereCondition,
        eq(pengajuanSurat.status, status)
      );
    }
    if (jenisSuratId) {
      whereCondition = and(
        whereCondition,
        eq(pengajuanSurat.jenisSuratId, parseInt(jenisSuratId))
      );
    }

    const results = await db
      .select({
        id: pengajuanSurat.id,
        mahasiswaId: pengajuanSurat.mahasiswaId,
        jenisSuratId: pengajuanSurat.jenisSuratId,
        keperluan: pengajuanSurat.keperluan,
        status: pengajuanSurat.status,
        nomorSurat: pengajuanSurat.nomorSurat,
        fileSurat: pengajuanSurat.fileSurat,
        processedBy: pengajuanSurat.processedBy,
        processedAt: pengajuanSurat.processedAt,
        catatan: pengajuanSurat.catatan,
        createdAt: pengajuanSurat.createdAt,
        namaJenisSurat: jenisSurat.namaSurat,
        namaMahasiswa: mahasiswa.namaLengkap,
        nim: mahasiswa.nim,
        namaPetugas: users.namaLengkap,
      })
      .from(pengajuanSurat)
      .leftJoin(jenisSurat, eq(pengajuanSurat.jenisSuratId, jenisSurat.id))
      .leftJoin(mahasiswa, eq(pengajuanSurat.mahasiswaId, mahasiswa.id))
      .leftJoin(users, eq(pengajuanSurat.processedBy, users.id))
      .where(whereCondition)
      .orderBy(sql`${pengajuanSurat.createdAt} DESC`)
      .limit(parseInt(limit))
      .offset(parseInt(offset));

    const total = await db
      .select({ count: sql<number>`count(*)` })
      .from(pengajuanSurat)
      .leftJoin(jenisSurat, eq(pengajuanSurat.jenisSuratId, jenisSurat.id))
      .leftJoin(mahasiswa, eq(pengajuanSurat.mahasiswaId, mahasiswa.id))
      .leftJoin(users, eq(pengajuanSurat.processedBy, users.id))
      .where(whereCondition);

    return Response.json({
      data: results,
      total: total[0].count,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Error in GET /api/pengajuan-surat:', error);
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
      mahasiswaId,
      jenisSuratId,
      keperluan,
      fileSurat
    } = await req.json();

    // Validasi input
    if (!mahasiswaId || !jenisSuratId || !keperluan) {
      return Response.json({ error: 'Mahasiswa ID, jenis surat ID, and keperluan are required' }, { status: 400 });
    }

    // Cek apakah mahasiswa dan jenis surat ada
    const existingMahasiswa = await db.query.mahasiswa.findFirst({
      where: eq(mahasiswa.id, mahasiswaId)
    });
    if (!existingMahasiswa) {
      return Response.json({ error: 'Mahasiswa not found' }, { status: 400 });
    }

    const existingJenisSurat = await db.query.jenisSurat.findFirst({
      where: eq(jenisSurat.id, jenisSuratId)
    });
    if (!existingJenisSurat) {
      return Response.json({ error: 'Jenis Surat not found' }, { status: 400 });
    }

    // Buat data pengajuan surat
    const [newPengajuanSurat] = await db.insert(pengajuanSurat).values({
      mahasiswaId,
      jenisSuratId,
      keperluan,
      fileSurat,
      status: 'pending'  // Default status pending
    }).returning();

    return Response.json({
      message: 'Pengajuan Surat created successfully',
      data: newPengajuanSurat
    });
  } catch (error) {
    console.error('Error in POST /api/pengajuan-surat:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session || session.user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, status, catatan, nomorSurat, processedBy } = await req.json();

    if (!id) {
      return Response.json({ error: 'ID is required' }, { status: 400 });
    }

    // Cek apakah pengajuan surat ada
    const existingPengajuanSurat = await db.query.pengajuanSurat.findFirst({
      where: eq(pengajuanSurat.id, id)
    });
    if (!existingPengajuanSurat) {
      return Response.json({ error: 'Pengajuan Surat not found' }, { status: 404 });
    }

    // Validasi status
    const validStatus = ['pending', 'approved', 'rejected'];
    if (status && !validStatus.includes(status)) {
      return Response.json({ error: 'Invalid status' }, { status: 400 });
    }

    // Update data pengajuan surat
    const updateData: any = { status, catatan };
    if (status === 'approved') {
      updateData.processedBy = processedBy || session.user.id;
      updateData.processedAt = new Date();
      updateData.nomorSurat = nomorSurat; // Nomor surat hanya diisi saat approved
    } else if (status === 'rejected') {
      updateData.processedBy = processedBy || session.user.id;
      updateData.processedAt = new Date();
    }

    const [updatedPengajuanSurat] = await db
      .update(pengajuanSurat)
      .set(updateData)
      .where(eq(pengajuanSurat.id, id))
      .returning();

    return Response.json({
      message: 'Pengajuan Surat updated successfully',
      data: updatedPengajuanSurat
    });
  } catch (error) {
    console.error('Error in PUT /api/pengajuan-surat:', error);
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

    // Cek apakah pengajuan surat ada
    const existingPengajuanSurat = await db.query.pengajuanSurat.findFirst({
      where: eq(pengajuanSurat.id, parseInt(id))
    });
    if (!existingPengajuanSurat) {
      return Response.json({ error: 'Pengajuan Surat not found' }, { status: 404 });
    }

    // Hapus pengajuan surat
    await db.delete(pengajuanSurat).where(eq(pengajuanSurat.id, parseInt(id)));

    return Response.json({
      message: 'Pengajuan Surat deleted successfully'
    });
  } catch (error) {
    console.error('Error in DELETE /api/pengajuan-surat:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}