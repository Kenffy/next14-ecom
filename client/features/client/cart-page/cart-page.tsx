"use client"

import { FC } from "react";
import { CartDetailsPage } from "./cart-details-page";

interface CartPageProps {
  settings: any;
}

export const CartPage: FC<CartPageProps> = (props) => {

  return (
    <CartDetailsPage settings={props.settings}/>
  );
};
