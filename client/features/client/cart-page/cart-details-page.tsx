"use client";

import { BiSolidCoupon } from "react-icons/bi";
import Image from "next/image";
import React, { FC, useEffect, useState } from "react";
import PaymentSelect from "@/components/PaymentSelect";
import useCartService from "@/hooks/useCartStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderItem } from "@/schemas/models";
import { formatCurrency } from "@/lib/formatters";
import Link from "next/link";
import { FaArrowLeftLong } from "react-icons/fa6";
import { CartSummary } from "./cart-summary";
import { RefreshCw, ShieldCheck, Trash, TruckIcon } from "lucide-react";
import { computeCurrentPrice, computeDiscountPrice } from "@/lib/utils";
import { CheckoutPage } from "../checkout-page/checkout-page";
import { useSession } from "next-auth/react";
import { set } from "mongoose";
import CheckoutAuthOptions from "@/components/CheckoutAuthOptions";
import { CgShoppingBag } from "react-icons/cg";

interface CartPageProps {
  settings: any;
}

export const CartDetailsPage: FC<CartPageProps> = (props) => {
  const { data: session } = useSession();
  const [onCheckout, setOnCheckout] = useState<boolean>(false);
  const [onDialog, setOnDialog] = useState<boolean>(false);
  const [coupon, setCoupon] = useState<string>("");
  const [couponApplied, setCouponApplied] = useState<boolean>(false);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState<boolean>(false);

  const { settings } = props;
  const cart = useCartService();

  useEffect(() => {
    if (props.settings) {
      cart.updateShopSettings(
        settings.shopSettings.shopDiscount,
        settings.shopSettings.shopTax,
        settings.shopSettings.currency
      );
    }
  }, [settings]);

  const handleIncrement = (item: OrderItem) => {
    cart.increase(item);
  };

  const handleDecrement = (item: OrderItem) => {
    cart.decrease(item);
  };

  const handleCheckout = () => {
    if (session) {
      setOnCheckout(true);
    } else {
      setOnDialog(true);
    }
  };

  const applyCouponCode = () => {
    setIsApplyingCoupon(true);

    // Simuler une vérification API
    setTimeout(() => {
      if (coupon.toLowerCase() === "bienvenue10") {
        setCouponApplied(true);
      }
      setIsApplyingCoupon(false);
    }, 1000);
  };

  const isCartEmpty = cart.items.length === 0;

  return (
    <div className=" w-full container mx-auto min-h-screen flex flex-col gap-4 py-16">
      <div className=" my-2 md:my-4 flex items-center justify-between pt-16">
        {isCartEmpty ? (
          <h1 className="text-3xl font-bold flex items-center">
            <CgShoppingBag className="mr-3 h-7 w-7" />
            Your Basket
          </h1>
        ) : (
          <span className=" flex items-center p-0 gap-2 md:gap-4 text-xl md:text-2xl">
            {cart.items.length}{" "}
            {`${cart.items.length > 1 ? "items" : "item"} in your basket`}
          </span>
        )}

        <Button onClick={() => cart.clearCart()} variant="outline">
          Clear Basket
        </Button>
      </div>

      {isCartEmpty ? (
        <Card className="text-center py-12 rounded-md">
          <CardContent className="flex flex-col items-center">
            <div className="bg-gray-100 rounded-full p-6 mb-4">
              <CgShoppingBag className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">
              Your basket is empty
            </h2>
            <p className="text-gray-500 mb-6">
              Explore our catalog and find the products that interest you.
            </p>
            <Button className="px-6">
              <Link href="/shop">Discover our products</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card className="md:col-span-2 p-2 md:p-4 rounded-md">
              <div className=" flex flex-col">
                {cart.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex py-4 border-b-[1px] relative"
                  >
                    <Image
                      src={item.image.url}
                      alt={item.slug}
                      width={120}
                      height={120}
                      className=" flex-none w-[70px] h-[70px] md:w-[80px] md:h-[80px] lg:w-[110px] lg:h-[110px] rounded-md object-cover object-center cursor-pointer"
                    />

                    <div className=" grow flex flex-col gap-1 md:gap-2 pl-2 md:pl-4">
                      <h1 className=" w-full text-sm font-semibold md:text-md line-clamp-2 ">
                        {item.name}
                      </h1>
                      <div className="flex gap-4 items-center">
                        <span className=" text-xl md:text-2xl font-semibold">
                          {formatCurrency(computeCurrentPrice(item))}
                        </span>

                        <div className="bg-red-100 text-red-600 px-2 rounded-full text-sm">
                          {item?.discount && item.discount > 0
                            ? `-${item.discount}%`
                            : ""}
                        </div>
                      </div>

                      <div className=" flex items-center gap-2 md:gap-4">
                        <div className=" w-full flex gap-2 flex-col items-end sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex items-center gap-3">
                            <span className=" text-sm md:text-md">
                              {`${item.qty}x${
                                item.discount && item.discount > 0
                                  ? formatCurrency(computeDiscountPrice(item))
                                  : formatCurrency(item.price)
                              }`}
                            </span>

                            <span className=" line-through text-sm md:text-md text-muted-foreground">
                              {item.discount && item.discount > 0
                                ? `${item.qty}x${formatCurrency(item.price)}`
                                : ""}
                            </span>

                            {item.attributes && item.attributes.length > 0 && (
                              <div className="flex items-center">
                                <span className=" text-muted-foreground text-sm">
                                  {item.attributes
                                    .map((attr) => attr.value)
                                    .join(", ")}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-3">
                            <div className=" text-sm w-fit ml-4 flex items-center border-[2px] border-white/20 rounded-md overflow-hidden">
                              <Button
                                variant="outline"
                                onClick={() => handleDecrement(item)}
                                className=" h-[30px] w-[30px] cursor-pointer "
                              >
                                -
                              </Button>
                              <div className=" flex items-center justify-center px-2">
                                <span className=" text-center">{item.qty}</span>
                              </div>
                              <Button
                                variant="outline"
                                onClick={() => handleIncrement(item)}
                                className=" h-[30px] w-[30px] cursor-pointer"
                              >
                                +
                              </Button>
                            </div>
                            <Button
                              onClick={() => cart.remove(item)}
                              variant="ghost"
                              className=" h-[30px] px-2 flex items-center justify-center gap-1 bg-red-100/80 text-red-600/50 hover:bg-red-100 hover:text-red-600"
                            >
                              <Trash size={15} />
                              <span className=" hidden md:block">remove</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className=" flex flex-col gap-4 mt-4">
                <div className=" flex items-center gap-2 text-md font-bold">
                  <BiSolidCoupon size={20} />
                  <span>Apply shop coupon codes</span>
                </div>

                <form className="flex flex-col gap-2 w-full md:flex-row md:items-center md:w-fit">
                  <Input
                    type="text"
                    placeholder="Enter coupon code"
                    className="w-full sm:w-auto"
                    onChange={(e) => setCoupon(e.target.value)}
                  />
                  <Button
                    disabled={isApplyingCoupon || !coupon || couponApplied}
                    onClick={applyCouponCode}
                    className=" font-bold w-32"
                  >
                    {isApplyingCoupon ? "Please wait..." : "Apply"}
                  </Button>
                </form>

                <div className=" flex flex-col md:flex-row gap-4 md:items-center justify-between mt-4">
                  <div className=" flex items-center">
                    <Link href="/shop" className=" text-md">
                      <Button variant="outline">
                        <FaArrowLeftLong />
                        <span className="ml-2">Continue shop</span>
                      </Button>
                    </Link>
                  </div>
                  <span className=" text-xs">
                    Estimated delivery: 2-3 days from Germany
                  </span>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <Card className="p-4 text-center flex flex-col items-center rounded-md">
                <TruckIcon className="h-8 w-8 mb-2" />
                <h3 className="font-medium">Fast delivery</h3>
                <p className="text-sm text-gray-500">Shipping within 24h</p>
              </Card>

              <Card className="p-4 text-center flex flex-col items-center rounded-md">
                <RefreshCw className="h-8 w-8 mb-2" />
                <h3 className="font-medium">Free returns</h3>
                <p className="text-sm text-gray-500">Over 30 days</p>
              </Card>

              <Card className="p-4 text-center flex flex-col items-center rounded-md">
                <ShieldCheck className="h-8 w-8 mb-2" />
                <h3 className="font-medium">Secure payment</h3>
                <p className="text-sm text-gray-500">Encrypted transactions</p>
              </Card>
            </div>
          </div>

          <div className="md:col-span-1">
            <Card className="sticky top-6 rounded-md">
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <CartSummary cart={cart} />
                {session && session?.user ? (
                  <Link href="/checkout">
                    <Button
                      disabled={cart.items.length === 0}
                      className=" flex items-center justify-center mt-4 w-full font-bold rounded-md duration-100"
                    >
                      <span className=" text-center">Proceed to checkout</span>
                    </Button>
                  </Link>
                ) : (
                  <Button
                    onClick={handleCheckout}
                    disabled={cart.items.length === 0}
                    className=" flex items-center justify-center mt-4 w-full font-bold rounded-md duration-100"
                  >
                    <span className=" text-center">Proceed to checkout</span>
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card className="mt-6 p-4 rounded-md">
              <div className="text-sm space-y-2">
                <h3 className="font-semibold">Accepted payment methods</h3>
                <div className="flex flex-wrap gap-2">
                  <div className="border rounded-md px-3 py-1 text-xs">
                    Visa
                  </div>
                  <div className="border rounded-md px-3 py-1 text-xs">
                    Mastercard
                  </div>
                  <div className="border rounded-md px-3 py-1 text-xs">
                    Google Pay
                  </div>
                  <div className="border rounded-md px-3 py-1 text-xs">
                    PayPal
                  </div>
                  <div className="border rounded-md px-3 py-1 text-xs">
                    Apple Pay
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {onDialog && !session && <CheckoutAuthOptions onClose={setOnDialog} />}
    </div>
  );
};
