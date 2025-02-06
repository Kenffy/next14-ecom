"use client";

import React, { FC, useRef, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import "swiper/css";
import { FileModel } from "@/schemas/models";

interface ImageSliderProps {
  images: Array<FileModel>;
}

export const ImageSlider: FC<ImageSliderProps> = ({ images }) => {
  const swiperRef = useRef<SwiperCore | null>(null);

  const [activeImage, setActiveImage] = useState(0);
  const handleActiveImage = (index: number) => {
    setActiveImage(index);
    swiperRef.current?.slideTo(index);
  };
  return (
    <div className="relative">
      <div className="flex flex-col-reverse md:flex-row gap-2">
        <div className="hide-scrollbar whitespace-nowrap flex gap-3 h-20 flex-row items-center overscroll-x-auto md:flex-col overflow-y-auto md:h-[480px] lg:h-[520px] md:w-20">
          {images &&
            images.map((img, index) => (
              <button
                key={index}
                onMouseOver={() => handleActiveImage(index)}
                onClick={() => handleActiveImage(index)}
                className={`flex-none w-16 h-16 rounded-lg overflow-hidden border-2 ${
                  activeImage === index ? "border-red-600" : "border-gray-300"
                }`}
              >
                <Image
                  src={img.url}
                  alt={`Thumbnail ${index + 1}`}
                  width={80}
                  height={80}
                  className="object-cover h-full w-full"
                />
              </button>
            ))}
        </div>

        <Swiper
          className="w-full h-[400px] lg:h-[500px] overflow-hidden"
          onSlideChange={(swiper) => setActiveImage(swiper.activeIndex)}
          initialSlide={activeImage}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
        >
          {images &&
            images.map((img, index) => (
              <SwiperSlide key={index} className="overflow-hidden rounded-md ">
                <div className="relative w-full h-[360px] md:h-[480px] lg:h-[520px] col-span-3 bg-muted">
                  <Image
                    src={img.url}
                    alt={`Slide ${index + 1}`}
                    fill
                    className="object-contain"
                  />
                </div>
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </div>
  );
};
