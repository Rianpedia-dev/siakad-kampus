import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Download } from "lucide-react";

export default function DataProdiPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Data Program Studi</h1>
          <p className="text-muted-foreground">
            Manajemen data program studi, kaprodi, dan informasi akreditasi.
          </p>
        </div>
        <div className="flex gap-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Prodi
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">Daftar Program Studi</CardTitle>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cari program studi..."
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
                  <th className="text-left py-3 px-4">Kode Prodi</th>
                  <th className="text-left py-3 px-4">Nama Prodi</th>
                  <th className="text-left py-3 px-4">Jenjang</th>
                  <th className="text-left py-3 px-4">Fakultas</th>
                  <th className="text-left py-3 px-4">Akreditasi</th>
                  <th className="text-left py-3 px-4">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 px-4">IF</td>
                  <td className="py-3 px-4">Teknik Informatika</td>
                  <td className="py-3 px-4">S1</td>
                  <td className="py-3 px-4">Fakultas Ilmu Komputer</td>
                  <td className="py-3 px-4">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                      A
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <Button variant="outline" size="sm">Edit</Button>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">SI</td>
                  <td className="py-3 px-4">Sistem Informasi</td>
                  <td className="py-3 px-4">S1</td>
                  <td className="py-3 px-4">Fakultas Ilmu Komputer</td>
                  <td className="py-3 px-4">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                      A
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