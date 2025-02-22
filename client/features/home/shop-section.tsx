"use client"

import { FC } from "react";
import { useHomeState } from "./home-store";
import Link from "next/link";
import ProductCard from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { BaseProductModel } from "@/schemas/models";


interface ShopSectionProps {
    products: Array<BaseProductModel>
}

export const ShopSection: FC<ShopSectionProps> = (props) => {
    const {products} = props;
    //const { products } = useHomeState();

    if(products.length == 0){
        return <></>
    }

    return (
        <section id="shop" className=" container mx-auto flex items-center justify-center py-20">
            <div className=" flex flex-col gap-4">
                <h2 className=" uppercase text-2xl text-center font-semibold">
                    Our latest products
                </h2>
                <div className=" flex justify-end">
                    <Link
                        className=" hover:underline hover:font-semibold duration-75"
                        href={`/shop`}
                    >
                        <span>View All</span>
                    </Link>
                </div>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                    {products.map((product) => (
                        <ProductCard key={product.slug} product={product as BaseProductModel} />
                    ))}
                </div>
                <div className=" flex justify-center mt-5">
                    <Link href="/shop">
                        <Button className=" uppercase font-semibold">View More</Button>
                    </Link>
                </div>
            </div>
        </section>
    );
};

