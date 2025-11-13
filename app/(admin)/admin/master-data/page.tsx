import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const masterDataModules = [
  {
    title: "Data Mahasiswa",
    description: "CRUD data mahasiswa, import dari Excel, dan integrasi dengan akun pengguna.",
    href: "/admin/master-data/mahasiswa",
  },
  {
    title: "Data Dosen",
    description: "Kelola dosen, penugasan mengajar, dan penetapan dosen pembimbing akademik.",
    href: "/admin/master-data/dosen",
  },
  {
    title: "Mata Kuliah",
    description: "Atur mata kuliah, SKS, kurikulum per prodi, serta mapping ke semester.",
    href: "/admin/master-data/mata-kuliah",
  },
  {
    title: "Ruangan",
    description: "Manajemen data ruangan, kapasitas, dan fasilitas kelas.",
    href: "/admin/master-data/ruangan",
  },
  {
    title: "Program Studi",
    description: "Manajemen data program studi, kaprodi, dan informasi akreditasi.",
    href: "/admin/master-data/prodi",
  },
];

export default function AdminMasterDataPage() {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Manajemen Master Data</h1>
        <p className="text-sm text-muted-foreground">
          Kelola seluruh data referensi akademik kampus secara terpusat dan konsisten.
        </p>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        {masterDataModules.map((module) => (
          <Link href={module.href} key={module.title}>
            <Card className="border-border/60 hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{module.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground leading-relaxed">
                {module.description}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}

