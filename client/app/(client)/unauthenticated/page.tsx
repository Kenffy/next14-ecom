"use client";
import { Button } from "@/components/ui/button";
import { RedirectToPage } from "@/features/common/navigation-helpers";
import { useSession } from "next-auth/react";

export default function Unauthenticated() {
  const { data: session } = useSession();

  if (session && session.user) {
    RedirectToPage("shop");
  }
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
      <div className="w-[400px] bg-white flex flex-col text-center p-6 rounded-lg shadow-md gap-4">
        <h1 className="text-3xl font-bold text-muted-foreground">
          Unauthenticated
        </h1>
        <p className="text-gray-600">
          Sorry, you are not authenticated. Please log in to access this page.
        </p>
        <Button variant={"link"} onClick={() => RedirectToPage("login")}>
          Login here
        </Button>
        <Button variant="default" onClick={() => RedirectToPage("home")}>
          Back to home
        </Button>
      </div>
    </div>
  );
}
