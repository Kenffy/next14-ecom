"use client"

import React, { FC, useEffect } from "react";
import { shopStore } from "./shop-store";
import { BaseProductModel, CategoryModel } from "@/schemas/models";
import BannerSlider from "@/components/product/BannerSlider";
import Filters from "@/components/product/Filters";
import FilterForm from "@/components/product/FilterForm";
import ProductsList from "./products-list";

interface ShopPageProps {
  products: Array<BaseProductModel>;
  categories: Array<CategoryModel>;
}

export const ShopPage: FC<ShopPageProps> = (props) => {

  useEffect(() => {
    shopStore.initShopSession({
      products: props.products,
      categories: props.categories.map((category) => category.name),
    });
  }, [props.products, props.categories]);

  return (
    <div className="w-full flex flex-col min-h-screen">
        <BannerSlider />
        <Filters />
        <div className="container mx-auto">
          <div className="flex">
            <div className=" flex-none w-[70%] sm:w-80 md:w-72 hidden md:flex pt-16 pr-6">
              <FilterForm />
            </div>
            <div className="flex-grow">
            <ProductsList />
            </div>
            
          </div>
        </div>
      </div>
  );
};
