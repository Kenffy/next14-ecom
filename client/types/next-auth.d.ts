import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      isAdmin: boolean;
      acceptedTerms: boolean;
    } & DefaultSession["user"];
  }

  interface Token {
    id: string;
    isAdmin: boolean;
  }

  interface User {
    id: string;
    isAdmin: boolean;
    acceptedTerms: boolean;
  }
}
