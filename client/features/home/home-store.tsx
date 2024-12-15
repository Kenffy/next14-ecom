import { CategoryModel, BaseProductModel } from "@/schemas/models";
import { proxy, useSnapshot } from "valtio";


class HomeState {
  public products: Array<BaseProductModel> = [];
  public categories: Array<CategoryModel> = [];


  public initHomeSession({
    products,
    categories,
  }: {
    products: Array<BaseProductModel>;
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