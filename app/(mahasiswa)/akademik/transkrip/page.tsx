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
import { useSession } from '@/lib/auth-client';
import { Download, BookOpen, GraduationCap, Calendar } from 'lucide-react';

// Define types for the transkrip data
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

type OverallStats = {
  totalSks: number;
  ipk: number;
  predikat: string;
  totalMataKuliah: number;
};

type TranskripDataItem = {
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

export default function TranskripNilaiPage() {
  const { data: session, status: sessionStatus } = useSession();
  const [mahasiswaInfo, setMahasiswaInfo] = useState<Mahasiswa | null>(null);
  const [transkripData, setTranskripData] = useState<TranskripDataItem[]>([]);
  const [overallStats, setOverallStats] = useState<OverallStats>({
    totalSks: 0,
    ipk: 0,
    predikat: '',
    totalMataKuliah: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      
      const response = await fetch(`/api/transkrip?userId=${userId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'Gagal memuat data transkrip');
        return;
      }
      
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
        return;
      }
      
      setMahasiswaInfo(data.mahasiswa);
      setTranskripData(data.transkripData);
      setOverallStats(data.overallStats);
    } catch (err) {
      setError('Gagal memuat data transkrip');
      console.error('Error loading transkrip data:', err);
    } finally {
      setLoading(false);
    }
  };

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

  const downloadTranskrip = () => {
    // In a real implementation, this would generate a PDF
    alert('Fitur download transkrip akan diimplementasikan. File PDF akan dihasilkan dengan format resmi.');
  };

  if (loading || sessionStatus === 'loading') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-4"></div>
          <p className="text-muted-foreground">Memuat transkrip nilai...</p>
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
            <h1 className="text-2xl font-semibold tracking-tight">Transkrip Nilai</h1>
            <p className="text-sm text-muted-foreground">
              Generate transkrip nilai lengkap beserta fitur ekspor ke PDF untuk kebutuhan resmi.
            </p>
          </div>
          <Button onClick={downloadTranskrip} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Unduh Transkrip
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

      {/* Overall Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Ringkasan Akademik</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-primary/5 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                <p className="text-sm text-muted-foreground">IPK</p>
              </div>
              <p className="text-2xl font-bold">{overallStats.ipk || '0.00'}</p>
            </div>
            <div className="bg-primary/5 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <p className="text-sm text-muted-foreground">Total SKS</p>
              </div>
              <p className="text-2xl font-bold">{overallStats.totalSks || 0}</p>
            </div>
            <div className="bg-primary/5 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <p className="text-sm text-muted-foreground">Jumlah MK</p>
              </div>
              <p className="text-2xl font-bold">{overallStats.totalMataKuliah || 0}</p>
            </div>
            <div className="bg-primary/5 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <p className="text-sm text-muted-foreground">Status</p>
              </div>
              <p className="text-2xl font-bold">
                {overallStats.ipk >= 2.00 ? 'Lulus' : 'Aktif'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transkrip Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Transkrip Nilai Lengkap</CardTitle>
          <div className="text-sm">
            Jumlah Mata Kuliah: {transkripData.length}
          </div>
        </CardHeader>
        <CardContent>
          {transkripData.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tahun Ajaran</TableHead>
                  <TableHead>Kode MK</TableHead>
                  <TableHead>Nama Mata Kuliah</TableHead>
                  <TableHead>SKS</TableHead>
                  <TableHead>Dosen</TableHead>
                  <TableHead>Nilai</TableHead>
                  <TableHead>Indeks</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transkripData.map((item, idx) => (
                  <TableRow key={idx}>
                    <TableCell>
                      {item.tahunAkademik?.tahun} - {item.tahunAkademik?.semester}
                    </TableCell>
                    <TableCell className="font-medium">
                      {item.kelas?.mataKuliah?.kodeMk}
                    </TableCell>
                    <TableCell>{item.kelas?.mataKuliah?.namaMk}</TableCell>
                    <TableCell>{item.kelas?.mataKuliah?.sks}</TableCell>
                    <TableCell>{item.kelas?.dosen?.namaLengkap}</TableCell>
                    <TableCell>
                      {getGradeBadge(item.nilaiAkhir?.nilaiHuruf)}
                    </TableCell>
                    <TableCell>{item.nilaiAkhir?.nilaiIndeks || '-'}</TableCell>
                    <TableCell>
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
              Tidak ada data transkrip nilai yang tersedia.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Semester Grouped View */}
      <Card>
        <CardHeader>
          <CardTitle>Transkrip Per Semester</CardTitle>
        </CardHeader>
        <CardContent>
          {transkripData.length > 0 ? (
            <div className="space-y-8">
              {Array.from(new Set(transkripData.map(item => item.tahunAkademik?.id)))
                .map(tahunAkademikId => {
                  const semesterData = transkripData.filter(item =>
                    item.tahunAkademik?.id === tahunAkademikId
                  );

                  if (semesterData.length === 0) return null;

                  const firstItem = semesterData[0];
                  const semesterName = `${firstItem.tahunAkademik?.tahun} - ${firstItem.tahunAkademik?.semester}`;

                  // Calculate semester stats
                  const semesterSks = semesterData.reduce((sum, item) =>
                    sum + (item.kelas?.mataKuliah?.sks || 0), 0);

                  const semesterBobot = semesterData.reduce((sum, item) => {
                    const nilaiIndeks = parseFloat(item.nilaiAkhir?.nilaiIndeks || '0');
                    const sks = item.kelas?.mataKuliah?.sks || 0;
                    return sum + (nilaiIndeks * sks);
                  }, 0);

                  const ips = semesterSks > 0 ? semesterBobot / semesterSks : 0;

                  return (
                    <div key={tahunAkademikId} className="space-y-4">
                      <div className="flex justify-between items-center border-b pb-2">
                        <h3 className="text-lg font-semibold">{semesterName}</h3>
                        <div className="flex gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground">IPS</p>
                            <p className="font-semibold">{ips.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Total SKS</p>
                            <p className="font-semibold">{semesterSks}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Jumlah MK</p>
                            <p className="font-semibold">{semesterData.length}</p>
                          </div>
                        </div>
                      </div>

                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Kode MK</TableHead>
                            <TableHead>Nama Mata Kuliah</TableHead>
                            <TableHead>SKS</TableHead>
                            <TableHead>Nilai</TableHead>
                            <TableHead>Indeks</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {semesterData.map((item, idx) => (
                            <TableRow key={idx}>
                              <TableCell className="font-medium">
                                {item.kelas?.mataKuliah?.kodeMk}
                              </TableCell>
                              <TableCell>{item.kelas?.mataKuliah?.namaMk}</TableCell>
                              <TableCell>{item.kelas?.mataKuliah?.sks}</TableCell>
                              <TableCell>
                                {getGradeBadge(item.nilaiAkhir?.nilaiHuruf)}
                              </TableCell>
                              <TableCell>{item.nilaiAkhir?.nilaiIndeks || '-'}</TableCell>
                              <TableCell>
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
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Tidak ada data transkrip nilai yang tersedia.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}