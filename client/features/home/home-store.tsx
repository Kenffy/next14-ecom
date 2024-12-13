import { CategoryModel, ProductModel, UserModel } from "@/schemas/models";
import { proxy, useSnapshot } from "valtio";


class HomeState {
  public products: Array<ProductModel> = [];
  public categories: Array<CategoryModel> = [];


  public initHomeSession({
    products,
    categories,
  }: {
    products: Array<ProductModel>;
    categories: Array<CategoryModel>;
  }) {
    this.products = products;
    this.categories = categories;
  }
};

export const homeStore = proxy(new HomeState());

export const useHomeState = () => {
  return useSnapshot(homeStore, { sync: true });
};