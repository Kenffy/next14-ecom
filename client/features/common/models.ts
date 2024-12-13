import * as z from "zod";

export interface ResetPasswordModel {
    password: string;
    confirmPassword: string;
}

export interface ChangePasswordModel {
    userId?: string;
    oldPassword: string;
    password: string;
    confirmPassword: string;
}

export interface LoginUserModel {
    email?: string;
    username?: string;
    password: string;
}

export interface RegisterUserModel {
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
}

export interface UpdateUserModel {
    _id: string;
    email: string;
    lastName: string;
    firstName: string;
    username: string;
    image?: string;
}

export const ResetPasswordSchema = z.object({
    password: z.string().min(6, {
      message: "Minimum 6 character"
    }),
    confirmPassword: z.string().min(6, {
      message: "Minimum 6 character"
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});
  
export const ChangePasswordSchema = z.object({
    oldPassword: z.string().min(6, {
        message: "Minimum 6 character"
    }),
    newPassword: z.string().min(6, {
      message: "Minimum 6 character"
    }),
    confirmPassword: z.string().min(6, {
      message: "Minimum 6 character"
    }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export const LoginUserSchema = z.object({
    email: z.string().email({
        message: "Email is Required"
    }),
    password: z.string().min(1, {
        message: "Password is required"
    })
});

export const RegisterUserSchema = z.object({
    username: z.string().min(1, {
      message: "Username is Required"
    }),
    email: z.string().email({
      message: "Email is Required"
    }),
    password: z.string().min(6, {
        message: "Minimum 6 character"
    }),
    confirmPassword: z.string().min(6, {
      message: "Minimum 6 character"
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export const UpdateUserSchema = z.object({
    username: z.string().min(1, {
      message: "Username is Required"
    }),
    lastName: z.string(),
    firstName: z.string(),
});