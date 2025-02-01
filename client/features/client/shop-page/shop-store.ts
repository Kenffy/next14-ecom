import { Sorts } from "@/data/data";
import { BaseProductModel } from "@/schemas/models";
import { proxy, useSnapshot } from "valtio";

class ShopState {

  public filterPrice = {
    minPrice: 0,
    maxPrice: 0,
  }
  public filterSort = Sorts[0];

  public filterCategory: string = "";
  public errors: string[] = [];
  public products: Array<BaseProductModel> = [];
  public sorts: Array<string> = [];
  public categories: Array<string> = [];
  public isOpened: boolean = false;
  public search: string = "";
  public filter = "";

  public initShopSession({
    products,
    categories
  }: {
    products: Array<BaseProductModel>;
    categories: Array<string>;
  }) {
    this.products = products;
    this.categories = categories;
    this.filterCategory = this.categories[0];
  }


  public updateOpened(value: boolean) {
    this.isOpened = value;
  }

  public updateErrors(errors: string[]) {
    this.errors = errors;
  }

  public updateFilterSort(value: string){
    const sort = Sorts.find((sort) => sort.value === value);
    if(sort){
      this.filterSort = sort;
    }
  }

  public updateFilterPrice(values: {minPrice: number, maxPrice: number}){
    this.filterPrice = values;
  }

  public updateFilterCategory(value: string){
    this.filterCategory = value;
  }

  public updateSearch(value: string){
    this.search = value;
  }

  public updateFilter(){
    this.filter = `?category=${this.filterCategory}&sort=${this.filterSort.value}&minPrice=${this.filterPrice.minPrice}&maxPrice=${this.filterPrice.maxPrice}&search=${this.search}`;
  }
};

export const shopStore = proxy(new ShopState());

export const useShopState = () => {
  return useSnapshot(shopStore, {
    sync: true,
  });
};