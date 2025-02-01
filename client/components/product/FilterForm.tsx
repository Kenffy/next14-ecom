"use client";

import React from "react";
import SearchForm from "../SearchForm";
import CustomPriceFilterForm from "../CustomPriceFilterForm";
import { Button } from "../ui/button";
import {
  shopStore,
  useShopState,
} from "@/features/client/shop-page/shop-store";
import { CustomComboBox } from "../CustomComboBox";

export default function FilterForm({
  isSideFilter,
}: {
  isSideFilter?: boolean;
}) {
  const { categories, filterCategory } = useShopState();

  return (
    <div className=" flex flex-col gap-6 w-full">
      <h2 className=" text-3xl mt-2">Filters</h2>

      <div className=" flex flex-col gap-2">
        <h4>Search</h4>
        <SearchForm />
      </div>

      <div className=" flex flex-col gap-2">
        <h4>Categories</h4>
        <CustomComboBox
          selected={filterCategory as string}
          onChange={(value) => shopStore.updateFilterCategory(value)}
          items={categories as Array<string>}
          width="w-full"
        />
      </div>
      <div className=" flex flex-col gap-2">
        <h4>Price</h4>
        <CustomPriceFilterForm />
      </div>

      <div className=" flex gap-2 items-center justify-around">
        {isSideFilter && (
          <Button
            variant="outline"
            onClick={() => shopStore.updateOpened(false)}
            className=" flex-1 py-1 px-2  "
          >
            Cancel
          </Button>
        )}
        <Button onClick={()=> shopStore.updateFilter()} className=" flex-1 py-1 px-2  ">Apply</Button>
      </div>
    </div>
  );
}
