"use client";
import CustomSelect from "@/components/CustomSelect";
import Rating from "@/components/Rating";
import { FC, useEffect, useState } from "react";
//import AddCart from "./AddCart";
//import { OrderItem, Product } from "@/types";
import { Textarea } from "@/components/ui/textarea";
//import useCartService from "@/hooks/useCartStore";
import { ProductModel } from "@/schemas/models";

type ProductDetailsProps = {
  product: ProductModel;
};

export const ProductDetails: FC<ProductDetailsProps> = ({ product }) => {
  //   const { items } = useCartService();
  //   const [existItem, setExistItem] = useState<OrderItem | undefined>();
  const [onExpand, setOnExpand] = useState<boolean>(false);
  //   const [color, setColor] = useState<string>(
  //     product?.colors ? product.colors[0] : ""
  //   );
  //   const [size, setSize] = useState<string>(
  //     product?.sizes ? product.sizes[0] : ""
  //   );
  //   const [personalisation, setPersonalisation] = useState<string>("");

  //   useEffect(() => {
  //     const orderItem = items.find((x) => x.slug === product.slug);
  //     if (orderItem) {
  //       setExistItem(orderItem);
  //       setPersonalisation(orderItem.personalisation!);
  //     }
  //   }, [product, items]);

  //   const handleColor = (color: any) => {
  //     setColor(color);
  //   };

  //   const handleSize = (size: any) => {
  //     setSize(size);
  //   };

  //   const orderItem: OrderItem = {
  //     name: product.name,
  //     slug: product.slug,
  //     price: product.price,
  //     discount: product?.discount ? product.discount : 0,
  //     productId: product._id!,
  //     image: product.images[0],
  //     personalisable: product.personalisable,
  //     personalisation,
  //     qty: 0,
  //     color,
  //     size,
  //   };

  return (
    <div className="flex flex-col gap-4">
      {/* <div>
        <Rating value={product.rating} />
      </div> */}

      {/* <div className="py-4">
        <AddCart item={orderItem} />
      </div> */}

      <div className=" flex flex-col gap-2">
      <div className=" flex items-center gap-4 py-3 border-b-[2px]">
        <h1 className=" text-xl font-bold">Product details</h1>
      </div>
        <h2 className="font-bold mt-4">
          {product.name}
        </h2>
        <div className={`flex flex-col gap-3`}>
          <div className="flex flex-col">
            <div className="w-full flex flex-col gap-2">
              <span className="font-semibold">Description</span>
              <p className={onExpand ? " line-clamp-none" : "line-clamp-3"}>
                {product.description}
              </p>
            </div>

            <span
              className="mt-2 self-center text-sm font-semibold cursor-pointer w-fit bg-black/10 hover:bg-black/20 py-1 px-4 rounded-2xl"
              onClick={() => setOnExpand((prev) => !prev)}
            >
              {onExpand ? "read less" : "read more"}
            </span>
          </div>

          {product?.brand && (
            <div className="w-full flex items-center gap-2">
              <span className="font-semibold">Brand:</span>
              <p>{product.brand}</p>
            </div>
          )}
          {/* <div className="w-full flex items-center gap-2">
            <span className="font-semibold">Default Price:</span>
            <p>{product.price}€</p>
          </div> */}

          {product.dimensions && (
            <div className="w-full flex items-center gap-2">
              <span className="font-semibold">Dimensions:</span>
              <p>
                {product.dimensions?.length} x {product.dimensions?.width} x{" "}
                {product.dimensions?.height} Cm
              </p>
            </div>
          )}
          <div className="w-full flex items-center gap-2">
            <span className="font-semibold">Material:</span>
            <p>{product.material ? product.material : "-"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
