import { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getAuthSession } from "@/lib/auth";
import { AppProviders } from "@/components/app-providers";

const mahasiswaNav = [
  {
    label: "Dashboard",
    href: "/mahasiswa/dashboard",
    description: "Ringkasan akademik dan aktivitas terbaru.",
  },
  {
    label: "Akademik",
    href: "/mahasiswa/akademik",
    description: "KRS, KHS, jadwal kuliah, dan presensi.",
  },
  {
    label: "Perkuliahan",
    href: "/mahasiswa/perkuliahan",
    description: "Akses materi, tugas, dan evaluasi dosen.",
  },
  {
    label: "Keuangan",
    href: "/mahasiswa/keuangan",
    description: "Status pembayaran dan riwayat transaksi.",
  },
  {
    label: "Administrasi",
    href: "/mahasiswa/administrasi",
    description: "Pengajuan cuti, surat keterangan, dan layanan akademik.",
  },
  {
    label: "Profil",
    href: "/mahasiswa/profil",
    description: "Kelola data pribadi dan preferensi akun.",
  },
];

export default async function MahasiswaLayout({ children }: { children: ReactNode }) {
  const session = await getAuthSession();

  if (!session || session.user.role !== "mahasiswa") {
    redirect("/unauthorized");
  }

  return (
    <AppProviders>
      <div className="flex min-h-screen bg-background">
        <aside className="hidden w-72 flex-shrink-0 border-r border-border bg-sidebar lg:flex lg:flex-col">
          <div className="px-6 py-8 border-b border-border/30">
            <h2 className="text-xl font-semibold">Portal Mahasiswa</h2>
            <p className="text-sm text-muted-foreground">Navigasi fitur akademik SIAKAD.</p>
          </div>
          <nav className="flex-1 overflow-y-auto px-4 py-6">
            <ul className="space-y-4">
              {mahasiswaNav.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="block rounded-lg border border-transparent px-3 py-2 transition hover:border-primary/20 hover:bg-primary/5"
                  >
                    <p className="font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="px-6 py-4 text-xs text-muted-foreground border-t border-border/30">
            Masuk sebagai <span className="font-medium">{session.user.username}</span>
          </div>
        </aside>
        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-10">{children}</main>
      </div>
    </AppProviders>
  );
}

