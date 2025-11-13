import { DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      role: string;
      username: string;
      name?: string | null;
      image?: string | null;
    };
  }

  interface User {
    id: number;
    email: string;
    username: string;
    role: string;
    password: string;
    isActive: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id?: string;
    role?: string;
    username?: string;
  }
}

