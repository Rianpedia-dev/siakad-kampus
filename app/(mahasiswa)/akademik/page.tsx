'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const akademikModules = [
  {
    title: "Kartu Rencana Studi (KRS)",
    description: "Pilih mata kuliah, susun jadwal, dan ajukan KRS untuk disetujui oleh dosen PA.",
    href: "/mahasiswa/akademik/krs",
  },
  {
    title: "Kartu Hasil Studi (KHS)",
    description: "Pantau nilai per semester, status kelulusan mata kuliah, dan indeks prestasi.",
    href: "/mahasiswa/akademik/khs",
  },
  {
    title: "Jadwal Kuliah",
    description: "Lihat jadwal mingguan, jadwal ujian (UTS/UAS), serta notifikasi perubahan kelas.",
    href: "/mahasiswa/akademik/jadwal",
  },
  {
    title: "Presensi",
    description: "Monitoring kehadiran per mata kuliah, status izin/sakit/alpa, dan rekapitulasi presensi.",
    href: "/mahasiswa/akademik/presensi",
  },
  {
    title: "Transkrip Nilai",
    description: "Generate transkrip nilai lengkap beserta fitur ekspor ke PDF untuk kebutuhan resmi.",
    href: "/mahasiswa/akademik/transkrip",
  },
];

export default function MahasiswaAkademikPage() {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Modul Akademik Mahasiswa</h1>
        <p className="text-sm text-muted-foreground">
          Fitur akademik terintegrasi untuk membantu mahasiswa mengelola kegiatan belajar.
        </p>
      </header>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {akademikModules.map((item) => (
          <Link href={item.href} key={item.title}>
            <Card className="border-border/60 hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground leading-relaxed">
                {item.description}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}

