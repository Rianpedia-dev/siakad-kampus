import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const perkuliahanModules = [
  {
    title: "Materi Perkuliahan",
    description: "Akses materi kuliah terbaru dalam format PDF, PPT, dan video pembelajaran.",
  },
  {
    title: "Tugas",
    description: "Upload tugas, monitor status penilaian, dan terima feedback dari dosen.",
  },
  {
    title: "Evaluasi Dosen",
    description: "Isi kuesioner evaluasi pengajaran untuk meningkatkan kualitas perkuliahan.",
  },
  {
    title: "Forum & Diskusi",
    description: "Fasilitas komunikasi antara mahasiswa dan dosen terkait aktivitas kelas.",
  },
];

export default function MahasiswaPerkuliahanPage() {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Modul Perkuliahan</h1>
        <p className="text-sm text-muted-foreground">
          Mendukung aktivitas belajar harian melalui distribusi materi, penugasan, dan evaluasi.
        </p>
      </header>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {perkuliahanModules.map((item) => (
          <Card key={item.title} className="border-border/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{item.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground leading-relaxed">
              {item.description}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

