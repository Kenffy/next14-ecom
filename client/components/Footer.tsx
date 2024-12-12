"use client";
import Link from "next/link";
import { FaInstagram } from "react-icons/fa";
//import { FaYoutube } from "react-icons/fa";
import { FiYoutube } from "react-icons/fi";
import { AiOutlineHome } from "react-icons/ai";
import { CgShoppingBag } from "react-icons/cg";
import { MdOutlineLocalShipping } from "react-icons/md";
import { RxAvatar } from "react-icons/rx";
//import { FaEnvelope } from "react-icons/fa";
import { FaRegEnvelope } from "react-icons/fa6";
//import { FaLocationDot } from "react-icons/fa6";
import { SlLocationPin } from "react-icons/sl";
//import { FaPhoneAlt } from "react-icons/fa";
import { FiPhone } from "react-icons/fi";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Separator } from "./ui/separator";

export default function Footer() {
  const { theme } = useTheme();
  return (
    <footer className=" flex flex-col bg-foreground text-background">
      <div className=" container py-10 grid md:grid-cols-3 gap-4">
        <div className="flex flex-col gap-4 mb-[2rem] md:mb-0">
          <Link
            href="/"
            className=" flex items-center"
            suppressHydrationWarning
          >
            <Image
              src={
                theme == "dark" ? "/images/logo.png" : "/images/logo-white.png"
              }
              alt="temosco logo"
              width={100}
              height={100}
              className="h-[40px] w-[40px] object-contain object-center"
            />

            <h1 className="text-2xl font-semibold ml-1">
              Temos<span>Co</span>
            </h1>
          </Link>
          <div>
            <p className=" text-sm w-[90%] p-1">
              Temosco is a small clothing, home decoration and accessories
              family business. With us, every customer is part of the family.
            </p>
          </div>
          <h2 className=" text-xl">Follow us</h2>
          <div className=" flex items-center gap-6">
            <Link href={`#socials`}>
              <FaInstagram size={24} />
            </Link>
            <Link href={`#socials`}>
              <FiYoutube size={24} />
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-4 mb-[2rem] md:mb-0">
          <h2 className=" text-xl">Quick Links</h2>
          <div className="flex flex-col gap-6 mt-2">
            <Link className=" flex items-center gap-4 text-sm" href={`/`}>
              <AiOutlineHome size={22} />
              Home
            </Link>
            <Link className=" flex items-center gap-4 text-sm" href={`/shop`}>
              <CgShoppingBag size={22} />
              Shop
            </Link>
            <Link className=" flex items-center gap-4 text-sm" href={`/orders`}>
              <MdOutlineLocalShipping size={22} />
              Order Tracking
            </Link>
            <Link
              className=" flex items-center gap-4 text-sm"
              href={`/profile`}
            >
              <RxAvatar size={22} />
              My Account
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-4 mb-[2rem] md:mb-0">
          <h2 className=" text-xl">Contact</h2>
          <div className="flex flex-col gap-6 mt-2">
            <div className=" flex items-center gap-4 text-sm">
              <SlLocationPin size={22} />
              Musterstraße 15, 44578 Musterstadt.
            </div>
            <div className=" flex items-center gap-4 text-sm">
              <FaRegEnvelope size={22} />
              temosco@example.com
            </div>
            <div className=" flex items-center gap-4 text-sm">
              <FiPhone size={22} />
              +49 145 5544871
            </div>
            <div className=" flex items-center gap-2">
              <img
                src="/images/mcard.png"
                className=" h-[30px] w-[55px] border py-1 rounded-md object-contain"
                alt="master card"
              />
              <img
                src="/images/visa.png"
                className=" h-[30px] w-[55px] border py-1 rounded-md object-contain"
                alt="visa card"
              />
              <img
                src="/images/paypal.png"
                className=" h-[30px] w-[55px] border py-1 rounded-md object-contain"
                alt="paypal"
              />
              <img
                src="/images/gpay.png"
                className=" h-[30px] w-[55px] border py-1 rounded-md object-contain"
                alt="google pay"
              />
            </div>
          </div>
        </div>
      </div>
      {/* <Separator /> */}
      <div className="p-4 border-t text-sm">
        <p className=" text-center py-4">
          Copyright © 2024 - All right reserved by Temesco
        </p>
      </div>
    </footer>
  );
}
