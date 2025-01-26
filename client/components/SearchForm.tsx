import React from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { IoSearch } from "react-icons/io5";
import {
  shopStore,
  useShopState,
} from "@/features/client/shop-page/shop-store";

export default function SearchForm() {
  const { search } = useShopState();
  return (
    <form className=" flex items-center">
      <Input
        value={search}
        onChange={(e) => shopStore.updateSearch(e.target.value)}
        type="search"
        placeholder="Search..."
        className=" bg-transparent py-2 px-3 outline-none focus-within:outline-none focus-visible:ring-0 focus-visible:ring-transparent flex-grow rounded-r-none"
      />
      <Button variant="outline" className=" h-full px-2 rounded-l-none">
        <IoSearch size={22} />
      </Button>
    </form>
  );
}
