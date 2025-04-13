"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type Page = "home" | "cart" | "checkout" | "shop" | "dashboard" | "login" | "register" | "forgot-password" | "unauthenticated";

export const RevalidateCache = (props: {
  page: Page;
  params?: string | undefined;
  type?: "layout" | "page" | undefined;
}) => {
  const { page, params, type } = props;
  if (params) {
    revalidatePath(`/${page}/${params}`, type);
  } else {
    revalidatePath(`/${page}`, type);
  }
};

export const RedirectToPage = (path: Page) => {
  redirect(`/${path === "home" ? "" : path}`);
};

export const RedirectToChatThread = (chatThreadId: string) => {
  redirect(`/chat/${chatThreadId}`);
};
