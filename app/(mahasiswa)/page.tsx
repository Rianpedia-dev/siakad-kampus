import { redirect } from "next/navigation";

import { getAuthSession } from "@/lib/auth";

export default async function MahasiswaIndexPage() {
  const session = await getAuthSession();

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "mahasiswa") {
    redirect("/unauthorized");
  }

  redirect("/mahasiswa/dashboard");
}

