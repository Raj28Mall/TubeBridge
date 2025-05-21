"use client";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { FeatureCard } from "@/components/feature-card";
import { PricingCard } from "@/components/pricing-card";
import { ArrowRight, Upload, CheckCircle, Shield, Settings, LogOut, User, Check, X, UploadIcon, UsersIcon, VideoIcon, LifeBuoyIcon, ShieldCheckIcon, BarChartIcon, CalendarIcon, } from "lucide-react";
import { useUserStore } from "@/store/userStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Footer } from "@/components/footer";

const freeFeatures = [
  { icon: UploadIcon, text: "Basic uploads" },
  { icon: VideoIcon, text: "5 videos per month" },
  { icon: ShieldCheckIcon, text: "YouTube API integration" },
  { icon: LifeBuoyIcon, text: "Standard support" },
];

const proFeatures = [
  { icon: UploadIcon, text: "Unlimited uploads" },
  { icon: UsersIcon, text: "Team collaboration" },
  { icon: BarChartIcon, text: "Advanced analytics" },
  { icon: CalendarIcon, text: "Bulk scheduling" },
  { icon: LifeBuoyIcon, text: "Priority support" },
];

export default function LandingPage() {
  const user = useUserStore(state => state.user);
  const setUser=useUserStore(state=>state.setUser);

  const handleLogOut=()=>{
    setUser(null);
    window.location.href='/';
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-10">
          <div className="flex items-center gap-2">
            <Link href='/' className="flex items-center gap-2">
              <Image src="/logo.png" alt="Logo" width={35} height={35}/>
              <span className="text-xl font-bold">TubeBridge</span>
            </Link>
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
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="cursor-pointer" asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.picture} alt="User" />
                      <AvatarFallback>{(((user.name).split(" ")).map((n) => n[0])).join("")}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem className="cursor-pointer" asChild>
                      <Link href="/profile">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer" asChild>
                      <Link href="/profile">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer" onClick={handleLogOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild onClick={() => {}}>
                <Link href="/auth">Sign In</Link>
              </Button>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative overflow-hidden py-20 md:py-32 bg-slate-100">
          <div className="container relative z-10 mx-auto px-4 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Smarter Youtube Uploads.
              <br />
              <p className="text-blue-600">Built for Teams.</p>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
              Upload videos, review, approve, and publish – all in one place.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="h-12 px-8 py-3">
                <Link className="text-sans" href={!user?"/auth": user.role==='admin'?'/dashboard':'/content-manager'}>
                  {user? "Dashboard":"Get Started"}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="h-12 px-8 text-sans">
                Watch Demo
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
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-primary-foreground">
                  1
                </div>
                <h3 className="mt-4 text-xl font-bold">Upload</h3>
                <p className="mt-2 text-muted-foreground">
                  Content managers upload videos and add metadata like titles, descriptions, and tags.
                </p>
              </div>

              <div className="relative flex flex-col items-center rounded-lg bg-card p-6 text-center shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-primary-foreground">
                  2
                </div>
                <h3 className="mt-4 text-xl font-bold">Review</h3>
                <p className="mt-2 text-muted-foreground">
                  Admins review uploaded content and either approve, reject, or request changes.
                </p>
              </div>

              <div className="relative flex flex-col items-center rounded-lg bg-card p-6 text-center shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-primary-foreground">
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
                    <TableHead className="w-[300px] pl-4">Feature</TableHead>
                    <TableHead className="text-center">TubeBridge</TableHead>
                    <TableHead className="text-center">YouTube Studio</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium pl-5">Team Collaboration</TableCell>
                    <TableCell className="text-center">
                      <Check className="mx-auto h-5 w-5 text-green-600" />
                    </TableCell>
                    <TableCell className="text-center">
                      <X className="mx-auto h-5 w-5 text-red-600" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium pl-5">Advanced Scheduling</TableCell>
                    <TableCell className="text-center">
                      <Check className="mx-auto h-5 w-5 text-green-600" />
                    </TableCell>
                    <TableCell className="text-center">
                      <Check className="mx-auto h-5 w-5 text-green-600" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium pl-5">Admin Review Process</TableCell>
                    <TableCell className="text-center">
                      <Check className="mx-auto h-5 w-5 text-green-600" />
                    </TableCell>
                    <TableCell className="text-center">
                      <X className="mx-auto h-5 w-5 text-red-600" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium pl-5">Metadata Control</TableCell>
                    <TableCell className="text-center">
                      <Check className="mx-auto h-5 w-5 text-green-600" />
                    </TableCell>
                    <TableCell className="text-center">
                      <Check className="mx-auto h-5 w-5 text-green-600" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium pl-5">Role-Based Permissions</TableCell>
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

        <section id="use-case" className="py-20 bg-muted">
          <div className="container">
            <div className="mx-auto max-w-4xl">
              <div className="rounded-xl bg-white p-8 shadow-sm">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="md:w-1/3">
                    <div className="aspect-square rounded-full bg-blue-100 overflow-hidden">
                      <Image
                        src="/raj.jpeg"
                        alt="Raj, a content creator"
                        width={300}
                        height={300}
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                  <div className="md:w-2/3">
                    <h2 className="text-3xl font-bold tracking-tight mb-4">Meet Raj, a Growing Creator</h2>
                    <p className="text-lg text-slate-600 mb-4">
                      Raj runs a tech review channel with over 500,000 subscribers. As his channel grew, he hired
                      two editors and a content manager to help scale his production.
                    </p>
                    <p className="text-lg text-slate-600 mb-4">
                      Before TubeBridge, Raj had to share his YouTube credentials with his team, creating security
                      concerns. Uploads were often delayed because he needed to manually review and publish each video.
                    </p>
                    <p className="text-lg text-slate-600">
                      With TubeBridge, his team now uploads videos directly to the platform. Raj receives
                      notifications, reviews the content, and approves uploads with a single click. his publishing
                      schedule is now consistent, and his channel has grown by 30% since implementing this workflow.
                    </p>
                  </div>
                </div>
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
                features={freeFeatures}
                buttonText="Get Started"
                buttonVariant="outline"
                popular={false}
              />
              <PricingCard
                title="Pro"
                price="$19"
                period="per month"
                description="For content creators who need more power."
                features={proFeatures}
                buttonText="Start Free Trial"
                buttonVariant="default"
                popular={true}
              />
            </div>
          </div>
        </section>

        <section className="bg-blue-600 py-20 text-primary-foreground">
          <div className="container text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to Streamline Your YouTube Workflow?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-foreground/80">
              Join thousands of content creators who are saving time and publishing better content.
            </p>
            <Button asChild size="lg" variant="secondary" className="mt-10 h-12 px-8">
              <Link className="text-sans" href={!user?"/auth": user.role==='admin'?'/dashboard':'/content-manager'}>
                {user? "Get Started":"Get Started Today"}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />       
    </div>
  )
}

