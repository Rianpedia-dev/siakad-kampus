import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const profilSections = [
  {
    title: "Data Personal",
    description: "Perbarui nama, NIDN/NIP, kontak, foto profil, dan informasi kepegawaian.",
  },
  {
    title: "Riwayat Akademik",
    description: "Kelola informasi pendidikan terakhir, bidang keahlian, dan sertifikasi.",
  },
  {
    title: "Preferensi Mengajar",
    description: "Atur preferensi jadwal mengajar, mode perkuliahan, dan format evaluasi.",
  },
  {
    title: "Keamanan Akun",
    description: "Ganti password, aktifkan autentikasi dua faktor, dan pantau aktivitas login.",
  },
];

export default function DosenProfilPage() {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Profil Dosen</h1>
        <p className="text-sm text-muted-foreground">
          Kelola informasi pribadi, riwayat akademik, dan preferensi mengajar untuk memperkaya data kampus.
        </p>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        {profilSections.map((item) => (
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

