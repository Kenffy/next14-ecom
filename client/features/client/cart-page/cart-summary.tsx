"use client";
import CheckoutAuthOptions from "@/components/CheckoutAuthOptions";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/formatters";
import { Cart } from "@/schemas/models";
import React, { FC, useState } from "react";

interface CartSummaryProps {
    cart: Cart;
}

export const CartSummary: FC<CartSummaryProps> = ({cart}) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <div className=" flex flex-col gap-2 py-4 mt-4">
      <Separator />
      <div className=" text-md font-semibold flex items-center justify-between">
        <span>{`Item(s) total:`}</span>
        <span>{formatCurrency(cart.itemsPrice)}</span>
      </div>
      <div className=" text-md font-semibold flex items-center justify-between">
        <span>{`Shop discount:`}</span>
        <span>{`-`}</span>
      </div>
      <Separator />
      <div className=" text-sm flex items-center justify-between">
        <span>Subtotal:</span>
        <span>{formatCurrency(cart.itemsPrice)}</span>
      </div>
      <div className=" text-sm flex items-center justify-between">
        <span>Tax:</span>
        <span>{formatCurrency(cart.taxPrice)}</span>
      </div>
      <div className=" text-sm flex items-center justify-between">
        <span>Shipping:</span>
        <span>
          {cart.shippingPrice > 0
            ? `${formatCurrency(cart.shippingPrice)} €`
            : `Free`}
        </span>
      </div>

      <div className=" text-xl font-semibold flex items-center justify-between">
        <span>{`Total`}</span>
        <span>{formatCurrency(cart.totalPrice)}</span>
      </div>

      <Button
        onClick={() => setOpen(true)}
        className=" flex items-center justify-center mt-4 w-full font-bold rounded-md duration-100"
      >
        <span className=" text-center">Proceed to checkout</span>
      </Button>
      {open && <CheckoutAuthOptions onClose={setOpen} />}
    </div>
  );
}
