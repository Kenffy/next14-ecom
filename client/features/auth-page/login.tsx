"use client";
import { signIn } from "next-auth/react";
import { FC, useState } from "react";
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
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RedirectToPage } from "../common/navigation-helpers";
import { PasswordInput } from "@/components/ui/password-input";

interface LoginProps { }

export const LoginPage: FC<LoginProps> = (props) => {

  const [error, setError] = useState<string>("");
  const [isPending, setIsPending] = useState<boolean>(false);

  const router = useRouter();

  const onSubmit = async (formData: FormData) => {
    setIsPending(true);
    try {
      const response = await signIn("credentials", {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        redirect: false
      });
      if (response?.error) {
        setError(response?.error!);
        setIsPending(false);
        return;
      }
      setIsPending(false);
      //RedirectToPage("home");
      router.back();
    } catch (error) {
      setIsPending(false);
      setError("Something went wrong.");
    }
  }

  return (
    <Card className="flex gap-2 flex-col min-w-[350px]">
      <CardHeader className="gap-2">
        <CardTitle className="text-2xl flex justify-center gap-2">
          <span className="text-primary">{"Login"}</span>
        </CardTitle>
        <CardDescription className=" text-center">
          Login in with your credentials
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <form action={onSubmit} className="space-y-4 flex flex-col" >
          <div className="grid gap-2">
            <Label>Name</Label>
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
          <span className="text-sm text-center text-primary">{error}</span>
          <Button type="submit" className=" w-full mt-4">
            {isPending ? "Please wait..." : "Login"}
          </Button>
        </form>
        <CardFooter>
          <div className=" flex items-center gap-2 text-sm">
            <span>Don't have an account?</span>
            <Link className=" hover:underline transition-all duration-150" href={"/register"}>
              Register here
            </Link>
          </div>
        </CardFooter>
      </CardContent>
    </Card>
  );
};
