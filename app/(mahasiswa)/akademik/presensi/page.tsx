'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSession } from '@/lib/auth-client'; // Changed from next-auth/react to auth-client
import { CheckCircle, XCircle, MinusCircle } from 'lucide-react'; // Removed Calendar, Clock, Users, BookOpen

type Mahasiswa = {
  id: number;
  userId: number;
  nim: string;
  namaLengkap: string;
  tempatLahir?: string;
  tanggalLahir?: Date;
  jenisKelamin?: string;
  alamat?: string;
  noTelp?: string;
  prodiId?: number;
  angkatan?: string;
  semester: number;
  status: string;
  dosenPaId?: number;
  foto?: string;
  createdAt: Date;
  updatedAt: Date;
  prodi?: {
    kodeProdi: string;
    namaProdi: string;
    jenjang?: string;
    fakultas?: string;
    akreditasi?: string;
  };
  dosenPa?: {
    id: number;
    namaLengkap: string;
  };
};

type TahunAkademik = {
  id: number;
  tahun: string;
  semester: string;
  tanggalMulai: Date;
  tanggalSelesai: Date;
  isActive: boolean;
  createdAt: Date;
};

type PertemuanItem = {
  pertemuanId: number;
  pertemuanKe: number;
  tanggal?: Date;
  topik?: string;
  status: string;
  keterangan?: string;
};

type PresensiDataItem = {
  id: number;
  krsId: number;
  kelasId: number;
  createdAt: Date;
  kelas: {
    id: number;
    kodeKelas: string;
    mataKuliahId: number;
    dosenId: number;
    tahunAkademikId: number;
    ruanganId?: number;
    kapasitas: number;
    kuota: number;
    hari?: string;
    jamMulai?: string;
    jamSelesai?: string;
    createdAt: Date;
    mataKuliah: {
      id: number;
      kodeMk: string;
      namaMk: string;
      sks: number;
      semester: number;
    };
    dosen: {
      id: number;
      namaLengkap: string;
    };
  };
  pertemuan: PertemuanItem[]; // Typed
};

export default function PresensiPage() {
  const { data: session, status: sessionStatus } = useSession(); // Changed
  const [mahasiswaInfo, setMahasiswaInfo] = useState<Mahasiswa | null>(null);
  const [availableSemesters, setAvailableSemesters] = useState<TahunAkademik[]>([]);
  const [selectedSemester, setSelectedSemester] = useState<string>('');
  const [presensiData, setPresensiData] = useState<PresensiDataItem[]>([]);
  const [selectedSemesterInfo, setSelectedSemesterInfo] = useState<TahunAkademik | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial data when session is available
  useEffect(() => {
    if (sessionStatus === 'authenticated' && session?.user?.id) {
      loadInitialData(session.user.id);
    } else if (sessionStatus === 'unauthenticated') {
      setError('Anda harus login untuk melihat halaman ini.');
      setLoading(false);
    }
  }, [session, sessionStatus]);

  const loadInitialData = async (userId: string) => {
    if (!userId) {
      setError('User ID tidak ditemukan. Harap login kembali.');
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/presensi?userId=${userId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'Gagal memuat data presensi');
        return;
      }
      
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
        return;
      }
      
      setMahasiswaInfo(data.mahasiswa);
      setAvailableSemesters(data.availableSemesters);
      setPresensiData(data.presensiData);
      setSelectedSemesterInfo(data.selectedSemester);
      
      // Set default to active semester if available
      if (data.selectedSemester) {
        setSelectedSemester(data.selectedSemester.id.toString());
      } else if (data.availableSemesters.length > 0) {
        setSelectedSemester(data.availableSemesters[0].id.toString());
      }
    } catch (err) {
      setError('Gagal memuat data presensi');
      console.error('Error loading presensi:', err);
    } finally {
      setLoading(false);
    }
  };

  const getPresensiBadge = (status: string) => {
    switch (status) {
      case 'hadir':
        return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Hadir</Badge>;
      case 'izin':
        return <Badge className="bg-blue-500"><MinusCircle className="h-3 w-3 mr-1" />Izin</Badge>;
      case 'sakit':
        return <Badge className="bg-yellow-500"><MinusCircle className="h-3 w-3 mr-1" />Sakit</Badge>;
      case 'alpa':
        return <Badge className="bg-red-500"><XCircle className="h-3 w-3 mr-1" />Alpa</Badge>;
      default:
        return <Badge variant="outline">-</Badge>;
    }
  };

  const calculateAttendanceStats = (pertemuan: PertemuanItem[]) => { // Typed
    const total = pertemuan.length;
    const hadir = pertemuan.filter(p => p.status === 'hadir').length;
    const izin = pertemuan.filter(p => p.status === 'izin').length;
    const sakit = pertemuan.filter(p => p.status === 'sakit').length;
    const alpa = pertemuan.filter(p => p.status === 'alpa').length;
    
    const presentPercentage = total > 0 ? Math.round((hadir / total) * 100) : 0;
    
    return { total, hadir, izin, sakit, alpa, presentPercentage };
  };

  if (sessionStatus === 'loading') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-4"></div>
          <p className="text-muted-foreground">Memuat halaman...</p>
        </div>
      </div>
    );
  }

  if (sessionStatus === 'unauthenticated') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-500 mb-2">Anda harus login terlebih dahulu</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-4"></div>
          <p className="text-muted-foreground">Memuat data presensi...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-500 mb-2">Error: {error}</p>
          <button 
            className="text-blue-500 hover:underline"
            onClick={() => {
              if (session?.user?.id) {
                loadInitialData(session.user.id);
              } else {
                setError('User ID tidak ditemukan. Harap login kembali.');
              }
            }}
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Presensi Kuliah</h1>
        <p className="text-sm text-muted-foreground">
          Monitoring kehadiran per mata kuliah, status izin/sakit/alpa, dan rekapitulasi presensi.
        </p>
      </header>

      {/* Student Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Informasi Mahasiswa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">NIM</p>
              <p className="font-medium">{mahasiswaInfo?.nim || '-'}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Nama</p>
              <p className="font-medium">{mahasiswaInfo?.namaLengkap || '-'}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Program Studi</p>
              <p className="font-medium">{mahasiswaInfo?.prodi?.namaProdi || '-'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Semester Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Pilih Semester</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedSemester} onValueChange={setSelectedSemester}>
            <SelectTrigger className="w-full sm:w-[250px]">
              <SelectValue placeholder="Pilih semester" />
            </SelectTrigger>
            <SelectContent>
              {availableSemesters.map((semester) => (
                <SelectItem key={semester.id} value={semester.id.toString()}>
                  {semester.tahun} - {semester.semester}
                  {semester.isActive && ' (Aktif)'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Attendance Statistics */}
      {presensiData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {presensiData.map((kelas, idx) => {
            const stats = calculateAttendanceStats(kelas.pertemuan);
            return (
              <Card key={idx} className="border border-border/60">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    {kelas.kelas?.mataKuliah?.namaMk}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {kelas.kelas?.dosen?.namaLengkap}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Hadir</span>
                      <span className="font-medium">{stats.hadir}/{stats.total}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${(stats.hadir / stats.total) * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-center text-sm font-medium">
                      {stats.presentPercentage}%
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Tabs for different views */}
      <Tabs defaultValue="summary" className="space-y-4">
        <TabsList>
          <TabsTrigger value="summary">Rekap Kehadiran</TabsTrigger>
          <TabsTrigger value="detail">Detail Per MK</TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rekap Kehadiran Semester - {selectedSemesterInfo ? selectedSemesterInfo.tahun + ' - ' + selectedSemesterInfo.semester : 'Pilih Semester'}</CardTitle>
            </CardHeader>
            <CardContent>
              {presensiData.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama Mata Kuliah</TableHead>
                      <TableHead>Dosen</TableHead>
                      <TableHead className="text-center">Total Pertemuan</TableHead>
                      <TableHead className="text-center">Hadir</TableHead>
                      <TableHead className="text-center">Izin</TableHead>
                      <TableHead className="text-center">Sakit</TableHead>
                      <TableHead className="text-center">Alpa</TableHead>
                      <TableHead className="text-center">Persentase Hadir</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {presensiData.map((kelas, idx) => {
                      const stats = calculateAttendanceStats(kelas.pertemuan);
                      return (
                        <TableRow key={idx}>
                          <TableCell className="font-medium">
                            {kelas.kelas?.mataKuliah?.namaMk}
                          </TableCell>
                          <TableCell>{kelas.kelas?.dosen?.namaLengkap}</TableCell>
                          <TableCell className="text-center">{stats.total}</TableCell>
                          <TableCell className="text-center">{stats.hadir}</TableCell>
                          <TableCell className="text-center">{stats.izin}</TableCell>
                          <TableCell className="text-center">{stats.sakit}</TableCell>
                          <TableCell className="text-center">{stats.alpa}</TableCell>
                          <TableCell className="text-center">
                            <Badge className={stats.presentPercentage >= 75 ? 'bg-green-500' : 'bg-red-500'}>
                              {stats.presentPercentage}%
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  {selectedSemester 
                    ? 'Tidak ada data presensi untuk semester yang dipilih.' 
                    : 'Silakan pilih semester untuk melihat data presensi.'}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="detail" className="space-y-4">
          {presensiData.map((kelas, classIdx) => (
            <Card key={classIdx} className="border border-border/60">
              <CardHeader>
                <CardTitle>
                  {kelas.kelas?.mataKuliah?.namaMk} - {kelas.kelas?.dosen?.namaLengkap}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center">Pertemuan</TableHead>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Topik</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead>Keterangan</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {kelas.pertemuan.map((pertemuan, pertemuanIdx) => (
                      <TableRow key={pertemuanIdx}>
                        <TableCell className="text-center">{pertemuan.pertemuanKe}</TableCell>
                        <TableCell>
                          {pertemuan.tanggal ? new Date(pertemuan.tanggal).toLocaleDateString('id-ID') : '-'}
                        </TableCell>
                        <TableCell>{pertemuan.topik || '-'}</TableCell>
                        <TableCell className="text-center">
                          {getPresensiBadge(pertemuan.status)}
                        </TableCell>
                        <TableCell>{pertemuan.keterangan || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))}
          
          {presensiData.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {selectedSemester 
                ? 'Tidak ada data presensi untuk semester yang dipilih.' 
                : 'Silakan pilih semester untuk melihat data presensi.'}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}