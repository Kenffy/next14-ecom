import { CartPage } from "@/features/client/cart-page/cart-page";
import { GetAppSettings } from "@/lib/app-settings";
import React from "react";

export const metadata = {
  title: "TemosCo Cart",
  description: "TemosCo Cart Page",
};

export default async function Cart() {
  const appSettings = await GetAppSettings();
  return (
    <main className="flex min-h-screen">
      <CartPage settings={appSettings}/>
    </main>
  );
}
