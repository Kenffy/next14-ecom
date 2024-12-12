"use client"

import { FC } from "react";
import { useHomeState } from "./home-store";
import Link from "next/link";
import ProductCard from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { ProductModel } from "@/schemas/models";
import { Reviews } from "@/data/data";
import ReviewCard from "@/components/product/ReviewCard";


interface ReviewSectionProps {
}

export const ReviewSection: FC<ReviewSectionProps> = (props) => {

    return (
        <section id="reviews" className=" container max-w-5xl mx-auto flex items-center justify-center py-20">
            <div className=" flex flex-col gap-4">
                <h2 className=" mb-10 uppercase text-2xl text-center font-semibold">
                    Customer Reviews
                </h2>
                <div className=" flex justify-end">
                    <Link
                        className=" hover:underline hover:font-semibold duration-75"
                        href={`/reviews`}
                    >
                        <span>View All</span>
                    </Link>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
                    {Reviews.map((review) => (
                        <ReviewCard key={review.id} review={review} />
                    ))}
                </div>
            </div>
        </section>
    );
}
