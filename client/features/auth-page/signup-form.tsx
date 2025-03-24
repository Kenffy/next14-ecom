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
import { RegisterAsync } from "./auth-service";

type Props = {
  onSignIn: Dispatch<SetStateAction<boolean>>;
};

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
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

export default function SignUpForm({ onSignIn }: Props) {
  const [error, setError] = useState<string>("");
  const [isPending, setIsPending] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async(values: z.infer<typeof formSchema>) => {
    setIsPending(true);
    try {
      const response = await RegisterAsync({
        email: values.email,
        username: values.username,
        password: values.password,
        isAdmin: false,
      });
      if(response.status === "OK") {
        setIsPending(false);
        onSignIn(true);
        return;
      }
    } catch (error) {
      setIsPending(false);
      setError("Failed to register: Something went wrong.");
    }
  }

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className=" flex flex-col gap-3"
        >
          {error && <span className="w-full text-sm text-center text-red-400">{error}</span>}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel />
                <FormControl>
                  <Input placeholder="Username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel />
                <FormControl>
                  <Input placeholder="Email" {...field} />
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
                  <Input type="password" placeholder="Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className=" p-2 ">
          {isPending ? "Please wait..." : "Register"}
          </Button>
        </form>
        <div className=" mt-2 flex justify-end">
          <span
            className=" text-xs cursor-pointer hover:underline"
            onClick={() => onSignIn(true)}
          >
            Login here.
          </span>
        </div>
      </Form>
    </div>
  );
}
