"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useRouter, useSearchParams } from "next/navigation"


const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const FRONTEND_URL = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
const REDIRECT_URI = `${FRONTEND_URL}/auth/google/callback`;
const BACKEND_API_URL = "http://127.0.0.1:5000/api/auth/google/exchange";

export default function AuthPage() {  
  const [selectedRole, setSelectedRole] = useState("admin");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // This component might be rendered *on* /auth/google/callback
    // The effect will run when the component mounts after the redirect
    const authCode = searchParams.get("code");
    if (authCode) {
      // Optionally, clear the code from the URL after processing
      // router.replace('/auth/google/callback', undefined, { shallow: true });
      handleCredentialResponse(authCode);
    }
  }, [searchParams, router]); // Add router to dependencies if used inside

  const handleLogin = () => {
    const scope = "openid email profile";
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=${encodeURIComponent(scope)}&access_type=offline&prompt=consent`; // Added prompt=consent for refresh token
    window.location.href = authUrl;
  };

  const handleCredentialResponse = async (authCode) => {
    // Get role from state *at the time of the call*
    const roleToSend = selectedRole;
    console.log(`Sending code: ${authCode} and role: ${roleToSend} to backend...`);
    try {
      const res = await fetch(BACKEND_API_URL, { // Use the new backend API endpoint
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: authCode, role: roleToSend }),
      });
      const data = await res.json();
      console.log("Backend Response:", data);

      if (!res.ok) {
          throw new Error(data.error || `HTTP error! status: ${res.status}`);
      }

      console.log(`Login successful for role: ${roleToSend}`);
      if (roleToSend === "admin") {
        router.push(`/dashboard`);
      } else {
        router.push(`/content-manager`);
      }

    } catch (error) {
      console.error("Error exchanging auth code:", error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-0 my-0 ">
      <Card className="w-full max-w-md pb-6 pt-0">
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2 gap-x-2">
            <TabsTrigger className=" rounded-sm" value="signin">Sign In</TabsTrigger>
            <TabsTrigger className=" rounded-sm" value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <CardHeader>
              <CardTitle className="text-2xl  mt-4 pb-0 mb-0">Sign In</CardTitle>
              <CardDescription>Sign in to your account using Google OAuth</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pb-8 pt-4">
              <Button className="w-full  rounded-sm py-5" variant="outline" onClick={handleLogin}>
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Sign in with Google
              </Button>

              <div className="mt-3">
                <h3 className="mb-4 text-sm font-medium">Select Your Role</h3>
                <RadioGroup
                  defaultValue="admin"
                  value={selectedRole}
                  onValueChange={setSelectedRole}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="admin" id="admin" />
                    <Label className="" htmlFor="admin">Admin</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="content-manager" id="content-manager" />
                    <Label className="" htmlFor="content-manager">Content Manager</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleLogin}>
                Continue
              </Button>
            </CardFooter>
          </TabsContent>

          <TabsContent value="signup">
            <CardHeader>
              <CardTitle className="text-2xl  mt-4 pb-0 mb-0">Sign Up</CardTitle>
              <CardDescription>Create a new account using Google OAuth</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pb-8 pt-4">
              <Button className="w-full  rounded-sm py-5" variant="outline" onClick={handleLogin}>
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Sign Up with Google
              </Button>

              <div className="mt-3">
                <h3 className="mb-4 text-sm font-medium">Select Your Role</h3>
                <RadioGroup
                  defaultValue="admin"
                  value={selectedRole}
                  onValueChange={setSelectedRole}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="admin" id="admin" />
                    <Label className="" htmlFor="admin">Admin</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="content-manager" id="content-manager" />
                    <Label className="" htmlFor="content-manager">Content Manager</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleLogin}>
                Create Account
              </Button>
            </CardFooter>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}

