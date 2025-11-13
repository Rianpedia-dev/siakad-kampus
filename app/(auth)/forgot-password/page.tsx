"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      // TODO: connect with password reset API
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setMessage({
        type: "success",
        text: "Jika email terdaftar, tautan reset password telah dikirim.",
      });
      setEmail("");
    } catch {
      setMessage({
        type: "error",
        text: "Terjadi kesalahan, mohon coba kembali.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold">Reset Kata Sandi</CardTitle>
          <CardDescription>Masukkan email terdaftar untuk menerima tautan reset password</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {message && (
              <Alert variant={message.type === "success" ? "default" : "destructive"}>
                <AlertDescription>{message.text}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Mengirim tautan...
                </>
              ) : (
                "Kirim Tautan Reset"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center">
          <Link href="/login" className="text-sm text-primary hover:underline">
            Kembali ke halaman login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

