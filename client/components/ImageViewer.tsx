"use client";
import Image from "next/image";
import React, { useState } from "react";

export default function ImageViewer({ images }: any, details: any) {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className="flex flex-col-reverse md:flex-row gap-3 h-full w-full">
      <div className=" flex flex-row md:flex-col gap-3 w-full overflow-x-auto md:w-fit md:overflow-y-auto no-scrollbar">
        {images.map((image: any, index: number) => (
          <div
            key={index}
            onClick={() => setCurrentIndex(index)}
            className="relative w-full"
          >
            <Image
              src={image?.url}
              alt={details}
              fill
              className="object-contain"
            />
          </div>
        ))}
      </div>
      <div className=" w-full bg-white/20 rounded-md overflow-hidden">
        <Image
          src={images[currentIndex]?.url}
          alt={details}
          width={250}
          height={250}
          className="w-full h-[380px] md:h-full object-cover  cursor-pointer"
        />
      </div>
    </div>
  );
}
