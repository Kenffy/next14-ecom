"use client"

import { CategoryModel, ProductModel } from "@/schemas/models";
import { FC, useEffect } from "react";
import { homeStore } from "./home-store";
import HomeHeader from "./home-header";
import { ShopSection } from "./shop-section";
import { ReviewSection } from "./review-section";
import { AboutSection } from "./about-section";
import { ContactSection } from "./contact-section";
import Footer from "@/components/Footer";


interface HomePageProps {
    products: Array<ProductModel>;
    categories: Array<CategoryModel>;
}

export const HomePage: FC<HomePageProps> = (props) => {

    useEffect(() => {
        homeStore.initHomeSession({
            products: props.products,
            categories: props.categories,
        });
    }, [props.products, props.categories]);

    return (
        <div className="flex flex-1 flex-col gap-4 pt-0">
            <HomeHeader />
            <ShopSection />
            <ReviewSection />
            <AboutSection />
            <ContactSection />
            <Footer />
        </div>
    );
};
