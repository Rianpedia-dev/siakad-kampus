import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const keuanganModules = [
  {
    title: "Verifikasi Pembayaran",
    description: "Validasi pembayaran mahasiswa, unggah bukti, dan set status menjadi verified.",
  },
  {
    title: "Jenis Pembayaran",
    description: "Atur jenis biaya kuliah, nominal, periode penagihan, dan integrasi dengan sistem pembayaran.",
  },
  {
    title: "Rekapitulasi Keuangan",
    description: "Generate laporan pemasukan, tunggakan, dan status pembayaran per angkatan/prodi.",
  },
  {
    title: "Notifikasi Keuangan",
    description: "Kirim pengingat otomatis kepada mahasiswa terkait pembayaran yang belum lunas.",
  },
];

export default function AdminKeuanganPage() {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Modul Keuangan Admin</h1>
        <p className="text-sm text-muted-foreground">
          Pengelolaan keuangan kampus yang terintegrasi dengan data akademik dan notifikasi otomatis.
        </p>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        {keuanganModules.map((module) => (
          <Card key={module.title} className="border-border/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{module.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground leading-relaxed">
              {module.description}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

