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
import { Clock, Users, MapPin } from 'lucide-react'; // Removed Calendar, BookOpen

interface SemesterStats {
  totalSks?: number;
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

type JadwalDataItem = {
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
    ruangan?: {
      id: number;
      kodeRuangan: string;
      namaRuangan?: string;
    };
  };
};

export default function JadwalKuliahPage() {
  const { data: session, status: sessionStatus } = useSession(); // Changed
  const [mahasiswaInfo, setMahasiswaInfo] = useState<Mahasiswa | null>(null);
  const [availableSemesters, setAvailableSemesters] = useState<TahunAkademik[]>([]);
  const [selectedSemester, setSelectedSemester] = useState<string>('');
  const [jadwalData, setJadwalData] = useState<Record<string, JadwalDataItem[]>>({});
  const [selectedSemesterInfo, setSelectedSemesterInfo] = useState<TahunAkademik | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial data when session is available
  useEffect(() => {
    if (sessionStatus === 'authenticated' && session?.user?.id) {
      loadInitialData(session.user.id); // Pass userId
    } else if (sessionStatus === 'unauthenticated') {
      setError('Anda harus login untuk melihat halaman ini.');
      setLoading(false);
    }
  }, [session, sessionStatus]); // Added session to dependencies

  const loadInitialData = async (userId: string) => { // Added userId parameter
    if (!userId) {
      setError('User ID tidak ditemukan. Harap login kembali.');
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/jadwal?userId=${userId}`); // Use userId
      
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'Gagal memuat jadwal');
        return;
      }
      
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
        return;
      }
      
      setMahasiswaInfo(data.mahasiswa);
      setAvailableSemesters(data.availableSemesters);
      setJadwalData(data.jadwalData);
      setSelectedSemesterInfo(data.selectedSemester);
      
      // Set default to active semester if available
      if (data.selectedSemester) {
        setSelectedSemester(data.selectedSemester.id.toString());
      } else if (data.availableSemesters.length > 0) {
        setSelectedSemester(data.availableSemesters[0].id.toString());
      }
    } catch (err) {
      setError('Gagal memuat jadwal');
      console.error('Error loading jadwal:', err);
    } finally {
      setLoading(false);
    }
  };

  const getDaySchedule = (day: string) => {
    return jadwalData[day] || [];
  };

  const getDayBadge = (hari: string) => {
    const dayColors: Record<string, string> = {
      'Senin': 'bg-blue-100 text-blue-800',
      'Selasa': 'bg-green-100 text-green-800',
      'Rabu': 'bg-purple-100 text-purple-800',
      'Kamis': 'bg-yellow-100 text-yellow-800',
      'Jumat': 'bg-red-100 text-red-800',
      'Sabtu': 'bg-indigo-100 text-indigo-800',
      'Minggu': 'bg-pink-100 text-pink-800'
    };
    
    return (
      <Badge className={dayColors[hari] || 'bg-gray-100 text-gray-800'}>
        {hari}
      </Badge>
    );
  };

  if (loading || sessionStatus === 'loading') { // Added sessionStatus
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-4"></div>
          <p className="text-muted-foreground">Memuat jadwal kuliah...</p>
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
        <h1 className="text-2xl font-semibold tracking-tight">Jadwal Kuliah</h1>
        <p className="text-sm text-muted-foreground">
          Lihat jadwal mingguan, jadwal ujian (UTS/UAS), serta notifikasi perubahan kelas.
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

      {/* Weekly Schedule */}
      <Tabs defaultValue="weekly" className="space-y-4">
        <TabsList>
          <TabsTrigger value="weekly">Jadwal Mingguan</TabsTrigger>
          <TabsTrigger value="daily">Jadwal Harian</TabsTrigger>
        </TabsList>
        
        <TabsContent value="weekly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Jadwal Mingguan - {selectedSemesterInfo ? selectedSemesterInfo.tahun + ' - ' + selectedSemesterInfo.semester : 'Pilih Semester'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'].map((day) => {
                  const daySchedule = getDaySchedule(day);
                  
                  return (
                    <Card key={day} className="border border-border/60">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">{day}</CardTitle>
                          {getDayBadge(day)}
                        </div>
                      </CardHeader>
                      <CardContent>
                        {daySchedule.length > 0 ? (
                          <div className="space-y-3">
                            {daySchedule.map((item, idx) => (
                              <div key={idx} className="border border-border/40 rounded-lg p-3">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-medium">{item.kelas?.mataKuliah?.namaMk}</h4>
                                    <p className="text-xs text-muted-foreground">
                                      {item.kelas?.kodeKelas}
                                    </p>
                                  </div>
                                  <Badge variant="outline">
                                    {item.kelas?.mataKuliah?.sks} SKS
                                  </Badge>
                                </div>
                                
                                <div className="mt-2 flex items-center text-sm text-muted-foreground gap-4">
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    <span>
                                      {item.kelas?.jamMulai} - {item.kelas?.jamSelesai}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    <span>{item.kelas?.ruangan?.namaRuangan || 'TBD'}</span>
                                  </div>
                                </div>
                                
                                <div className="mt-1 flex items-center text-sm text-muted-foreground">
                                  <Users className="h-3 w-3 mr-1" />
                                  <span>{item.kelas?.dosen?.namaLengkap}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-4 text-muted-foreground">
                            Tidak ada jadwal
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="daily" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Jadwal Harian</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'].map((day) => {
                  const daySchedule = getDaySchedule(day);
                  
                  if (daySchedule.length === 0) return null;
                  
                  return (
                    <div key={day} className="space-y-2">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        {getDayBadge(day)}
                        <span>{day}</span>
                      </h3>
                      
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Jam</TableHead>
                            <TableHead>Kode MK</TableHead>
                            <TableHead>Nama Mata Kuliah</TableHead>
                            <TableHead>Dosen</TableHead>
                            <TableHead>Ruangan</TableHead>
                            <TableHead>SKS</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {daySchedule.map((item, idx) => (
                            <TableRow key={idx}>
                              <TableCell className="font-medium">
                                {item.kelas?.jamMulai} - {item.kelas?.jamSelesai}
                              </TableCell>
                              <TableCell>{item.kelas?.mataKuliah?.kodeMk}</TableCell>
                              <TableCell>{item.kelas?.mataKuliah?.namaMk}</TableCell>
                              <TableCell>{item.kelas?.dosen?.namaLengkap}</TableCell>
                              <TableCell>{item.kelas?.ruangan?.namaRuangan || 'TBD'}</TableCell>
                              <TableCell>{item.kelas?.mataKuliah?.sks}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  );
                })}
              </div>
              
              {Object.values(jadwalData).flat().length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  {selectedSemester 
                    ? 'Tidak ada jadwal kuliah untuk semester yang dipilih.' 
                    : 'Silakan pilih semester untuk melihat jadwal kuliah.'}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}