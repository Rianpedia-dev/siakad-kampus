import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Download, FileText, Database, FileSpreadsheet } from "lucide-react";

export default function ExportDataPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Ekspor Data</h1>
          <p className="text-muted-foreground">
            Ekspor laporan ke format PDF atau Excel untuk kebutuhan rapat dan dokumentasi.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Format Ekspor Tersedia</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <FileText className="h-6 w-6 text-blue-500" />
                <h3 className="font-semibold">PDF Report</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Ekspor laporan dalam format PDF untuk cetak atau arsip dokumentasi.
              </p>
              <div className="space-y-2">
                <Button variant="outline" className="w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  Ekspor Data Mahasiswa
                </Button>
                <Button variant="outline" className="w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  Ekspor Data Dosen
                </Button>
                <Button variant="outline" className="w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  Ekspor Laporan Akademik
                </Button>
              </div>
            </div>
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <FileSpreadsheet className="h-6 w-6 text-green-500" />
                <h3 className="font-semibold">Excel/Spreadsheet</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Ekspor data ke format Excel untuk analisis lanjutan atau pemrosesan.
              </p>
              <div className="space-y-2">
                <Button variant="outline" className="w-full">
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Ekspor Data Mahasiswa
                </Button>
                <Button variant="outline" className="w-full">
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Ekspor Data Dosen
                </Button>
                <Button variant="outline" className="w-full">
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Ekspor Laporan Presensi
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">Riwayat Ekspor</CardTitle>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari riwayat ekspor..."
              className="pl-8 pr-4 py-2 border rounded-md w-full md:w-64"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="text-left py-3 px-4">Jenis Data</th>
                  <th className="text-left py-3 px-4">Format</th>
                  <th className="text-left py-3 px-4">Tanggal</th>
                  <th className="text-left py-3 px-4">Pengguna</th>
                  <th className="text-left py-3 px-4">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 px-4">Data Mahasiswa</td>
                  <td className="py-3 px-4">PDF</td>
                  <td className="py-3 px-4">2024-11-13 10:30</td>
                  <td className="py-3 px-4">admin</td>
                  <td className="py-3 px-4">
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Unduh
                    </Button>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">Laporan Presensi</td>
                  <td className="py-3 px-4">Excel</td>
                  <td className="py-3 px-4">2024-11-12 15:45</td>
                  <td className="py-3 px-4">admin</td>
                  <td className="py-3 px-4">
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Unduh
                    </Button>
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