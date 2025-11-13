import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const bimbinganFeatures = [
  {
    title: "Daftar Mahasiswa Bimbingan",
    description: "Lihat daftar mahasiswa bimbingan akademik lengkap dengan status studi dan catatan penting.",
  },
  {
    title: "Agenda Konsultasi",
    description: "Jadwalkan pertemuan, dokumentasikan topik konsultasi, dan rencanakan tindak lanjut.",
  },
  {
    title: "Monitoring Progres",
    description: "Pantau IPK, SKS tempuh, status skripsi/TA, dan rekomendasi akademik.",
  },
  {
    title: "Catatan & Notifikasi",
    description: "Simpan catatan bimbingan dan kirim notifikasi ke mahasiswa terkait arahan akademik.",
  },
];

export default function DosenBimbinganPage() {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Bimbingan Akademik</h1>
        <p className="text-sm text-muted-foreground">
          Fasilitas untuk mendampingi mahasiswa bimbingan secara terstruktur dan terdokumentasi.
        </p>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        {bimbinganFeatures.map((feature) => (
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

