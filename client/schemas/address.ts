import { Schema, model, models } from "mongoose";
import { AddressModel } from "./models";

const AddressSchema = new Schema<AddressModel>(
    {
      street: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
    },
    { timestamps: true }
  );

  export const Address = models.Address || model("Address", AddressSchema);