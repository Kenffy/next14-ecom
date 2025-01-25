import Rating from "@/components/Rating";
import { FaQuoteLeft } from "react-icons/fa";
import { Card } from "@/components/ui/card";
import { Reviews } from "@/data/data";
import Image from "next/image";
import React from "react";
import CustomPagination from "@/components/CustomPagination";


export default function ReviewPage() {
  return (
    <section id="reviews" className=" py-20 flex items-center overflow-hidden">
      <div className="container flex flex-col gap-4">
        <h2 className=" my-10 uppercase text-2xl text-center font-semibold">
          Customer Reviews
        </h2>
        <div className=" grid gap-6">
          {Reviews.map((review) => (
            <Card key={review.id} className=" flex flex-col gap-4 px-4 py-6">
              <div className=" flex items-center justify-between">
                <FaQuoteLeft size={24} />
                <span className=" text-sm">{review?.createdAt}</span>
              </div>

              <div className=" flex-grow">
                <p className=" text-sm">{review?.desc}</p>
              </div>

              <div className=" flex items-center justify-between">
                <div className=" flex flex-col gap-1">
                  <span className=" font-semibold">{review?.username}</span>
                  <Rating value={review?.rating} />
                </div>
                <Image
                  height={200}
                  width={200}
                  src={"/images/default.png"}
                  alt="user profile"
                  className=" h-[50px] w-[50px] md:h-[60px] md:w-[60px] rounded-full object-cover object-center cursor-pointer"
                />
              </div>
            </Card>
          ))}
        </div>
        <div className="mt-[2rem]">
          <CustomPagination />
        </div>
      </div>
    </section>
  );
}
