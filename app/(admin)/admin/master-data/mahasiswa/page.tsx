import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Download, Upload } from "lucide-react";

export default function DataMahasiswaPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Data Mahasiswa</h1>
          <p className="text-muted-foreground">
            Kelola data mahasiswa, import dari Excel, dan integrasi dengan akun pengguna.
          </p>
        </div>
        <div className="flex gap-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Mahasiswa
          </Button>
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Import Excel
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">Daftar Mahasiswa</CardTitle>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cari mahasiswa..."
                className="pl-8 pr-4 py-2 border rounded-md w-full md:w-64"
              />
            </div>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="text-left py-3 px-4">NIM</th>
                  <th className="text-left py-3 px-4">Nama</th>
                  <th className="text-left py-3 px-4">Program Studi</th>
                  <th className="text-left py-3 px-4">Angkatan</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 px-4">2021001</td>
                  <td className="py-3 px-4">Budi Santoso</td>
                  <td className="py-3 px-4">Teknik Informatika</td>
                  <td className="py-3 px-4">2021</td>
                  <td className="py-3 px-4">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                      Aktif
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <Button variant="outline" size="sm">Edit</Button>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">2021002</td>
                  <td className="py-3 px-4">Ani Lestari</td>
                  <td className="py-3 px-4">Sistem Informasi</td>
                  <td className="py-3 px-4">2021</td>
                  <td className="py-3 px-4">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                      Aktif
                    </span>
                  </td>
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