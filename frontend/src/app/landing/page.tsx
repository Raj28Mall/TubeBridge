"use client";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { FeatureCard } from "@/components/feature-card";
import { PricingCard } from "@/components/pricing-card";
import { ArrowRight, Upload, CheckCircle, Shield } from "lucide-react";
import { useUserStore } from "@/store/userStore";

export default function LandingPage() {
  const user = useUserStore(state => state.user);
  
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-10">
          <div className="flex items-center gap-2">
            <Image src="/logo.jpeg" alt="Logo" width={50} height={50}/>
            <span className="text-xl font-bold">TubeBridge</span>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="#features" className="text-sm font-medium hover:underline">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium hover:underline">
              How It Works
            </Link>
            <Link href="#pricing" className="text-sm font-medium hover:underline">
              Pricing
            </Link>
            <Button asChild>
              <Link href="/auth">Sign In</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative overflow-hidden py-20 md:py-32 bg-slate-100">
          <div className="container relative z-10 mx-auto px-4 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Effortless YouTube Uploads
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
              Upload videos, review, approve, and publish – all in one place.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="h-12 px-8">
                <Link className="text-sans" href={!user?"/auth": user.role==='admin'?'/dashboard':'/content-manager'}>
                  {user? "Dashboard":"Get Started"}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="h-12 px-8 text-sans">
                Learn More
              </Button>
            </div>
          </div>

          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background"></div>
        </section>

        <section id="features" className="py-20 px-10">
          <div className="container">
            <div className="mx-auto mb-16 max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Powerful Features for Content Creators</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Everything you need to streamline your YouTube publishing workflow.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <FeatureCard
                icon={<Upload className="h-10 w-10 text-blue-600" />}
                title="Automate Uploads"
                description="Schedule and upload videos without manual effort. Set it and forget it."
              />
              <FeatureCard
                icon={<CheckCircle className="h-10 w-10 text-blue-600" />}
                title="Approval Workflow"
                description="Control what gets published on your channel with a robust review process."
              />
              <FeatureCard
                icon={<Shield className="h-10 w-10 text-blue-600" />}
                title="Secure & Reliable"
                description="Encrypted API communication ensures your content and account remain safe."
              />
            </div>
          </div>
        </section>

        <section id="how-it-works" className="bg-muted py-20 px-12">
          <div className="container">
            <div className="mx-auto mb-16 max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">How It Works</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                A simple three-step process to get your content on YouTube.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <div className="relative flex flex-col items-center rounded-lg bg-card p-6 text-center shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500 text-xl font-bold text-primary-foreground">
                  1
                </div>
                <h3 className="mt-4 text-xl font-bold">Upload</h3>
                <p className="mt-2 text-muted-foreground">
                  Content managers upload videos and add metadata like titles, descriptions, and tags.
                </p>
              </div>

              <div className="relative flex flex-col items-center rounded-lg bg-card p-6 text-center shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500 text-xl font-bold text-primary-foreground">
                  2
                </div>
                <h3 className="mt-4 text-xl font-bold">Review</h3>
                <p className="mt-2 text-muted-foreground">
                  Admins review uploaded content and either approve, reject, or request changes.
                </p>
              </div>

              <div className="relative flex flex-col items-center rounded-lg bg-card p-6 text-center shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500 text-xl font-bold text-primary-foreground">
                  3
                </div>
                <h3 className="mt-4 text-xl font-bold">Publish</h3>
                <p className="mt-2 text-muted-foreground">
                  Approved videos are automatically published to YouTube on schedule.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="py-20">
          <div className="container">
            <div className="mx-auto mb-16 max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Simple, Transparent Pricing</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Choose the plan that&apos;s right for your content strategy.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:max-w-4xl lg:mx-auto">
              <PricingCard
                title="Free"
                price="$0"
                description="Perfect for individuals just getting started."
                features={[
                  "Basic uploads",
                  "Single-user access",
                  "5 videos per month",
                  "Standard support",
                  "YouTube API integration",
                ]}
                buttonText="Get Started"
                buttonVariant="outline"
              />

              <PricingCard
                title="Pro"
                price="$19"
                period="per month"
                description="For content creators who need more power."
                features={[
                  "Unlimited uploads",
                  "Team collaboration",
                  "Priority support",
                  "Advanced analytics",
                  "Bulk scheduling",
                ]}
                buttonText="Start Free Trial"
                buttonVariant="default"
                popular={true}
              />
            </div>
          </div>
        </section>

        <section className="bg-red-500 py-20 text-primary-foreground">
          <div className="container text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to Streamline Your YouTube Workflow?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-foreground/80">
              Join thousands of content creators who are saving time and publishing better content.
            </p>
            <Button asChild size="lg" variant="secondary" className="mt-10 h-12 px-8">
              <Link className="text-sans" href="/auth">
                Get Started Today
                <ArrowRight className="h-4 w-4 mr-1" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="mt-6 mb-8 mx-10">
        <div className="container">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-0">
              <Image src="/logo.jpeg" alt="Logo" width={40} height={40} />
              <span className="text-lg font-bold">TubeBridge</span>
            </div>
            <div className="flex gap-6 pl-30">
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Terms
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Contact
              </Link>
            </div>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} TubeBridge. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

