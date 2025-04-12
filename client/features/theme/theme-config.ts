import { ReactPayPalScriptOptions } from "@paypal/react-paypal-js";

export const APP_NAME = `Authentication`;
export const APP_DESCRIPTION = `${APP_NAME} application and users managements`;

export const DashboardLinks = [
  { id: 1, link: "/dashboard", name: "Dashbord" },
  { id: 2, link: "/dashboard/users", name: "Users" },
  { id: 3, link: "/dashboard/products", name: "Products" },
  { id: 4, link: "/dashboard/categories", name: "Categories" },
  { id: 5, link: "/dashboard/settings", name: "Settings" },
];

export const Sorts = [
  { id: 1, type: "Relevancy", value: "relevancy" },
  { id: 2, type: "Lowest Price", value: "asc" },
  { id: 3, type: "Highest Price", value: "desc" },
  { id: 4, type: "Most Recent", value: "recent" },
];

export const PayInitialOptions: ReactPayPalScriptOptions = {
  clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
  currency: "EUR",
  intent: "capture",
  disableFunding: ["credit", "card","paylater"],
};
