import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const administrasiFeatures = [
  {
    title: "Pengajuan Cuti Akademik",
    description: "Ajukan cuti kuliah secara daring, unggah dokumen pendukung, dan pantau status approval.",
  },
  {
    title: "Surat Keterangan",
    description: "Request surat aktif kuliah, beasiswa, magang, dan dokumen administratif lainnya.",
  },
  {
    title: "Bimbingan Akademik",
    description: "Jadwalkan konsultasi dengan dosen PA serta rekam catatan bimbingan.",
  },
  {
    title: "Notifikasi Administratif",
    description: "Terima pemberitahuan otomatis terkait proses administrasi yang sedang berjalan.",
  },
];

export default function MahasiswaAdministrasiPage() {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Layanan Administrasi</h1>
        <p className="text-sm text-muted-foreground">
          Layanan digital untuk kebutuhan administrasi dan pengajuan dokumen akademik mahasiswa.
        </p>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        {administrasiFeatures.map((item) => (
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

