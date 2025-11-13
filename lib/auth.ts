import type { NextAuthOptions, User } from 'next-auth';
import { getServerSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

import { db } from '@/db';

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        identifier: { label: 'Email or Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) {
          return null;
        }

        const identifier = credentials.identifier.trim();
        const normalizedEmail = identifier.toLowerCase();

        const existingUser = await db.query.users.findFirst({
          where: (table, { eq, or }) =>
            or(
              eq(table.email, normalizedEmail),
              eq(table.username, identifier),
            ),
        });

        if (!existingUser || !existingUser.isActive) {
          return null;
        }

        const isValidPassword = await bcrypt.compare(
          credentials.password,
          existingUser.password,
        );

        if (!isValidPassword) {
          return null;
        }

        return {
          id: existingUser.id.toString(),
          email: existingUser.email,
          username: existingUser.username,
          role: existingUser.role,
          name: existingUser.username,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const typedUser = user as User & {
          id: string | number;
          role: string;
          username: string;
        };
        token.id = typedUser.id.toString();
        token.role = typedUser.role;
        token.username = typedUser.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.username = token.username as string;
      }
      return session;
    },
  },
};

export const getAuthSession = () => getServerSession(authOptions);