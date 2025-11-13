import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

import { db } from '@/db';
import { users } from '@/db/schema/users';

const registerSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(50)
    .regex(/^[a-zA-Z0-9_.-]+$/),
  email: z.string().email().max(100),
  password: z.string().min(8),
  role: z.enum(['mahasiswa', 'dosen', 'admin']).optional(),
});

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const { username, email, password, role } = registerSchema.parse(payload);

    const existingUser = await db.query.users.findFirst({
      where: (table, { or, eq }) =>
        or(eq(table.username, username), eq(table.email, email.toLowerCase())),
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Username atau email sudah terdaftar' },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.insert(users).values({
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role ?? 'mahasiswa',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message ?? 'Input tidak valid' },
        { status: 400 },
      );
    }

    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server' },
      { status: 500 },
    );
  }
}

