import { redirect } from 'next/navigation';
import { getAuthSession } from '@/lib/auth';

export default async function UserDashboard() {
  const session = await getAuthSession();

  if (!session || !session.user?.role) {
    redirect('/login');
  }

  // Redirect berdasarkan role pengguna
  switch (session.user.role) {
    case 'mahasiswa':
      redirect('/mahasiswa/dashboard');
    case 'dosen':
      redirect('/dosen/dashboard');
    case 'admin':
      redirect('/admin/dashboard');
    default:
      redirect('/unauthorized');
  }
}