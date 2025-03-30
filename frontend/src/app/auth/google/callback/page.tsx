"use client"; 
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
  const role= useRoleStore(state => state.role);
  const setUser = useUserStore(state => state.setUser);

  // This function sends the code to your backend
  const handleCredentialResponse = async (authCode: string) => {
      // Note: We don't have access to the 'selectedRole' state from the original login page here.
      // You might need to:
      // 1. Store the selected role temporarily (e.g., localStorage) before redirecting to Google.
      // 2. Or, perhaps the role is determined *after* login based on backend data.
      // For now, let's assume the backend assigns a default or fetched role.
      // If sending the role from frontend is critical, you'll need to persist it across the redirect.
      // Let's simplify and assume the backend handles role assignment or uses a default for now.
      // const roleToSend = localStorage.getItem('selectedRole') || 'user'; // Example using localStorage
      const currentRole = useRoleStore.getState().role;
      setError(null); 

      try {
          const res = await fetch(BACKEND_API_URL, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              // You might need to adjust what data you send based on your backend needs
              body: JSON.stringify({ code: authCode , role: currentRole }),
          });
          console.log("This is in callback: ", currentRole);
          const data = await res.json(); // Always parse JSON to check for backend errors

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
          // No need to setIsProcessing(false) here as we are redirecting

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


  // Display loading or error state
  return (
      <div>
          <h1>Processing Google Login...</h1>
          {isProcessing && <p>Please wait while we verify your login...</p>}
          {error && <p style={{ color: 'red' }}>Error: {error}</p>}
          {/* You might want a link back to the login page if it fails permanently */}
          {!isProcessing && error && <a href="/auth">Try Login Again</a>}
      </div>
  );
}