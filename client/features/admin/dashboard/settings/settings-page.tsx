"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Hero } from "@/components/ui/hero";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Settings } from "lucide-react";
import { FC, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { adminSettingStore, useAdminSettingState } from "./admin-settings-store";

interface AdminSettingProps {
  settings: any;
}

export const AdminShopSettings: FC<AdminSettingProps> = (props) => {
  const { shopSettings } = useAdminSettingState();

  useEffect(() => {
    adminSettingStore.initSettingsSession({
      appSettings: props.settings,
    });
  }, [props.settings]);

  return (
    <ScrollArea className="flex-1">
      <main className="flex flex-1 flex-col">
        <Hero
          title={
            <>
              <Settings size={26} strokeWidth={1.5} /> Settings
            </>
          }
          description={"Settings"}
        ></Hero>
        <div className="container max-w-5xl px-4 md:px-8 py-3 mx-auto">
          <div className=" flex flex-col gap-4">
            <Card className=" p-3">
              <CardHeader>
                <CardTitle>Shop Settings</CardTitle>
                <CardDescription>
                  Set the shop Tax and discount settings.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex flex-col gap-3">
                    <span>Shop Tax in %: {shopSettings.shopTax}</span>
                    <Slider
                      onValueChange={(value) =>
                        adminSettingStore.updateShopTax(value[0])
                      }
                      name="shopTax"
                      defaultValue={[shopSettings.shopTax]}
                      min={5}
                      max={100}
                      step={1}
                      className={cn(" bg-background")}
                    />
                  </div>

                  <div className="flex flex-col gap-3">
                    <span>Shop Discount in %: {shopSettings.shopDiscount}</span>
                    <Slider
                      onValueChange={(value) =>
                        adminSettingStore.updateShopDiscount(value[0])
                      }
                      name="free_truncation_tokens"
                      defaultValue={[shopSettings.shopDiscount]}
                      min={0}
                      max={100}
                      step={5}
                      className={cn(" bg-background")}
                    />
                  </div>
                </div>
              </CardContent>

              {/* <CardContent>
                <div className="flex flex-col gap-4">

                </div>
            </CardContent> */}

              <CardFooter className=" flex items-center justify-end gap-3">
                <Button
                  onClick={() => adminSettingStore.resetAppSettings()}
                  variant="secondary"
                >
                  Reset Settings
                </Button>
                <Button onClick={() => adminSettingStore.updateAppSettings()}>
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </ScrollArea>
  );
};
