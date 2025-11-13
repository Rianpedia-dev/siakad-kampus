import { NextRequest } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { db } from '@/db';
import { pengumuman, users } from '@/db/schema';
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
    const kategori = searchParams.get('kategori');
    const targetRole = searchParams.get('targetRole');

    let whereCondition: any = {};
    if (search) {
      whereCondition = and(
        whereCondition,
        like(pengumuman.judul, `%${search}%`)
      );
    }
    if (kategori) {
      whereCondition = and(
        whereCondition,
        eq(pengumuman.kategori, kategori)
      );
    }
    if (targetRole) {
      whereCondition = and(
        whereCondition,
        eq(pengumuman.targetRole, targetRole)
      );
    }

    const results = await db
      .select({
        id: pengumuman.id,
        judul: pengumuman.judul,
        konten: pengumuman.konten,
        kategori: pengumuman.kategori,
        targetRole: pengumuman.targetRole,
        isPinned: pengumuman.isPinned,
        publishedBy: pengumuman.publishedBy,
        publishedAt: pengumuman.publishedAt,
        expiresAt: pengumuman.expiresAt,
        createdAt: pengumuman.createdAt,
        namaPenulis: users.namaLengkap,
      })
      .from(pengumuman)
      .leftJoin(users, eq(pengumuman.publishedBy, users.id))
      .where(whereCondition)
      .orderBy(sql`${pengumuman.publishedAt} DESC`)
      .limit(parseInt(limit))
      .offset(parseInt(offset));

    const total = await db
      .select({ count: sql<number>`count(*)` })
      .from(pengumuman)
      .leftJoin(users, eq(pengumuman.publishedBy, users.id))
      .where(whereCondition);

    return Response.json({
      data: results,
      total: total[0].count,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Error in GET /api/pengumuman:', error);
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
      judul,
      konten,
      kategori,
      targetRole,
      isPinned,
      expiresAt
    } = await req.json();

    // Validasi input
    if (!judul || !konten) {
      return Response.json({ error: 'Judul and konten are required' }, { status: 400 });
    }

    // Buat data pengumuman
    const [newPengumuman] = await db.insert(pengumuman).values({
      judul,
      konten,
      kategori: kategori || 'umum',
      targetRole: targetRole || 'all',
      isPinned: isPinned || false,
      publishedBy: session.user.id,
      publishedAt: new Date(),
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      createdAt: new Date()
    }).returning();

    return Response.json({
      message: 'Pengumuman created successfully',
      data: newPengumuman
    });
  } catch (error) {
    console.error('Error in POST /api/pengumuman:', error);
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

    // Cek apakah pengumuman ada dan milik pengguna ini
    const existingPengumuman = await db.query.pengumuman.findFirst({
      where: and(
        eq(pengumuman.id, id),
        eq(pengumuman.publishedBy, session.user.id)
      )
    });
    if (!existingPengumuman) {
      return Response.json({ error: 'Pengumuman not found' }, { status: 404 });
    }

    // Update data pengumuman
    const [updatedPengumuman] = await db
      .update(pengumuman)
      .set(updateData)
      .where(eq(pengumuman.id, id))
      .returning();

    return Response.json({
      message: 'Pengumuman updated successfully',
      data: updatedPengumuman
    });
  } catch (error) {
    console.error('Error in PUT /api/pengumuman:', error);
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

    // Cek apakah pengumuman ada dan milik pengguna ini
    const existingPengumuman = await db.query.pengumuman.findFirst({
      where: and(
        eq(pengumuman.id, parseInt(id)),
        eq(pengumuman.publishedBy, session.user.id)
      )
    });
    if (!existingPengumuman) {
      return Response.json({ error: 'Pengumuman not found' }, { status: 404 });
    }

    // Hapus pengumuman
    await db.delete(pengumuman).where(eq(pengumuman.id, parseInt(id)));

    return Response.json({
      message: 'Pengumuman deleted successfully'
    });
  } catch (error) {
    console.error('Error in DELETE /api/pengumuman:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}