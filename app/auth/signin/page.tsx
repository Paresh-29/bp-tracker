"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Button onClick={() => signIn("google")}>Sign in with Google</Button>
    </div>
  );
}
