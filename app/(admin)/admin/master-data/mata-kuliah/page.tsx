import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Download } from "lucide-react";

export default function DataMataKuliahPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Data Mata Kuliah</h1>
          <p className="text-muted-foreground">
            Atur mata kuliah, SKS, kurikulum per prodi, serta mapping ke semester.
          </p>
        </div>
        <div className="flex gap-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Mata Kuliah
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">Daftar Mata Kuliah</CardTitle>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cari mata kuliah..."
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
                  <th className="text-left py-3 px-4">Kode MK</th>
                  <th className="text-left py-3 px-4">Nama Mata Kuliah</th>
                  <th className="text-left py-3 px-4">SKS</th>
                  <th className="text-left py-3 px-4">Semester</th>
                  <th className="text-left py-3 px-4">Program Studi</th>
                  <th className="text-left py-3 px-4">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 px-4">IF101</td>
                  <td className="py-3 px-4">Algoritma dan Pemrograman</td>
                  <td className="py-3 px-4">3</td>
                  <td className="py-3 px-4">1</td>
                  <td className="py-3 px-4">Teknik Informatika</td>
                  <td className="py-3 px-4">
                    <Button variant="outline" size="sm">Edit</Button>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">SI205</td>
                  <td className="py-3 px-4">Sistem Basis Data</td>
                  <td className="py-3 px-4">4</td>
                  <td className="py-3 px-4">3</td>
                  <td className="py-3 px-4">Sistem Informasi</td>
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