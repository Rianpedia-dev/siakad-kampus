import { NextRequest } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { db } from '@/db';
import { mahasiswa, mahasiswaDetail, users, programStudi, dosen } from '@/db/schema';
import { eq, and, like, sql } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

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

    let whereCondition: any = {};
    if (search) {
      whereCondition = and(
        whereCondition,
        like(mahasiswa.namaLengkap, `%${search}%`)
      );
    }
    if (prodiId) {
      whereCondition = and(
        whereCondition,
        eq(mahasiswa.prodiId, parseInt(prodiId))
      );
    }

    const results = await db
      .select({
        id: mahasiswa.id,
        userId: mahasiswa.userId,
        nim: mahasiswa.nim,
        namaLengkap: mahasiswa.namaLengkap,
        tempatLahir: mahasiswa.tempatLahir,
        tanggalLahir: mahasiswa.tanggalLahir,
        jenisKelamin: mahasiswa.jenisKelamin,
        alamat: mahasiswa.alamat,
        noTelp: mahasiswa.noTelp,
        prodiId: mahasiswa.prodiId,
        angkatan: mahasiswa.angkatan,
        semester: mahasiswa.semester,
        status: mahasiswa.status,
        dosenPaId: mahasiswa.dosenPaId,
        foto: mahasiswa.foto,
        createdAt: mahasiswa.createdAt,
        updatedAt: mahasiswa.updatedAt,
        ipk: mahasiswaDetail.ipk,
        totalSks: mahasiswaDetail.totalSks,
        namaProdi: programStudi.namaProdi,
        namaDosenPa: dosen.namaLengkap,
      })
      .from(mahasiswa)
      .leftJoin(mahasiswaDetail, eq(mahasiswa.id, mahasiswaDetail.mahasiswaId))
      .leftJoin(programStudi, eq(mahasiswa.prodiId, programStudi.id))
      .leftJoin(dosen, eq(mahasiswa.dosenPaId, dosen.id))
      .where(whereCondition)
      .limit(parseInt(limit))
      .offset(parseInt(offset));

    const total = await db
      .select({ count: sql<number>`count(*)` })
      .from(mahasiswa)
      .where(whereCondition);

    return Response.json({
      data: results,
      total: total[0].count,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Error in GET /api/mahasiswa:', error);
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
      userId,
      nim,
      namaLengkap,
      tempatLahir,
      tanggalLahir,
      jenisKelamin,
      alamat,
      noTelp,
      prodiId,
      angkatan,
      semester,
      status,
      dosenPaId
    } = await req.json();

    // Validasi input
    if (!nim || !namaLengkap) {
      return Response.json({ error: 'NIM and nama lengkap are required' }, { status: 400 });
    }

    // Cek apakah NIM sudah ada
    const existingNim = await db.query.mahasiswa.findFirst({
      where: eq(mahasiswa.nim, nim)
    });
    if (existingNim) {
      return Response.json({ error: 'NIM already exists' }, { status: 400 });
    }

    // Cek apakah user ID valid jika disediakan
    if (userId) {
      const existingUser = await db.query.users.findFirst({
        where: eq(users.id, userId)
      });
      if (!existingUser) {
        return Response.json({ error: 'User ID does not exist' }, { status: 400 });
      }
    }

    // Buat user jika belum ada
    let createdUserId = userId;
    if (!userId) {
      // Buat user baru dengan password default
      const defaultPassword = 'Password123!'; // Password default
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);
      
      const [newUser] = await db.insert(users).values({
        username: nim,
        email: `${nim}@student.university.ac.id`,
        password: hashedPassword,
        role: 'mahasiswa'
      }).returning({ id: users.id });
      
      createdUserId = newUser.id;
    }

    // Buat data mahasiswa
    const [newMahasiswa] = await db.insert(mahasiswa).values({
      userId: createdUserId,
      nim,
      namaLengkap,
      tempatLahir,
      tanggalLahir: tanggalLahir ? new Date(tanggalLahir) : null,
      jenisKelamin,
      alamat,
      noTelp,
      prodiId,
      angkatan,
      semester: semester || 1,
      status: status || 'aktif',
      dosenPaId
    }).returning();

    // Buat detail mahasiswa
    await db.insert(mahasiswaDetail).values({
      mahasiswaId: newMahasiswa.id,
      ipk: '0.00',
      totalSks: 0,
      sksLulus: 0
    });

    return Response.json({
      message: 'Mahasiswa created successfully',
      data: newMahasiswa
    });
  } catch (error) {
    console.error('Error in POST /api/mahasiswa:', error);
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

    // Cek apakah mahasiswa ada
    const existingMahasiswa = await db.query.mahasiswa.findFirst({
      where: eq(mahasiswa.id, id)
    });
    if (!existingMahasiswa) {
      return Response.json({ error: 'Mahasiswa not found' }, { status: 404 });
    }

    // Update data mahasiswa
    const [updatedMahasiswa] = await db
      .update(mahasiswa)
      .set(updateData)
      .where(eq(mahasiswa.id, id))
      .returning();

    return Response.json({
      message: 'Mahasiswa updated successfully',
      data: updatedMahasiswa
    });
  } catch (error) {
    console.error('Error in PUT /api/mahasiswa:', error);
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

    // Cek apakah mahasiswa ada
    const existingMahasiswa = await db.query.mahasiswa.findFirst({
      where: eq(mahasiswa.id, parseInt(id))
    });
    if (!existingMahasiswa) {
      return Response.json({ error: 'Mahasiswa not found' }, { status: 404 });
    }

    // Hapus detail mahasiswa terlebih dahulu
    await db.delete(mahasiswaDetail).where(eq(mahasiswaDetail.mahasiswaId, parseInt(id)));
    
    // Hapus mahasiswa
    await db.delete(mahasiswa).where(eq(mahasiswa.id, parseInt(id)));

    return Response.json({
      message: 'Mahasiswa deleted successfully'
    });
  } catch (error) {
    console.error('Error in DELETE /api/mahasiswa:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}