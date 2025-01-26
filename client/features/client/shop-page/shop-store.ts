import { Sorts } from "@/data/data";
import { CategoryModel, BaseProductModel } from "@/schemas/models";
import { proxy, useSnapshot } from "valtio";

class ShopState {

  public filterPrice = {
    minPrice: 0,
    maxPrice: 0,
  }
  public filterSort = Sorts[0];

  public filterCategory: CategoryModel | undefined;
  public errors: string[] = [];
  public products: Array<BaseProductModel> = [];
  public categories: Array<CategoryModel> = [];
  public isOpened: boolean = false;
  public search: string = "";

  public initShopSession({
    products,
    categories
  }: {
    products: Array<BaseProductModel>;
    categories: Array<CategoryModel>;
  }) {
    this.products = products;
    this.categories = categories;
    this.filterCategory = categories[0];
  }


  public updateOpened(value: boolean) {
    this.isOpened = value;
  }

  public updateErrors(errors: string[]) {
    this.errors = errors;
  }

  public updateFilterSort(values: {id: number, type: string, value: string}){
    console.log("update sorts: ", values)
    this.filterSort = values;
  }

  public updateFilterPrice(values: {minPrice: number, maxPrice: number}){
    console.log("update prices: ", values)
    this.filterPrice = values;
  }

  public updateFilterCategory(value: CategoryModel){
    console.log("update categories: ", value)
    this.filterCategory = value;
  }

  public updateSearch(value: string){
    this.search = value;
    console.log("search: ", this.search)
  }
};

export const shopStore = proxy(new ShopState());

export const useShopState = () => {
  return useSnapshot(shopStore, {
    sync: true,
  });
};