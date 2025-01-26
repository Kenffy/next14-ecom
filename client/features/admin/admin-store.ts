"use client"

import { CategoryModel, ProductModel, UserModel } from "@/schemas/models";
import { proxy, useSnapshot } from "valtio";

type AdminViews =
  | "dashboard"
  | "users"
  | "products"
  | "categories"
  | "settings";

class AdminState {
  public users: Array<UserModel> = [];
  public products: Array<ProductModel> = [];
  public categories: Array<CategoryModel> = [];

  public adminView: AdminViews = "dashboard";

  public initAdminSession({
    users,
    products,
    categories,
  }: {
    users: Array<UserModel>;
    products: Array<ProductModel>;
    categories: Array<CategoryModel>;
  }) {
    this.users = users;
    this.products = products;
    this.categories = categories;
  }

  public updateAdminView(value: string) {
    this.adminView = value as AdminViews;
  }
}

export const adminStore = proxy(new AdminState());

export const useAdminSate = () => {
  return useSnapshot(adminStore, { sync: true });
};
