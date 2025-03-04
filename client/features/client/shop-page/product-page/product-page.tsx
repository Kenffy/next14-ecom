"use client";

import {
  FileModel,
  OrderItem,
  ProductModel,
  VariantModel,
} from "@/schemas/models";
import Link from "next/link";
import React, { FC, useState } from "react";
import { ProductDetails } from "./product-details";
import { ArrowLeft } from "lucide-react";
import { ImageSlider } from "@/components/ImageSlider";
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProductReviews from "@/components/product/Reviews";
import { AddToCart } from "./add-cart";
import { Button } from "@/components/ui/button";
import { format } from "path";
import { formatCurrency } from "@/lib/formatters";

interface ProductPageProps {
  product: ProductModel;
  variants: Array<VariantModel>;
}

export const ProductPage: FC<ProductPageProps> = (props) => {
  const { product, variants } = props;
  const [personalisation, setPersonalisation] = useState<string>("");
  const [errors, setErrors] = useState<string>("");
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
    setErrors("");
  };

  const getProductPrice = () => {
    return selectedVariant ? selectedVariant.price : product.price;
  };

  const getProductDiscount = () => {
    return selectedVariant ? selectedVariant.discount : product.discount;
  };

  const computeCurrentPrice = () => {
    return selectedVariant
      ? (selectedVariant.discount as number) > 0
        ? product.price -
          ((selectedVariant.discount as number) * 0.01) * product.price
        : selectedVariant.price
      : (product.discount as number) > 0
      ? product.price - ((product.discount as number) * 0.01) * product.price
      : product.price;
  };

  const getProductImage = () => {
    if (
      (product.images && product.images.length > 0) ||
      (selectedVariant?.images && selectedVariant.images.length > 0)
    ) {
      return selectedVariant?.images
        ? selectedVariant.images[0]
        : product.images
        ? product.images[0]
        : null;
    }
    return null;
  };

  const handleErrors = () => {
    if (product.type === "variable" && (!selectedVariant || (product.personalisable && !personalisation))) {
      const message = `Please select fill all the required fields to continue`;
      setErrors(message);
    }
  };


  const isVariantInStock = (choices: { [key: string]: string }) => {
    return variants.some((variant) => {
      const variantAttribures = variant.attributes;
      if (!variantAttribures) return false;

      return (
        Object.entries(choices).every(
          ([key, value]) => variantAttribures.some((attr) => attr.name === key && attr.value === value)
        ) &&
        variant.inventory?.status !== "out_of_stock" &&
        variant.inventory?.quantity &&
        variant.inventory?.quantity > 0
      );
    });
  };

  const orderItem: OrderItem = {
    name: product.name,
    slug: product.slug as string,
    price: getProductPrice(),
    discount: getProductDiscount(),
    productId: product._id!,
    image: getProductImage() as FileModel,
    personalisable: product.personalisable as boolean,
    personalisation: personalisation,
    qty: 0,
    variable: product.type === "variable",
    variantId: selectedVariant?._id,
    attributes: selectedVariant?.attributes,
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
          <h1 className="text-2xl lg:text-4xl font-bold mb-2">
            {product.name}
          </h1>
          <div className="flex flex-col gap-2 md:flex-row justify-start items-center mb-4">
            <div className="w-full flex items-center gap-2">
              <span className="text-3xl font-bold">
                {formatCurrency(computeCurrentPrice())}
              </span>
              {(selectedVariant?.discount as number) > 0 ||
                (product?.discount as number) > 0 && (
                  <span className="line-through ml-3 text-gray-500">
                    €{selectedVariant ? selectedVariant.price : product.price}
                  </span>
                )}
              <span className="ml-3 bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs">
                On sale for a limited time
              </span>
            </div>
            <span className="w-full text-foreground-muted text-xs">{`VAT included (where applicable)`}</span>
          </div>

          <div className="flex items-center">
            <span className="text-yellow-500 text-lg">★★★★★</span>
            <span className="ml-3 text-gray-600">(132 Reviews)</span>
          </div>

          {product.type === "variable" && product.attributes && (
            <div className="flex flex-col gap-3 mt-4">
              {errors && <span className="text-sm text-red-500">{errors}</span>}
              <div className="mb-4 bg-background mt-4">
                {product.attributes.map((attribute) => {
                  return (
                    <div
                      key={attribute.id}
                      className=" flex flex-col gap-2"
                    >
                      <span>{attribute.name}*</span>
                      <Select
                        onValueChange={(item) =>
                          handleAttributeChange(attribute.name, item)
                        }
                        value={selectedAttributes[attribute.name]}
                      >
                        <SelectTrigger
                          className={(errors && !selectedVariant) ? "border-red-500 not-allowed" : ""}
                        >
                          <SelectValue
                            placeholder={`Select ${attribute.name}`}
                          />
                        </SelectTrigger>
                        <SelectContent className="">
                          <SelectGroup>
                            {attribute.values.map((value, index) => {
                              const isAvailable = !isVariantInStock({
                                ...selectedAttributes,
                                [attribute.name]: value,
                              });
                              return (
                                <SelectItem
                                  //disabled={isAvailable}
                                  key={index}
                                  value={value}
                                >
                                  {/* {value} {isAvailable && <span className="text-xs text-red-500">nicht vorrätig</span>} */}
                                  {value}{" "}
                                  {isAvailable && (
                                    <span className="text-xs text-red-500 ml-3">
                                      {"(Out of stock)"}
                                    </span>
                                  )}
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
            </div>
          )}

          {product.personalisable && (
            <div className=" flex flex-col gap-2 mt-4">
              <span>Add your personalisation*</span>
              <span className="text-sm text-muted-foreground">
                Enter your desired text. Example: Mom
              </span>
              <Textarea
                className={(errors && !personalisation) ? "border-red-500" : ""}
                value={personalisation}
                onChange={(e) => {
                  setPersonalisation(e.target.value);
                  setErrors("");
                }}
              />
            </div>
          )}

          {/* Add to Cart Button */}
          <div className="w-full mt-6">
            {product.type === "simple" && <AddToCart product={orderItem} />}
            {product.type === "variable" && 
            <>
              {((selectedVariant && !product.personalisable) || (selectedVariant && product.personalisable && personalisation)) ? <AddToCart product={orderItem} /> : 
              <Button onClick={handleErrors} className="w-full  md:w-[180px]">
                <span>Add to Cart</span>
              </Button>}
              </>
            }
          </div>
        </div>
      </div>
      <div className=" flex flex-col my-10 gap-6">
        <ProductDetails product={product} />
        <ProductReviews
          rating={product.rating as number}
          reviews={product.reviews as number}
        />
      </div>
    </div>
  );
};
