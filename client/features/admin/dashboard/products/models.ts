import * as z from "zod";

export const ProductSchema = z.object({
  name: z.string().min(1, {
    message: "Product name is Required",
  }),
  desc: z.string().min(1, {
    message: "Product description is Required",
  }),
  category: z.string().min(1, {
    message: "Category is Required",
  }),
  price: z.number().min(1, {
    message: "Price is Required",
  }),
  discount: z.number(),
  quantity: z.number(),
  personalisable: z.boolean(),
});

export const ProductVariantSchema = z.object({
  color: z.string().min(1, {
    message: "Product Color is Required",
  }),
  desc: z.string(),
  size: z.string().min(1, {
    message: "Size is Required",
  }),
  price: z.number().min(1, {
    message: "Price is Required",
  }),
  quantity: z.number().min(1, {
    message: "Price is Required",
  }),
  discount: z.number(),
});
