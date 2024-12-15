import { Schema, model, models } from "mongoose";
import { CategoryModel } from "./models";

const CategorySchema = new Schema<CategoryModel>(
    {
      name: { type: String, required: true },
      desc: { type: String },
      brand: { type: String },
      image: { type: String },
      banner: { type: String },
    },
    { timestamps: true }
  );

  export const Category = models.Category || model("Category", CategorySchema);