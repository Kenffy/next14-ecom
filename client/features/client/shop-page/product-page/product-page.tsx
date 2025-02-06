"use client";

import ImageViewer from "@/components/ImageViewer";
import { FileModel, ProductModel, VariantModel } from "@/schemas/models";
import Link from "next/link";
import React, { FC, useRef, useState } from "react";
import { ProductDetails } from "./product-details";
import { ArrowLeft } from "lucide-react";
import { ImageSlider } from "@/components/ImageSlider";
import { Textarea } from "@/components/ui/textarea";
import CustomSelect from "@/components/CustomSelect";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ProductPageProps {
  product: ProductModel;
  variants: Array<VariantModel>;
}

export const ProductPage: FC<ProductPageProps> = (props) => {
  const { product, variants } = props;
  const [personalisation, setPersonalisation] = useState<string>("");
  const [selectedAttributes, setSelectedAttributes] = useState<{
    [key: string]: string;
  }>({});
  const [selectedVariant, setSelectedVariant] = useState<VariantModel | null>(
    null
  );

  // Handle attribute selection
  const handleAttributeChange = (attributeName: string, value: string) => {
    const updatedAttributes = { ...selectedAttributes, [attributeName]: value };
    setSelectedAttributes(updatedAttributes);

    // Find a matching variant
    if (variants) {
      const matchingVariant = variants.find((variant) =>
        variant.attributes.every(
          (attr) => updatedAttributes[attr.name] === attr.value
        )
      );
      setSelectedVariant(matchingVariant || null);
    }
  };

  return (
    <div className="container mx-auto min-h-screen flex flex-col gap-4">
      <div className=" pt-32">
        <Link href="/shop" className="hover:underline">
          <span className=" flex items-center gap-2 py-2">
            <ArrowLeft size={16} />
            Back to shop
          </span>
        </Link>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 md:gap-6 lg:gap-8">
        <div className="relative col-span-3">
          <ImageSlider images={product.images as Array<FileModel>} />
        </div>

        <div className="w-full md:col-span-2">
          <h1 className="text-md lg:text-xl font-semibold mb-2">
            Personalised Christmas Sweaters, Family Sweatshirts Christmas,
            Uniform Family Holiday Outfit, Christmas Family Pyjamas for All
          </h1>
          <div className="flex items-center mb-4">
            <span className="text-2xl font-bold">
              €
              {selectedVariant
                ? selectedVariant.discount as number > 0 ? selectedVariant.discount : selectedVariant.price
                : product.discount as number > 0 ? product.discount : product.price}
            </span>
            {selectedVariant?.discount as number > 0 || product?.discount as number > 0 &&
            <span className="line-through ml-3 text-gray-500">
              €{selectedVariant ? selectedVariant.price : product.price}
            </span>}
            <span className="ml-3 bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs">
              On sale for a limited time
            </span>
          </div>

          <div className="flex items-center mb-6">
            <span className="text-yellow-500 text-lg">★★★★★</span>
            <span className="ml-3 text-gray-600">(132 Reviews)</span>
          </div>

          {product.type === "variable" && product.attributes && (
            <div className="mb-4 bg-background">
              {product.attributes.map((attribute) => {
                return (
                  <div key={attribute.id} className=" flex flex-col gap-2 mt-4">
                    <span>{attribute.name}*</span>
                    <Select
                      onValueChange={(item) => handleAttributeChange(attribute.name, item)}
                      value={selectedAttributes[attribute.name]}
                    >
                      <SelectTrigger className="">
                        <SelectValue placeholder={`Select ${attribute.name}`} />
                      </SelectTrigger>
                      <SelectContent className="">
                        <SelectGroup>
                          {attribute.values.map((value, index) => {
                            const isAvailable = variants.every(
                                (variant) =>
                                  !variant.attributes.some(
                                    (attr) =>
                                      attr.name === attribute.name &&
                                      attr.value === value
                                  )
                              )
                            return (
                              <SelectItem disabled={isAvailable} key={index} value={value}>
                                <Button
                                  disabled={isAvailable}
                                  variant="ghost"
                                >
                                  {value}
                                </Button>
                              </SelectItem>
                            );
                          })}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {/* <CustomSelect
                        width="w-full"
                        selected={attribute.values[0]}
                        items={attribute.values}
                        onChange={(e) => console.log(e)}
                    /> */}
                  </div>
                );
              })}
            </div>
          )}

          {product.personalisable && (
            <div className=" flex flex-col gap-2 mt-4">
              <span>Add your personalisation*</span>
              <span>Enter your desired text. Example: Mom</span>
              <Textarea
                value={personalisation}
                onChange={(e) => setPersonalisation(e.target.value)}
              />
            </div>
          )}

          {/* Add to Cart Button */}
          <button className="w-full bg-red-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-red-700 transition">
            Add to Cart
          </button>
        </div>
      </div>
      <div className=" flex flex-col lg:grid lg:grid-cols-3 lg:gap-3">
        <div className="lg:col-span-2">
          <div>
            {product && (
              <ImageViewer images={product.images} details={product.name} />
            )}
          </div>

          {/* <div className=" hidden lg:flex mt-10">
            <ProductReviews
              rating={product.rating}
              reviews={product.numReviews}
            />
          </div> */}
        </div>

        <div className=" lg:col-span-1">
          <ProductDetails product={product} />
          {/* <div className=" py-6 flex lg:hidden">
            <ProductReviews
              rating={product.rating}
              reviews={product.numReviews}
            />
          </div> */}
        </div>
      </div>
    </div>
  );
};
