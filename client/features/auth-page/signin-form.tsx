"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import React, { Dispatch, SetStateAction, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { RedirectToPage, RevalidateCache } from "../common/navigation-helpers";

type Props = {
  onSignUp: Dispatch<SetStateAction<boolean>>;
};

const formSchema = z.object({
  email: z
    .string()
    .min(1, {
      message: "Email is required.",
    })
    .email("This is not a valid email."),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

export default function SignInForm({ onSignUp }: Props) {
  const [error, setError] = useState<string>("");
  const [isPending, setIsPending] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsPending(true);
    try {
      const response = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });
      if (response?.error) {
        setError(response?.error!);
        setIsPending(false);
        return;
      }
      setIsPending(false);
      RevalidateCache({page: "cart", type: "page"})
      RedirectToPage("checkout");
    } catch (error) {
      setIsPending(false);
      setError("Failed to sign in: Something went wrong.");
    }
  };

  return (
    <div>
      <Form {...form}>
        <form
          className=" flex flex-col gap-3"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          {error && <span className="w-full text-sm text-center text-red-400">{error}</span>}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel />
                <FormControl>
                  <Input type="email" placeholder="Email" {...field} required/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel />
                <FormControl>
                  <Input type="password" placeholder="Password" {...field} required/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className=" p-2">
            {isPending ? "Please wait..." : "Login to continue"}
          </Button>
        </form>
        <div className=" mt-2 flex justify-end">
          <span
            className=" text-xs cursor-pointer hover:underline"
            onClick={() => onSignUp(false)}
          >
            Register here.
          </span>
        </div>
      </Form>
    </div>
  );
}
