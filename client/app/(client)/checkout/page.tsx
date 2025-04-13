import { DisplayError } from "@/components/ui/error/display-error";
import { isUserAuthenticated } from "@/features/auth-page/helpers";
import { CheckoutPage } from "@/features/client/checkout-page/checkout-page";
import { FindShippingAddressForCurrentUser } from "@/features/client/checkout-page/checkout-services";
import { GetAppSettings } from "@/lib/app-settings";

export const metadata = {
  title: "TemosCo Checkout",
  description: "TemosCo Checkout Page",
};

export default async function Checkout() {
  const [settingsResponse, userAuthenticated] = await Promise.all([
    GetAppSettings(),
    isUserAuthenticated()
  ]);

  if (!settingsResponse) {
    return <DisplayError errors={[{ message: "App settings couldn't be loaded." }]}/>;
  }

  if(!userAuthenticated) {
    return (
      <main className="flex min-h-screen">
      <CheckoutPage appSettings={settingsResponse.response} addressList={[]}/>
    </main>
    )
  }

  const addressResponse = await FindShippingAddressForCurrentUser();

  if (addressResponse.status !== "OK") {
    return <DisplayError errors={addressResponse.errors} />;
  }

  return (
    <main className="flex min-h-screen">
      <CheckoutPage appSettings={settingsResponse.response} addressList={addressResponse.response}/>
    </main>
  );
}
