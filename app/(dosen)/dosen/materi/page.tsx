import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const materiFeatures = [
  {
    title: "Upload Materi",
    description: "Unggah materi perkuliahan dalam berbagai format (PDF, PPT, video) dengan pengaturan akses.",
  },
  {
    title: "Manajemen Tugas",
    description: "Buat penugasan, atur batas pengumpulan, dan tentukan aturan penilaian.",
  },
  {
    title: "Review Submission",
    description: "Pantau submission mahasiswa, berikan feedback, dan tetapkan nilai langsung dari sistem.",
  },
  {
    title: "Integrasi Notifikasi",
    description: "Kirim notifikasi otomatis ke mahasiswa untuk materi atau tugas baru.",
  },
];

export default function DosenMateriPage() {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Materi & Penugasan</h1>
        <p className="text-sm text-muted-foreground">
          Fitur e-learning yang mendukung distribusi materi kuliah dan manajemen tugas secara terpusat.
        </p>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        {materiFeatures.map((feature) => (
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

