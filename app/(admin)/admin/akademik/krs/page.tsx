import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, CalendarCheck } from "lucide-react";

export default function PeriodeKRSPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Periode KRS</h1>
          <p className="text-muted-foreground">
            Atur waktu pembukaan KRS, monitoring pengisian, dan approval oleh dosen PA.
          </p>
        </div>
        <div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Periode
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">Daftar Periode KRS</CardTitle>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cari periode..."
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
                  <th className="text-left py-3 px-4">Periode</th>
                  <th className="text-left py-3 px-4">Tahun Akademik</th>
                  <th className="text-left py-3 px-4">Tanggal Mulai</th>
                  <th className="text-left py-3 px-4">Tanggal Selesai</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 px-4">Ganjil 2024/2025</td>
                  <td className="py-3 px-4">2024/2025</td>
                  <td className="py-3 px-4">2024-08-15</td>
                  <td className="py-3 px-4">2024-09-15</td>
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
                  <td className="py-3 px-4">Genap 2024/2025</td>
                  <td className="py-3 px-4">2024/2025</td>
                  <td className="py-3 px-4">2025-01-15</td>
                  <td className="py-3 px-4">2025-02-15</td>
                  <td className="py-3 px-4">
                    <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
                      Pending
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