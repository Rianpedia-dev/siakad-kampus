import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const akademikModules = [
  {
    title: "Penjadwalan Kuliah",
    description: "Susun jadwal kuliah, alokasikan ruangan, dan assign dosen secara otomatis maupun manual.",
    href: "/admin/akademik/penjadwalan",
  },
  {
    title: "Periode KRS",
    description: "Atur waktu pembukaan KRS, monitoring pengisian, dan approval oleh dosen PA.",
    href: "/admin/akademik/krs",
  },
  {
    title: "Manajemen Kelas",
    description: "Kelola kelas paralel, kapasitas, dan distribusi mahasiswa ke kelas.",
    href: "/admin/akademik/kelas",
  },
  {
    title: "Monitoring Akademik",
    description: "Pantau progres nilai, presensi, dan status akademik mahasiswa per semester.",
    href: "/admin/akademik/monitoring",
  },
];

export default function AdminAkademikPage() {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Modul Akademik Admin</h1>
        <p className="text-sm text-muted-foreground">
          Orkestrasi aktivitas akademik kampus dengan dukungan otomasi dan monitoring real-time.
        </p>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        {akademikModules.map((module) => (
          <Link href={module.href} key={module.title}>
            <Card className="border-border/60 hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{module.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground leading-relaxed">
                {module.description}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}

