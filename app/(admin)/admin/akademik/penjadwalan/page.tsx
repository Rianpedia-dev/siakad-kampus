import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Calendar } from "lucide-react";

export default function PenjadwalanKuliahPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Penjadwalan Kuliah</h1>
          <p className="text-muted-foreground">
            Susun jadwal kuliah, alokasikan ruangan, dan assign dosen secara otomatis maupun manual.
          </p>
        </div>
        <div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Buat Jadwal Baru
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">Daftar Jadwal Kuliah</CardTitle>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cari jadwal..."
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
                  <th className="text-left py-3 px-4">Kode Kelas</th>
                  <th className="text-left py-3 px-4">Mata Kuliah</th>
                  <th className="text-left py-3 px-4">Dosen</th>
                  <th className="text-left py-3 px-4">Hari</th>
                  <th className="text-left py-3 px-4">Jam</th>
                  <th className="text-left py-3 px-4">Ruangan</th>
                  <th className="text-left py-3 px-4">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 px-4">IF101-A</td>
                  <td className="py-3 px-4">Algoritma dan Pemrograman</td>
                  <td className="py-3 px-4">Dr. Andi Prasetyo</td>
                  <td className="py-3 px-4">Senin</td>
                  <td className="py-3 px-4">08:00 - 10:00</td>
                  <td className="py-3 px-4">R.1.1</td>
                  <td className="py-3 px-4">
                    <Button variant="outline" size="sm">Edit</Button>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">SI205-B</td>
                  <td className="py-3 px-4">Sistem Basis Data</td>
                  <td className="py-3 px-4">Dra. Siti Rahayu</td>
                  <td className="py-3 px-4">Selasa</td>
                  <td className="py-3 px-4">10:00 - 12:00</td>
                  <td className="py-3 px-4">R.2.3</td>
                  <td className="py-3 px-4">
                    <Button variant="outline" size="sm">Edit</Button>
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