import { NextRequest } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { db } from '@/db';
import { dosen, users, mahasiswa } from '@/db/schema';
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

    let whereCondition: any = {};
    if (search) {
      whereCondition = and(
        whereCondition,
        like(dosen.namaLengkap, `%${search}%`)
      );
    }

    const results = await db
      .select({
        id: dosen.id,
        userId: dosen.userId,
        nip: dosen.nip,
        nidn: dosen.nidn,
        namaLengkap: dosen.namaLengkap,
        tempatLahir: dosen.tempatLahir,
        tanggalLahir: dosen.tanggalLahir,
        jenisKelamin: dosen.jenisKelamin,
        alamat: dosen.alamat,
        noTelp: dosen.noTelp,
        email: dosen.email,
        pendidikanTerakhir: dosen.pendidikanTerakhir,
        bidangKeahlian: dosen.bidangKeahlian,
        status: dosen.status,
        foto: dosen.foto,
        createdAt: dosen.createdAt,
        updatedAt: dosen.updatedAt,
      })
      .from(dosen)
      .where(whereCondition)
      .limit(parseInt(limit))
      .offset(parseInt(offset));

    const total = await db
      .select({ count: sql<number>`count(*)` })
      .from(dosen)
      .where(whereCondition);

    return Response.json({
      data: results,
      total: total[0].count,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Error in GET /api/dosen:', error);
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
      nip,
      nidn,
      namaLengkap,
      tempatLahir,
      tanggalLahir,
      jenisKelamin,
      alamat,
      noTelp,
      email,
      pendidikanTerakhir,
      bidangKeahlian,
      status
    } = await req.json();

    // Validasi input
    if (!nip || !namaLengkap) {
      return Response.json({ error: 'NIP and nama lengkap are required' }, { status: 400 });
    }

    // Cek apakah NIP sudah ada
    const existingNip = await db.query.dosen.findFirst({
      where: eq(dosen.nip, nip)
    });
    if (existingNip) {
      return Response.json({ error: 'NIP already exists' }, { status: 400 });
    }

    // Cek apakah NIDN sudah ada
    if (nidn) {
      const existingNidn = await db.query.dosen.findFirst({
        where: eq(dosen.nidn, nidn)
      });
      if (existingNidn) {
        return Response.json({ error: 'NIDN already exists' }, { status: 400 });
      }
    }

    // Buat user baru dengan password default
    const defaultPassword = 'Password123!'; // Password default
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);
    
    const [newUser] = await db.insert(users).values({
      username: nip,
      email: email || `${nip}@lecturer.university.ac.id`,
      password: hashedPassword,
      role: 'dosen'
    }).returning({ id: users.id });
    
    // Buat data dosen
    const [newDosen] = await db.insert(dosen).values({
      userId: newUser.id,
      nip,
      nidn,
      namaLengkap,
      tempatLahir,
      tanggalLahir: tanggalLahir ? new Date(tanggalLahir) : null,
      jenisKelamin,
      alamat,
      noTelp,
      email: email || `${nip}@lecturer.university.ac.id`,
      pendidikanTerakhir,
      bidangKeahlian,
      status: status || 'aktif',
      foto: null
    }).returning();

    return Response.json({
      message: 'Dosen created successfully',
      data: newDosen
    });
  } catch (error) {
    console.error('Error in POST /api/dosen:', error);
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

    // Cek apakah dosen ada
    const existingDosen = await db.query.dosen.findFirst({
      where: eq(dosen.id, id)
    });
    if (!existingDosen) {
      return Response.json({ error: 'Dosen not found' }, { status: 404 });
    }

    // Update data dosen
    const [updatedDosen] = await db
      .update(dosen)
      .set(updateData)
      .where(eq(dosen.id, id))
      .returning();

    return Response.json({
      message: 'Dosen updated successfully',
      data: updatedDosen
    });
  } catch (error) {
    console.error('Error in PUT /api/dosen:', error);
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

    // Cek apakah dosen ada
    const existingDosen = await db.query.dosen.findFirst({
      where: eq(dosen.id, parseInt(id))
    });
    if (!existingDosen) {
      return Response.json({ error: 'Dosen not found' }, { status: 404 });
    }

    // Cek apakah dosen masih menjadi dosen PA
    const mahasiswaWithDosenPa = await db.query.mahasiswa.findFirst({
      where: eq(mahasiswa.dosenPaId, parseInt(id))
    });
    if (mahasiswaWithDosenPa) {
      return Response.json({ error: 'Dosen is still assigned as PA to some students' }, { status: 400 });
    }

    // Hapus user terkait
    if (existingDosen.userId) {
      await db.delete(users).where(eq(users.id, existingDosen.userId));
    }
    
    // Hapus dosen
    await db.delete(dosen).where(eq(dosen.id, parseInt(id)));

    return Response.json({
      message: 'Dosen deleted successfully'
    });
  } catch (error) {
    console.error('Error in DELETE /api/dosen:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}