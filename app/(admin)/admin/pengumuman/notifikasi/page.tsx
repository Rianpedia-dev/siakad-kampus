import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Bell, Mail } from "lucide-react";

export default function NotifikasiPengumumanPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifikasi Pengumuman</h1>
          <p className="text-muted-foreground">
            Sinkronkan dengan sistem notifikasi email/push agar pengguna mendapat informasi real-time.
          </p>
        </div>
        <div>
          <Button>
            <Mail className="mr-2 h-4 w-4" />
            Kirim Notifikasi Massal
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">Pengaturan Notifikasi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <Bell className="h-6 w-6 text-blue-500" />
                <h3 className="font-semibold">Notifikasi Push</h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>Pengumuman Umum</span>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input type="checkbox" id="push-umum" className="sr-only" defaultChecked />
                    <label htmlFor="push-umum" className="block h-6 w-10 rounded-full bg-gray-300 cursor-pointer"></label>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Pengumuman Akademik</span>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input type="checkbox" id="push-akademik" className="sr-only" defaultChecked />
                    <label htmlFor="push-akademik" className="block h-6 w-10 rounded-full bg-gray-300 cursor-pointer"></label>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Pengumuman Penting</span>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input type="checkbox" id="push-penting" className="sr-only" defaultChecked />
                    <label htmlFor="push-penting" className="block h-6 w-10 rounded-full bg-gray-300 cursor-pointer"></label>
                  </div>
                </div>
              </div>
            </div>
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <Mail className="h-6 w-6 text-green-500" />
                <h3 className="font-semibold">Notifikasi Email</h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>Pengumuman Umum</span>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input type="checkbox" id="email-umum" className="sr-only" />
                    <label htmlFor="email-umum" className="block h-6 w-10 rounded-full bg-gray-300 cursor-pointer"></label>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Pengumuman Akademik</span>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input type="checkbox" id="email-akademik" className="sr-only" defaultChecked />
                    <label htmlFor="email-akademik" className="block h-6 w-10 rounded-full bg-gray-300 cursor-pointer"></label>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Pengumuman Penting</span>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input type="checkbox" id="email-penting" className="sr-only" defaultChecked />
                    <label htmlFor="email-penting" className="block h-6 w-10 rounded-full bg-gray-300 cursor-pointer"></label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">Riwayat Notifikasi</CardTitle>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari riwayat..."
              className="pl-8 pr-4 py-2 border rounded-md w-full md:w-64"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="text-left py-3 px-4">Judul</th>
                  <th className="text-left py-3 px-4">Jenis</th>
                  <th className="text-left py-3 px-4">Tujuan</th>
                  <th className="text-left py-3 px-4">Tanggal</th>
                  <th className="text-left py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 px-4">Libur Hari Raya</td>
                  <td className="py-3 px-4">Email & Push</td>
                  <td className="py-3 px-4">Semua Pengguna</td>
                  <td className="py-3 px-4">2024-06-01</td>
                  <td className="py-3 px-4">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                      Terkirim
                    </span>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">Perubahan Jadwal Ujian</td>
                  <td className="py-3 px-4">Push</td>
                  <td className="py-3 px-4">Mahasiswa</td>
                  <td className="py-3 px-4">2024-06-05</td>
                  <td className="py-3 px-4">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                      Terkirim
                    </span>
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