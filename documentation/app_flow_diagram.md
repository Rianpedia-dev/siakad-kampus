USER FLOW DIAGRAM: 

graph TD
    Start([User Mengakses Sistem]) --> Login[Login Page]
    Login --> Auth{Autentikasi}
    Auth -->|Gagal| Login
    Auth -->|Berhasil| Role{Cek Role User}
    
    %% MAHASISWA FLOW
    Role -->|Mahasiswa| MhsDash[Dashboard Mahasiswa]
    MhsDash --> MhsMenu{Pilih Menu}
    
    MhsMenu -->|Akademik| MhsAkademik[Menu Akademik]
    MhsAkademik --> MhsAkademikOpt{Pilih Fitur}
    MhsAkademikOpt -->|KRS| KRS[Pengisian KRS]
    KRS --> KRSAction[Pilih Mata Kuliah]
    KRSAction --> KRSSubmit[Submit KRS]
    KRSSubmit --> KRSApproval{Menunggu Approval}
    KRSApproval -->|Disetujui| MhsDash
    KRSApproval -->|Ditolak| KRS
    
    MhsAkademikOpt -->|KHS| KHS[Lihat Kartu Hasil Studi]
    KHS --> KHSDetail[Detail Nilai per Semester]
    KHSDetail --> MhsDash
    
    MhsAkademikOpt -->|Jadwal| JadwalMhs[Lihat Jadwal Kuliah]
    JadwalMhs --> MhsDash
    
    MhsAkademikOpt -->|Presensi| PresensiMhs[Lihat Kehadiran]
    PresensiMhs --> MhsDash
    
    MhsAkademikOpt -->|Transkrip| Transkrip[Cetak Transkrip]
    Transkrip --> MhsDash
    
    MhsMenu -->|Perkuliahan| Perkuliahan[Menu Perkuliahan]
    Perkuliahan --> PerkuliahanOpt{Pilih Fitur}
    PerkuliahanOpt -->|Materi| Materi[Download Materi]
    Materi --> MhsDash
    PerkuliahanOpt -->|Tugas| Tugas[Upload Tugas]
    Tugas --> MhsDash
    
    MhsMenu -->|Keuangan| Keuangan[Status Pembayaran]
    Keuangan --> MhsDash
    
    MhsMenu -->|Profil| ProfilMhs[Edit Profil]
    ProfilMhs --> MhsDash
    
    MhsMenu -->|Logout| Logout[Keluar Sistem]
    
    %% DOSEN FLOW
    Role -->|Dosen| DsnDash[Dashboard Dosen]
    DsnDash --> DsnMenu{Pilih Menu}
    
    DsnMenu -->|Perkuliahan| DsnPerkuliahan[Menu Perkuliahan]
    DsnPerkuliahan --> DsnPerkOpt{Pilih Fitur}
    
    DsnPerkOpt -->|Presensi| InputPresensi[Input Presensi Mahasiswa]
    InputPresensi --> PilihKelas[Pilih Kelas]
    PilihKelas --> PilihPertemuan[Pilih Pertemuan]
    PilihPertemuan --> IsiPresensi[Isi Kehadiran]
    IsiPresensi --> SavePresensi[Simpan Data]
    SavePresensi --> DsnDash
    
    DsnPerkOpt -->|Nilai| InputNilai[Input Nilai]
    InputNilai --> PilihKelasNilai[Pilih Kelas]
    PilihKelasNilai --> PilihKomponen[Pilih Komponen Nilai]
    PilihKomponen --> IsiNilai[Isi Nilai Mahasiswa]
    IsiNilai --> SaveNilai[Simpan Nilai]
    SaveNilai --> DsnDash
    
    DsnPerkOpt -->|Materi| UploadMateri[Upload Materi Kuliah]
    UploadMateri --> DsnDash
    
    DsnPerkOpt -->|Tugas| BuatTugas[Buat Penugasan]
    BuatTugas --> LihatSubmission[Lihat Submission]
    LihatSubmission --> DsnDash
    
    DsnMenu -->|Jadwal| JadwalDosen[Lihat Jadwal Mengajar]
    JadwalDosen --> DsnDash
    
    DsnMenu -->|Mahasiswa| DaftarMhs[Daftar Mahasiswa]
    DaftarMhs --> DsnDash
    
    DsnMenu -->|Bimbingan| BimbinganAkademik[Mahasiswa Bimbingan]
    BimbinganAkademik --> DsnDash
    
    DsnMenu -->|Profil| ProfilDsn[Edit Profil]
    ProfilDsn --> DsnDash
    
    DsnMenu -->|Logout| Logout
    
    %% ADMIN FLOW
    Role -->|Admin| AdminDash[Dashboard Admin]
    AdminDash --> AdminMenu{Pilih Menu}
    
    AdminMenu -->|Master Data| MasterData[Menu Master Data]
    MasterData --> MasterOpt{Pilih Data}
    
    MasterOpt -->|Mahasiswa| DataMhs[Kelola Data Mahasiswa]
    DataMhs --> CRUDMhs{Pilih Aksi}
    CRUDMhs -->|Tambah| TambahMhs[Tambah Mahasiswa]
    TambahMhs --> AdminDash
    CRUDMhs -->|Edit| EditMhs[Edit Mahasiswa]
    EditMhs --> AdminDash
    CRUDMhs -->|Hapus| HapusMhs[Hapus Mahasiswa]
    HapusMhs --> AdminDash
    CRUDMhs -->|Import| ImportMhs[Import Excel]
    ImportMhs --> AdminDash
    
    MasterOpt -->|Dosen| DataDosen[Kelola Data Dosen]
    DataDosen --> AdminDash
    
    MasterOpt -->|Mata Kuliah| DataMK[Kelola Mata Kuliah]
    DataMK --> AdminDash
    
    MasterOpt -->|Ruangan| DataRuang[Kelola Ruangan]
    DataRuang --> AdminDash
    
    AdminMenu -->|Akademik| AdminAkademik[Menu Akademik]
    AdminAkademik --> AkademikOpt{Pilih Fitur}
    
    AkademikOpt -->|Penjadwalan| Jadwal[Buat Jadwal Kuliah]
    Jadwal --> InputJadwal[Input Jadwal]
    InputJadwal --> AssignDosen[Assign Dosen & Ruangan]
    AssignDosen --> PublishJadwal[Publish Jadwal]
    PublishJadwal --> AdminDash
    
    AkademikOpt -->|KRS| MonitorKRS[Monitoring KRS]
    MonitorKRS --> ApprovalKRS{Approve/Reject}
    ApprovalKRS -->|Approve| ApproveKRS[Setujui KRS]
    ApproveKRS --> AdminDash
    ApprovalKRS -->|Reject| RejectKRS[Tolak KRS]
    RejectKRS --> AdminDash
    
    AkademikOpt -->|Kelas| KelolaKelas[Kelola Kelas]
    KelolaKelas --> AdminDash
    
    AdminMenu -->|Keuangan| Pembayaran[Kelola Pembayaran]
    Pembayaran --> InputBayar[Input Pembayaran]
    InputBayar --> AdminDash
    
    AdminMenu -->|Laporan| LaporanMenu[Menu Laporan]
    LaporanMenu --> LaporanOpt{Pilih Laporan}
    LaporanOpt -->|Nilai| LapNilai[Laporan Nilai]
    LapNilai --> ExportNilai[Export PDF/Excel]
    ExportNilai --> AdminDash
    
    LaporanOpt -->|Kehadiran| LapPresensi[Laporan Kehadiran]
    LapPresensi --> AdminDash
    
    LaporanOpt -->|Keuangan| LapKeuangan[Laporan Keuangan]
    LapKeuangan --> AdminDash
    
    AdminMenu -->|Pengumuman| BuatPengumuman[Buat Pengumuman]
    BuatPengumuman --> PublishPengumuman[Publish]
    PublishPengumuman --> AdminDash
    
    AdminMenu -->|User| ManageUser[Kelola User]
    ManageUser --> AdminDash
    
    AdminMenu -->|Logout| Logout
    
    Logout --> End([Selesai])
    
    style Start fill:#e1f5ff
    style End fill:#e1f5ff
    style MhsDash fill:#c8e6c9
    style DsnDash fill:#fff9c4
    style AdminDash fill:#ffccbc
    style Login fill:#f3e5f5
    style Logout fill:#f3e5f5

