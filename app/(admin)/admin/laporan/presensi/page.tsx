import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, BarChart3, Download, Calendar, Users } from "lucide-react";

export default function LaporanPresensiPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Laporan Presensi</h1>
          <p className="text-muted-foreground">
            Pantau kehadiran mahasiswa dan dosen dengan filter per kelas atau periode.
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
            <CardTitle className="text-base font-medium">Rata-rata Kehadiran</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">84%</div>
            <p className="text-xs text-muted-foreground">↑ 5% dari bulan lalu</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Jumlah Mahasiswa</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,248</div>
            <p className="text-xs text-muted-foreground">42 aktif tidak hadir</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Jumlah Dosen</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">86</div>
            <p className="text-xs text-muted-foreground">3 izin, 1 tidak hadir</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">Daftar Mahasiswa dengan Presensi Rendah</CardTitle>
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
                  <th className="text-left py-3 px-4">Presensi (%)</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 px-4">2021006</td>
                  <td className="py-3 px-4">Agus Prasetyo</td>
                  <td className="py-3 px-4">Sistem Informasi</td>
                  <td className="py-3 px-4">60%</td>
                  <td className="py-3 px-4">
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
                      Rendah
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <Button variant="outline" size="sm">Peringatkan</Button>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">2021007</td>
                  <td className="py-3 px-4">Dewi Anggraini</td>
                  <td className="py-3 px-4">Teknik Informatika</td>
                  <td className="py-3 px-4">55%</td>
                  <td className="py-3 px-4">
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
                      Rendah
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <Button variant="outline" size="sm">Peringatkan</Button>
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