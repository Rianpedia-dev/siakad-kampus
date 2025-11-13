import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Users } from "lucide-react";

export default function ManajemenKelasPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Manajemen Kelas</h1>
          <p className="text-muted-foreground">
            Kelola kelas paralel, kapasitas, dan distribusi mahasiswa ke kelas.
          </p>
        </div>
        <div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Buat Kelas Baru
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">Daftar Kelas</CardTitle>
          <div className="flex gap-2">
            <select className="border rounded-md px-3 py-2">
              <option value="">Semua Prodi</option>
              <option value="if">Teknik Informatika</option>
              <option value="si">Sistem Informasi</option>
            </select>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cari kelas..."
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
                  <th className="text-left py-3 px-4">Kapasitas</th>
                  <th className="text-left py-3 px-4">Terisi</th>
                  <th className="text-left py-3 px-4">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 px-4">IF101-A</td>
                  <td className="py-3 px-4">Algoritma dan Pemrograman</td>
                  <td className="py-3 px-4">Dr. Andi Prasetyo</td>
                  <td className="py-3 px-4">30</td>
                  <td className="py-3 px-4">28</td>
                  <td className="py-3 px-4">
                    <Button variant="outline" size="sm">Edit</Button>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">IF101-B</td>
                  <td className="py-3 px-4">Algoritma dan Pemrograman</td>
                  <td className="py-3 px-4">Dr. Budi Santoso</td>
                  <td className="py-3 px-4">30</td>
                  <td className="py-3 px-4">25</td>
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