import { model, models, Schema } from "mongoose";
import { InventoryStatus, VariantModel } from "./models";

const VariantSchema = new Schema<VariantModel>(
    {
      productId: { type: String, required: true },
      sku: { type: String, required: true, unique: true },
      price: { type: Number, required: true },
      discount: { type: Number },
      attributes: [{ name: String, value: String }],
      inventory: {
        quantity: {type: Number, required: true, default: 1},
        status: {type: String, enum: InventoryStatus, default: "low_stock"},
      },
      images: {
        type: [
          {
            name: String,
            location: String,
            url: String,
          },
        ],
        default: [],
        maxlength: 5,
      },
      deleted: { type: Boolean, default: false }
    },
    { timestamps: true }
  );

export const Variant = models.Variant || model("Variant", VariantSchema);