import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Upload, BarChart3 } from "lucide-react"
import { LandingPageHeader } from "@/components/landing-page-header"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center bg-background">
      <LandingPageHeader />

      {/* Hero Section */}
      <section className="flex-1">
        <div className="container flex flex-col items-center justify-center gap-6 px-4 py-24 text-center md:px-6 md:py-32 lg:py-40">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            Unlock Insights from Your <br className="hidden sm:inline" />
            Bank Statements
          </h1>
          <p className="mx-auto max-w-[700px] text-lg text-muted-foreground md:text-xl">
            AI-powered credit transaction extraction and analysis. Upload your statements and get organized results instantly.
          </p>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
            <Link href="/register">
              <Button size="lg" className="gap-2">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t bg-muted/40 w-full">
        <div className="container py-20 md:py-24 lg:py-32">
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tight md:mb-16 md:text-4xl">
            Simple Steps to Financial Clarity
          </h2>
          <div className="grid gap-10 md:grid-cols-3 md:gap-12">
            <div className="flex flex-col items-center text-center">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 p-3">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">1. Upload Statements</h3>
              <p className="text-muted-foreground">Securely upload your bank statements in PDF or CSV format.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 p-3">
                <Image
                  src="/logo-no-text.svg"
                  alt="AI Processing Icon"
                  width={24}
                  height={24}
                  className="h-6 w-6 text-primary"
                />
              </div>
              <h3 className="mb-2 text-xl font-semibold">2. AI Processing</h3>
              <p className="text-muted-foreground">Our AI validates and extracts credit transactions automatically.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 p-3">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">3. Analyze Results</h3>
              <p className="text-muted-foreground">
                View and analyze your credit transactions in an organized dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Added Content Section - Simplified Layout */}
      <section className="py-20 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="mx-auto mb-12 max-w-3xl text-center md:mb-16">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Go Beyond Extraction
            </h2>
            <p className="mt-4 text-muted-foreground md:text-lg">
              Explore advanced analytics, detailed reporting, budget tracking, and more. Our platform simplifies your financial tracking.
            </p>
          </div>
          {/* Simplified two-column grid for features */}
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:gap-x-12">
            {/* Feature 1 */}
            <div>
              <h3 className="text-xl font-semibold">Advanced Analytics</h3>
              <p className="mt-2 text-muted-foreground">
                Gain deeper insights into your spending patterns with comprehensive analytical tools.
              </p>
            </div>
            {/* Feature 2 */}
            <div>
              <h3 className="text-xl font-semibold">Custom Reports</h3>
              <p className="mt-2 text-muted-foreground">
                Generate tailored reports for tax purposes, expense tracking, or personal review.
              </p>
            </div>
            {/* Feature 3 */}
            <div>
              <h3 className="text-xl font-semibold">Budget Tracking</h3>
              <p className="mt-2 text-muted-foreground">
                Set financial goals, create budgets, and monitor your progress effortlessly.
              </p>
            </div>
            {/* Feature 4 */}
            <div>
              <h3 className="text-xl font-semibold">Priority Support</h3>
              <p className="mt-2 text-muted-foreground">
                Get faster assistance and dedicated help from our expert support team.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} deposily. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link href="/about" className="hover:underline">
              About
            </Link>
            <Link href="/privacy" className="hover:underline">
              Privacy
            </Link>
            <Link href="/terms" className="hover:underline">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
