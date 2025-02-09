"use client";
import { BsBagXFill } from "react-icons/bs";
import { MdClose } from "react-icons/md";
import { BiSolidCoupon } from "react-icons/bi";
import Image from "next/image";
import React, { FC } from "react";
import PaymentSelect from "@/components/PaymentSelect";
import useCartService from "@/hooks/useCartStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { OrderItem } from "@/schemas/models";
import { formatCurrency } from "@/lib/formatters";
import Link from "next/link";
import { FaArrowLeftLong } from "react-icons/fa6";
import { CartSummary } from "./cart-summary";

interface CartPageProps {
}

export const CartDetailsPage: FC<CartPageProps> = (props) => {
  const cart = useCartService();

  const handleIncrement = (item: OrderItem) => {
    cart.increase(item);
  };

  const handleDecrement = (item: OrderItem) => {
    cart.decrease(item);
  };

  return (
    <div className=" w-full container mx-auto min-h-screen flex flex-col gap-4 py-16">
      <div className=" my-2 md:my-4 flex items-center justify-between pt-16">
        <span className=" flex items-center p-0 gap-2 md:gap-4 text-xl md:text-2xl">
          {cart.items.length}{" "}
          {`${cart.items.length > 1 ? "items" : "item"} in your basket`}
        </span>
        <Button onClick={() => cart.clearCart()} variant="outline">
          Clear Basket
        </Button>
      </div>

      <div className="grid md:grid-cols-3 md:gap-3">
        <Card className="md:col-span-2 p-2 md:p-4 rounded-md">
          <div className=" flex flex-col">
            {cart.items.map((item, index) => (
              <div key={index} className="flex py-4 border-b-[1px] relative">
                <Image
                  src={item.image.url}
                  alt={item.slug}
                  width={250}
                  height={250}
                  className=" flex-none w-[60px] h-[60px] md:w-[80px] md:h-[80px] lg:w-[110px] lg:h-[110px] rounded-md object-cover object-center cursor-pointer"
                />

                <div className=" grow flex flex-col gap-1 md:gap-2 pl-2 md:pl-4">
                  <h1 className=" w-[90%] text-sm font-bold md:text-xl line-clamp-1 ">
                    {item.name}
                  </h1>
                  <div className="">
                    <span className=" text-md md:text-xl font-semibold">
                      {formatCurrency(item.price * item.qty)}
                    </span>
                  </div>
                  {/* <div className=" flex items-center gap-4">
                    <span className=" text-sm">
                      <b>Color:</b> {item.color}
                    </span>
                    <span className=" text-sm">
                      <b>Size:</b> {item.size}
                    </span>
                  </div> */}

                  <div className=" flex items-center gap-2 md:gap-4">
                    <div className=" w-full flex items-center justify-between">
                      <div className="flex items-center">
                        <span className=" text-sm md:text-md">{`${
                          item.qty
                        }x${formatCurrency(item.price)}`}</span>
                        {/* <select className=" bg-transparent outline-none p-1 border rounded-md overflow-hidden">
                      {[...Array(20)].map((item, index) => (
                        <option className=" text-black" key={index + 1}>
                          {index + 1}
                        </option>
                      ))}
                    </select> */}

                        <div className=" w-fit ml-4 flex items-center border-[2px] border-white/20 rounded-md overflow-hidden">
                          <Button
                            variant="outline"
                            onClick={() => handleDecrement(item)}
                            className=" text-xl h-[30px] w-[30px] cursor-pointer "
                          >
                            -
                          </Button>
                          <div className=" flex items-center justify-center h-[30px] w-[30px]">
                            <span className=" text-center">{item.qty}</span>
                          </div>
                          <Button
                            variant="outline"
                            onClick={() => handleIncrement(item)}
                            className=" text-xl h-[30px] w-[30px] cursor-pointer"
                          >
                            +
                          </Button>
                        </div>
                      </div>
                      <Button
                        onClick={() => cart.remove(item)}
                        variant="destructive"
                        className=" h-[30px] px-2 flex items-center justify-center gap-1"
                      >
                        <MdClose size={15} />
                        <span className=" hidden md:block">remove</span>
                      </Button>
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

            <form className=" flex items-center border-[2px] border-white/50 rounded-md overflow-hidden w-fit">
              <Input
                type="text"
                placeholder="Enter coupon code"
                className=" rounded-r-none"
              />
              <Button className=" rounded-l-none font-bold">Apply</Button>
            </form>

            <div className=" flex items-center mt-2">
              <Link href="/shop" className=" text-md">
                <Button variant="outline">
                  <FaArrowLeftLong />
                  <span className="ml-2">Continue shop</span>
                </Button>
              </Link>
            </div>

            <div className=" flex items-center justify-end mt-4">
              <span className=" text-xs">
                Estimated delivery: 2-3 days from Germany
              </span>
            </div>
          </div>
        </Card>

        <div className="col-span-1 mt-6 md:mt-0 px-2 md:pl-4 flex flex-col gap-2">
          <PaymentSelect />
          <CartSummary cart={cart} />
        </div>
      </div>
    </div>
  );
}
