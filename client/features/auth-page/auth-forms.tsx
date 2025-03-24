"use client";
import React, { useState } from "react";
import SignInForm from "./signin-form";
import SignUpForm from "./signup-form";
import ProvidersForm from "./provider-form";
import Separator from "@/components/Separator";

interface AuthFormsProps {
}

export default function AuthForms(props: AuthFormsProps) {
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
