'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
import { useSession } from '@/lib/auth-client'; // Changed from next-auth/react to auth-client
import { Download, GraduationCap, BookOpen, Calendar } from 'lucide-react';

interface SemesterStats {
  totalSks: number;
  ipk?: number;
  ips?: number;
}

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

type KhsDataItem = {
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
  nilaiAkhir: {
    id: number;
    krsDetailId: number;
    nilaiAngka?: string;
    nilaiHuruf?: string;
    nilaiIndeks?: string;
    status?: string;
    createdAt: Date;
  };
  tahunAkademik: TahunAkademik;
};

export default function KhsPage() {
  const { data: session, status: sessionStatus } = useSession(); // Changed
  const [mahasiswaInfo, setMahasiswaInfo] = useState<Mahasiswa | null>(null);
  const [availableSemesters, setAvailableSemesters] = useState<TahunAkademik[]>([]);
  const [selectedSemester, setSelectedSemester] = useState<string>('');
  const [khsData, setKhsData] = useState<KhsDataItem[]>([]);
  const [semesterStats, setSemesterStats] = useState<SemesterStats>({ totalSks: 0, ips: 0 }); // Typed
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
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/khs?userId=${userId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'Gagal memuat data KHS');
        return;
      }
      
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
        return;
      }
      
      setMahasiswaInfo(data.mahasiswa);
      setAvailableSemesters(data.availableSemesters);
      
      // Set default to active semester if available
      const activeSemester = data.availableSemesters.find((sem: TahunAkademik) => sem.isActive);
      if (activeSemester) {
        setSelectedSemester(activeSemester.id.toString());
      } else if (data.availableSemesters.length > 0) {
        setSelectedSemester(data.availableSemesters[0].id.toString());
      }
      
      // Calculate overall stats for all data
      const allKhsData = data.khsData || [];
      setKhsData(allKhsData);
      
      // Calculate overall stats
      const totalSks = allKhsData.reduce((sum: number, item: KhsDataItem) => 
        sum + (item.kelas?.mataKuliah?.sks || 0), 0);
      
      const totalBobot = allKhsData.reduce((sum: number, item: KhsDataItem) => {
        const nilaiIndeks = parseFloat(item.nilaiAkhir?.nilaiIndeks || '0');
        const sks = item.kelas?.mataKuliah?.sks || 0;
        return sum + (nilaiIndeks * sks);
      }, 0);
      
      const ipk = totalSks > 0 ? totalBobot / totalSks : 0;
      
      setSemesterStats({
        totalSks,
        ipk: parseFloat(ipk.toFixed(2))
      });
    } catch (err) {
      setError('Gagal memuat data KHS');
      console.error('Error loading KHS data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load KHS data when semester changes
  useEffect(() => {
    if (selectedSemester && session?.user?.id) {
      loadKhsDataForSemester(parseInt(selectedSemester), session.user.id); // Pass userId
    }
  }, [selectedSemester, session, loadKhsDataForSemester]); // Added loadKhsDataForSemester to dependencies

  const loadKhsDataForSemester = useCallback(async (tahunAkademikId: number, userId: string) => { // Added userId parameter
    try {
      const response = await fetch(`/api/khs?userId=${userId}&tahunAkademikId=${tahunAkademikId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'Gagal memuat data KHS');
        return;
      }
      
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
        return;
      }
      
      // Filter data for selected semester
      const filteredData = data.khsData.filter((item: KhsDataItem) => 
        item.tahunAkademik.id === tahunAkademikId
      );
      
      setKhsData(filteredData);
      
      // Calculate semester statistics
      const totalSks = filteredData.reduce((sum: number, item: KhsDataItem) => 
        sum + (item.kelas?.mataKuliah?.sks || 0), 0);
      
      const totalBobot = filteredData.reduce((sum: number, item: KhsDataItem) => {
        const nilaiIndeks = parseFloat(item.nilaiAkhir?.nilaiIndeks || '0');
        const sks = item.kelas?.mataKuliah?.sks || 0;
        return sum + (nilaiIndeks * sks);
      }, 0);
      
      const ips = totalSks > 0 ? totalBobot / totalSks : 0;
      
      setSemesterStats({
        totalSks,
        ips: parseFloat(ips.toFixed(2))
      });
    } catch (err) {
      setError('Gagal memuat data KHS');
      console.error('Error loading KHS data:', err);
    }
  }, []); // Empty dependency array as it doesn't depend on any props or state that change over time

  const getGradeBadge = (nilaiHuruf: string | null) => {
    if (!nilaiHuruf) return <Badge variant="outline">-</Badge>;
    
    const gradeColors: Record<string, string> = {
      'A': 'bg-green-100 text-green-800',
      'A-': 'bg-green-100 text-green-800',
      'B+': 'bg-blue-100 text-blue-800',
      'B': 'bg-blue-100 text-blue-800',
      'B-': 'bg-blue-100 text-blue-800',
      'C+': 'bg-yellow-100 text-yellow-800',
      'C': 'bg-yellow-100 text-yellow-800',
      'D': 'bg-orange-100 text-orange-800',
      'E': 'bg-red-100 text-red-800',
    };
    
    return (
      <Badge className={gradeColors[nilaiHuruf] || 'bg-gray-100 text-gray-800'}>
        {nilaiHuruf}
      </Badge>
    );
  };

  const downloadKhs = () => {
    // In a real implementation, this would generate a PDF
    alert('Fitur download KHS akan diimplementasikan');
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
          <p className="text-muted-foreground">Memuat data KHS...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-500 mb-2">Error: {error}</p>
          <Button onClick={() => loadInitialData(session?.user?.id)}>Coba Lagi</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Kartu Hasil Studi (KHS)</h1>
            <p className="text-sm text-muted-foreground">
              Pantau nilai per semester, status kelulusan mata kuliah, dan indeks prestasi.
            </p>
          </div>
          <Button onClick={downloadKhs} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Unduh KHS
          </Button>
        </div>
      </header>

      {/* Student Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Informasi Mahasiswa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            <div>
              <p className="text-xs text-muted-foreground">Angkatan</p>
              <p className="font-medium">{mahasiswaInfo?.angkatan || '-'}</p>
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
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="w-full sm:w-auto">
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
            </div>
            {semesterStats.ips && (
              <div className="grid grid-cols-2 gap-4 w-full sm:w-auto">
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground">IPS</p>
                  <p className="font-bold text-lg">{semesterStats.ips}</p>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground">Total SKS</p>
                  <p className="font-bold text-lg">{semesterStats.totalSks}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* KHS Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Kartu Hasil Studi - {selectedSemester ? availableSemesters.find(s => s.id.toString() === selectedSemester)?.tahun + ' - ' + availableSemesters.find(s => s.id.toString() === selectedSemester)?.semester : 'Pilih Semester'}</CardTitle>
          <div className="text-sm">
            Jumlah Mata Kuliah: {khsData.length}
          </div>
        </CardHeader>
        <CardContent>
          {khsData.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Kode MK</TableHead>
                  <TableHead>Nama Mata Kuliah</TableHead>
                  <TableHead className="text-center">SKS</TableHead>
                  <TableHead className="text-center">Nilai</TableHead>
                  <TableHead className="text-center">Indeks</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {khsData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      {item.kelas?.mataKuliah?.kodeMk}
                    </TableCell>
                    <TableCell>{item.kelas?.mataKuliah?.namaMk}</TableCell>
                    <TableCell className="text-center">{item.kelas?.mataKuliah?.sks}</TableCell>
                    <TableCell className="text-center">
                      {getGradeBadge(item.nilaiAkhir?.nilaiHuruf)}
                    </TableCell>
                    <TableCell className="text-center">
                      {item.nilaiAkhir?.nilaiIndeks || '-'}
                    </TableCell>
                    <TableCell className="text-center">
                      {item.nilaiAkhir?.status === 'lulus' ? (
                        <Badge className="bg-green-500">Lulus</Badge>
                      ) : item.nilaiAkhir?.status === 'tidak_lulus' ? (
                        <Badge className="bg-red-500">Tidak Lulus</Badge>
                      ) : (
                        <Badge variant="outline">-</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {selectedSemester 
                ? 'Tidak ada data KHS untuk semester yang dipilih.' 
                : 'Silakan pilih semester untuk melihat data KHS.'}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Overall Stats */}
      {semesterStats.ips && (
        <Card>
          <CardHeader>
            <CardTitle>Ringkasan Semester</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-primary/5 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  <p className="text-sm text-muted-foreground">IPS</p>
                </div>
                <p className="text-2xl font-bold">{semesterStats.ips}</p>
              </div>
              <div className="bg-primary/5 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <p className="text-sm text-muted-foreground">Total SKS</p>
                </div>
                <p className="text-2xl font-bold">{semesterStats.totalSks}</p>
              </div>
              <div className="bg-primary/5 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <p className="text-sm text-muted-foreground">Jumlah MK</p>
                </div>
                <p className="text-2xl font-bold">{khsData.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}