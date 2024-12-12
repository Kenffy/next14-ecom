import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { Provider } from "next-auth/providers/index";
import { LoginAsync } from "./auth-service";

const configureIdentityProvider = () => {
  const providers: Array<Provider> = [];

  providers.push(
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req): Promise<any> {
        const email = credentials?.email!;
        const password = credentials?.password!;
        const loginResponse = await LoginAsync({ email, password });

        if (loginResponse.status === "OK") {
          const user = loginResponse.response;
          return {
            ...user,
            name: user.username,
          };
        } else {
          console.log("credential error: ", loginResponse);
          throw new Error(
            `Error: ${loginResponse.errors.map((e) => e.message)}`
          );
        }
      },
    })
  );

  return providers;
};

export const options: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [...configureIdentityProvider()],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.isAdmin) {
        token.isAdmin = user.isAdmin as boolean;
      }
      if (user?.acceptedTerms) {
        token.acceptedTerms = user.acceptedTerms as boolean;
      }
      return token;
    },
    async session({ session, token, user }) {
      if (token.sub && session.user) {
        session.user.id = token.sub as string;
      }
      session.user.isAdmin = token?.isAdmin
        ? (token.isAdmin as boolean)
        : false;
      session.user.acceptedTerms = token?.acceptedTerms
        ? (token?.acceptedTerms as boolean)
        : false;
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
};

export const handlers = NextAuth(options);
