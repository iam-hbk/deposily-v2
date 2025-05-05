"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Loader, ArrowLeft } from "lucide-react";
import { signIn } from "@/lib/auth-client";
import { toast } from "sonner";

type AuthResponse = {
  data: {
    user: {
      id: string;
      email: string;
    };
  } | null;
  error?: {
    code: string;
    message: string;
    status: number;
    statusText: string;
  };
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const result = await signIn.email(credentials) as AuthResponse;
      if (result instanceof Error || (result?.error?.message)) {
        const error = result instanceof Error ? result : new Error(result.error?.message || "Login failed");
        throw error;
      }
      return result;
    },
    onSuccess: (data: AuthResponse) => {
      if (!data || !data.data) {
        toast.error("Login failed - Invalid response from server");
        return;
      }
      toast.success("Login successful");
      router.push("/dashboard");
    },
    onError: (error: Error) => {
      console.error("Login failed:", error);
      toast.error(error.message || "Failed to login. Please try again.");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="justify-start absolute top-4 left-0">
          <Button variant="link" className="self-start" asChild>
            <Link href="/" className="mb-4 flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Home
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col justify-center p-6 md:p-8 lg:p-10"
          >
            <div className="mb-6 flex flex-col items-center text-center">
              <h1 className="text-2xl font-bold">Welcome back</h1>
              <p className="text-balance text-sm text-muted-foreground">
                Login to your deposily account
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loginMutation.isPending}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/reset-password"
                    className="ml-auto text-sm text-primary underline-offset-2 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loginMutation.isPending}
                />
              </div>
              <Button
                type="submit"
                className="mt-4 w-full"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="text-primary underline underline-offset-4 hover:text-primary/90"
                >
                  Sign up
                </Link>
              </div>
            </div>
          </form>

          {/* <div className="relative hidden items-center justify-center md:flex md:border-l">
            <Image
              src="/logo-with-text.svg"
              alt="Deposily Logo"
              width={160}
              height={160}
              className="max-w-full object-contain"
            />
          </div> */}
        </CardContent>
      </Card>
    </div>
  );
}
