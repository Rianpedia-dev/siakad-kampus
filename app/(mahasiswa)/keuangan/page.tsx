import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const keuanganFeatures = [
  {
    title: "Status Pembayaran",
    description: "Pantau tagihan SPP/UKT, status pembayaran, dan tanggal jatuh tempo.",
  },
  {
    title: "Riwayat Transaksi",
    description: "Lihat riwayat pembayaran lengkap beserta bukti transaksi yang diunggah.",
  },
  {
    title: "Cetak Kwitansi",
    description: "Unduh kwitansi resmi dalam format PDF untuk kebutuhan administrasi.",
  },
  {
    title: "Notifikasi",
    description: "Terima pengingat otomatis terkait pembayaran yang belum dilunasi.",
  },
];

export default function MahasiswaKeuanganPage() {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Modul Keuangan</h1>
        <p className="text-sm text-muted-foreground">
          Transparansi pembayaran kuliah dengan integrasi notifikasi dan bukti digital.
        </p>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        {keuanganFeatures.map((item) => (
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

