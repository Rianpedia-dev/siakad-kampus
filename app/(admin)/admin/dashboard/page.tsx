import { Suspense } from "react";

import {
  Building2,
  CalendarClock,
  ClipboardCheck,
  FileBarChart,
  Files,
  UsersRound,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAuthSession } from "@/lib/auth";

async function AdminHeader() {
  const session = await getAuthSession();
  return (
    <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-sky-500 via-indigo-500 to-blue-600 p-8 text-white shadow-xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-sky-100">
            SIAKAD Admin
          </p>
          <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">
            Selamat datang, {session?.user.username ?? "Admin"} 👋
          </h1>
          <p className="mt-3 max-w-2xl text-sm sm:text-base text-sky-50/90">
            Kelola data akademik, operasional, dan administrasi kampus secara terpusat. Berikut ringkasan fitur yang bisa Anda gunakan hari ini.
          </p>
        </div>
        <div className="rounded-2xl bg-white/15 px-4 py-3 text-sm font-medium backdrop-blur-md">
          Status Sistem: <span className="ml-1 inline-flex items-center text-emerald-100">Aktif</span>
        </div>
      </div>
    </div>
  );
}

const featureHighlights = [
  {
    title: "Master Data",
    description: "Kelola data mahasiswa, dosen, program studi, dan ruangan dari satu tempat.",
    icon: UsersRound,
  },
  {
    title: "Manajemen Akademik",
    description: "Atur periode KRS, jadwal kuliah, dan pemantauan approval secara real-time.",
    icon: CalendarClock,
  },
  {
    title: "Administrasi & Keuangan",
    description: "Verifikasi pembayaran, proses pengajuan surat, dan pantau status cuti akademik.",
    icon: ClipboardCheck,
  },
  {
    title: "Pelaporan",
    description: "Bangun laporan nilai, kehadiran, dan keuangan dengan dukungan ekspor PDF/Excel.",
    icon: FileBarChart,
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8 pb-16">
      <Suspense fallback={<div className="h-48 w-full animate-pulse rounded-3xl bg-slate-200" />}>
        <AdminHeader />
      </Suspense>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {featureHighlights.map(({ title, description, icon: Icon }) => (
          <Card
            key={title}
            className="border-border bg-card text-card-foreground shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg"
          >
            <CardHeader className="flex flex-row items-start gap-3 pb-3">
              <div className="rounded-xl bg-primary/10 p-2 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg">{title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed text-muted-foreground">{description}</CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border bg-card text-card-foreground shadow-sm">
          <CardHeader className="flex items-center justify-between pb-2">
            <div>
              <CardTitle>Ringkasan Statistik</CardTitle>
              <p className="text-sm text-muted-foreground">
                Integrasikan modul analytics untuk memantau performa akademik kampus.
              </p>
            </div>
            <div className="rounded-full bg-indigo-100 p-2 text-indigo-600">
              <Building2 className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-2 text-sm text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>Mahasiswa aktif</span>
              <span className="font-semibold">-</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Dosen aktif</span>
              <span className="font-semibold">-</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Approval KRS tertunda</span>
              <span className="font-semibold text-amber-600">-</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Pengajuan surat baru</span>
              <span className="font-semibold">-</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card text-card-foreground shadow-sm">
          <CardHeader className="flex items-center justify-between pb-2">
            <div>
              <CardTitle>Tugas Administratif Aktif</CardTitle>
              <p className="text-sm text-muted-foreground">
                Tampilkan daftar tugas prioritas agar tim akademik dapat menindaklanjuti lebih cepat.
              </p>
            </div>
            <div className="rounded-full bg-sky-100 p-2 text-sky-600">
              <Files className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-2 text-sm text-muted-foreground">
            <p>Hubungkan modul tugas untuk menampilkan daftar approval, verifikasi, atau pengajuan terbaru.</p>
            <div className="rounded-2xl border border-dashed border-border bg-muted px-4 py-3 text-xs text-muted-foreground">
              Tip: gunakan notifikasi dan label prioritas agar tim dapat memantau permintaan penting tanpa terlewat.
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

