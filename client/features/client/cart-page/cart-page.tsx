"use client"

import { FC } from "react";
import { CartDetailsPage } from "./cart-details-page";

interface CartPageProps {
  settings: any;
}

export const CartPage: FC<CartPageProps> = (props) => {

  return (
    <div className="w-full min-h-screen">
        <CartDetailsPage settings={props.settings}/>
    </div>
  );
};
