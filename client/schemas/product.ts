import { model, models, Schema } from "mongoose";
import { InventoryStatus, ProductModel, VariantModel } from "./models";
import slugify from "slugify";

const ProductSchema: Schema = new Schema<ProductModel>(
  {
    sku: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    slug: { type: String, required: true },
    brand: { type: String },
    description: { type: String },
    price: { type: Number },
    discount: { type: Number },
    type: { type: String, enum: ["simple", "variable"], required: true },
    inventory: {
      quantity: {type: Number, required: true, default: 1},
      status: {type: String, enum: InventoryStatus, default: "low_stock"},
    },
    defaultImage: { type: String },
    images: {
      type: [
        {
          name: String,
          location: String,
          url: String,
        }
      ],
      default: [],
      maxlength: 5,
    },
    categories: [String],
    tags: [String],
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
    },
    deleted: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
    rating: { type: Number },
    material: { type: String },
    weight: { type: String },
    reviews: { type: Number },
    personalisable: { type: Boolean, default: false },
    personalisation: { type: String },
    attributes: [
      {
        id: String,
        name: String,
        values: [String]
      }
    ],
  },
  { timestamps: true }
);

ProductSchema.pre("validate", function (next) {
  if (this.name) {
    const name = this.name as string;
    this.slug = slugify(name, { lower: true, strict: true });
  }
  next();
});

export const Product = models.Product || model("Product", ProductSchema);
