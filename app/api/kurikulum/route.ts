import { NextRequest } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { db } from '@/db';
import { kurikulum, kurikulumDetail, programStudi, mataKuliah } from '@/db/schema';
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
    const prodiId = searchParams.get('prodiId');

    let whereCondition: any = {};
    if (search) {
      whereCondition = and(
        whereCondition,
        like(kurikulum.tahunKurikulum, `%${search}%`)
      );
    }
    if (isActive) {
      whereCondition = and(
        whereCondition,
        eq(kurikulum.isActive, isActive === 'true')
      );
    }
    if (prodiId) {
      whereCondition = and(
        whereCondition,
        eq(kurikulum.prodiId, parseInt(prodiId))
      );
    }

    const results = await db
      .select({
        id: kurikulum.id,
        prodiId: kurikulum.prodiId,
        tahunKurikulum: kurikulum.tahunKurikulum,
        totalSks: kurikulum.totalSks,
        isActive: kurikulum.isActive,
        createdAt: kurikulum.createdAt,
        namaProdi: programStudi.namaProdi,
      })
      .from(kurikulum)
      .leftJoin(programStudi, eq(kurikulum.prodiId, programStudi.id))
      .where(whereCondition)
      .limit(parseInt(limit))
      .offset(parseInt(offset));

    const total = await db
      .select({ count: sql<number>`count(*)` })
      .from(kurikulum)
      .leftJoin(programStudi, eq(kurikulum.prodiId, programStudi.id))
      .where(whereCondition);

    return Response.json({
      data: results,
      total: total[0].count,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Error in GET /api/kurikulum:', error);
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
      prodiId,
      tahunKurikulum,
      totalSks,
      isActive,
      kurikulumDetails
    } = await req.json();

    // Validasi input
    if (!prodiId || !tahunKurikulum || !totalSks) {
      return Response.json({ error: 'Prodi ID, tahun kurikulum, and total SKS are required' }, { status: 400 });
    }

    // Cek apakah program studi ada
    const existingProdi = await db.query.programStudi.findFirst({
      where: eq(programStudi.id, prodiId)
    });
    if (!existingProdi) {
      return Response.json({ error: 'Program Studi ID does not exist' }, { status: 400 });
    }

    // Cek apakah kurikulum untuk prodi dan tahun yang sama sudah ada
    const existingKurikulum = await db.query.kurikulum.findFirst({
      where: and(
        eq(kurikulum.prodiId, prodiId),
        eq(kurikulum.tahunKurikulum, tahunKurikulum)
      )
    });
    if (existingKurikulum) {
      return Response.json({ error: 'Kurikulum for this program study and year already exists' }, { status: 400 });
    }

    // Buat data kurikulum
    const [newKurikulum] = await db.insert(kurikulum).values({
      prodiId,
      tahunKurikulum,
      totalSks,
      isActive: isActive || false
    }).returning();

    // Jika ada kurikulum detail, tambahkan
    if (kurikulumDetails && Array.isArray(kurikulumDetails)) {
      const kurikulumDetailData = kurikulumDetails.map((detail: any) => ({
        kurikulumId: newKurikulum.id,
        mataKuliahId: detail.mataKuliahId,
        semester: detail.semester,
        isWajib: detail.isWajib !== undefined ? detail.isWajib : true
      }));

      await db.insert(kurikulumDetail).values(kurikulumDetailData);
    }

    return Response.json({
      message: 'Kurikulum created successfully',
      data: { ...newKurikulum, kurikulumDetails: kurikulumDetailData || [] }
    });
  } catch (error) {
    console.error('Error in POST /api/kurikulum:', error);
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
    const kurikulumDetails = updateData.kurikulumDetails;
    delete updateData.kurikulumDetails;

    if (!id) {
      return Response.json({ error: 'ID is required' }, { status: 400 });
    }

    // Cek apakah kurikulum ada
    const existingKurikulum = await db.query.kurikulum.findFirst({
      where: eq(kurikulum.id, id)
    });
    if (!existingKurikulum) {
      return Response.json({ error: 'Kurikulum not found' }, { status: 404 });
    }

    // Cek apakah prodi ID baru valid
    if (updateData.prodiId) {
      const existingProdi = await db.query.programStudi.findFirst({
        where: eq(programStudi.id, updateData.prodiId)
      });
      if (!existingProdi) {
        return Response.json({ error: 'Program Studi ID does not exist' }, { status: 400 });
      }
    }

    // Update data kurikulum
    const [updatedKurikulum] = await db
      .update(kurikulum)
      .set(updateData)
      .where(eq(kurikulum.id, id))
      .returning();

    // Jika ada kurikulum detail, hapus yang lama dan tambahkan yang baru
    if (kurikulumDetails && Array.isArray(kurikulumDetails)) {
      // Hapus kurikulum detail lama
      await db.delete(kurikulumDetail).where(eq(kurikulumDetail.kurikulumId, id));
      
      // Tambahkan kurikulum detail baru
      const newKurikulumDetailData = kurikulumDetails.map((detail: any) => ({
        kurikulumId: id,
        mataKuliahId: detail.mataKuliahId,
        semester: detail.semester,
        isWajib: detail.isWajib !== undefined ? detail.isWajib : true
      }));

      await db.insert(kurikulumDetail).values(newKurikulumDetailData);
    }

    return Response.json({
      message: 'Kurikulum updated successfully',
      data: updatedKurikulum
    });
  } catch (error) {
    console.error('Error in PUT /api/kurikulum:', error);
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

    // Cek apakah kurikulum ada
    const existingKurikulum = await db.query.kurikulum.findFirst({
      where: eq(kurikulum.id, parseInt(id))
    });
    if (!existingKurikulum) {
      return Response.json({ error: 'Kurikulum not found' }, { status: 404 });
    }

    // Cek apakah kurikulum ini digunakan di kelas
    // Kita tidak bisa menghapus kurikulum jika sudah digunakan di kelas

    // Hapus kurikulum detail terlebih dahulu
    await db.delete(kurikulumDetail).where(eq(kurikulumDetail.kurikulumId, parseInt(id)));
    
    // Hapus kurikulum
    await db.delete(kurikulum).where(eq(kurikulum.id, parseInt(id)));

    return Response.json({
      message: 'Kurikulum deleted successfully'
    });
  } catch (error) {
    console.error('Error in DELETE /api/kurikulum:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}