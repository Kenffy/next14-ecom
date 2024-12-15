import * as z from "zod";

// Define the possible inventory statuses
const InventoryStatusEnum = z.enum([
  "in_stock",
  "out_of_stock",
  "low_stock",
  "backorder",
  "pre_order",
  "discontinued",
  "reserved",
  "coming_soon",
  "on_hold",
]);

// Define the ProductType enum (assuming possible types)
const ProductTypeEnum = z.enum(["simple", "variable"]);

// Define the Inventory schema
const InventorySchema = z.object({
  quantity: z.number().nonnegative({ message: "Quantity must be a non-negative number" }),
  status: InventoryStatusEnum,
});

export const ProductSchema = z.object({
  sku: z.string().min(1, {
    message: "SKU is Required",
  }),
  name: z.string().min(1, {
    message: "Product name is Required",
  }),
  description: z.string().min(1, {
    message: "Product description is Required",
  }),
  price: z.number().min(1, {
    message: "Price is Required",
  }),
  type: ProductTypeEnum,
  inventory: InventorySchema.optional(),
  brand: z.string().optional(),
  discount: z.number().optional(),
  personalisable: z.boolean().optional(),
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
