import * as z from "zod";

export const CategorySchema = z.object({
  name: z.string().min(1, {
    message: "Category name is Required",
  }),
  desc: z.string(),
});
