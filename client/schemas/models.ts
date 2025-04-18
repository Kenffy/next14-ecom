export type ProductType = "simple" | "variable";

export type PaymentType = {
  id: string;
  name: string;
  icon: string;
  available: boolean;
}

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

export interface Dimension {
  length: number;
  width: number;
  height: number;
}

export interface ProductFilter {
  category: string;
  sort: string;
  minPrice: number;
  maxPrice: number;
  search: string;
}

export interface CurrencyModel {
  name: string;
  symbol: string;
  position: string;
  decimals: number;
  decimalPoint: string;
  thousandSeparator: string;
}

export interface BaseProductModel {
  slug?: string;
  name: string;
  price: number;
  rating?: number;
  discount?: number;
  defaultImage?: string;
}

export interface PaginationResponse<T> {
  data: T[];
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  limit: number;
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
  attributes?: Array<ProductAttribute>;
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

export interface VariantAttribute {
  name: string;
  value: string;
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

export type OrderItem = {
  name: string;
  slug: string;
  qty: number;
  image: FileModel;
  variable: boolean;
  variantId?: string;
  attributes?: Array<VariantAttribute>;
  personalisable: boolean;
  personalisation?: string;
  productId: string;
  price: number;
  discount?: number;
};

export type Cart = {
  shopTax: number; // in percentage
  shopDiscount: number; // in percentage
  couponCode: string;
  couponDiscount: number; // in percentage
  items: OrderItem[];
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  subTotalPrice: number;
  totalPrice: number;
  itemsDiscountPrice: number;
  shopDiscountPrice: number;
  couponDiscountPrice: number;
  totalDiscountPrice: number;
  paymentMethod: string;
  shippingAddress: AddressModel;
  currency: CurrencyModel;
};

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
  fullName: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  userId: string;
  default?: boolean;
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

export const INITIAL_ADDRESS_DATA: AddressModel = {
  fullName: "",
  street: "",
  city: "",
  postalCode: "",
  country: "",
  userId: ""
};

export type CardFormData = {
  fullName: string;
  cardNumber: string;
  expirationDate: string;
  securityCode: number;
};

export const INITIAL_CARD_DATA: CardFormData = {
  fullName: "",
  cardNumber: "",
  expirationDate: "MM/YY",
  securityCode: 0,
};