"use client";
import { FC } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { useFormState, useFormStatus } from "react-dom";
import { ServerActionResponse } from "../common/server-action-response";
import { RegisterUser } from "./authenticate-store";
import { LoadingIndicator } from "@/components/ui/loading";
import Link from "next/link";

interface RegisterProps {}

export const RegisterPage: FC<RegisterProps> = (props) => {

    const initialState: ServerActionResponse | undefined = undefined;
    const [formState, formAction] = useFormState(RegisterUser, initialState);

  return (
    <Card className="flex gap-2 flex-col min-w-[350px]">
      <CardHeader className="gap-2">
        <CardTitle className="text-2xl justify-center flex gap-2">
          <span className="text-primary text-center">{"Register"}</span>
        </CardTitle>
        <CardDescription className=" text-center">
          Login in with your credentials
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <form action={formAction} className="space-y-4 flex flex-col" >
          <div className="grid gap-2">
            <Label>Username</Label>
            <Input
              type="text"
              required
              name="username"
              placeholder="Username"
            />
          </div>
          <div className="grid gap-2">
            <Label>Email</Label>
            <Input
              type="email"
              required
              name="email"
              placeholder="Email"
            />
          </div>
          <div className="grid gap-2">
            <Label>Password</Label>
            <PasswordInput
              required
              name="password"
              placeholder="Password"
            />
          </div>
          <div className="grid gap-2">
            <Label>Confirm Password</Label>
            <PasswordInput
              required
              name="confirmPassword"
              placeholder="Confirm Password"
            />
          </div>
            {formState && formState.status === "OK" ? null : (
            <>
                {formState &&
                formState.errors.map((error, index) => (
                    <div key={index} className="text-red-500">
                    {error.message}
                    </div>
                ))}
            </>
            )}
          <Submit />
        </form>
        <CardFooter>
          <div className=" flex items-center gap-2 text-sm">
            <span>Already have an account?</span>
            <Link className=" hover:underline transition-all duration-150" href={"/login"}>
              Login here
            </Link>
          </div>
        </CardFooter>
      </CardContent>
    </Card>
  );
};

function Submit() {
    const status = useFormStatus();
    return (
      <Button disabled={status.pending} className="gap-2">
        <LoadingIndicator isLoading={status.pending} />
        Register
      </Button>
    );
}
