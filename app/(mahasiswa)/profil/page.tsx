import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const profilSections = [
  {
    title: "Data Pribadi",
    description: "Perbarui informasi dasar seperti nama lengkap, alamat, kontak, dan foto profil.",
  },
  {
    title: "Informasi Akademik",
    description: "Lihat data program studi, dosen pembimbing akademik, angkatan, dan status perkuliahan.",
  },
  {
    title: "Keamanan Akun",
    description: "Ubah password, atur autentikasi ganda, dan pantau riwayat login.",
  },
  {
    title: "Preferensi Notifikasi",
    description: "Atur preferensi pengiriman email dan notifikasi sistem yang relevan.",
  },
];

export default function MahasiswaProfilPage() {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Profil Mahasiswa</h1>
        <p className="text-sm text-muted-foreground">
          Satu tempat untuk mengelola data pribadi, informasi akademik, dan preferensi akun mahasiswa.
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

