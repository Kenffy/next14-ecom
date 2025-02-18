import { OrderItem } from "@/schemas/models";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const round2 = (num: number) =>
  Math.round((num + Number.EPSILON) * 100) / 100;

export function convertDocToObj(doc: any) {
  doc._id = doc._id.toString();
  return doc;
}

export const formatNumber = (x: number) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const formatId = (x: string) => {
  return `..${x.substring(20, 24)}`;
};

export const computeCurrentPrice = (item: OrderItem) => {
  return item.discount && item.discount > 0
    ? item.qty * (item.price - (item.price * item.discount * 0.01))
    : item.qty * item.price;
};

export const computeDiscountPrice = (item: OrderItem) => {
  const discount = item?.discount as number;
  return item.price - (item.price * discount * 0.01);
};
