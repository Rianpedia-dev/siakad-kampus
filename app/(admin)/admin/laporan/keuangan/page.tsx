import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, BarChart3, Download, TrendingUp, CreditCard } from "lucide-react";

export default function LaporanKeuanganPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Laporan Keuangan</h1>
          <p className="text-muted-foreground">
            Analisis pemasukan, tunggakan, dan status pembayaran untuk pengambilan keputusan.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Ekspor PDF
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Ekspor Excel
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Total Pemasukan</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp 2.4 M</div>
            <p className="text-xs text-muted-foreground">+15% dari bulan lalu</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Jumlah Tunggakan</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp 800 Jt</div>
            <p className="text-xs text-muted-foreground">↓ 8% dari bulan lalu</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Tingkat Pembayaran</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">84%</div>
            <p className="text-xs text-muted-foreground">↑ 5% dari bulan lalu</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">Daftar Mahasiswa dengan Tunggakan</CardTitle>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cari mahasiswa..."
                className="pl-8 pr-4 py-2 border rounded-md w-full md:w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="text-left py-3 px-4">NIM</th>
                  <th className="text-left py-3 px-4">Nama</th>
                  <th className="text-left py-3 px-4">Prodi</th>
                  <th className="text-left py-3 px-4">Jumlah Tunggakan</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 px-4">2021005</td>
                  <td className="py-3 px-4">Rina Kumala Sari</td>
                  <td className="py-3 px-4">Teknik Informatika</td>
                  <td className="py-3 px-4">Rp 4,500,000</td>
                  <td className="py-3 px-4">
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
                      Belum Lunas
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <Button variant="outline" size="sm">Kirim Notifikasi</Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}