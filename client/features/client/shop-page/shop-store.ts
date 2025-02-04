import { Sorts } from "@/data/data";
import { GetBaseProductsAsync } from "@/features/admin/dashboard/products/product-service";
import { BaseProductModel, PaginationResponse } from "@/schemas/models";
import { proxy, useSnapshot } from "valtio";

class ShopState {

  public filterPrice = {
    minPrice: 0,
    maxPrice: 0,
  }
  public filterSort = Sorts[0];

  public filterCategory: string = "";
  public errors: string[] = [];
  public productData: PaginationResponse<BaseProductModel> | undefined;
  public sorts: Array<string> = [];
  public categories: Array<string> = [];
  public isOpened: boolean = false;
  public search: string = "";
  public filters = {
    category: "",
    sort: "",
    minPrice: 0,
    maxPrice: 0,
    search: ""
  };

  public initShopSession({
    products,
    categories
  }: {
    products: PaginationResponse<BaseProductModel>;
    categories: Array<string>;
  }) {
    this.productData = products;
    this.categories = categories;
    this.filterCategory = this.categories[0];
  }

  private getCategoryId(category: string){
    return this.categories.find((cat) => cat === category);
  }

  private resetFilters(){
    this.filterPrice = {
      minPrice: 0,
      maxPrice: 0,
    }
    this.filterSort = Sorts[0];
    this.filterCategory = this.categories[0];
    this.search = "";
    this.updateFilters();
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

  public async updateByCategory(category: string){
    this.filterCategory = category;
    this.updateFilters();
  }

  public async updatePage(page: number){
    const response = await GetBaseProductsAsync(this.filters, page, 2);
    if(response.status !== "OK"){
      //this.errors = response.errors;
      return;
    }
    this.productData = response.response;
  }

  public async updateFilters(){
    this.filters = {
      category: this.filterCategory,
      sort: this.filterSort.value,
      minPrice: this.filterPrice.minPrice,
      maxPrice: this.filterPrice.maxPrice,
      search: this.search
    }

    const response = await GetBaseProductsAsync(this.filters, 1, 2);
    if(response.status !== "OK"){
      //this.errors = response.errors;
      return;
    }
    this.productData = response.response;
  }
};

export const shopStore = proxy(new ShopState());

export const useShopState = () => {
  return useSnapshot(shopStore, {
    sync: true,
  });
};