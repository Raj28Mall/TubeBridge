import { redirect } from "next/navigation";

export const metadata = {
  title: "TubeBridge - Effortless YouTube Uploads",
  description: "Upload videos, review, approve, and publish – all in one place.",
};

export default function Home() {
  // Redirect to landing page
  redirect("/landing");
}

