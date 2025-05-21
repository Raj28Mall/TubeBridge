/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"; 
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { useRoleStore } from '@/store/roleStore';

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_AUTH_API_URL;

export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = useRoleStore((state) => state.role);
  const setUser = useUserStore((state) => state.setUser); // From your userStore

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); 

  const handleCredentialResponse = async (authCode: string) => {
      setIsLoading(true);
      setError(null);
      try {
          if (!BACKEND_API_URL) {
              throw new Error("Backend API URL is not defined");
          }
          else{
          console.log("Backend API URL exists");
          }
          const res = await fetch(BACKEND_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code: authCode , role: role }),
          });
          console.log("This is in callback: ", role);
          const data = await res.json();

          if (!res.ok) {
            setError(data.error || "Failed to authenticate with backend.");
            setIsLoading(false);
            return;
          }
          
          const { id_token, user } = data; // Assuming backend sends id_token and user object

          if (id_token) {
            localStorage.setItem("id_token", id_token);
            console.log("ID Token stored in localStorage.");

            if (user) {
              setUser(user);
              console.log("User data stored in Zustand:", user);
            }else{
              console.error("User data not found in backend response.");
            }
            
            router.push("/");
          } else {
            console.error("ID token not found in backend response.");
            setError("ID token not found in backend response.");
          }
        } catch (err) {
          console.error("Frontend error during auth exchange:", err);
          setError(err instanceof Error ? err.message : "An unexpected error occurred.");
        } finally {
          setIsLoading(false);
        }
    };

  useEffect(() => {
      const authCode = searchParams.get("code");
      if (authCode) {
          setIsLoading(true); 
          handleCredentialResponse(authCode);
      } else {
          setError("No authorization code found in the URL.");
          setIsLoading(false);
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);


  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-md text-center space-y-6">
          <div className="flex justify-center">
            <Image src="/logo.png" alt="TubeBridge" width={64} height={64} className="rounded-xl" />
          </div>
    
          <h1 className="text-2xl font-bold text-foreground">Processing Google Login...</h1>

          {isLoading ? (
            <div className="flex flex-col items-center space-y-2">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <p className="text-muted-foreground">Please wait while we verify your login...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-red-500 font-medium">Error while Logging In</p>
              <Button asChild variant="outline">
                <a href="/auth">Try Login Again</a>
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }
}