"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper";
// Import Swiper styles
import 'swiper/css';
import { MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";
import { useRef } from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import { shopStore, useShopState } from "@/features/client/shop-page/shop-store";

export default function BannerSlider() {
  const swiperRef = useRef<SwiperType>();
  const { categories } = useShopState();

  return (
    <div className=" h-96 md:h-[480px] container relative pt-[6rem] md:rounded-md overflow-hidden bg-gradient-to-t from-slate-300 to-slate-100 dark:text-background">
      <div className=" absolute bottom-2 right-3 gap-2 flex items-center z-10 dark:text-foreground">
        <Button
          variant="outline"
          onClick={() => swiperRef.current?.slidePrev()}
          className=" "
        >
          <MdArrowBackIosNew size={18} />
        </Button>
        <Button
          variant="outline"
          onClick={() => swiperRef.current?.slideNext()}
          className=""
        >
          <MdArrowForwardIos size={18} />
        </Button>
      </div>
      <Swiper
        loop={true}
        autoplay={false}
        navigation={false}
        spaceBetween={0}
        slidesPerView={1}
        onBeforeInit={(swiper) => {
          swiperRef.current = swiper;
        }}
      >
        {categories.map((category, index) => (
          <SwiperSlide key={index}>
          <div className=" grid grid-cols-3 h-full">
            <div className=" p-3 col-span-2">
              <div className=" flex flex-col px-2 md:px-4 justify-center h-full gap-4">
                {category?.name?.toLocaleLowerCase() !== "all" && <span>{category.name}</span>}
                <h2 className=" text-2xl font-semibold md:text-4xl lg:text-5xl">
                  {category.brand}
                </h2>
                <Button
                  onClick={() => shopStore.updateFilterCategory(category)}
                  variant="outline"
                  className=" w-fit uppercase dark:text-foreground"
                >
                  view all
                </Button>
              </div>
            </div>
            <div className=" flex items-center justify-center col-span-1">
              <div className=" aspect-square m-2 md:m-0 h-28 md:h-44 lg:h-64 rounded-full shadow-2xl overflow-hidden flex items-center justify-center ">
                <Image
                  height={250}
                  width={250}
                  src={"/images/header.png"}
                  alt="category image"
                  className=" h-full w-full object-cover object-center cursor-pointer"
                />
              </div>
            </div>
          </div>
        </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
