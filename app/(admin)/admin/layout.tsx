import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { getAuthSession } from "@/lib/auth";
import { AppProviders } from "@/components/app-providers";
import { AdminNavItem } from "@/components/admin/admin-nav-item";

const adminNav = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    description: "Ringkasan operasional kampus dan aktivitas terbaru.",
  },
  {
    label: "Master Data",
    href: "/admin/master-data",
    description: "Kelola data mahasiswa, dosen, mata kuliah, prodi, dan ruangan.",
  },
  {
    label: "Akademik",
    href: "/admin/akademik",
    description: "Penjadwalan kuliah, monitoring KRS, dan manajemen kelas.",
  },
  {
    label: "Keuangan",
    href: "/admin/keuangan",
    description: "Verifikasi pembayaran dan generate laporan keuangan.",
  },
  {
    label: "Laporan",
    href: "/admin/laporan",
    description: "Laporan akademik, presensi, keuangan, dan analitik lainnya.",
  },
  {
    label: "Pengumuman & User",
    href: "/admin/pengumuman",
    description: "Publikasi pengumuman dan manajemen akun pengguna.",
  },
];

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getAuthSession();

  if (!session || session.user.role !== "admin") {
    redirect("/unauthorized");
  }

  return (
    <AppProviders>
      <div className="flex min-h-screen bg-background">
        <aside className="hidden w-72 flex-shrink-0 border-r border-border bg-sidebar lg:flex lg:flex-col">
          <div className="px-6 pb-6 pt-10 border-b border-border">
            <span className="text-xs font-semibold uppercase tracking-wide text-primary">
              SIAKAD Admin
            </span>
            <h2 className="mt-2 text-2xl font-semibold text-sidebar-foreground">Control Center</h2>
            <p className="mt-2 text-sm leading-6 text-sidebar-foreground/70">
              Kelola operasional akademik dan administrasi kampus.
            </p>
          </div>
          <nav className="flex-1 overflow-y-auto px-5 py-6">
            <div className="space-y-3">
              {adminNav.map((item) => (
                <AdminNavItem key={item.label} {...item} />
              ))}
            </div>
          </nav>
          <div className="px-6 py-5 border-t border-border">
            <p className="text-xs uppercase tracking-wider text-sidebar-foreground/60">Sedang masuk</p>
            <p className="text-sm font-semibold text-sidebar-foreground">{session.user.username}</p>
          </div>
        </aside>
        <main className="flex-1 px-4 py-8 sm:px-8 lg:px-12 xl:px-16">{children}</main>
      </div>
    </AppProviders>
  );
}

