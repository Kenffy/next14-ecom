export type ProductType = "simple" | "variable";

export const InventoryStatus = [
  "in_stock",
  "out_of_stock",
  "low_stock",
  "backorder",
  "pre_order",
  "discontinued",
  "reserved",
  "coming_soon",
  "on_hold",
];


export interface UploadResponse {
  message: string;
  data: FileModel;
}

export interface FileModel {
  name: string;
  location: string;
  url: string;
}

export interface ProductAttribute {
  id: string;
  name: string;
  values: string[];
}

export interface VariantAttribute {
  name: string;
  value: string;
}

export interface Dimension {
  length: number;
  width: number;
  height: number;
}

export interface BaseProductModel {
  slug?: string;
  name: string;
  price: number;
  rating?: number;
  discount?: number;
  defaultImage?: string;
}

export interface ProductModel {
  _id?: string;
  name: string;
  slug?: string;
  brand?: string;
  description: string;
  sku: string;
  price: number;
  discount?: number;
  type: ProductType;
  inventory?: {
    quantity: number;
    status: string;
  };
  defaultImage?: string;
  dimensions?: Dimension;
  images?: Array<FileModel>;
  categories: Array<string>;
  tags?: Array<string>;
  attributes: Array<ProductAttribute>;
  deleted?: boolean;
  featured?: boolean;
  rating?: number;
  material?: string;
  weight?: number;
  reviews?: number;
  personalisable?: boolean;
  personalisation?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface VariantModel {
  _id?: string;
  productId: string;
  sku: string;
  price: number;
  discount?: number;
  attributes: Array<VariantAttribute>;
  inventory: {
    quantity: number;
    status: string;
  };
  deleted?: boolean;
  images?: Array<FileModel>;
  createdAt?: Date;
  updatedAt?: Date;
}

export type ProductDimension = {
  length: number;
  width: number;
  height: number;
};

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

export interface CategoryModel {
  _id?: string;
  name: string;
  desc: string;
  image?: string;
  brand?: string;
  banner?: string;
}
