"use client"; 
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { useRoleStore } from '@/store/roleStore';

const BACKEND_API_URL = "http://127.0.0.1:5000/api/auth/google/exchange"; 

export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true); 
  const setUser = useUserStore(state => state.setUser);

  const handleCredentialResponse = async (authCode: string) => {
      const currentRole = useRoleStore.getState().role;
      setError(null); 

      try {
          const res = await fetch(BACKEND_API_URL, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ code: authCode , role: currentRole }),
          });
          console.log("This is in callback: ", currentRole);
          const data = await res.json();

          if (!res.ok) {
              throw new Error(data.error || `Backend error: ${res.status}`);
          }
          setUser(data.user);
          // --- SUCCESS ---
          // TODO: Store session token/user data received from backend (if any)
          // localStorage.setItem('authToken', data.token);

          // Redirect to appropriate page based on backend response or stored role
          // This logic might need refinement based on what your backend returns
          router.push("/landing");

      } catch (err: any) {
          console.error("Error exchanging auth code:", err);
          setError(err.message || "An unknown error occurred during login.");
          setIsProcessing(false); // Stop processing on error
      }
  };

  useEffect(() => {
      const authCode = searchParams.get("code");

      if (authCode) {
          setIsProcessing(true); // Ensure processing state is true
          handleCredentialResponse(authCode);
          // Optional: Clear the code from URL bar visually after processing starts
          // router.replace('/auth/google/callback', undefined); // Use replace to avoid back button issues
      } else {
          // No code found in URL params, maybe show an error or redirect
          setError("No authorization code found in the URL.");
          setIsProcessing(false);
          // Optionally redirect back to login page after a delay
          // setTimeout(() => router.push('/auth'), 3000);
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]); // Rerun effect if searchParams change


  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md text-center space-y-6">
        {/* Logo or illustration */}
        <div className="flex justify-center">
          <Image src="/logo.png" alt="TubeBridge Logo" width={64} height={64} className="rounded-xl" />
        </div>

        <h1 className="text-2xl font-bold text-foreground">Processing Google Login...</h1>

        {isProcessing ? (
          <div className="flex flex-col items-center space-y-2">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <p className="text-muted-foreground">Please wait while we verify your login...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-red-500 font-medium">Error: {error}</p>
            <Button asChild variant="outline">
              <a href="/auth">Try Login Again</a>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}