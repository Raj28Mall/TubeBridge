import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Check, X, Upload, Calendar, Bell, Users, FileEdit } from "lucide-react"

export const metadata = {
  title: "Learn More | TubeBridge",
  description: "Learn how TubeBridge helps you manage YouTube uploads collaboratively",
}

export default function LearnMorePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Upload className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold">TubeBridge</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#how-it-works" className="text-sm font-medium hover:text-blue-600">
              How It Works
            </Link>
            <Link href="#features" className="text-sm font-medium hover:text-blue-600">
              Features
            </Link>
            <Link href="#comparison" className="text-sm font-medium hover:text-blue-600">
              Comparison
            </Link>
            <Link href="#use-case" className="text-sm font-medium hover:text-blue-600">
              Use Case
            </Link>
            <Button asChild>
              <Link href="/auth">Sign In</Link>
            </Button>
          </nav>
          <Button className="md:hidden" variant="ghost" size="icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 bg-gradient-to-b from-blue-50 to-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Smarter YouTube Uploads.
              <br />
              <span className="text-blue-600">Built for Teams.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 md:text-xl">
              TubeBridge lets you schedule, manage, and review uploads collaboratively — all in one place.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="h-12 px-8">
                <Link href="/auth">Get Started</Link>
              </Button>
              <Button variant="outline" size="lg" className="h-12 px-8">
                Watch Demo
              </Button>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20">
          <div className="container">
            <div className="mx-auto mb-10 max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">How TubeBridge Works</h2>
              <p className="mt-4 text-lg text-slate-600">A quick look at your new collaborative upload workflow.</p>
            </div>

            <div className="mx-auto max-w-4xl">
              <div className="rounded-lg border bg-white p-4 shadow-sm">
                <Image
                  src="/workflow.png"
                  alt="TubeBridge workflow diagram showing the upload and approval process"
                  width={1000}
                  height={400}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Key Features Section */}
        <section id="features" className="py-20 bg-slate-50">
          <div className="container">
            <div className="mx-auto mb-16 max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Key Features</h2>
              <p className="mt-4 text-lg text-slate-600">
                Everything you need to streamline your YouTube publishing workflow.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle>Team-Based Uploads</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription>
                    Invite team members with specific roles and permissions to collaborate on your channel.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                    <Calendar className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle>Smart Scheduling</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription>
                    Plan your content calendar and schedule uploads for optimal audience engagement.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                    <FileEdit className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle>Admin Metadata Review</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription>
                    Review and edit titles, descriptions, tags, and thumbnails before publishing.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                    <Bell className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle>Email Notifications</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription>
                    Stay informed with automated notifications for uploads, approvals, and rejections.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Comparison Table Section */}
        <section id="comparison" className="py-20">
          <div className="container">
            <div className="mx-auto mb-16 max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">What Makes TubeBridge Better</h2>
              <p className="mt-4 text-lg text-slate-600">
                See how TubeBridge compares to YouTube Studio for team-based content creation.
              </p>
            </div>

            <div className="mx-auto max-w-3xl overflow-hidden rounded-lg border shadow">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Feature</TableHead>
                    <TableHead className="text-center">TubeBridge</TableHead>
                    <TableHead className="text-center">YouTube Studio</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Team Collaboration</TableCell>
                    <TableCell className="text-center">
                      <Check className="mx-auto h-5 w-5 text-green-600" />
                    </TableCell>
                    <TableCell className="text-center">
                      <X className="mx-auto h-5 w-5 text-red-600" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Advanced Scheduling</TableCell>
                    <TableCell className="text-center">
                      <Check className="mx-auto h-5 w-5 text-green-600" />
                    </TableCell>
                    <TableCell className="text-center">
                      <Check className="mx-auto h-5 w-5 text-green-600" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Admin Review Process</TableCell>
                    <TableCell className="text-center">
                      <Check className="mx-auto h-5 w-5 text-green-600" />
                    </TableCell>
                    <TableCell className="text-center">
                      <X className="mx-auto h-5 w-5 text-red-600" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Metadata Control</TableCell>
                    <TableCell className="text-center">
                      <Check className="mx-auto h-5 w-5 text-green-600" />
                    </TableCell>
                    <TableCell className="text-center">
                      <Check className="mx-auto h-5 w-5 text-green-600" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Role-Based Permissions</TableCell>
                    <TableCell className="text-center">
                      <Check className="mx-auto h-5 w-5 text-green-600" />
                    </TableCell>
                    <TableCell className="text-center">
                      <X className="mx-auto h-5 w-5 text-red-600" />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </section>

        {/* Use Case Section */}
        <section id="use-case" className="py-20 bg-slate-50">
          <div className="container">
            <div className="mx-auto max-w-4xl">
              <div className="rounded-xl bg-white p-8 shadow-sm">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="md:w-1/3">
                    <div className="aspect-square rounded-full bg-blue-100 overflow-hidden">
                      <Image
                        src="/placeholder.svg?height=300&width=300"
                        alt="Ananya, a content creator"
                        width={300}
                        height={300}
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                  <div className="md:w-2/3">
                    <h2 className="text-3xl font-bold tracking-tight mb-4">Meet Ananya, a Growing Creator</h2>
                    <p className="text-lg text-slate-600 mb-4">
                      Ananya runs a tech review channel with over 500,000 subscribers. As her channel grew, she hired
                      two editors and a content manager to help scale her production.
                    </p>
                    <p className="text-lg text-slate-600 mb-4">
                      Before TubeBridge, Ananya had to share her YouTube credentials with her team, creating security
                      concerns. Uploads were often delayed because she needed to manually review and publish each video.
                    </p>
                    <p className="text-lg text-slate-600">
                      With TubeBridge, her team now uploads videos directly to the platform. Ananya receives
                      notifications, reviews the content, and approves uploads with a single click. Her publishing
                      schedule is now consistent, and her channel has grown by 30% since implementing this workflow.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="bg-blue-600 py-20 text-white">
          <div className="container text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ready to level up your YouTube workflow?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
              Join thousands of content creators who are saving time and publishing better content.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="h-12 px-8 bg-white text-blue-600 hover:bg-white/90"
              >
                <Link href="/auth">Start Free Trial</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 px-8 border-white text-white hover:bg-white/10"
              >
                <Link href="/contact">Book a Demo</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-12 bg-slate-900 text-white">
        <div className="container">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              <span className="text-lg font-bold">TubeBridge</span>
            </div>
            <div className="flex gap-6">
              <Link href="#" className="text-sm text-slate-300 hover:text-white">
                Terms
              </Link>
              <Link href="#" className="text-sm text-slate-300 hover:text-white">
                Privacy
              </Link>
              <Link href="#" className="text-sm text-slate-300 hover:text-white">
                Contact
              </Link>
            </div>
            <div className="text-sm text-slate-300">© {new Date().getFullYear()} TubeBridge. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
