"use client"

import CustomPagination from "@/components/CustomPagination";
import CustomSelect from "@/components/CustomSelect";
import ProductCard from "@/components/product/ProductCard";
import { Sorts } from "@/data/data";
import React, { FC, useEffect } from "react";
import { shopStore, useShopState } from "./shop-store";
import { LucideSettings2 } from "lucide-react";
import ProductReviews from "@/components/product/Reviews";
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
      categories: props.categories,
    });
  }, [props.products, props.categories]);

  return (
    <div className="w-full flex flex-col min-h-screen">
        <BannerSlider />
        <Filters />
        <div className="container mx-auto">
          <div className="flex">
            <div className=" flex-none hidden lg:grid lg:col-span-1 pt-16 pr-6">
              <FilterForm />
            </div>
            <div className="flex-4 flex-grow">
            <ProductsList />
            </div>
            
          </div>
        </div>
      </div>
  );
};
