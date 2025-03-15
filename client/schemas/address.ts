import { Schema, model, models } from "mongoose";
import { AddressModel } from "./models";

const AddressSchema = new Schema<AddressModel>(
    {
      fullName: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
      userId: { type: String, required: true },
      default: { type: Boolean, default: false }
    },
    { timestamps: true }
  );

  export const Address = models.Address || model("Address", AddressSchema);