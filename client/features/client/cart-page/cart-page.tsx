"use client"

import { FC } from "react";
import { CartDetailsPage } from "./cart-details-page";

interface CartPageProps {
}

export const CartPage: FC<CartPageProps> = (props) => {

  return (
    <div className="w-full min-h-screen">
        <CartDetailsPage />
    </div>
  );
};
