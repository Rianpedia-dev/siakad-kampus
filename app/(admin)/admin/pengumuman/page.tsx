import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const pengumumanModules = [
  {
    title: "Manajemen Pengumuman",
    description: "Buat dan publikasikan pengumuman ke target audiens (semua, mahasiswa, dosen).",
    href: "/admin/pengumuman/pengumuman",
  },
  {
    title: "Penjadwalan",
    description: "Atur waktu publikasi, masa berlaku, dan pin pengumuman penting di dashboard pengguna.",
    href: "/admin/pengumuman/penjadwalan",
  },
  {
    title: "Notifikasi",
    description: "Sinkronkan dengan sistem notifikasi email/push agar pengguna mendapat informasi real-time.",
    href: "/admin/pengumuman/notifikasi",
  },
  {
    title: "Manajemen User",
    description: "Kelola akun pengguna, reset password, dan set peran serta hak akses.",
    href: "/admin/pengumuman/user",
  },
];

export default function AdminPengumumanPage() {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Pengumuman & Manajemen User</h1>
        <p className="text-sm text-muted-foreground">
          Komunikasi terpusat dan pengelolaan hak akses pengguna SIAKAD kampus.
        </p>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        {pengumumanModules.map((module) => (
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

