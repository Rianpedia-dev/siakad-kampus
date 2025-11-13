import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAuthSession } from "@/lib/auth";

export default async function DosenDashboardPage() {
  const session = await getAuthSession();
  const nama = session?.user.name || session?.user.username || "Dosen";
  
  // Data dummy untuk contoh, nanti bisa diganti dengan data dari database
  const jadwalHariIni = [
    { jam: "08:00 - 10:00", mataKuliah: "Algoritma dan Pemrograman", kelas: "IF-2021A", ruangan: "R.1.1" },
    { jam: "13:00 - 15:00", mataKuliah: "Struktur Data", kelas: "IF-2021B", ruangan: "Lab Informatika" },
  ];
  
  const kelasAktif = [
    { mataKuliah: "Algoritma dan Pemrograman", kelas: "IF-2021A", mahasiswa: 30, pertemuan: 12 },
    { mataKuliah: "Struktur Data", kelas: "IF-2021B", mahasiswa: 28, pertemuan: 10 },
    { mataKuliah: "Basis Data", kelas: "SI-2021A", mahasiswa: 32, pertemuan: 14 },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Dosen</h1>
        <p className="text-muted-foreground">
          Selamat datang, {nama}! Kelola kegiatan perkuliahan Anda dengan mudah.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kelas Mengajar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kelasAktif.length}</div>
            <p className="text-xs text-muted-foreground">Jumlah kelas aktif</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mahasiswa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {kelasAktif.reduce((total, kelas) => total + kelas.mahasiswa, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Total mahasiswa</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jadwal Hari Ini</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jadwalHariIni.length}</div>
            <p className="text-xs text-muted-foreground">Sesi perkuliahan</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bimbingan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Mahasiswa bimbingan</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <span className="mr-2">📅</span>
              Jadwal Mengajar Hari Ini
            </CardTitle>
          </CardHeader>
          <CardContent>
            {jadwalHariIni.length > 0 ? (
              <div className="space-y-4">
                {jadwalHariIni.map((jadwal, index) => (
                  <div key={index} className="flex items-center border-b pb-3 last:border-0 last:pb-0">
                    <div className="flex-shrink-0 w-20 mr-4">
                      <div className="text-sm font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {jadwal.jam}
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{jadwal.mataKuliah}</p>
                      <p className="text-xs text-muted-foreground truncate">Kelas: {jadwal.kelas}</p>
                      <p className="text-xs text-muted-foreground">Ruangan: {jadwal.ruangan}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Tidak ada jadwal mengajar hari ini</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <span className="mr-2">📚</span>
              Kelas Aktif
            </CardTitle>
          </CardHeader>
          <CardContent>
            {kelasAktif.length > 0 ? (
              <div className="space-y-4">
                {kelasAktif.map((kelas, index) => (
                  <div key={index} className="flex items-center border-b pb-3 last:border-0 last:pb-0">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{kelas.mataKuliah}</p>
                      <p className="text-xs text-muted-foreground">Kelas: {kelas.kelas}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">{kelas.mahasiswa} mahasiswa</p>
                      <p className="text-xs text-muted-foreground">{kelas.pertemuan} pertemuan</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Tidak ada kelas aktif</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}



