import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Users, Activity } from "lucide-react";

export default function LaporanPenggunaPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Laporan Pengguna</h1>
          <p className="text-muted-foreground">
            Analisis jumlah dan aktivitas pengguna sistem.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Search className="mr-2 h-4 w-4" />
            Filter Laporan
          </Button>
          <Button>
            <Activity className="mr-2 h-4 w-4" />
            Generate Laporan
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Total Pengguna</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,480</div>
            <p className="text-xs text-muted-foreground">+5% dari bulan lalu</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Aktif Bulan Ini</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,245</div>
            <p className="text-xs text-muted-foreground">84% dari total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Pengguna Baru</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">+15 dari bulan lalu</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">Statistik Pengguna Berdasarkan Role</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Mahasiswa</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "70%" }}></div>
                </div>
                <span className="text-sm">1,080 (73%)</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span>Dosen</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2.5">
                  <div className="bg-green-600 h-2.5 rounded-full" style={{ width: "15%" }}></div>
                </div>
                <span className="text-sm">180 (12%)</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span>Admin</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2.5">
                  <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: "3%" }}></div>
                </div>
                <span className="text-sm">42 (3%)</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span>Lainnya</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2.5">
                  <div className="bg-yellow-600 h-2.5 rounded-full" style={{ width: "12%" }}></div>
                </div>
                <span className="text-sm">178 (12%)</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">Aktivitas Pengguna Terkini</CardTitle>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari aktivitas..."
              className="pl-8 pr-4 py-2 border rounded-md w-full md:w-64"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="text-left py-3 px-4">Waktu</th>
                  <th className="text-left py-3 px-4">Pengguna</th>
                  <th className="text-left py-3 px-4">Role</th>
                  <th className="text-left py-3 px-4">Aktivitas</th>
                  <th className="text-left py-3 px-4">IP</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 px-4">2024-11-13 10:30</td>
                  <td className="py-3 px-4">budi_2021</td>
                  <td className="py-3 px-4">mahasiswa</td>
                  <td className="py-3 px-4">Mengakses KRS</td>
                  <td className="py-3 px-4">192.168.1.100</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">2024-11-13 09:45</td>
                  <td className="py-3 px-4">siti_dosen</td>
                  <td className="py-3 px-4">dosen</td>
                  <td className="py-3 px-4">Input nilai UTS</td>
                  <td className="py-3 px-4">192.168.1.101</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}