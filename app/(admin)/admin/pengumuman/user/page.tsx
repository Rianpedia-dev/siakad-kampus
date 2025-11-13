import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, User } from "lucide-react";

export default function ManajemenUserPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Manajemen User</h1>
          <p className="text-muted-foreground">
            Kelola akun pengguna, reset password, dan set peran serta hak akses.
          </p>
        </div>
        <div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Tambah User
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">Daftar Pengguna</CardTitle>
          <div className="flex gap-2">
            <select className="border rounded-md px-3 py-2">
              <option value="">Semua Role</option>
              <option value="mahasiswa">Mahasiswa</option>
              <option value="dosen">Dosen</option>
              <option value="admin">Admin</option>
            </select>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cari user..."
                className="pl-8 pr-4 py-2 border rounded-md w-full md:w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="text-left py-3 px-4">ID</th>
                  <th className="text-left py-3 px-4">Username</th>
                  <th className="text-left py-3 px-4">Email</th>
                  <th className="text-left py-3 px-4">Role</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 px-4">1</td>
                  <td className="py-3 px-4">budi_2021</td>
                  <td className="py-3 px-4">budi.santoso@example.com</td>
                  <td className="py-3 px-4">mahasiswa</td>
                  <td className="py-3 px-4">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                      Aktif
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <Button variant="outline" size="sm">Reset Password</Button>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">2</td>
                  <td className="py-3 px-4">siti_dosen</td>
                  <td className="py-3 px-4">siti.rahayu@example.com</td>
                  <td className="py-3 px-4">dosen</td>
                  <td className="py-3 px-4">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                      Aktif
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <Button variant="outline" size="sm">Reset Password</Button>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">3</td>
                  <td className="py-3 px-4">admin_user</td>
                  <td className="py-3 px-4">admin@university.ac.id</td>
                  <td className="py-3 px-4">admin</td>
                  <td className="py-3 px-4">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                      Aktif
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <Button variant="outline" size="sm">Reset Password</Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}