import { DisplayError } from "@/components/ui/error/display-error";
import { isUserAuthenticated } from "@/features/auth-page/helpers";
import { CheckoutPage } from "@/features/client/checkout-page/checkout-page";
import { FindShippingAddressForCurrentUser } from "@/features/client/checkout-page/checkout-services";
import ProfilePage from "@/features/client/profile-page/profile-page";
import { FindCurrentUser } from "@/features/client/profile-page/profile-service";
import { RedirectToPage } from "@/features/common/navigation-helpers";

export const metadata = {
  title: "TemosCo Checkout",
  description: "TemosCo Checkout Page",
};

export default async function Checkout() {
  const userAuthenticated = await isUserAuthenticated();
  if(!userAuthenticated) {
    RedirectToPage("unauthenticated");
  }

  const [userResponse, shippingAddressResponse] = await Promise.all([
    FindCurrentUser(),
    FindShippingAddressForCurrentUser()
  ]);

  if (userResponse.status !== "OK") {
    return <DisplayError errors={userResponse.errors} />;
  }

  if (shippingAddressResponse.status !== "OK") {
    return <DisplayError errors={shippingAddressResponse.errors} />;
  }
console.log("shippingAddressResponse", shippingAddressResponse)
  return (
    <main className="flex min-h-screen">
      <ProfilePage currentUser={userResponse.response} shippingAddresses={shippingAddressResponse.response}/>
    </main>
  );
}
