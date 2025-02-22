import { DisplayError } from "@/components/ui/error/display-error";
import { AdminShopSettings } from "@/features/admin/dashboard/settings/settings-page";
import { GetAppSettings } from "@/lib/app-settings";
import React from "react";

export default async function Settings() {
  const settings = await GetAppSettings();

  if (!settings) {
    return (
      <DisplayError
        errors={[{ message: "App settings couldn't be loaded." }]}
      />
    );
  }

  return <AdminShopSettings settings={settings} />;
}
