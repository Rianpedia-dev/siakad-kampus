
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAuthSession } from "@/lib/auth";

export default async function MahasiswaDashboard() {
  const session = await getAuthSession();
  
  // Data dummy untuk contoh, nanti bisa diganti dengan data dari database
  const ipk = 3.45;
  const ips = 3.65;
  const nama = session?.user.name || session?.user.username || "Mahasiswa";
  
  // Jadwal hari ini (Senin, sebagai contoh)
  const jadwalHariIni = [
    { jam: "08:00 - 10:00", mataKuliah: "Algoritma dan Pemrograman", dosen: "Dr. Andi Prasetyo", ruangan: "R.1.1" },
    { jam: "10:30 - 12:30", mataKuliah: "Matematika Diskrit", dosen: "Prof. Siti Rahayu", ruangan: "R.2.3" },
  ];
  
  // Pengumuman terbaru
  const pengumuman = [
    { judul: "Libur Hari Raya", tanggal: "2024-06-01", prioritas: "Tinggi" },
    { judul: "Perubahan Jadwal Ujian", tanggal: "2024-06-05", prioritas: "Sedang" },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Mahasiswa</h1>
        <p className="text-muted-foreground">
          Selamat datang, {nama}! Informasi akademik dan aktivitas terkini Anda.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">IPK</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ipk}</div>
            <p className="text-xs text-muted-foreground">Indeks Prestasi Kumulatif</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">IPS Terakhir</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ips}</div>
            <p className="text-xs text-muted-foreground">Indeks Prestasi Semester</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jumlah SKS</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">Semester ini</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Aktif</div>
            <p className="text-xs text-muted-foreground">Status akademik</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <span className="mr-2">📅</span>
              Jadwal Hari Ini
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
                      <p className="text-xs text-muted-foreground truncate">{jadwal.dosen}</p>
                      <p className="text-xs text-muted-foreground">Ruangan: {jadwal.ruangan}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Tidak ada jadwal hari ini</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <span className="mr-2">📢</span>
              Pengumuman Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pengumuman.length > 0 ? (
              <div className="space-y-4">
                {pengumuman.map((item, index) => (
                  <div key={index} className="flex items-start border-b pb-3 last:border-0 last:pb-0">
                    <div className="mr-3 mt-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.prioritas === 'Tinggi' 
                          ? 'bg-red-100 text-red-800' 
                          : item.prioritas === 'Sedang' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-green-100 text-green-800'
                      }`}>
                        {item.prioritas}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{item.judul}</p>
                      <p className="text-xs text-muted-foreground">{item.tanggal}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Tidak ada pengumuman baru</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
