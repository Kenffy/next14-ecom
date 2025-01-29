"use client";
import { GrClose } from "react-icons/gr";
import FilterForm from "./FilterForm";
import { shopStore, useShopState } from "@/features/client/shop-page/shop-store";

export default function Filters() {
  const { isOpened } = useShopState();
  
  return (
    <div
      className={` ${
        isOpened ? " translate-x-0" : "translate-x-[-100%]"
      } duration-150 min-h-screen w-full fixed flex left-0 z-30 bg-black/50`}
    >
      <div
        className={` z-50 flex flex-col gap-4 p-4 min-w-[70%] md:min-w-[40%] lg:min-w-[250px] min-h-screen overflow-y-auto bg-background text-foreground relative`}
      >
        <GrClose
          onClick={() => shopStore.updateOpened(false)}
          className=" absolute p-2 right-4 top-4 h-[45px] w-[45px] rounded-full cursor-pointer hover:bg-black/20"
        />

        <div className="mt-[4rem]">
          <FilterForm isSideFilter={true} />
        </div>
      </div>
      <div
        className=" flex-grow-1 min-h-screen w-full z-50"
        onClick={() => shopStore.updateOpened(false)}
      ></div>
    </div>
  );
}
