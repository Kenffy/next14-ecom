import { model, models, Schema } from "mongoose";
import slugify from "slugify";

export type ProductDimension = {
  length: number;
  width: number;
  height: number;
};

export type FileModel = {
  fileName: string;
  location: string;
  url: string;
};

export interface UploadResponse {
  message: string;
  data: FileModel;
}

export interface UserModel {
  _id?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  image?: string;
  email: string;
  password?: string;
  emailVerified?: boolean;
  isAdmin?: boolean;
  isActive?: boolean;
  acceptedTerms?: boolean;
  lastFailedAttempts?: number;
  totalFailedAttempts?: number;
  lastAttempt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AddressModel {
  _id?: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductModel {
  _id?: string;
  name: string;
  desc: string;
  slug?: string;
  brand?: string;
  price: number;
  discount?: number;
  quantity: number;
  category?: string;
  defaultImage?: string;
  dimensions?: ProductDimension;
  variants?: string[];
  isDeleted?: boolean;
  isFeatured?: boolean;
  rating?: number;
  material?: string;
  weight?: number;
  reviews?: number;
  personalisable?: boolean;
  personalisation?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductVariantModel {
  _id?: string;
  productId: string;
  color: string;
  desc?: string;
  size: string;
  price: number;
  discount?: number;
  quantity: number;
  images?: Array<FileModel>;
  isDeleted?: boolean;
  isFeatured?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CategoryModel {
  _id?: string;
  name: string;
  desc: string;
  image?: string;
  brand?: string;
  banner?: string;
}

const UserSchema = new Schema<UserModel>(
  {
    username: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    image: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    emailVerified: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    acceptedTerms: { type: Boolean, default: false },
    lastFailedAttempts: { type: Number, default: 0 },
    totalFailedAttempts: { type: Number, default: 0 },
    lastAttempt: { type: Date },
  },
  { timestamps: true }
);

const ProductSchema = new Schema<ProductModel>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    desc: { type: String, required: true },
    brand: { type: String },
    price: { type: Number, required: true },
    discount: { type: Number },
    quantity: { type: Number },
    category: { type: String },
    defaultImage: { type: String },
    dimensions: { length: Number, width: Number, height: Number },
    variants: { type: Array<String> },
    weight: { type: Number },
    isDeleted: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    personalisable: { type: Boolean, default: false },
    personalisation: { type: String },
    rating: { type: Number },
    reviews: { type: Number },
    material: { type: String },
  },
  { timestamps: true }
);

ProductSchema.pre("validate", function (next) {
  if (this.name) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

const ProductVariantSchema = new Schema<ProductVariantModel>(
  {
    color: { type: String, required: true },
    desc: { type: String },
    size: { type: String },
    price: { type: Number, required: true },
    productId: { type: String, required: true },
    discount: { type: Number },
    quantity: { type: Number, required: true },
    isDeleted: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    images: { type: Array<FileModel>, maxlength: 5 },
  },
  { timestamps: true }
);

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

export const User = models.User || model("User", UserSchema);
export const Product = models.Product || model("Product", ProductSchema);
export const ProductVariant =
  models.ProductVariant || model("ProductVariant", ProductVariantSchema);
export const Category = models.Category || model("Category", CategorySchema);
export const Address = models.Address || model("Address", AddressSchema);
