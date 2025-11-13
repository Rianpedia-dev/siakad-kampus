import { NextRequest } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { db } from '@/db';
import { ruangan, kelas } from '@/db/schema';
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
        like(ruangan.namaRuangan, `%${search}%`)
      );
    }
    if (isActive) {
      whereCondition = and(
        whereCondition,
        eq(ruangan.isActive, isActive === 'true')
      );
    }

    const results = await db
      .select({
        id: ruangan.id,
        kodeRuangan: ruangan.kodeRuangan,
        namaRuangan: ruangan.namaRuangan,
        gedung: ruangan.gedung,
        lantai: ruangan.lantai,
        kapasitas: ruangan.kapasitas,
        fasilitas: ruangan.fasilitas,
        isActive: ruangan.isActive,
      })
      .from(ruangan)
      .where(whereCondition)
      .limit(parseInt(limit))
      .offset(parseInt(offset));

    const total = await db
      .select({ count: sql<number>`count(*)` })
      .from(ruangan)
      .where(whereCondition);

    return Response.json({
      data: results,
      total: total[0].count,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Error in GET /api/ruangan:', error);
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
      kodeRuangan,
      namaRuangan,
      gedung,
      lantai,
      kapasitas,
      fasilitas
    } = await req.json();

    // Validasi input
    if (!kodeRuangan || !namaRuangan || !kapasitas) {
      return Response.json({ error: 'Kode ruangan, nama ruangan, and kapasitas are required' }, { status: 400 });
    }

    // Cek apakah kode ruangan sudah ada
    const existingKodeRuangan = await db.query.ruangan.findFirst({
      where: eq(ruangan.kodeRuangan, kodeRuangan)
    });
    if (existingKodeRuangan) {
      return Response.json({ error: 'Kode Ruangan already exists' }, { status: 400 });
    }

    // Buat data ruangan
    const [newRuangan] = await db.insert(ruangan).values({
      kodeRuangan,
      namaRuangan,
      gedung,
      lantai,
      kapasitas,
      fasilitas,
      isActive: true
    }).returning();

    return Response.json({
      message: 'Ruangan created successfully',
      data: newRuangan
    });
  } catch (error) {
    console.error('Error in POST /api/ruangan:', error);
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

    // Cek apakah ruangan ada
    const existingRuangan = await db.query.ruangan.findFirst({
      where: eq(ruangan.id, id)
    });
    if (!existingRuangan) {
      return Response.json({ error: 'Ruangan not found' }, { status: 404 });
    }

    // Update data ruangan
    const [updatedRuangan] = await db
      .update(ruangan)
      .set(updateData)
      .where(eq(ruangan.id, id))
      .returning();

    return Response.json({
      message: 'Ruangan updated successfully',
      data: updatedRuangan
    });
  } catch (error) {
    console.error('Error in PUT /api/ruangan:', error);
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

    // Cek apakah ruangan ada
    const existingRuangan = await db.query.ruangan.findFirst({
      where: eq(ruangan.id, parseInt(id))
    });
    if (!existingRuangan) {
      return Response.json({ error: 'Ruangan not found' }, { status: 404 });
    }

    // Cek apakah ruangan ini digunakan dalam kelas
    const kelasInRuangan = await db.query.kelas.findFirst({
      where: eq(kelas.ruanganId, parseInt(id))
    });
    if (kelasInRuangan) {
      return Response.json({ error: 'Ruangan is currently used in classes' }, { status: 400 });
    }

    // Hapus ruangan
    await db.delete(ruangan).where(eq(ruangan.id, parseInt(id)));

    return Response.json({
      message: 'Ruangan deleted successfully'
    });
  } catch (error) {
    console.error('Error in DELETE /api/ruangan:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}