import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const nilaiFeatures = [
  {
    title: "Komponen Penilaian",
    description: "Definisikan bobot UTS, UAS, tugas, quiz, dan komponen lain sesuai kurikulum.",
  },
  {
    title: "Input Nilai",
    description: "Masukkan nilai mahasiswa secara individual maupun impor massal dari template Excel.",
  },
  {
    title: "Nilai Akhir",
    description: "Otomatisasi perhitungan nilai akhir, konversi skor ke huruf mutu, dan status kelulusan.",
  },
  {
    title: "Analitik Nilai",
    description: "Visualisasikan distribusi nilai untuk evaluasi capaian pembelajaran.",
  },
];

export default function DosenNilaiPage() {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Manajemen Penilaian</h1>
        <p className="text-sm text-muted-foreground">
          Sistem penilaian terintegrasi untuk memastikan transparansi dan akurasi nilai mahasiswa.
        </p>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        {nilaiFeatures.map((feature) => (
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

