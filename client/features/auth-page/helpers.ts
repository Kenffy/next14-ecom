import { createHash } from "crypto";
import { getServerSession } from "next-auth";
import { options } from "./auth-api";
import { RedirectToPage } from "../common/navigation-helpers";

export const userSession = async (): Promise<UserBaseModel | null> => {
  const session = await getServerSession(options);
  if (session && session.user) {
    return {
      id: session.user.id,
      name: session.user.name!,
      image: session.user.image!,
      email: session.user.email!,
      isAdmin: session.user.isAdmin!,
    };
  }

  return null;
};

export const getCurrentUser = async (): Promise<UserBaseModel> => {
  const user = await userSession();
  if (user) {
    return user;
  }
  throw new Error("User not found");
};

export const isUserAuthenticated = async (): Promise<boolean> => {
  const user = await userSession();
  return !!user;
};

export const userHashedId = async (): Promise<string> => {
  const user = await userSession();
  if (user) {
    return hashValue(user.email);
  }

  throw new Error("User not found");
};

export const hashValue = (value: string): string => {
  const hash = createHash("sha256");
  hash.update(value);
  return hash.digest("hex");
};

export const redirectIfAuthenticated = async () => {
  const user = await userSession();
  if (user) {
    RedirectToPage("dashboard");
  }
};

export type UserBaseModel = {
  id: string;
  name: string;
  image: string;
  email: string;
  isAdmin: boolean;
  acceptedTerms?: boolean;
};
