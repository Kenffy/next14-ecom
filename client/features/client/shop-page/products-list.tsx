"use client";
import React from "react";
import { shopStore, useShopState } from "./shop-store";
import { LucideSettings2 } from "lucide-react";
import CustomSelect from "@/components/CustomSelect";
import { Sorts } from "@/data/data";
import ProductCard from "@/components/product/ProductCard";
import CustomPagination from "@/components/CustomPagination";
import ProductReviews from "@/components/product/Reviews";

export default function ProductsList() {
  const { products, categories, filterSort, filterCategory } = useShopState();

  return (
    <div className="min-h-screen w-full flex flex-col pt-16 ">
      <div className=" md:p-0 mx-auto ">
        <div className=" flex items-center justify-between">
          <div
            onClick={() => shopStore.updateOpened(true)}
            className=" flex lg:hidden items-center font-semibold gap-2 justify-center border py-1 px-3  rounded-sm cursor-pointer"
          >
            <LucideSettings2 />
            Filters
          </div>

          <div className=" hidden lg:flex items-center gap-2">
            {categories.map((cat, index) => {
              return (
                <div
                  key={index}
                  onClick={() => shopStore.updateFilterCategory(cat)}
                  className={`border py-1 px-4 cursor-pointer rounded-md ${
                    cat._id == filterCategory?._id &&
                    "bg-foreground text-background"
                  } hover:bg-foreground hover:text-background duration-100`}
                >
                  {cat.name}
                </div>
              );
            })}
          </div>

          <div className=" flex items-center gap-2 py-1">
            <span>Sort by:</span>
            <CustomSelect
              selected={filterSort}
              onChange={(value) => shopStore.updateFilterSort(value)}
              items={Sorts}
            />
          </div>
        </div>
        <div className=" flex flex-col my-[2rem] gap-4">
          <div className="grid grid-cols-2 gap-3 md:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
          <div className="mt-[4rem]">
            <CustomPagination />
          </div>
        </div>

        <div className=" my-16">
          <ProductReviews rating={5} reviews={4} />
        </div>
      </div>
    </div>
  );
}
