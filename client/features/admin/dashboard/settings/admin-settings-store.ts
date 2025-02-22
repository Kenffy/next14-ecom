"use client";

import { showError, showSuccess } from "@/features/globals/global-message-store";
import { UpdateAppSettings } from "@/lib/app-settings";
import { proxy, useSnapshot } from "valtio";

class AdminSettingState {
  public appSettings: any = {};
  public shopSettings = {
    shopDiscount: 0,
    shopTax: 0,
    shopCurrency: {
      name: "EUR",
      symbol: "€",
      position: "right",
      decimals: 2,
      decimalPoint: ",",
      thousandSeparator: ".",
    },
  };

  public initSettingsSession({ appSettings }: { appSettings: any }) {
    this.appSettings = appSettings;
    this.shopSettings = appSettings.shopSettings;
  }

  public updateShopTax(value: number) {
    this.shopSettings = {
      ...this.shopSettings,
      shopTax: value,
    };
  }

  public updateShopDiscount(value: number) {
    this.shopSettings = {
      ...this.shopSettings,
      shopDiscount: value,
    };
  }

  public async updateAppSettings() {
    const message = `Are you sure you want to save those changes?`;
    if (window.confirm(message)) {
      const updatedSettings = {
        ...this.appSettings,
        shopSettings: {
          ...this.shopSettings,
          shopDiscount: this.shopSettings.shopDiscount,
          shopTax: this.shopSettings.shopTax,
          //shopCurrency: this.shopSettings.shopCurrency,
        },
      };

      const response = await UpdateAppSettings(updatedSettings);
      if (response?.status === "OK") {
        showSuccess({
          title: "Update shop settings",
          description: response.message!,
        });
      } else if (response?.status === "UNAUTHORIZED") {
        showError(response.error!);
      } else {
        showError("Failed to update the model settings.");
      }
    }
  }

  public async resetAppSettings() {
    const message = `Are you sure you want to reset the default settings?`;
    if (window.confirm(message)) {
      const updatedSettings = {
        ...this.appSettings,
        shopSettings: this.appSettings.defaultShopSettings,
      };
      const response = await UpdateAppSettings(updatedSettings);
      if (response?.status === "OK") {
        showSuccess({
          title: "Reset Shop settings",
          description: response.message!,
        });
      } else if (response?.status === "UNAUTHORIZED") {
        showError(response.error!);
      } else {
        showError("Failed to reset the model settings.");
      }
    }
  }
}

export const adminSettingStore = proxy(new AdminSettingState());

export const useAdminSettingState = () => {
  return useSnapshot(adminSettingStore, { sync: true });
};
