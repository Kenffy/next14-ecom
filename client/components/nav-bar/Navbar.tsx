"use client";
import Link from "next/link";
import { CgShoppingBag } from "react-icons/cg";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { MdClose } from "react-icons/md";
import { useEffect, useState } from "react";
//import ToggleTheme from "./ToggleTheme";
//import useCartService from "@/hooks/useCartStore";
import Image from "next/image";
import { useTheme } from "next-themes";
import { UserMenu } from "./user-menu";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import GlobalInformationBar from "../GlobalInformationBar";
import useCartService from "@/hooks/useCartStore";

const links = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "Reviews", href: "/reviews" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const { items } = useCartService();
  const { theme } = useTheme();
  const path = usePathname();

  const [onMenu, setOnMenu] = useState<boolean>(false);
  const [currIndex, setCurrIndex] = useState<number>(0);
  const [mounted, setMounted] = useState<boolean>(false);
  const user = false;

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header
      className={` fixed top-0 w-full z-20 border-b bg-background text-foreground`}
    >
      <>
      <GlobalInformationBar />
      <div className=" container flex items-center justify-between mx-auto relative py-4">
        <Link href="/" className=" flex items-center">
          <Image
            src={
              theme == "dark" ? "/images/logo-white.png" : "/images/logo.png"
            }
            alt="temosco logo"
            width={100}
            height={100}
            className="h-[40px] w-[40px] object-contain object-center"
          />

          <h1 className="text-2xl font-semibold">
            Temos<span>Co</span>
          </h1>
        </Link>

        <nav className=" hidden gap-6 md:flex">
          {links.map((link, idx) => (
            <div
              key={idx}
              onClick={() => {
                setCurrIndex(idx);
                setOnMenu(false);
              }}
            >
              <Link
                className={cn(
                  "text-lg transition duration-100 text-gray-500 hover:font-semibold",
                  path === link.href ? " text-foreground font-semibold" : ""
                )}
                href={link.href}
              >
                {link.name}
              </Link>
            </div>
          ))}
        </nav>

        <nav
          className={` ${
            onMenu ? "flex" : "hidden"
          } flex-col items-center pt-10 absolute top-[3rem] left-0 w-full min-h-screen gap-6 md:hidden bg-white dark:bg-background`}
        >
          {links.map((link, idx) => (
            <div
              key={idx}
              onClick={() => {
                setCurrIndex(idx);
                setOnMenu(false);
              }}
            >
              <Link
                className={cn(
                  "text-lg transition duration-100 text-gray-500 hover:font-semibold",
                  path === link.href ? " text-foreground font-semibold" : ""
                )}
                href={link.href}
              >
                {link.name}
              </Link>
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-6 md:gap-8">
          {/* <div className="cursor-pointer">
            <ToggleTheme />
          </div> */}

          <Link href={`/cart`} className=" cursor-pointer relative">
            <CgShoppingBag size={24} />
            {mounted && items.length != 0 && (
              <div className=" absolute top-[-10px] right-[-12px] h-[22px] w-[22px] bg-red-500 text-white text-sm font-bold rounded-full flex justify-center item-center">
                {items.reduce((a: any, c: any) => a + c.qty, 0)}
              </div>
            )}
          </Link>

          <div>
            <UserMenu />
          </div>

          <div
            onClick={() => setOnMenu((prev) => !prev)}
            className=" md:hidden cursor-pointer border py-1 px-2 rounded-md"
          >
            {onMenu ? <MdClose size={24} /> : <HiOutlineMenuAlt3 size={24} />}
          </div>
        </div>
      </div>
      </>
    </header>
  );
}
