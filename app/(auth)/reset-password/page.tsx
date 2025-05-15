"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle } from "lucide-react"

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // This is a placeholder for the actual password reset logic
    // You would integrate with better-auth here
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setIsSubmitted(true)
    } catch (error) {
      console.error("Password reset request failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link href="/" className="absolute left-4 top-4 md:left-8 md:top-8">
        <Button variant="ghost" className="gap-2">
          <Image src="/logo-text-only.svg" alt="deposily" width={100} height={30} className="h-6 w-auto" />
        </Button>
      </Link>

      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
          <CardDescription>
            {isSubmitted ? "Check your email for a reset link" : "Enter your email to receive a password reset link"}
          </CardDescription>
        </CardHeader>

        {isSubmitted ? (
          <CardContent className="flex flex-col items-center justify-center py-6">
            <CheckCircle className="mb-4 h-12 w-12 text-primary" />
            <p className="text-center">
              We&apos;ve sent a password reset link to <strong>{email}</strong>. Please check your email and follow the
              instructions.
            </p>
          </CardContent>
        ) : (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending reset link...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </Button>
              <div className="text-center text-sm">
                Remember your password?{" "}
                <Link href="/login" className="text-primary hover:underline">
                  Back to login
                </Link>
              </div>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  )
}
