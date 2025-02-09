"use client";
import React, { useState } from "react";
import SignInForm from "./signin-form";
import SignUpForm from "./signup-form";
import { Separator } from "@/components/ui/separator";
import ProvidersForm from "./provider-form";

export default function AuthForms() {
  const [isSignIn, setIsSignIn] = useState<boolean>(true);

  return (
    <div className=" flex flex-col gap-8">
      {isSignIn ? (
        <SignInForm onSignUp={setIsSignIn} />
      ) : (
        <SignUpForm onSignIn={setIsSignIn} />
      )}
      <Separator>OR</Separator>
      <ProvidersForm />
    </div>
  );
}
