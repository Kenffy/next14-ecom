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
    <div className=" lg:col-span-1 md:ml-2 flex flex-col gap-2">
      <h1 className=" text-md md:text-xl mt-6 lg:mt-0">{product.name}</h1>
      <div className=" flex items-center gap-4">
        <span className=" text-3xl font-bold">
          €{product?.discount ? product.discount : product.price}
        </span>
        {product?.discount && (
          <span className=" text-sm line-through">€{product.price}</span>
        )}
      </div>
      {product?.discount && (
        <span className=" text-primary">On sale for a limited time</span>
      )}
      <span className=" text-foreground-muted text-xs">{`VAT included (where applicable)`}</span>

      {/* <div>
        <Rating value={product.rating} />
      </div> */}

      {/* {product?.sizes && (
        <div className=" flex flex-col gap-2 mt-4">
          <span>Sizes*</span>
          <CustomSelect
            width="w-full"
            selected={existItem ? existItem.size : size}
            items={product.sizes}
            onChange={handleSize}
          />
        </div>
      )}

      {product?.colors && (
        <div className=" flex flex-col gap-2 mt-4">
          <span>Colors*</span>
          <CustomSelect
            width="w-full"
            selected={existItem ? existItem.color : color}
            items={product.colors}
            onChange={handleColor}
          />
        </div>
      )} */}

      {/* {product.personalisable && (
        <div className=" flex flex-col gap-2 mt-4">
          <span>Add your personalisation*</span>
          <span>Enter your desired text. Example: Mom</span>
          <Textarea
            value={personalisation}
            onChange={(e) => setPersonalisation(e.target.value)}
          />
        </div>
      )} */}

      {/* <div className="py-4">
        <AddCart item={orderItem} />
      </div> */}

      <div className=" flex flex-col gap-2 mt-6">
        <h2>Other details</h2>
        <div className=" flex flex-col gap-6">
          <span>
            <b>Material:</b> {product.material}
          </span>
          <div className="flex flex-col gap-2">
            <span>
              <b>Description:</b>
            </span>
            <p className={onExpand ? " line-clamp-none" : "line-clamp-3"}>
              {product.description}
            </p>
            <span
              className=" self-center text-sm font-semibold cursor-pointer w-fit bg-black/10 hover:bg-black/20 py-1 px-4 rounded-2xl"
              onClick={() => setOnExpand((prev) => !prev)}
            >
              {onExpand ? "read less" : "read more"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
