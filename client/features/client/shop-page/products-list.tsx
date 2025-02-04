"use client";
import React from "react";
import { shopStore, useShopState } from "./shop-store";
import { LucideSettings2 } from "lucide-react";
import { Sorts } from "@/data/data";
import ProductCard from "@/components/product/ProductCard";
import CustomPagination from "@/components/CustomPagination";
import ProductReviews from "@/components/product/Reviews";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export default function ProductsList() {
  const { productData, categories, filterCategory } = useShopState();

  return (
    <div className="min-h-screen w-full flex flex-col pt-16 ">
      <div className=" md:p-0 mx-auto ">
        <div className=" flex items-center justify-between">
          <div
            onClick={() => shopStore.updateOpened(true)}
            className=" flex md:hidden items-center font-semibold gap-2 justify-center border py-1 px-3  rounded-sm cursor-pointer"
          >
            <LucideSettings2 />
            Filters
          </div>

          <ScrollArea className="w-full whitespace-nowrap">
            <div className=" hidden md:flex flex-grow items-center gap-2">
              {categories.map((category, index) => {
                return (
                  <div
                    key={index}
                    onClick={() => shopStore.updateByCategory(category)}
                    className={`border py-1 px-4 cursor-pointer rounded-md ${
                      category == filterCategory &&
                      "bg-foreground text-background"
                    } hover:bg-foreground hover:text-background duration-100`}
                  >
                    {category}
                  </div>
                );
              })}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          <div className=" flex flex-none min-w-fit items-center gap-2 py-1">
            <span className="mr-2 flex-none">Sort by:</span>
            <SelectSort />
          </div>
        </div>
        <div className=" flex flex-col my-[2rem] gap-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 md:grid-cols-3 xl:grid-cols-4">
            {productData?.data.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
          <div className="mt-[4rem]">
            <CustomPagination
              currentPage={productData?.currentPage as number}
              totalPages={productData?.totalPages as number}
              totalRecords={productData?.totalRecords as number}
              goToPage={(page) => shopStore.updatePage(page)}  
            />
          </div>
        </div>

        <div className=" my-16">
          <ProductReviews rating={5} reviews={4} />
        </div>
      </div>
    </div>
  );
}

function SelectSort() {
  const { filterSort } = useShopState();
  return (
    <Select
      onValueChange={(value) => shopStore.updateFilterSort(value)}
      value={filterSort.value}
    >
      <SelectTrigger>
        <SelectValue placeholder={filterSort.type} />
      </SelectTrigger>
      <SelectContent>
        {Sorts.map((item, index) => {
          return (
            <SelectItem key={index} value={item.value}>
              {item.type}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
