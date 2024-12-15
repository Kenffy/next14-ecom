"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export const HomeHeader = () => {
    return (
        <div
            id="header"
            className="  max-h-screen container max-w-5xl mx-auto md:px-4 pt-[6rem]"
        >
            <div className="flex flex-col-reverse md:flex-row md:items-center gap-4 md:py-[4rem]">
                <div className=" flex-1 flex items-center justify-center">
                    <div className=" flex items-center justify-center md:items-start md:justify-start w-full flex-col">
                        <h1 className=" text-center md:text-start mb-4 text-2xl font-bold  md:text-3xl lg:text-4xl md:mb-8">
                            Clothing, Home Decor and Accessories
                        </h1>
                        <p className=" text-center md:text-start max-w-md leading-relaxed  xl:text-lg mb-10">
                            Our goal is to constantly offer new garments for all occasions
                            that you won't find anywhere else. We are the best so come and
                            shop with us.
                        </p>
                        <Link href="/shop">
                            <Button className=" uppercase font-semibold">Shop Now</Button>
                        </Link>
                    </div>
                </div>

                <div className=" flex-1 w-full h-full">
                    <div className=" flex items-center justify-center w-full h-full">
                        <Image
                            src={`/images/collage4.png`}
                            alt="header collage"
                            className=" object-cover object-center h-full w-full"
                            priority
                            width={640}
                            height={640}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
