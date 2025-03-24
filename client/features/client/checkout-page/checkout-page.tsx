"use client";
import { Button } from "@/components/ui/button";
import useCartService from "@/hooks/useCartStore";
import { AddressModel, PaymentType } from "@/schemas/models";
import { useSession } from "next-auth/react";
import React, { FC, useEffect, useState } from "react";
import { CheckoutForm } from "./checkout-forms/checkout-form";
import { PaymentMethodForm } from "./checkout-forms/payment-method-form";
import { AddressForm } from "./checkout-forms/address-form";
import { CustomerInfoForm } from "./checkout-forms/customer-infos-form";
import Image from "next/image";
import { formatCurrency } from "@/lib/formatters";
import { computeCurrentPrice, computeDiscountPrice } from "@/lib/utils";
import { CartSummaryPrices } from "../cart-page/cart-summary-prices";
import { useRouter } from "next/navigation";

interface CheckoutPageProps {
}

const AddressList = [
  {
    _id: "abc",
    userId: "asdfghjkl",
    fullName: "John Doe",
    street: "Berliner Street 12A",
    postalCode: "12345",
    city: "Berlin",
    country: "Germany",
    default: true,
  },
  {
    _id: "def",
    userId: "asdfghjkl",
    fullName: "Jane Doe",
    street: "Stuttgarter Street 85",
    postalCode: "70123",
    city: "Stuttgart",
    country: "Germany",
    default: false,
  },
];

export const CheckoutPage: FC<CheckoutPageProps> = (props) => {
  const cart = useCartService();
  const { data: session } = useSession();
  const [open, setOpen] = useState<boolean>(false);
  const [selectedAddress, setSelectedAddress] = useState<AddressModel | null>(
    null
  );
  const [selectedMethod, setSelectedMethod] = useState<PaymentType | null>(
    null
  );

  const [userInfos, setUserInfos] = useState({
    title: "",
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
  });

  const router = useRouter();

  useEffect(() => {
    if (cart && cart.items.length === 0) {
      router.push("/cart");
    }
  }, [cart]);

  const handleShippingAdress = (name: string, value: string) => {
    setSelectedAddress((prev) => ({
      ...prev!,
      [name]: value,
    }));
  };

  const handleUserInfos = (name: string, value: string) => {
    setUserInfos((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className=" w-full container max-w-4xl mx-auto min-h-screen flex flex-col gap-4 py-16">
      <div className=" my-2 md:my-4 flex items-center justify-between pt-16">
        <span className=" flex items-center p-0 gap-2 md:gap-4 text-xl md:text-2xl">
          Checkout
        </span>
        <Button onClick={() => router.back()} variant="outline">
          Back to Cart
        </Button>
      </div>

      <div className="grid md:grid-cols-3 md:gap-3">
        <div className="col-span-1 my-6 md:mt-0 px-2 flex flex-col gap-2 sm:hidden">
          <h2 className="text-xl">Cart Details</h2>
          <div className=" flex flex-col">
            {cart.items.map((item, index) => (
              <div key={index} className="flex py-4 border-b-[1px] relative">
                <Image
                  src={item.image.url}
                  alt={item.slug}
                  width={60}
                  height={60}
                  className=" flex-none w-[50px] h-[50px] rounded-md object-cover object-center cursor-pointer"
                />

                <div className=" grow flex flex-col gap-1 md:gap-2 pl-2 md:pl-4">
                  <h1 className=" w-full text-sm line-clamp-2 ">{item.name}</h1>

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
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <CartSummaryPrices />
        </div>

        <div className="md:col-span-2">
          {session && session.user ? (
            <div className="flex flex-col gap-6">
              <CustomerInfoForm
                customer={userInfos}
                onChangeValues={handleUserInfos}
              />
              <AddressForm
                onChange={setSelectedAddress}
                addressList={AddressList}
                selectedAddress={selectedAddress}
                onChangeValues={handleShippingAdress}
              />
              <PaymentMethodForm
                onChange={setSelectedMethod}
                selectedMethod={selectedMethod}
              />

              <div className="mt-3 flex items-center gap-3 w-full sm:w-[90%]">
                <Button
                  onClick={() => router.push("/cart")}
                  className="flex-1 cursor-pointer"
                  variant="outline"
                >
                  Back to Cart
                </Button>
                <Button
                  onClick={() => console.log("checkout")}
                  className="flex-1 cursor-pointer"
                >
                  Checkout
                </Button>
              </div>
            </div>
          ) : (
            <>
              <CheckoutForm
                customer={userInfos}
                selectedAddress={selectedAddress}
                onChangeMethod={setSelectedMethod}
                onChangeUserValues={handleUserInfos}
                onChangeAddressValues={handleShippingAdress}
                selectedMethod={selectedMethod}
              />
            </>
          )}
        </div>

        <div className="col-span-1 mt-6 md:mt-0 px-2 hidden sm:flex flex-col gap-2">
          <h2 className="text-xl">Cart Details</h2>
          <div className=" flex flex-col">
            {cart.items.map((item, index) => (
              <div key={index} className="flex py-4 border-b-[1px] relative">
                <Image
                  src={item.image.url}
                  alt={item.slug}
                  width={60}
                  height={60}
                  className=" flex-none w-[50px] h-[50px] rounded-md object-cover object-center cursor-pointer"
                />

                <div className=" grow flex flex-col gap-1 md:gap-2 pl-2 md:pl-4">
                  <h1 className=" w-full text-sm line-clamp-2 ">{item.name}</h1>

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
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <CartSummaryPrices />
        </div>
      </div>
    </div>
  );
};
