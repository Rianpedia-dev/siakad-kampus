import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, BarChart3, Download } from "lucide-react";

export default function LaporanAkademikPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Laporan Akademik</h1>
          <p className="text-muted-foreground">
            Rekap nilai mahasiswa, distribusi nilai, dan performa akademik per program studi.
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
            <CardTitle className="text-base font-medium">Jumlah Mahasiswa Aktif</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,248</div>
            <p className="text-xs text-muted-foreground">+12% dari semester lalu</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Rata-rata IPK</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.24</div>
            <p className="text-xs text-muted-foreground">↑ 0.12 dari semester lalu</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Lulus Tepat Waktu</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">↑ 5% dari tahun lalu</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">Distribusi Nilai</CardTitle>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cari laporan..."
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
                  <th className="text-left py-3 px-4">Program Studi</th>
                  <th className="text-left py-3 px-4">Jumlah Mahasiswa</th>
                  <th className="text-left py-3 px-4">IPK Rata-rata</th>
                  <th className="text-left py-3 px-4">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 px-4">Teknik Informatika</td>
                  <td className="py-3 px-4">420</td>
                  <td className="py-3 px-4">3.32</td>
                  <td className="py-3 px-4">
                    <Button variant="outline" size="sm">Lihat Detail</Button>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">Sistem Informasi</td>
                  <td className="py-3 px-4">380</td>
                  <td className="py-3 px-4">3.18</td>
                  <td className="py-3 px-4">
                    <Button variant="outline" size="sm">Lihat Detail</Button>
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