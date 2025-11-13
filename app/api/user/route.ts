import { NextRequest } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { db } from '@/db';
import { users, mahasiswa, dosen } from '@/db/schema';
import { eq, and, like, sql, or } from 'drizzle-orm';
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
    const role = searchParams.get('role');
    const isActive = searchParams.get('isActive');

    let whereCondition: any = {};
    if (search) {
      whereCondition = and(
        whereCondition,
        like(users.username, `%${search}%`)
      );
    }
    if (role) {
      whereCondition = and(
        whereCondition,
        eq(users.role, role)
      );
    }
    if (isActive !== null) {
      whereCondition = and(
        whereCondition,
        eq(users.isActive, isActive === 'true')
      );
    }

    const results = await db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        role: users.role,
        isActive: users.isActive,
        lastLogin: users.lastLogin,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(whereCondition)
      .limit(parseInt(limit))
      .offset(parseInt(offset));

    const total = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(whereCondition);

    return Response.json({
      data: results,
      total: total[0].count,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Error in GET /api/user:', error);
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
      username,
      email,
      password,
      role
    } = await req.json();

    // Validasi input
    if (!username || !email || !password || !role) {
      return Response.json({ error: 'Username, email, password, and role are required' }, { status: 400 });
    }

    // Cek apakah username atau email sudah ada
    const existingUser = await db.query.users.findFirst({
      where: and(
        or(
          eq(users.username, username),
          eq(users.email, email)
        )
      )
    });
    if (existingUser) {
      return Response.json({ error: 'Username or email already exists' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat user baru
    const [newUser] = await db.insert(users).values({
      username,
      email,
      password: hashedPassword,
      role
    }).returning();

    return Response.json({
      message: 'User created successfully',
      data: newUser
    });
  } catch (error) {
    console.error('Error in POST /api/user:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session || session.user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, password, isActive, ...updateData } = await req.json();

    if (!id) {
      return Response.json({ error: 'ID is required' }, { status: 400 });
    }

    // Cek apakah user ada
    const existingUser = await db.query.users.findFirst({
      where: eq(users.id, id)
    });
    if (!existingUser) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    // Jika password diberikan, hash dulu
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    // Update data user
    const [updatedUser] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning();

    return Response.json({
      message: 'User updated successfully',
      data: updatedUser
    });
  } catch (error) {
    console.error('Error in PUT /api/user:', error);
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

    // Cek apakah user ada
    const existingUser = await db.query.users.findFirst({
      where: eq(users.id, parseInt(id))
    });
    if (!existingUser) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    // Jangan hapus user admin yang sedang login
    if (parseInt(id) === session.user.id) {
      return Response.json({ error: 'Cannot delete current user' }, { status: 400 });
    }

    // Hapus user
    await db.delete(users).where(eq(users.id, parseInt(id)));

    return Response.json({
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error in DELETE /api/user:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// API khusus untuk reset password
export async function PATCH(req: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session || session.user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId, newPassword } = await req.json();

    if (!userId || !newPassword) {
      return Response.json({ error: 'User ID and new password are required' }, { status: 400 });
    }

    // Cek apakah user ada
    const existingUser = await db.query.users.findFirst({
      where: eq(users.id, userId)
    });
    if (!existingUser) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    // Hash password baru
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    const [updatedUser] = await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, userId))
      .returning();

    return Response.json({
      message: 'Password reset successfully',
      data: updatedUser
    });
  } catch (error) {
    console.error('Error in PATCH /api/user:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}