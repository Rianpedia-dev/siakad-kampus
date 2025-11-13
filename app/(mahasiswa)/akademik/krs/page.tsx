'use client';

import { useState, useEffect, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSession } from '@/lib/auth-client'; // Changed from next-auth/react to auth-client
import { 
  addClassToKrs,
  removeClassFromKrs,
  submitKrs
} from '@/lib/actions/krs-actions';
import { Search, Plus, Trash2, CheckCircle, XCircle, Clock } from 'lucide-react'; // Removed Calendar

// Define types based on database schema
type Mahasiswa = { // This type is actually used in the component, so keep it.
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

type Krs = {
  id: number;
  mahasiswaId: number;
  tahunAkademikId: number;
  totalSks: number;
  status: string;
  approvedBy?: number;
  approvedAt?: Date;
  catatan?: string;
  createdAt: Date;
  updatedAt: Date;
  tahunAkademik?: {
    tahun: string;
    semester: string;
  };
};

type KrsDetail = {
  id: number;
  krsId: number;
  kelasId: number;
  createdAt: Date;
  kelas?: {
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
    mataKuliah?: {
      id: number;
      kodeMk: string;
      namaMk: string;
      sks: number;
      semester: number;
    };
    dosen?: {
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

type AvailableClass = {
  kelasId: number;
  kodeKelas: string;
  hari?: string;
  jamMulai?: string;
  jamSelesai?: string;
  kapasitas: number;
  kuota: number;
  mataKuliahId: number;
  kodeMk: string;
  namaMk: string;
  sks: number;
  semester: number;
  jenis?: string;
  dosenId: number;
  namaDosen: string;
  kodeRuangan?: string;
  namaRuangan?: string;
};

type TahunAkademikAktif = { // Defined type for tahunAkademikAktif
  id: number;
  tahun: string;
  semester: string;
  tanggalMulai: Date;
  tanggalSelesai: Date;
  isActive: boolean;
  createdAt: Date;
};

export default function KrsPage() {
  const { data: session, status: sessionStatus } = useSession(); // Changed
  const [tahunAkademikAktif, setTahunAkademikAktif] = useState<TahunAkademikAktif | null>(null); // Typed
  const [krsAktif, setKrsAktif] = useState<Krs | null>(null);
  const [krsDetails, setKrsDetails] = useState<KrsDetail[]>([]);
  const [availableClasses, setAvailableClasses] = useState<AvailableClass[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSemester, setSelectedSemester] = useState<string>('all');
  const [totalSks, setTotalSks] = useState(0);
  const [isSubmitting, startSubmitting] = useTransition();
  const [isAdding, startAdding] = useTransition();
  const [isRemoving, startRemoving] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Load initial data when session is available
  useEffect(() => {
    if (sessionStatus === 'authenticated' && session?.user?.id) {
      loadInitialData(session.user.id);
    } else if (sessionStatus === 'unauthenticated') {
      setError('Anda harus login untuk melihat halaman ini.');
    }
  }, [session, sessionStatus]); // Added session to dependencies

  const loadInitialData = async (userId: string) => { // Added userId parameter
    if (!userId) {
      setError('User ID tidak ditemukan. Harap login kembali.');
      return;
    }
    try {
      setError(null);
      const response = await fetch(`/api/krs?userId=${userId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'Gagal memuat data KRS');
        return;
      }
      
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
        return;
      }
      
      setTahunAkademikAktif(data.tahunAkademikAktif);
      setKrsAktif(data.krsAktif);
      setKrsDetails(data.krsDetails);
      setAvailableClasses(data.availableClasses);
      setTotalSks(data.totalSks);
    } catch (err) {
      setError('Gagal memuat data KRS');
      console.error('Error loading data:', err);
    }
  };

  const handleAddClass = (kelasId: number) => {
    if (!session?.user?.id) {
      setError('User ID tidak ditemukan. Harap login kembali.');
      return;
    }
    startAdding(() => {
      addClassToKrs(session.user.id, kelasId) // Pass userId
        .then(result => {
          if (result.error) {
            setError(result.error);
          } else {
            setSuccess('Kelas berhasil ditambahkan ke KRS');
            loadInitialData(session.user.id); // Refresh data, pass userId
          }
        })
        .catch(err => {
          setError('Gagal menambahkan kelas ke KRS');
          console.error('Error adding class:', err);
        });
    });
  };

  const handleRemoveClass = (krsDetailId: number) => { // Removed unused kelasId
    if (!session?.user?.id) {
      setError('User ID tidak ditemukan. Harap login kembali.');
      return;
    }
    startRemoving(() => {
      removeClassFromKrs(krsDetailId)
        .then(result => {
          if (result.error) {
            setError(result.error);
          } else {
            setSuccess('Kelas berhasil dihapus dari KRS');
            loadInitialData(session.user.id); // Refresh data, pass userId
          }
        })
        .catch(err => {
          setError('Gagal menghapus kelas dari KRS');
          console.error('Error removing class:', err);
        });
    });
  };

  const handleSubmitKrs = () => {
    if (!krsAktif) return;
    
    startSubmitting(() => {
      submitKrs(krsAktif.id)
        .then(result => {
          if (result.error) {
            setError(result.error);
          } else {
            setSuccess('KRS berhasil diajukan untuk persetujuan');
            // Update local state
            setKrsAktif({ ...krsAktif, status: 'submitted' });
          }
        })
        .catch(err => {
          setError('Gagal mengirim KRS');
          console.error('Error submitting KRS:', err);
        });
    });
  };

  // Calculate total SKS
  useEffect(() => {
    const total = krsDetails.reduce((sum, detail) => {
      return sum + (detail.kelas?.mataKuliah?.sks || 0);
    }, 0);
    setTotalSks(total);
  }, [krsDetails]);

  // Filter available classes based on search and semester
  const filteredClasses = availableClasses.filter(cls => {
    const matchesSearch = cls.namaMk.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          cls.kodeMk.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSemester = selectedSemester === 'all' || cls.semester.toString() === selectedSemester;
    return matchesSearch && matchesSemester;
  });

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

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Kartu Rencana Studi (KRS)</h1>
        <p className="text-sm text-muted-foreground">
          Pilih mata kuliah, susun jadwal, dan ajukan KRS untuk disetujui oleh dosen PA.
        </p>
      </header>

      {/* Error/Success Messages */}
      {error && (
        <Card className="border-red-500 bg-red-50">
          <CardContent className="p-4 text-red-700">
            {error}
          </CardContent>
        </Card>
      )}
      
      {success && (
        <Card className="border-green-500 bg-green-50">
          <CardContent className="p-4 text-green-700">
            {success}
          </CardContent>
        </Card>
      )}

      {/* Status & Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Informasi KRS</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Tahun Akademik</Label>
              <p className="text-sm font-medium">
                {tahunAkademikAktif ? `${tahunAkademikAktif.tahun} - ${tahunAkademikAktif.semester}` : 'Belum Tersedia'}
              </p>
            </div>
            <div>
              <Label>Status KRS</Label>
              <div className="flex items-center gap-2">
                {krsAktif ? (
                  <>
                    {krsAktif.status === 'draft' && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Draft
                      </Badge>
                    )}
                    {krsAktif.status === 'submitted' && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Menunggu Persetujuan
                      </Badge>
                    )}
                    {krsAktif.status === 'approved' && (
                      <Badge className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Disetujui
                      </Badge>
                    )}
                    {krsAktif.status === 'rejected' && (
                      <Badge variant="destructive" className="flex items-center gap-1">
                        <XCircle className="h-3 w-3" />
                        Ditolak
                      </Badge>
                    )}
                  </>
                ) : (
                  <Badge variant="outline">Belum Dibuat</Badge>
                )}
              </div>
            </div>
            <div>
              <Label>Total SKS</Label>
              <p className="text-sm font-medium">{totalSks} SKS</p>
            </div>
          </div>
          
          {krsAktif?.status === 'draft' && (
            <div className="mt-4 flex gap-2">
              <Button 
                onClick={handleSubmitKrs} 
                disabled={isSubmitting || krsDetails.length === 0}
              >
                {isSubmitting ? 'Mengirim...' : 'Ajukan KRS'}
              </Button>
              <Button variant="outline" disabled>
                Simpan Draft
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="krs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="krs">KRS Saya</TabsTrigger>
          <TabsTrigger value="available">Mata Kuliah Tersedia</TabsTrigger>
        </TabsList>
        
        <TabsContent value="krs" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Mata Kuliah Terdaftar</CardTitle>
              <div className="text-sm">
                Jumlah: {krsDetails.length} MK | Total SKS: {totalSks}
              </div>
            </CardHeader>
            <CardContent>
              {krsDetails.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Kode MK</TableHead>
                      <TableHead>Nama Mata Kuliah</TableHead>
                      <TableHead>SKS</TableHead>
                      <TableHead>Dosen</TableHead>
                      <TableHead>Hari & Jam</TableHead>
                      <TableHead>Ruangan</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {krsDetails.map((detail) => (
                      <TableRow key={detail.id}>
                        <TableCell className="font-medium">
                          {detail.kelas?.mataKuliah?.kodeMk}
                        </TableCell>
                        <TableCell>{detail.kelas?.mataKuliah?.namaMk}</TableCell>
                        <TableCell>{detail.kelas?.mataKuliah?.sks}</TableCell>
                        <TableCell>{detail.kelas?.dosen?.namaLengkap}</TableCell>
                        <TableCell>
                          {detail.kelas?.hari}, {detail.kelas?.jamMulai} - {detail.kelas?.jamSelesai}
                        </TableCell>
                        <TableCell>{detail.kelas?.ruangan?.namaRuangan}</TableCell>
                        <TableCell>
                          {krsAktif?.status === 'draft' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemoveClass(detail.id)}
                              disabled={isRemoving}
                            >
                              {isRemoving ? (
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Belum ada mata kuliah yang terdaftar. Pilih dari daftar mata kuliah tersedia.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="available" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mata Kuliah Tersedia</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="flex-1">
                  <Label htmlFor="search">Cari Mata Kuliah</Label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Cari berdasarkan kode atau nama mata kuliah..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="semester">Filter Semester</Label>
                  <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Semua Semester" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Semester</SelectItem>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                        <SelectItem key={sem} value={sem.toString()}>
                          Semester {sem}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <ScrollArea className="h-[400px] rounded-md border">
                <Table>
                  <TableHeader className="sticky top-0 bg-background">
                    <TableRow>
                      <TableHead>Kode MK</TableHead>
                      <TableHead>Nama Mata Kuliah</TableHead>
                      <TableHead>SKS</TableHead>
                      <TableHead>Semester</TableHead>
                      <TableHead>Dosen</TableHead>
                      <TableHead>Hari & Jam</TableHead>
                      <TableHead>Ruangan</TableHead>
                      <TableHead>Kapasitas</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClasses.map((cls) => (
                      <TableRow key={cls.kelasId}>
                        <TableCell className="font-medium">{cls.kodeMk}</TableCell>
                        <TableCell>{cls.namaMk}</TableCell>
                        <TableCell>{cls.sks}</TableCell>
                        <TableCell>Semester {cls.semester}</TableCell>
                        <TableCell>{cls.namaDosen}</TableCell>
                        <TableCell>
                          {cls.hari}, {cls.jamMulai} - {cls.jamSelesai}
                        </TableCell>
                        <TableCell>{cls.namaRuangan || cls.kodeRuangan}</TableCell>
                        <TableCell>
                          {cls.kuota}/{cls.kapasitas}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            onClick={() => handleAddClass(cls.kelasId)}
                            disabled={isAdding || (krsAktif?.status !== 'draft' && krsAktif?.status !== undefined)}
                          >
                            {isAdding ? (
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            ) : (
                              <Plus className="h-4 w-4" />
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
              
              {filteredClasses.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  Tidak ada mata kuliah yang ditemukan.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}