import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const perkuliahanFeatures = [
  {
    title: "Jadwal Mengajar",
    description: "Lihat jadwal mengajar per pekan lengkap dengan ruangan dan mata kuliah yang diampu.",
  },
  {
    title: "Berita Acara",
    description: "Catat topik pertemuan, materi yang dibahas, dan perkembangan kelas secara terstruktur.",
  },
  {
    title: "Presensi Mahasiswa",
    description: "Input presensi harian, tandai status izin/sakit, dan ekspor rekap pertemuan.",
  },
  {
    title: "Notifikasi",
    description: "Terima pengingat otomatis untuk perkuliahan, evaluasi, dan aktivitas kelas.",
  },
];

export default function DosenPerkuliahanPage() {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Manajemen Perkuliahan</h1>
        <p className="text-sm text-muted-foreground">
          Optimalkan aktivitas mengajar dengan pencatatan terintegrasi antara jadwal, presensi, dan berita acara.
        </p>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        {perkuliahanFeatures.map((feature) => (
          <Card key={feature.title} className="border-border/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground leading-relaxed">
              {feature.description}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

