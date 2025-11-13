import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const laporanModules = [
  {
    title: "Laporan Akademik",
    description: "Rekap nilai mahasiswa, distribusi nilai, dan performa akademik per program studi.",
    href: "/admin/laporan/akademik",
  },
  {
    title: "Laporan Presensi",
    description: "Pantau kehadiran mahasiswa dan dosen dengan filter per kelas atau periode.",
    href: "/admin/laporan/presensi",
  },
  {
    title: "Laporan Keuangan",
    description: "Analisis pemasukan, tunggakan, dan status pembayaran untuk pengambilan keputusan.",
    href: "/admin/laporan/keuangan",
  },
  {
    title: "Ekspor Data",
    description: "Ekspor laporan ke format PDF atau Excel untuk kebutuhan rapat dan dokumentasi.",
    href: "/admin/laporan/export",
  },
];

export default function AdminLaporanPage() {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard Laporan</h1>
        <p className="text-sm text-muted-foreground">
          Satu pintu untuk menghasilkan laporan akademik dan operasional yang komprehensif.
        </p>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        {laporanModules.map((module) => (
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

