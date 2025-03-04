"use client";
import CheckoutAuthOptions from "@/components/CheckoutAuthOptions";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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
        <span>Total:</span>
        <span>{formatCurrency(cart.totalPrice)}</span>
      </div>
      {(cart.itemsDiscountPrice > 0 || cart.shopDiscountPrice || cart.couponDiscountPrice) &&
      <div className=" text-md font-semibold flex items-center justify-between">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="discount-total">
            <AccordionTrigger className="py-1">
              <div className="flex items-center justify-between w-full font-semibold">
                <span>Details:</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-1">
              <div className="text-xs font-normal flex items-center justify-between">
                <span>Items price:</span>
                <span className=" text-muted-foreground">{formatCurrency(cart.itemsPrice)}</span>
              </div>
              {cart.itemsDiscountPrice > 0 && 
              <div className="text-xs font-normal flex items-center justify-between">
                <span>Items discount:</span>
                <span className=" text-muted-foreground">-{formatCurrency(cart.itemsDiscountPrice)}</span>
              </div>
              }
              {cart.shopDiscountPrice > 0 &&
              <div className="text-xs font-normal flex items-center justify-between">
                <span>Shop discount:</span>
                <span className=" text-muted-foreground">-{formatCurrency(cart.shopDiscountPrice)}</span>
              </div>
              }
              {cart.couponDiscountPrice > 0 &&
              <div className="text-xs font-normal flex items-center justify-between">
                <span>Coupon code:</span>
                <span className=" text-muted-foreground">-{formatCurrency(cart.couponDiscountPrice)}</span>
              </div>
              }
              <div className="text-xs font-normal flex items-center justify-between">
                <span>You save:</span>
                <span className=" text-green-400">{formatCurrency(cart.totalDiscountPrice)}</span>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>}
      <div className=" text-sm flex items-center justify-between">
        <span>Subtotal:</span>
        <span>{formatCurrency(cart.subTotalPrice)}</span>
      </div>
      <div className=" text-sm flex items-center justify-between">
        <span>Tax:</span>
        <span>{formatCurrency(cart.taxPrice)}</span>
      </div>
      <div className=" text-sm flex items-center justify-between">
        <span>Shipping:</span>
        <span>
          {cart.shippingPrice > 0
            ? `${formatCurrency(cart.shippingPrice)}`
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
